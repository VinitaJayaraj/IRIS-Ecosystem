/**
 * IRIS Knowledge Ingestion & Chunking Pipeline
 * 1. Collects text / documents
 * 2. Cleans & normalizes
 * 3. Splits into semantic chunks (heading-aware with overlap)
 * 4. Generates high-dimensional embeddings
 * 5. Indexes into the Vector Store with metadata
 */

import { generateEmbedding } from "./embeddings";
import { getVectorStore, VectorDocument } from "./vectorStore";
import { INITIAL_KNOWLEDGE_BASE, KnowledgeSeedItem } from "./knowledgeData";

export interface ChunkingOptions {
  maxChunkSize?: number; // Approximate word count per chunk
  chunkOverlap?: number;  // Overlap word count
}

/**
 * Splits text into meaningful semantic chunks preserving markdown sections and paragraphs
 */
export function chunkText(
  text: string,
  options: ChunkingOptions = {}
): string[] {
  const { maxChunkSize = 250, chunkOverlap = 40 } = options;
  const clean = text.trim();
  if (!clean) return [];

  // Split by markdown headers or double newlines
  const sections = clean.split(/(?=^#{1,4}\s)/gm);
  const chunks: string[] = [];

  for (const section of sections) {
    const trimmedSection = section.trim();
    if (!trimmedSection) continue;

    const words = trimmedSection.split(/\s+/);
    if (words.length <= maxChunkSize) {
      chunks.push(trimmedSection);
    } else {
      // Sliding window chunking with overlap
      let i = 0;
      while (i < words.length) {
        const chunkWords = words.slice(i, i + maxChunkSize);
        if (chunkWords.length > 0) {
          chunks.push(chunkWords.join(" "));
        }
        i += maxChunkSize - chunkOverlap;
      }
    }
  }

  return chunks.length > 0 ? chunks : [clean];
}

/**
 * Ingests a single knowledge item into the Vector Store
 */
export async function ingestKnowledgeItem(
  item: Omit<VectorDocument, "embedding">,
  apiKey?: string
): Promise<VectorDocument> {
  const store = getVectorStore();
  const textToEmbed = `${item.topic} ${item.tags.join(" ")} ${item.content}`;
  const embedding = await generateEmbedding(textToEmbed, apiKey);

  const doc: VectorDocument = {
    ...item,
    embedding,
  };

  await store.upsert(doc);
  return doc;
}

/**
 * Ingests an uploaded document note by chunking and indexing it
 */
export async function ingestDocument(
  doc: {
    id?: string;
    name: string;
    content: string;
    subject: string;
    tutorId?: string;
    difficulty?: "Beginner" | "Intermediate" | "Advanced";
    tags?: string[];
  },
  apiKey?: string
): Promise<VectorDocument[]> {
  const chunks = chunkText(doc.content, { maxChunkSize: 220, chunkOverlap: 30 });
  const results: VectorDocument[] = [];

  const tutorMapping: Record<string, { tutor: string; tutorId: string }> = {
    Mathematics: { tutor: "Mathematics Mentor", tutorId: "math" },
    Science: { tutor: "Science Explorer", tutorId: "science" },
    Coding: { tutor: "Coding Coach", tutorId: "code" },
    Literature: { tutor: "Literature & Language Guide", tutorId: "lit" },
    Career: { tutor: "Career Navigator", tutorId: "career" },
    Research: { tutor: "Research Assistant", tutorId: "research" },
  };

  const mapping = tutorMapping[doc.subject] || {
    tutor: "IRIS Mentor",
    tutorId: doc.tutorId || "general",
  };

  for (let i = 0; i < chunks.length; i++) {
    const chunkContent = chunks[i];
    const chunkId = `${doc.id || "doc"}_chunk_${i}_${Date.now()}`;
    const chunkTitle = chunks.length > 1 ? `${doc.name} (Part ${i + 1})` : doc.name;

    const item: Omit<VectorDocument, "embedding"> = {
      id: chunkId,
      subject: doc.subject,
      tutor: mapping.tutor,
      tutorId: mapping.tutorId,
      topic: chunkTitle,
      source: `Uploaded Document: ${doc.name}`,
      difficulty: doc.difficulty || "Intermediate",
      tags: doc.tags || [doc.subject.toLowerCase(), "custom_document"],
      content: chunkContent,
    };

    const ingested = await ingestKnowledgeItem(item, apiKey);
    results.push(ingested);
  }

  return results;
}

/**
 * Initializes the Vector Store with seed knowledge if currently empty or missing items
 */
export async function initializeKnowledgeBaseIfNeeded(apiKey?: string): Promise<number> {
  const store = getVectorStore();
  const existing = await store.getAll();
  const existingMap = new Map(existing.map(d => [d.id, d]));

  const docsToUpsert: VectorDocument[] = [];

  for (const seed of INITIAL_KNOWLEDGE_BASE) {
    if (!existingMap.has(seed.id)) {
      const textToEmbed = `${seed.topic} ${seed.subTopic || ""} ${seed.tags.join(" ")} ${seed.content}`;
      const embedding = await generateEmbedding(textToEmbed, apiKey);
      docsToUpsert.push({
        ...seed,
        embedding,
      });
    }
  }

  if (docsToUpsert.length > 0) {
    await store.upsertBatch(docsToUpsert);
  }

  const total = await store.getAll();
  return total.length;
}

/**
 * Re-indexes all knowledge seeds and recalculates embeddings
 */
export async function reindexAllKnowledge(apiKey?: string): Promise<{ count: number; durationMs: number }> {
  const startTime = Date.now();
  const store = getVectorStore();
  await store.clear();

  const docsToUpsert: VectorDocument[] = [];

  for (const seed of INITIAL_KNOWLEDGE_BASE) {
    const textToEmbed = `${seed.topic} ${seed.subTopic || ""} ${seed.tags.join(" ")} ${seed.content}`;
    const embedding = await generateEmbedding(textToEmbed, apiKey);
    docsToUpsert.push({
      ...seed,
      embedding,
    });
  }

  await store.upsertBatch(docsToUpsert);
  const durationMs = Date.now() - startTime;

  return {
    count: docsToUpsert.length,
    durationMs,
  };
}
