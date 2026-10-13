import { NextResponse } from "next/server";
import { getVectorStore, VectorDocument } from "@/lib/rag/vectorStore";
import {
  ingestKnowledgeItem,
  ingestDocument,
  reindexAllKnowledge,
  initializeKnowledgeBaseIfNeeded
} from "@/lib/rag/ingestion";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/knowledge
 * Query parameters:
 * - subject: filter by subject (optional)
 * - query: search query for testing vector similarity (optional)
 * - stats: if "true", returns vector store statistics
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get("subject") || undefined;
    const query = searchParams.get("query") || undefined;
    const statsOnly = searchParams.get("stats") === "true";

    await initializeKnowledgeBaseIfNeeded();
    const store = getVectorStore();

    if (statsOnly) {
      const stats = await store.getStats();
      return NextResponse.json(stats);
    }

    if (query) {
      const searchResults = await store.search({
        query,
        subject,
        topK: 10,
        minScore: 0.05,
      });

      return NextResponse.json({
        query,
        results: searchResults.map(r => ({
          id: r.doc.id,
          topic: r.doc.topic,
          subject: r.doc.subject,
          tutor: r.doc.tutor,
          source: r.doc.source,
          difficulty: r.doc.difficulty,
          tags: r.doc.tags,
          content: r.doc.content,
          score: Math.round(r.score * 1000) / 1000,
          cosineScore: Math.round(r.cosineScore * 1000) / 1000,
          lexicalScore: Math.round(r.lexicalScore * 1000) / 1000,
        })),
      });
    }

    const docs = await store.getAll(subject);
    const stats = await store.getStats();

    // Return documents without large raw embedding arrays for UI efficiency
    const sanitizedDocs = docs.map(d => ({
      id: d.id,
      subject: d.subject,
      tutor: d.tutor,
      tutorId: d.tutorId,
      topic: d.topic,
      source: d.source,
      difficulty: d.difficulty,
      tags: d.tags,
      content: d.content,
      embeddingDim: d.embedding ? d.embedding.length : 0,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    }));

    return NextResponse.json({
      documents: sanitizedDocs,
      stats,
    });
  } catch (error: any) {
    console.error("Admin Knowledge GET error:", error);
    return NextResponse.json({ error: error.message || "Failed to retrieve knowledge" }, { status: 500 });
  }
}

/**
 * POST /api/admin/knowledge
 * Actions:
 * 1. Default: Add new knowledge item
 * 2. action === "reindex": Re-index all seed knowledge and recompute embeddings
 * 3. action === "upload": Ingest uploaded document note
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, apiKey } = body;

    await initializeKnowledgeBaseIfNeeded(apiKey);
    const store = getVectorStore();

    // Action 1: Re-index Knowledge
    if (action === "reindex") {
      const result = await reindexAllKnowledge(apiKey);
      const stats = await store.getStats();
      return NextResponse.json({
        success: true,
        message: `Successfully re-indexed ${result.count} knowledge items in ${result.durationMs}ms`,
        stats,
      });
    }

    // Action 2: Ingest Uploaded Document
    if (action === "upload") {
      const { name, content, subject, tutorId, difficulty, tags } = body;
      if (!name || !content || !subject) {
        return NextResponse.json({ error: "Document name, subject, and content are required" }, { status: 400 });
      }

      const ingested = await ingestDocument(
        {
          name,
          content,
          subject,
          tutorId,
          difficulty,
          tags,
        },
        apiKey
      );

      const stats = await store.getStats();
      return NextResponse.json({
        success: true,
        message: `Document '${name}' chunked and indexed into ${ingested.length} vector embeddings.`,
        chunks: ingested.length,
        stats,
      });
    }

    // Action 3: Add Single Knowledge Entry
    const { topic, subject, tutor, tutorId, source, difficulty, tags, content } = body;
    if (!topic || !content || !subject) {
      return NextResponse.json({ error: "Topic, subject, and content are required" }, { status: 400 });
    }

    const id = body.id || `custom_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const tutorIdFinal = tutorId || (subject.toLowerCase().startsWith("math") ? "math" : subject.toLowerCase().startsWith("sci") ? "science" : subject.toLowerCase().startsWith("cod") ? "code" : subject.toLowerCase().startsWith("lit") ? "lit" : subject.toLowerCase().startsWith("car") ? "career" : "research");

    const newDoc = await ingestKnowledgeItem(
      {
        id,
        subject,
        tutor: tutor || `${subject} Mentor`,
        tutorId: tutorIdFinal,
        topic,
        source: source || "Admin Knowledge Portal",
        difficulty: difficulty || "Intermediate",
        tags: Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",").map((t: string) => t.trim()) : [subject.toLowerCase()],
        content,
      },
      apiKey
    );

    const stats = await store.getStats();
    return NextResponse.json({
      success: true,
      document: {
        id: newDoc.id,
        topic: newDoc.topic,
        subject: newDoc.subject,
        tutor: newDoc.tutor,
        source: newDoc.source,
        difficulty: newDoc.difficulty,
        tags: newDoc.tags,
      },
      stats,
    });
  } catch (error: any) {
    console.error("Admin Knowledge POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to process knowledge action" }, { status: 500 });
  }
}

/**
 * PUT /api/admin/knowledge
 * Update an existing knowledge item and regenerate its embedding
 */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, topic, subject, tutor, tutorId, source, difficulty, tags, content, apiKey } = body;

    if (!id || !topic || !content) {
      return NextResponse.json({ error: "ID, topic, and content are required for update" }, { status: 400 });
    }

    const updatedDoc = await ingestKnowledgeItem(
      {
        id,
        subject: subject || "General",
        tutor: tutor || "IRIS Tutor",
        tutorId: tutorId || "general",
        topic,
        source: source || "Admin Knowledge Portal",
        difficulty: difficulty || "Intermediate",
        tags: Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",").map((t: string) => t.trim()) : [],
        content,
      },
      apiKey
    );

    const store = getVectorStore();
    const stats = await store.getStats();

    return NextResponse.json({
      success: true,
      message: `Knowledge item '${topic}' updated and re-indexed.`,
      document: {
        id: updatedDoc.id,
        topic: updatedDoc.topic,
      },
      stats,
    });
  } catch (error: any) {
    console.error("Admin Knowledge PUT error:", error);
    return NextResponse.json({ error: error.message || "Failed to update knowledge item" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/knowledge
 * Query parameter: ?id=...
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Item ID is required for deletion" }, { status: 400 });
    }

    const store = getVectorStore();
    const deleted = await store.delete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const stats = await store.getStats();
    return NextResponse.json({
      success: true,
      message: `Knowledge entry '${id}' deleted from vector database.`,
      stats,
    });
  } catch (error: any) {
    console.error("Admin Knowledge DELETE error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete knowledge item" }, { status: 500 });
  }
}
