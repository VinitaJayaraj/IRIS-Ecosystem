import { NextResponse } from "next/server";
import { getRetrievalLogs, getRetrievalStats, clearRetrievalLogs, getRetrievalLogById } from "@/lib/rag/retrievalInspector";
import { runRagPipeline } from "@/lib/rag/ragPipeline";

export const dynamic = "force-dynamic";

/**
 * GET: Retrieve recent RAG retrieval inspection logs and metrics
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const limit = parseInt(searchParams.get("limit") || "30", 10);

    if (id) {
      const log = getRetrievalLogById(id);
      if (!log) {
        return NextResponse.json({ error: "Log record not found" }, { status: 404 });
      }
      return NextResponse.json({ log });
    }

    const logs = getRetrievalLogs(limit);
    const stats = getRetrievalStats();

    return NextResponse.json({
      success: true,
      stats,
      logs,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch inspection logs" }, { status: 500 });
  }
}

/**
 * POST: Interactive Developer & Admin RAG Tester
 * Test any query, inspect retrieved chunks, relevance score breakdown, and final context
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question, tutorId = "math", studentLevel = "Intermediate", learningMode = "Concept Mastery Mode" } = body;

    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return NextResponse.json({ error: "Question parameter is required" }, { status: 400 });
    }

    // Execute RAG Pipeline with inspection
    const ragResponse = await runRagPipeline({
      agentId: tutorId,
      messages: [{ sender: "user", content: question.trim() }],
      userStats: {
        skillLevel: studentLevel,
        learningMode: learningMode,
      },
    });

    return NextResponse.json({
      success: true,
      inspection: ragResponse.inspectionRecord || null,
      answer: ragResponse.content,
      sources: ragResponse.sources,
      relevanceStatus: ragResponse.relevanceStatus,
      retrievedChunksCount: ragResponse.retrievedChunksCount,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to execute inspection" }, { status: 500 });
  }
}

/**
 * DELETE: Clear inspection log history
 */
export async function DELETE() {
  try {
    clearRetrievalLogs();
    return NextResponse.json({ success: true, message: "Retrieval logs cleared successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to clear logs" }, { status: 500 });
  }
}
