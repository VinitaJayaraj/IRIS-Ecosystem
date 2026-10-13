"use client";

import React, { useState } from "react";
import { useLearning, DocFile, Flashcard } from "@/context/LearningContext";
import { FileText, Plus, Search, HelpCircle, GraduationCap, Copy, Trash2, ArrowRight, BrainCircuit, Download, Folder, HardDrive, Edit3 } from "lucide-react";

export default function NotebookWorkspace() {
  const {
    documents,
    flashcards,
    uploadDocument,
    deleteDocument,
    generateFlashcardsFromDocs,
    generateQuizFromDocs,
  } = useLearning();

  // Ingest form
  const [docName, setDocName] = useState("");
  const [docContent, setDocContent] = useState("");
  const [docType, setDocType] = useState<DocFile["type"]>("text");

  // Document Management Filter & Folders
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [docSearch, setDocSearch] = useState("");
  const [offlinePackEnabled, setOfflinePackEnabled] = useState(false);

  // RAG query state
  const [ragQuery, setRagQuery] = useState("");
  const [ragAnswer, setRagAnswer] = useState<{ answer: string; source: string } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Active flashcards state
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
  const [activeDocId, setActiveDocId] = useState<string | null>(documents[0]?.id || null);

  const activeDoc = documents.find(d => d.id === activeDocId) || documents[0];

  const handleIngest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim() || !docContent.trim()) return;

    const size = `${(docContent.length * 1.2).toFixed(0)} B`;
    uploadDocument(docName, docContent, docType, size);
    
    // reset form
    setDocName("");
    setDocContent("");
  };

  const handleRAGSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ragQuery.trim() || documents.length === 0) return;

    setIsSearching(true);
    setRagAnswer(null);

    setTimeout(() => {
      setIsSearching(false);
      
      const lowerQuery = ragQuery.toLowerCase();
      // Search for matches in documents
      let matchingDoc = documents[0];
      let bestMatchScore = 0;

      documents.forEach(doc => {
        let score = 0;
        const words = lowerQuery.split(" ");
        words.forEach(w => {
          if (w.length > 3 && doc.content.toLowerCase().includes(w)) {
            score++;
          }
        });
        if (score > bestMatchScore) {
          bestMatchScore = score;
          matchingDoc = doc;
        }
      });

      // RAG synthesis
      let answer = "";
      if (bestMatchScore > 0) {
        answer = `Found relevant content in [${matchingDoc.name}]. Based on the sources, it notes that "${matchingDoc.content.substring(0, 180)}..." This directly answers your query about ${ragQuery}.`;
      } else {
        answer = `No highly specific vector match found in your ${documents.length} uploaded files. Reverting to general corpus: IRIS suggests that ${ragQuery} fits into standard learning modules. Add more textbooks to increase workspace accuracy.`;
      }

      setRagAnswer({
        answer,
        source: matchingDoc ? matchingDoc.name : "System Corpus"
      });
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Top RAG search bar */}
      <div className="p-6 rounded-3xl glass-panel relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        
        <h2 className="text-lg font-bold flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-primary animate-pulse" /> NotebookLM Intelligence Search
        </h2>
        <p className="text-xs text-zinc-500 mt-0.5">Cross-reference and ask questions across all uploaded text resources.</p>

        <form onSubmit={handleRAGSearch} className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={ragQuery}
              onChange={(e) => setRagQuery(e.target.value)}
              placeholder="Ask a question about your notes (e.g. What is inertia?)..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl glass-input text-xs text-white"
            />
          </div>
          <button
            type="submit"
            disabled={documents.length === 0 || !ragQuery.trim() || isSearching}
            className="bg-primary hover:bg-primary/95 text-white px-5 py-3 rounded-2xl font-bold text-xs disabled:bg-zinc-800 disabled:text-zinc-600 transition-all cursor-pointer"
          >
            {isSearching ? "Searching..." : "Query Sources"}
          </button>
        </form>

        {/* RAG Answer Output */}
        {ragAnswer && (
          <div className="mt-4 p-4 rounded-2xl bg-zinc-950/60 border border-zinc-850 text-xs space-y-2 animate-float">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-1">
              <span className="text-[10px] text-primary uppercase font-bold tracking-widest">Synthesized Answer</span>
              <span className="text-[10px] text-zinc-500">Source: <span className="text-zinc-300 font-bold">{ragAnswer.source}</span></span>
            </div>
            <p className="text-zinc-300 leading-relaxed font-medium">{ragAnswer.answer}</p>
          </div>
        )}
      </div>

      {/* Main Grid: Upload vs Document View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Upload and Document list */}
        <div className="space-y-6">
          {/* Upload panel */}
          <div className="p-6 rounded-3xl glass-panel">
            <h3 className="text-md font-bold flex items-center gap-1.5 mb-3 text-white">
              <Plus className="w-4 h-4 text-secondary" /> Add Source Material
            </h3>
            
            <form onSubmit={handleIngest} className="space-y-3.5">
              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Document Title</label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. calculus_limits.txt"
                  className="w-full mt-1 px-3 py-2 rounded-xl glass-input text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-sans">Document Type</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="w-full mt-1 px-3 py-2 rounded-xl glass-input text-xs text-white bg-zinc-950"
                >
                  <option value="text">Notes Text File</option>
                  <option value="pdf">PDF Document (Simulated)</option>
                  <option value="paper">Academic Research Paper</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Content Text</label>
                <textarea
                  required
                  rows={4}
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  placeholder="Paste or type content study details here..."
                  className="w-full mt-1 p-3 rounded-xl glass-input text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-secondary hover:bg-secondary/95 text-black font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Ingest to Vectors
              </button>
            </form>
          </div>

          {/* Documents lists */}
          <div className="p-6 rounded-3xl glass-panel">
            <h3 className="text-md font-bold mb-3 text-white">Ingested Sources ({documents.length})</h3>
            <div className="space-y-2">
              {documents.length === 0 ? (
                <div className="text-zinc-500 text-xs italic py-4 text-center">No source materials loaded yet.</div>
              ) : (
                documents.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setActiveDocId(doc.id)}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      doc.id === activeDocId
                        ? "bg-zinc-900 border-secondary"
                        : "bg-zinc-950/40 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-5 h-5 text-secondary shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold text-xs truncate text-zinc-200">{doc.name}</div>
                        <div className="text-[9px] text-zinc-500">{doc.type.toUpperCase()} • {doc.size}</div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDocument(doc.id);
                      }}
                      className="p-1 rounded bg-zinc-900/80 hover:bg-red-500/10 hover:text-red-400 text-zinc-500 transition-all border border-zinc-850"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Source Reading Pane & Flashcards */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Reader Pane */}
          {activeDoc && (
            <div className="p-6 rounded-3xl glass-panel flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
                  <span className="font-bold text-sm text-zinc-200 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-400" /> Reader: {activeDoc.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const blob = new Blob([activeDoc.content], { type: "text/plain" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = activeDoc.name;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 text-purple-400 text-[10px] font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Download className="w-3 h-3" /> Export File
                    </button>
                    <span className="text-[10px] text-zinc-500">Uploaded {activeDoc.uploadedAt}</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed italic bg-zinc-950/40 border border-zinc-900 p-3.5 rounded-2xl">
                  "{activeDoc.content}"
                </p>
              </div>

              {/* Study Generators Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 border-t border-zinc-800/40 pt-4">
                <button
                  onClick={generateFlashcardsFromDocs}
                  className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/40 font-bold text-xs py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <GraduationCap className="w-4 h-4" /> Synthesize Flashcards
                </button>
                <button
                  onClick={() => generateQuizFromDocs(`Assessment on ${activeDoc.name}`)}
                  className="bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 hover:border-secondary/40 font-bold text-xs py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <HelpCircle className="w-4 h-4" /> Practice Quiz
                </button>
                <button
                  onClick={() => {
                    setOfflinePackEnabled(!offlinePackEnabled);
                    alert(offlinePackEnabled ? "Offline Learning Pack disabled." : "Offline Learning Pack synced for local offline access!");
                  }}
                  className={`border font-bold text-xs py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    offlinePackEnabled
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                      : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border-zinc-800"
                  }`}
                >
                  <HardDrive className="w-4 h-4" /> {offlinePackEnabled ? "Offline Synced" : "Download Offline Pack"}
                </button>
              </div>
            </div>
          )}

          {/* Flashcards Visual Deck */}
          <div className="p-6 rounded-3xl glass-panel">
            <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-2">
              <div>
                <h3 className="text-md font-bold text-white">Interactive Flashcard Deck</h3>
                <p className="text-[10px] text-zinc-500">Tap cards to flip front/back</p>
              </div>
              <span className="text-xs bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded-lg text-zinc-400 font-mono">
                {flashcards.length} cards
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {flashcards.map((fc) => {
                const isFlipped = flippedCardId === fc.id;
                return (
                  <div
                    key={fc.id}
                    onClick={() => setFlippedCardId(isFlipped ? null : fc.id)}
                    className="relative h-32 cursor-pointer group rounded-2xl"
                    style={{ perspective: "1000px" }}
                  >
                    {/* Inner Container */}
                    <div
                      className={`relative w-full h-full duration-500 rounded-2xl border transition-all ${
                        isFlipped ? "border-primary" : "border-zinc-800 hover:border-zinc-700"
                      }`}
                      style={{
                        transformStyle: "preserve-3d",
                        transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                      }}
                    >
                      {/* Front: Question */}
                      <div
                        className="absolute inset-0 bg-zinc-900/60 p-4 rounded-2xl flex flex-col justify-between"
                        style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                      >
                        <span className="text-[9px] bg-zinc-800 border border-zinc-750 text-zinc-400 px-1.5 py-0.5 rounded self-start">
                          {fc.category}
                        </span>
                        <h4 className="text-xs font-bold text-zinc-200 text-center flex-1 flex items-center justify-center">
                          {fc.question}
                        </h4>
                      </div>

                      {/* Back: Answer */}
                      <div
                        className="absolute inset-0 bg-zinc-950 p-4 rounded-2xl flex flex-col justify-between border-l-2 border-l-primary"
                        style={{
                          backfaceVisibility: "hidden",
                          WebkitBackfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                        }}
                      >
                        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Recall Answer</span>
                        <p className="text-[11px] text-zinc-300 leading-relaxed font-semibold italic text-center flex-1 flex items-center justify-center">
                          {fc.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
