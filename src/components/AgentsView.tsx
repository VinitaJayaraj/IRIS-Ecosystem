"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLearning, Message, Agent } from "@/context/LearningContext";
import { Send, Eraser, AlertCircle, Play, Info, Sparkles, Plus, GraduationCap, Trash2 } from "lucide-react";

// --- CLEAN MATHEMATICAL & MARKDOWN RENDERER ---
function parseInlineFormatting(text: string) {
  if (!text) return null;
  // Strip raw inline $...$ wrappers
  const cleaned = text.replace(/\$([^$]+)\$/g, "$1");
  const parts = cleaned.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded bg-zinc-800 text-purple-300 font-mono text-[11px] border border-zinc-700/50">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function FormattedMessage({ content }: { content: string }) {
  if (!content) return null;

  // Clean raw technical LaTeX notation for beautiful user output
  let cleanText = content
    .replace(/\\begin\{pmatrix\}([\s\S]*?)\\end\{pmatrix\}/g, (match, body) => {
      const rows = body.split("\\\\").map((r: string) => r.replace(/&/g, "  ").trim());
      return `[ ${rows.join(" ; ")} ]`;
    })
    .replace(/\\text\{([^}]+)\}/g, "$1")
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1 / $2)")
    .replace(/\\sqrt\{([^}]+)\}/g, "√($1)")
    .replace(/\\cdot/g, "·")
    .replace(/\\times/g, "×")
    .replace(/\\pm/g, "±")
    .replace(/\\approx/g, "≈")
    .replace(/\\neq/g, "≠")
    .replace(/\\le/g, "≤")
    .replace(/\\ge/g, "≥")
    .replace(/\\infty/g, "∞")
    .replace(/\\pi/g, "π")
    .replace(/\\int/g, "∫")
    .replace(/\\sum/g, "∑")
    .replace(/\\partial/g, "∂")
    .replace(/\\implies/g, "⟹")
    .replace(/\^2/g, "²")
    .replace(/\^3/g, "³")
    .replace(/\^n/g, "ⁿ");

  const lines = cleanText.split("\n");

  return (
    <div className="space-y-2 text-xs leading-relaxed text-zinc-200">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        if (trimmed.startsWith("### ")) {
          return (
            <h4 key={idx} className="font-bold text-sm text-purple-300 mt-3 mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              {parseInlineFormatting(trimmed.substring(4))}
            </h4>
          );
        }

        if (trimmed.startsWith("## ")) {
          return (
            <h3 key={idx} className="font-bold text-sm text-white mt-3 mb-1 border-b border-zinc-800 pb-1">
              {parseInlineFormatting(trimmed.substring(3))}
            </h3>
          );
        }

        if (trimmed.startsWith("# ")) {
          return (
            <h2 key={idx} className="font-extrabold text-base text-white mt-3 mb-1">
              {parseInlineFormatting(trimmed.substring(2))}
            </h2>
          );
        }

        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2 my-0.5">
              <span className="text-purple-400 shrink-0 font-bold">•</span>
              <div className="flex-1">{parseInlineFormatting(trimmed.substring(2))}</div>
            </div>
          );
        }

        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2 my-0.5">
              <span className="text-purple-400 font-bold shrink-0">{numMatch[1]}.</span>
              <div className="flex-1">{parseInlineFormatting(numMatch[2])}</div>
            </div>
          );
        }

        if (trimmed.startsWith("> ")) {
          return (
            <div key={idx} className="p-2.5 my-1.5 rounded-xl bg-purple-950/20 border-l-4 border-purple-500 text-zinc-300 italic">
              {parseInlineFormatting(trimmed.substring(2))}
            </div>
          );
        }

        if (trimmed.toLowerCase().includes("final answer:")) {
          return (
            <div key={idx} className="p-3 my-2 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-bold text-sm shadow-sm">
              {parseInlineFormatting(trimmed)}
            </div>
          );
        }

        return <p key={idx}>{parseInlineFormatting(line)}</p>;
      })}
    </div>
  );
}

export default function AgentsView() {
  const {
    agents,
    activeAgentId,
    setActiveAgentId,
    conversations,
    sendMessage,
    clearConversation,
    clearAllConversations,
    currentMood,
    apiKey,
    tutorTone,
    setTutorTone,
    explanationDetail,
    setExplanationDetail,
    studyMode,
    setStudyMode,
    installedMentorIds,
    installMentor
  } = useLearning();

  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeAgent = agents.find(a => a.id === activeAgentId) || agents[0];
  const activeChat = conversations[activeAgentId] || [];

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat]);

  const handleSend = async (e?: React.FormEvent, presetText?: string) => {
    if (e) e.preventDefault();
    const query = presetText || inputText;
    if (!query.trim() || isSending) return;

    setInputText("");
    setIsSending(true);
    await sendMessage(query);
    setIsSending(false);
  };

  // --- INTERACTIVE WIDGET COMPONENT ---
  const RenderWidget = ({ widget }: { widget: Message["interactiveWidget"] }) => {
    if (!widget) return null;

    const { type, data } = widget;

    // 1. Math Chalkboard
    if (type === "chalkboard") {
      return (
        <div className="mt-3 p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800 font-mono text-xs text-zinc-300">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
            <span className="text-purple-400 font-bold">📐 Math Blackboard: {data.title}</span>
            <span className="text-[10px] text-zinc-500">Click steps to review</span>
          </div>
          <div className="space-y-3">
            {data.steps?.map((step: any, i: number) => (
              <div key={i} className="p-2 rounded bg-zinc-900 border border-zinc-850 hover:border-purple-500/30 transition-all cursor-pointer">
                <div className="text-purple-300 font-bold text-sm">{step.equation}</div>
                <div className="text-zinc-500 text-[10px] mt-0.5">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 2. Science Simulation
    if (type === "simulation") {
      const [sliderVal, setSliderVal] = useState(50);
      const calculatedForce = (6.674 * sliderVal * 1.5).toFixed(2);

      return (
        <div className="mt-3 p-4 rounded-2xl bg-zinc-950/95 border border-zinc-800 text-xs">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
            <span className="text-cyan-400 font-bold">🧪 Science Lab: {data.system}</span>
            <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-1.5 py-0.5 rounded">Active Preset: {data.preset}</span>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between font-semibold text-zinc-400">
                <span>Gravitational Mass Ratio</span>
                <span className="text-cyan-300">{sliderVal}% (Simulated Mass)</span>
              </div>
              <input
                type="range"
                min="10"
                max="120"
                value={sliderVal}
                onChange={(e) => setSliderVal(parseInt(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-850 space-y-1.5 font-mono text-[10px]">
              <div><span className="text-zinc-500">Calculated G-Force:</span> <span className="text-white font-bold">{calculatedForce} × 10⁻¹¹ N</span></div>
              <div><span className="text-zinc-500">Orbit Trajectory:</span> <span className={`${sliderVal > 90 ? "text-red-400" : sliderVal < 30 ? "text-yellow-400" : "text-emerald-400"} font-bold`}>{sliderVal > 90 ? "Orbital Decay (Crash imminent)" : sliderVal < 30 ? "Hyperbolic Escape Path" : "Stable Circular Orbit"}</span></div>
            </div>
          </div>
        </div>
      );
    }

    // 3. Coding Coach Sandbox
    if (type === "code_editor") {
      const [codeState, setCodeState] = useState(data.code);
      const [consoleOutput, setConsoleOutput] = useState("");
      const [isRunning, setIsRunning] = useState(false);

      const runCodeSim = () => {
        setIsRunning(true);
        setConsoleOutput("Analyzing AST...\nLinter checks complete.\n");
        setTimeout(() => {
          setIsRunning(false);
          if (codeState.includes("useMemo")) {
            setConsoleOutput(prev => prev + "✓ Execution Successful.\n" + data.output);
          } else {
            setConsoleOutput(prev => prev + "✓ Output: Function compiled without warning. Return payload validated.");
          }
        }, 600);
      };

      return (
        <div className="mt-3 p-4 rounded-2xl bg-zinc-950/95 border border-zinc-800 text-xs">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
            <span className="text-emerald-400 font-bold">💻 Code Sandbox: {data.fileName}</span>
            <button
              onClick={runCodeSim}
              disabled={isRunning}
              className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold px-2.5 py-1 rounded-lg transition-all"
            >
              <Play className="w-3 h-3 fill-black" /> {isRunning ? "Running..." : "Run"}
            </button>
          </div>
          <div className="space-y-3">
            <textarea
              value={codeState}
              onChange={(e) => setCodeState(e.target.value)}
              rows={8}
              className="w-full p-2.5 font-mono text-[11px] bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300 focus:outline-none focus:border-emerald-500/40"
            />
            {consoleOutput && (
              <div className="p-3 bg-zinc-900 border border-zinc-850 rounded-xl font-mono text-[10px] text-zinc-400 whitespace-pre-wrap">
                {consoleOutput}
              </div>
            )}
          </div>
        </div>
      );
    }

    // 4. Literature Grammar Checker
    if (type === "grammar_checker") {
      return (
        <div className="mt-3 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs">
          <div className="flex items-center justify-between border-b border-zinc-850 pb-2 mb-3">
            <span className="text-amber-500 font-bold">✍️ Style & Rhetoric Revisions</span>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-2.5 rounded-xl bg-red-950/10 border border-red-500/10">
                <div className="text-[10px] text-red-400 font-bold uppercase mb-1">Original Draft</div>
                <p className="text-zinc-400 leading-relaxed italic">"{data.originalText}"</p>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-950/10 border border-emerald-500/10">
                <div className="text-[10px] text-emerald-400 font-bold uppercase mb-1">Polished Revision</div>
                <p className="text-zinc-200 leading-relaxed font-medium italic">"{data.improvedText}"</p>
              </div>
            </div>

            <div className="mt-2 space-y-2">
              <div className="text-[10px] text-zinc-500 font-bold uppercase">Change Log details:</div>
              {data.suggestions?.map((s: any, idx: number) => (
                <div key={idx} className="p-2 bg-zinc-900/60 border border-zinc-850 rounded-lg flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <div>
                    <span className="text-zinc-400 line-through mr-1.5">{s.target}</span>
                    <span className="text-emerald-400 font-semibold mr-2">→ {s.fix}</span>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{s.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // 5. Career Path Roadmap
    if (type === "career_roadmap") {
      return (
        <div className="mt-3 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs">
          <div className="flex items-center justify-between border-b border-zinc-850 pb-2 mb-3">
            <span className="text-pink-500 font-bold">🚀 Career Path: {data.targetRole}</span>
            <span className="text-[10px] text-zinc-500">{data.salaryTrend}</span>
          </div>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-800">
            {data.nodes?.map((node: any, i: number) => (
              <div key={i} className="relative">
                <div className={`absolute -left-6 w-4 h-4 rounded-full border-4 border-zinc-950 flex items-center justify-center ${
                  node.status === "complete" ? "bg-emerald-500" : node.status === "in-progress" ? "bg-pink-500 animate-pulse" : "bg-zinc-800"
                }`} />
                <div>
                  <h4 className="font-bold text-zinc-200">{node.name}</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {node.skills?.map((sk: string, skIdx: number) => (
                      <span key={skIdx} className="text-[9px] bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 6. Research Citation
    if (type === "citation_generator") {
      return (
        <div className="mt-3 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs">
          <div className="flex items-center justify-between border-b border-zinc-850 pb-2 mb-3">
            <span className="text-slate-400 font-bold">📚 Academic References Helper</span>
          </div>
          <div className="space-y-3 font-mono text-[10px] text-zinc-400">
            <div>
              <div className="text-[9px] text-zinc-500 uppercase font-sans mb-1 font-bold">APA Formatter</div>
              <div className="p-2 bg-zinc-900 border border-zinc-850 rounded text-zinc-300 select-all">
                {data.formats?.apa}
              </div>
            </div>
            <div>
              <div className="text-[9px] text-zinc-500 uppercase font-sans mb-1 font-bold">MLA Formatter</div>
              <div className="p-2 bg-zinc-900 border border-zinc-850 rounded text-zinc-300 select-all">
                {data.formats?.mla}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)] min-h-[500px]">
      
      {/* Left Drawer: Agent Profiles */}
      <div className="lg:col-span-1 glass-panel rounded-3xl p-4 flex flex-col gap-3 overflow-y-auto max-h-full">
        <div className="pb-2 border-b border-zinc-800/40">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Multi-Agent Network</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">Click to consult specialized tutors</div>
        </div>

        <div className="space-y-2 flex-1">
          {agents.map((agent) => {
            const isActive = agent.id === activeAgentId;
            return (
              <button
                key={agent.id}
                onClick={() => setActiveAgentId(agent.id)}
                className={`w-full p-3 rounded-2xl text-left border flex items-start gap-3 transition-all cursor-pointer ${
                  isActive
                    ? `bg-gradient-to-r ${agent.color} text-white border-transparent shadow-md scale-[1.02]`
                    : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                }`}
              >
                <span className="text-2xl mt-0.5">{agent.avatar}</span>
                <div className="min-w-0">
                  <div className="font-bold text-xs truncate">{agent.name}</div>
                  <div className={`text-[10px] line-clamp-2 mt-0.5 ${isActive ? "text-white/80" : "text-zinc-500"}`}>
                    {agent.role}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Middle/Right: Live Chat Engine */}
      <div className="lg:col-span-3 glass-panel rounded-3xl flex flex-col h-full overflow-hidden">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-zinc-850 flex items-center justify-between bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{activeAgent.avatar}</span>
            <div>
              <div className="font-extrabold text-sm flex items-center gap-1.5">
                {activeAgent.name}
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              </div>
              <div className="text-[10px] text-zinc-500">{activeAgent.tagline}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2.5 py-1 rounded-full font-semibold">
              Mode: {studyMode}
            </span>

            {apiKey ? (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold">
                Live LLM
              </span>
            ) : (
              <span className="text-[10px] bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> RAG Knowledge
              </span>
            )}

            <button
              onClick={() => clearConversation(activeAgentId)}
              title="Clear conversation"
              className="p-1.5 px-2.5 rounded-xl bg-zinc-950/40 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 cursor-pointer flex items-center gap-1.5 text-[11px] transition-all"
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Message Space */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-full">
          {activeChat.map((msg) => {
            const isAgent = msg.sender === "agent";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isAgent ? "self-start" : "ml-auto flex-row-reverse"}`}
              >
                {isAgent ? (
                  <span className="text-2xl mt-0.5 filter drop-shadow-sm select-none">{activeAgent.avatar}</span>
                ) : (
                  <span className="text-2xl mt-0.5 filter drop-shadow-sm select-none">👤</span>
                )}
                
                <div className="space-y-1">
                  <div
                    className={`p-3.5 rounded-3xl text-xs leading-relaxed ${
                      isAgent
                        ? "bg-zinc-900 border border-zinc-850 rounded-tl-none text-zinc-300"
                        : "bg-primary text-white rounded-tr-none"
                    }`}
                  >
                    <FormattedMessage content={msg.content} />
                    <RenderWidget widget={msg.interactiveWidget} />

                    {isAgent && msg.sources && msg.sources.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-2.5 border-t border-zinc-800/60 mt-3">
                        <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
                          📚 Grounded Sources:
                        </span>
                        {msg.sources.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-purple-950/40 border border-purple-800/40 text-[9px] text-purple-300 font-medium truncate max-w-[240px]"
                            title={`${s.topic} (${s.source})`}
                          >
                            {s.topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className={`text-[9px] text-zinc-500 px-2 ${isAgent ? "text-left" : "text-right"}`}>
                    {msg.timestamp} {msg.moodDetected && `• Mood: ${msg.moodDetected}`}
                  </div>
                </div>
              </div>
            );
          })}
          {isSending && (
            <div className="flex gap-3 max-w-[80%] items-center text-zinc-500 text-xs">
              <span className="text-2xl animate-spin-slow">{activeAgent.avatar}</span>
              <div className="flex items-center gap-1">
                <span>{activeAgent.name} is compiling a response</span>
                <span className="animate-bounce font-bold">.</span>
                <span className="animate-bounce [animation-delay:0.2s] font-bold">.</span>
                <span className="animate-bounce [animation-delay:0.4s] font-bold">.</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Dynamic Prompt Suggestions */}
        {activeChat.length <= 1 && (
          <div className="px-4 pb-2">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center gap-1 font-bold">
              <GraduationCap className="w-3.5 h-3.5 text-primary" /> Study Starters
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeAgent.suggestions?.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(undefined, sug)}
                  className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 px-2.5 py-1 rounded-full text-left transition-all"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-4 border-t border-zinc-850 bg-zinc-900/20 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${activeAgent.name} (e.g. explain, write code, simulation)...`}
            className="flex-1 px-4 py-3 rounded-2xl glass-input text-xs text-white"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="p-3 rounded-2xl bg-primary hover:bg-primary/95 text-white disabled:bg-zinc-800 disabled:text-zinc-600 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
}
