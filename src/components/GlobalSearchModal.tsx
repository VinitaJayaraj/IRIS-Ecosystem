"use client";

import React, { useState, useEffect } from "react";
import { useLearning } from "@/context/LearningContext";
import { Search, X, Bot, FileText, BookOpen, CheckSquare, Sparkles, MessageSquare, ArrowRight, User } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: "tutor" | "document" | "task" | "node" | "chat" | "user";
  icon: React.ReactNode;
  action: () => void;
}

export default function GlobalSearchModal({
  isOpen,
  onClose,
  onSelectTab,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string, agentId?: string) => void;
}) {
  const { agents, documents, tasks, graphNodes, conversations, userName, primaryGoal } = useLearning();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or state toggle
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const q = searchQuery.toLowerCase().trim();
    const matches: SearchResult[] = [];

    // 1. Search Tutors
    agents.forEach(agent => {
      if (agent.name.toLowerCase().includes(q) || agent.role.toLowerCase().includes(q) || agent.tagline.toLowerCase().includes(q)) {
        matches.push({
          id: `tutor-${agent.id}`,
          title: agent.name,
          subtitle: agent.role,
          category: "tutor",
          icon: <span className="text-lg">{agent.avatar}</span>,
          action: () => {
            onSelectTab("agents", agent.id);
            onClose();
          }
        });
      }
    });

    // 2. Search Documents
    documents.forEach(doc => {
      if (doc.name.toLowerCase().includes(q) || doc.content.toLowerCase().includes(q)) {
        matches.push({
          id: `doc-${doc.id}`,
          title: doc.name,
          subtitle: `Document (${doc.size}) • Uploaded ${doc.uploadedAt}`,
          category: "document",
          icon: <FileText className="w-4 h-4 text-amber-400" />,
          action: () => {
            onSelectTab("workspace");
            onClose();
          }
        });
      }
    });

    // 3. Search Tasks
    tasks.forEach(task => {
      if (task.title.toLowerCase().includes(q) || task.subject.toLowerCase().includes(q)) {
        matches.push({
          id: `task-${task.id}`,
          title: task.title,
          subtitle: `${task.subject} • ${task.duration} mins • Priority ${task.priority}`,
          category: "task",
          icon: <CheckSquare className="w-4 h-4 text-emerald-400" />,
          action: () => {
            onSelectTab("planner");
            onClose();
          }
        });
      }
    });



    // 5. Search Conversations
    Object.entries(conversations).forEach(([agentId, msgs]) => {
      const agent = agents.find(a => a.id === agentId);
      msgs.forEach(msg => {
        if (msg.content.toLowerCase().includes(q)) {
          matches.push({
            id: `chat-${msg.id}`,
            title: `Chat with ${agent?.name || agentId}`,
            subtitle: `"${msg.content.substring(0, 50)}..."`,
            category: "chat",
            icon: <MessageSquare className="w-4 h-4 text-cyan-400" />,
            action: () => {
              onSelectTab("agents", agentId);
              onClose();
            }
          });
        }
      });
    });

    // 6. User Profile match
    if (userName.toLowerCase().includes(q) || primaryGoal.toLowerCase().includes(q)) {
      matches.push({
        id: "user-profile",
        title: `Learner Profile: ${userName}`,
        subtitle: `Primary Goal: ${primaryGoal}`,
        category: "user",
        icon: <User className="w-4 h-4 text-pink-400" />,
        action: () => {
          onSelectTab("dashboard");
          onClose();
        }
      });
    }

    setResults(matches.slice(0, 10));
  }, [searchQuery, agents, documents, tasks, graphNodes, conversations, userName, primaryGoal, onSelectTab, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-start justify-center pt-20 p-4 animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Bar Input */}
        <div className="p-4 border-b border-zinc-850 flex items-center gap-3 bg-zinc-950/60">
          <Search className="w-5 h-5 text-purple-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Global Search (Ctrl+K): type subjects, tutors, docs, chats..."
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-zinc-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] bg-zinc-800 text-zinc-400 rounded-lg font-mono border border-zinc-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {searchQuery.trim() === "" ? (
            <div className="p-8 text-center text-zinc-500 text-xs space-y-2">
              <Sparkles className="w-6 h-6 text-purple-400 mx-auto animate-pulse" />
              <p>Type to search across AI Tutors, Notes, Tasks, and Messages.</p>
              <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                {["Calculus", "React", "Newton", "Grammar", "Roadmap"].map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => setSearchQuery(sug)}
                    className="text-[10px] bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white px-2.5 py-1 rounded-full"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-xs">
              No matching records found for <span className="text-zinc-300 font-semibold">"{searchQuery}"</span>.
            </div>
          ) : (
            results.map((res) => (
              <button
                key={res.id}
                onClick={res.action}
                className="w-full p-3 rounded-2xl bg-zinc-950/40 hover:bg-purple-600/10 border border-zinc-850 hover:border-purple-500/30 flex items-center justify-between transition-all cursor-pointer text-left group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 shrink-0">
                    {res.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-zinc-200 group-hover:text-purple-300 truncate">
                      {res.title}
                    </div>
                    <div className="text-[10px] text-zinc-500 truncate mt-0.5">
                      {res.subtitle}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold bg-zinc-900 text-zinc-400 border border-zinc-800">
                    {res.category}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-purple-400 transition-colors" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-zinc-950/80 border-t border-zinc-850 text-[10px] text-zinc-500 flex justify-between items-center px-4 font-mono">
          <span>IRIS Universal Indexing</span>
          <span>{results.length} results</span>
        </div>

      </div>
    </div>
  );
}
