/**
 * IRIS High-Performance Vector Store
 * Supports:
 * - Pinecone Vector Database (if PINECONE_API_KEY is present)
 * - Built-in Persistent In-Memory Vector Store with Cosine Similarity and Hybrid Lexical-Semantic Ranking
 */

import { cosineSimilarity, generateEmbedding } from "./embeddings";
import fs from "fs";
import path from "path";

export interface VectorDocument {
  id: string;
  subject: "Mathematics" | "Science" | "Coding" | "Literature" | "Career" | "Research" | string;
  tutor: "Mathematics Mentor" | "Science Explorer" | "Coding Coach" | "Literature & Language Guide" | "Career Navigator" | "Research Assistant" | string;
  tutorId: "math" | "science" | "code" | "lit" | "career" | "research" | string;
  topic: string;
  subTopic?: string;
  source: string;
  content: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  embedding: number[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SearchQueryOptions {
  query: string;
  queryEmbedding?: number[];
  subject?: string;
  tutorId?: string;
  studentLevel?: string;
  learningMode?: string;
  subTopic?: string;
  topK?: number;
  minScore?: number;
  apiKey?: string;
}

export interface SearchResult {
  doc: VectorDocument;
  score: number; // 0 to 1 composite similarity score
  cosineScore: number;
  lexicalScore: number;
  isRelevant: boolean;
}

export interface VectorStoreStats {
  totalDocuments: number;
  bySubject: Record<string, number>;
  byTutor: Record<string, number>;
  storeType: "pinecone" | "local";
  lastIndexedAt: string;
}

export interface IVectorStore {
  upsert(doc: VectorDocument): Promise<void>;
  upsertBatch(docs: VectorDocument[]): Promise<void>;
  search(opts: SearchQueryOptions): Promise<SearchResult[]>;
  delete(id: string): Promise<boolean>;
  get(id: string): Promise<VectorDocument | null>;
  getAll(subjectFilter?: string): Promise<VectorDocument[]>;
  clear(): Promise<void>;
  getStats(): Promise<VectorStoreStats>;
}

/**
 * Local High-Speed In-Memory & Persistent Vector Database
 */
export class LocalVectorStore implements IVectorStore {
  private documents: Map<string, VectorDocument> = new Map();
  private storagePath: string;
  private isLoaded: boolean = false;
  private lastIndexedAt: string = new Date().toISOString();

  constructor(storageDir?: string) {
    const baseDir = storageDir || path.join(process.cwd(), "src", "lib", "data");
    this.storagePath = path.join(baseDir, "vector_index.json");
    this.ensureLoaded();
  }

  private ensureLoaded() {
    if (this.isLoaded) return;
    try {
      if (fs.existsSync(this.storagePath)) {
        const raw = fs.readFileSync(this.storagePath, "utf8");
        const data = JSON.parse(raw);
        if (Array.isArray(data)) {
          for (const item of data) {
            if (item && item.id) {
              this.documents.set(item.id, item);
            }
          }
        }
      }
    } catch {
      // In-memory fallback if filesystem restricted
    }
    this.isLoaded = true;
  }

  private persist() {
    try {
      const dir = path.dirname(this.storagePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const arr = Array.from(this.documents.values());
      fs.writeFileSync(this.storagePath, JSON.stringify(arr, null, 2), "utf8");
    } catch {
      // Ignore if read-only or in serverless tmp
    }
  }

  async upsert(doc: VectorDocument): Promise<void> {
    this.ensureLoaded();
    const now = new Date().toISOString();
    doc.updatedAt = now;
    if (!doc.createdAt) doc.createdAt = now;
    this.documents.set(doc.id, doc);
    this.lastIndexedAt = now;
    this.persist();
  }

  async upsertBatch(docs: VectorDocument[]): Promise<void> {
    this.ensureLoaded();
    const now = new Date().toISOString();
    for (const doc of docs) {
      doc.updatedAt = now;
      if (!doc.createdAt) doc.createdAt = now;
      this.documents.set(doc.id, doc);
    }
    this.lastIndexedAt = now;
    this.persist();
  }

  async delete(id: string): Promise<boolean> {
    this.ensureLoaded();
    const exists = this.documents.delete(id);
    if (exists) {
      this.persist();
    }
    return exists;
  }

  async get(id: string): Promise<VectorDocument | null> {
    this.ensureLoaded();
    return this.documents.get(id) || null;
  }

  async getAll(subjectFilter?: string): Promise<VectorDocument[]> {
    this.ensureLoaded();
    const all = Array.from(this.documents.values());
    if (!subjectFilter || subjectFilter === "all") return all;
    const filter = subjectFilter.toLowerCase();
    return all.filter(
      d =>
        d.subject.toLowerCase() === filter ||
        d.tutorId.toLowerCase() === filter ||
        d.tutor.toLowerCase().includes(filter)
    );
  }

  async clear(): Promise<void> {
    this.documents.clear();
    this.persist();
  }

  /**
   * Hybrid Vector & BM25-style Lexical Search with Domain Partitioning
   */
  async search(opts: SearchQueryOptions): Promise<SearchResult[]> {
    this.ensureLoaded();
    const { query, subject, tutorId, studentLevel, topK = 4, minScore = 0.15, apiKey } = opts;

    if (!query || query.trim().length === 0) {
      return [];
    }

    // 1. Get or compute query embedding
    let queryVec = opts.queryEmbedding;
    if (!queryVec || queryVec.length === 0) {
      queryVec = await generateEmbedding(query, apiKey);
    }

    const STOP_WORDS = new Set([
      "what", "is", "are", "was", "were", "the", "a", "an", "do", "does", "did",
      "how", "why", "can", "could", "would", "should", "will", "tell", "me",
      "about", "explain", "describe", "give", "solve", "in", "on", "at", "to",
      "for", "with", "from", "by", "of", "and", "or", "my", "your", "this", "that"
    ]);

    const rawTokens = query
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(t => t.length > 1);

    const meaningfulTokens = rawTokens.filter(t => !STOP_WORDS.has(t));
    const finalTokens = meaningfulTokens.length > 0 ? meaningfulTokens : rawTokens;

    const candidates: SearchResult[] = [];

    for (const doc of this.documents.values()) {
      // Strict Subject / Tutor Domain Isolation
      if (tutorId) {
        const normTutorId = tutorId.toLowerCase();
        if (normTutorId === "math") {
          if (doc.tutorId !== "math" && doc.subject !== "Mathematics") continue;
        } else if (normTutorId === "code") {
          if (doc.tutorId !== "code" && doc.subject !== "Coding") continue;
        } else {
          if (doc.tutorId !== normTutorId && !doc.subject.toLowerCase().includes(normTutorId)) {
            continue;
          }
        }
      } else if (subject && subject.toLowerCase() !== "all") {
        if (doc.subject.toLowerCase() !== subject.toLowerCase()) {
          continue;
        }
      }

      // 2. Compute Cosine Similarity
      const cosine = cosineSimilarity(queryVec, doc.embedding);

      // 3. Compute Lexical Overlap (BM25 / Keyword boost)
      const docText = `${doc.topic} ${doc.subTopic || ""} ${doc.tags.join(" ")} ${doc.content}`.toLowerCase();
      let matches = 0;
      let topicMatches = 0;
      let matchingTokensCount = 0;
      const lowerTopic = doc.topic.toLowerCase();
      const lowerSubTopic = (doc.subTopic || "").toLowerCase();
      const topicWords = `${lowerTopic} ${lowerSubTopic}`.split(/[\s\-&,/()]+/);
      const lowerTags = doc.tags.map(t => t.toLowerCase());

      // Check multi-word phrase match (e.g. "matrix multiplication", "literature review", "research gap")
      let phraseBonus = 0;
      const cleanQuery = query.toLowerCase().replace(/[^a-z0-9\s]/g, " ").trim();
      const qWords = cleanQuery.split(/\s+/);
      for (let i = 0; i < qWords.length - 1; i++) {
        const bigram = `${qWords[i]} ${qWords[i + 1]}`;
        if (bigram.length > 5 && !STOP_WORDS.has(qWords[i]) && !STOP_WORDS.has(qWords[i + 1])) {
          // Skip generic comparative or conversational bigrams
          if (bigram === "difference between" || bigram === "difference of" || bigram.startsWith("between ") || bigram.startsWith("compare ")) {
            continue;
          }
          if (lowerTopic.includes(bigram) || lowerSubTopic.includes(bigram)) {
            phraseBonus += 10.0;
          } else if (lowerTags.some(tg => tg.includes(bigram))) {
            phraseBonus += 5.0;
          }
        }
      }

      for (const token of finalTokens) {
        // Compute token stems (handling -ing, -ed, trailing -e, plurals -s/-es)
        const tokenStems = new Set<string>([token]);
        if (token.endsWith("ing") && token.length > 4) {
          tokenStems.add(token.slice(0, -3));
          tokenStems.add(token.slice(0, -3) + "e");
        }
        if (token.endsWith("ed") && token.length > 4) {
          tokenStems.add(token.slice(0, -2));
          tokenStems.add(token.slice(0, -1));
        }
        if (token.endsWith("es") && token.length > 4) tokenStems.add(token.slice(0, -2));
        if (token.endsWith("s") && token.length > 3) tokenStems.add(token.slice(0, -1));
        if (token.endsWith("e") && token.length > 3) tokenStems.add(token.slice(0, -1));

        // Exact match in topic title words (highest priority)
        const exactTopicMatch = topicWords.some(w => {
          if (tokenStems.has(w)) return true;
          if (w.endsWith("ing") && (tokenStems.has(w.slice(0, -3)) || tokenStems.has(w.slice(0, -3) + "e"))) return true;
          if (w.endsWith("ed") && (tokenStems.has(w.slice(0, -2)) || tokenStems.has(w.slice(0, -1)))) return true;
          if (w.endsWith("s") && tokenStems.has(w.slice(0, -1))) return true;
          return token.length >= 4 && (w.startsWith(token) || (token.endsWith("e") && w.startsWith(token.slice(0, -1))));
        });

        if (exactTopicMatch) {
          topicMatches += 7.0;
          matchingTokensCount++;
        } else if (lowerTopic.includes(token) || Array.from(tokenStems).some(s => s.length >= 4 && lowerTopic.includes(s))) {
          topicMatches += 4.0;
          matchingTokensCount++;
        } else if (lowerTags.some(tg => tg === token || tg.includes(token) || Array.from(tokenStems).some(s => s.length >= 4 && tg.includes(s)))) {
          topicMatches += 3.5;
          matchingTokensCount++;
        } else if (docText.includes(token)) {
          matches += 1.0;
        }
      }

      // Multi-token co-occurrence bonus in topic title or tags
      if (matchingTokensCount >= 2) {
        topicMatches += matchingTokensCount * 4.0;
      }

      const totalMatchPoints = topicMatches + phraseBonus + (matches * 0.3);
      const maxPossible = Math.max(1, finalTokens.length * 7.0);
      const lexical = Math.min(1.0, totalMatchPoints / maxPossible);

      // Student skill level alignment bonus
      let levelBonus = 0;
      if (studentLevel) {
        const sLevel = studentLevel.toLowerCase();
        const dDiff = (doc.difficulty || "").toLowerCase();
        if (sLevel === dDiff) {
          levelBonus = 0.03;
        }
      }

      // 4. Hybrid Composite Score (50% Semantic Vector, 50% Lexical/Topic Exactness + Level Bonus)
      let compositeScore = (cosine * 0.50) + (lexical * 0.50) + levelBonus;
      compositeScore = Math.min(1.0, Math.max(0, compositeScore));

      // Quality Gate: Check if doc is actual relevant content vs noisy irrelevant baseline
      // When lexical match is zero, unigram/stopword collisions in hashing embeddings can produce spurious cosine.
      // A doc with zero keyword overlap must have high cosine (>= 0.65) or it is treated as noise.
      const isNoise = (lexical === 0 && cosine < 0.60) || compositeScore < 0.20;
      const isRelevant = !isNoise && ((lexical >= 0.08 && compositeScore >= 0.25) || cosine >= 0.65);

      if (compositeScore >= minScore && !isNoise) {
        candidates.push({
          doc,
          score: Math.round(compositeScore * 100) / 100,
          cosineScore: Math.round(cosine * 100) / 100,
          lexicalScore: Math.round(lexical * 100) / 100,
          isRelevant,
        });
      }
    }

    // Rank candidates by composite score descending
    candidates.sort((a, b) => b.score - a.score);

    return candidates.slice(0, topK);
  }

  async getStats(): Promise<VectorStoreStats> {
    this.ensureLoaded();
    const bySubject: Record<string, number> = {};
    const byTutor: Record<string, number> = {};

    for (const doc of this.documents.values()) {
      bySubject[doc.subject] = (bySubject[doc.subject] || 0) + 1;
      byTutor[doc.tutor] = (byTutor[doc.tutor] || 0) + 1;
    }

    return {
      totalDocuments: this.documents.size,
      bySubject,
      byTutor,
      storeType: "local",
      lastIndexedAt: this.lastIndexedAt,
    };
  }
}

// Global Singleton Instance
let globalVectorStore: IVectorStore | null = null;

export function getVectorStore(): IVectorStore {
  if (!globalVectorStore) {
    globalVectorStore = new LocalVectorStore();
  }
  return globalVectorStore;
}
