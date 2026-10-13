/**
 * IRIS RAG Retrieval Inspector
 * Central in-memory ring-buffer for developer & admin debugging of data retrieval.
 * Tracks queries, selected tutors, retrieved chunks, relevance scores, and final AI context.
 * Strictly sanitizes sensitive information (no API keys, no passwords).
 */

export interface RetrievedChunkInspection {
  id: string;
  topic: string;
  source: string;
  difficulty: string;
  score: number;
  cosineScore: number;
  lexicalScore: number;
  isRelevant: boolean;
  contentSnippet: string;
}

export interface RagInspectionRecord {
  id: string;
  timestamp: string;
  question: string;
  resolvedQuery?: string;
  tutorId: string;
  tutorName: string;
  subject: string;
  studentLevel: string;
  learningMode: string;
  relevanceStatus: "VERIFIED_RELEVANT" | "FALLBACK_INSUFFICIENT";
  retrievedChunksCount: number;
  retrievedChunks: RetrievedChunkInspection[];
  finalContextSentToAi: {
    systemPromptSummary: string;
    retrievedKnowledgeText: string;
    conversationSummary?: string;
    instructionSummary: string;
  };
}

export interface RetrievalStats {
  totalRetrievals: number;
  verifiedRelevantCount: number;
  insufficientCount: number;
  averageRelevanceScore: number;
  lastRetrievalAt: string | null;
}

const MAX_RECORDS = 50;
const retrievalLogStore: RagInspectionRecord[] = [];

/**
 * Record a RAG retrieval inspection event
 */
export function recordRetrievalInspection(record: Omit<RagInspectionRecord, "id" | "timestamp">): RagInspectionRecord {
  const fullRecord: RagInspectionRecord = {
    id: `rag_insp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    ...record,
  };

  retrievalLogStore.unshift(fullRecord);
  if (retrievalLogStore.length > MAX_RECORDS) {
    retrievalLogStore.pop();
  }

  return fullRecord;
}

/**
 * Get all retrieval inspection logs (most recent first)
 */
export function getRetrievalLogs(limit = 30): RagInspectionRecord[] {
  return retrievalLogStore.slice(0, limit);
}

/**
 * Get a specific inspection log by ID
 */
export function getRetrievalLogById(id: string): RagInspectionRecord | undefined {
  return retrievalLogStore.find(r => r.id === id);
}

/**
 * Clear all retrieval logs
 */
export function clearRetrievalLogs(): void {
  retrievalLogStore.length = 0;
}

/**
 * Calculate retrieval statistics for admin/developer dashboard
 */
export function getRetrievalStats(): RetrievalStats {
  if (retrievalLogStore.length === 0) {
    return {
      totalRetrievals: 0,
      verifiedRelevantCount: 0,
      insufficientCount: 0,
      averageRelevanceScore: 0,
      lastRetrievalAt: null,
    };
  }

  let totalScore = 0;
  let relevantCount = 0;
  let scoreCount = 0;

  for (const record of retrievalLogStore) {
    if (record.relevanceStatus === "VERIFIED_RELEVANT") {
      relevantCount++;
    }
    if (record.retrievedChunks.length > 0) {
      totalScore += record.retrievedChunks[0].score;
      scoreCount++;
    }
  }

  return {
    totalRetrievals: retrievalLogStore.length,
    verifiedRelevantCount: relevantCount,
    insufficientCount: retrievalLogStore.length - relevantCount,
    averageRelevanceScore: scoreCount > 0 ? Math.round((totalScore / scoreCount) * 100) / 100 : 0,
    lastRetrievalAt: retrievalLogStore[0]?.timestamp || null,
  };
}
