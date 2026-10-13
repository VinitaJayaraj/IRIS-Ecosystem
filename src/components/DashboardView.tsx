"use client";

import React, { useState } from "react";
import { useLearning } from "@/context/LearningContext";
import {
  Brain,
  GraduationCap,
  Target,
  FolderOpen,
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Clock,
  Flame,
  BookOpen,
  Network,
  Activity,
  Award,
  Compass,
  Sliders,
  Check
} from "lucide-react";

interface DashboardViewProps {
  onNavigate?: (tab: "dashboard" | "agents" | "workspace" | "planner" | "assessments" | "profile") => void;
}

export default function DashboardView({ onNavigate }: DashboardViewProps) {
  const {
    dna,
    xp,
    level,
    streak,
    userName,
    studyMode,
    setStudyMode,
    activeModes,
    setActiveModes,
    primaryGoal,
    learningStyle,
    tutorTone,
    explanationDetail,
    dailyStudyMinutes,
    activeAgentId,
    setActiveAgentId,
    agents,
    tasks
  } = useLearning();

  const [modeNotice, setModeNotice] = useState<string | null>(null);

  const activeTasks = tasks.filter(t => !t.completed);

  // Available learning modes
  const learningModes = [
    {
      id: "Deep Learning",
      name: "Deep Learning",
      icon: "🧠",
      color: "border-purple-500/40 bg-purple-500/10 text-purple-300",
      activeBg: "bg-purple-600 text-white",
      desc: "Comprehensive derivations, fundamental axioms, and multi-concept synthesis."
    },
    {
      id: "Exam Prep",
      name: "Exam Preparation",
      icon: "📝",
      color: "border-primary/40 bg-primary/10 text-primary",
      activeBg: "bg-primary text-white",
      desc: "High-yield formulas, common examination traps, and structured problem solutions."
    },
    {
      id: "Quick Revision",
      name: "Quick Revision",
      icon: "⚡",
      color: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
      activeBg: "bg-cyan-600 text-white",
      desc: "Rapid 60-second recaps, decision matrices, and bullet-point memory anchors."
    },
    {
      id: "Concept Mastery",
      name: "Concept Mastery",
      icon: "🏆",
      color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
      activeBg: "bg-emerald-600 text-white",
      desc: "90% mastery threshold testing, active recall verification, and misconception audits."
    },
    {
      id: "Interview Prep",
      name: "Interview Preparation",
      icon: "💼",
      color: "border-pink-500/40 bg-pink-500/10 text-pink-300",
      activeBg: "bg-pink-600 text-white",
      desc: "Technical communication, architectural trade-offs, and STAR delivery strategies."
    },
    {
      id: "Competitive Exam",
      name: "Competitive Exam",
      icon: "🎯",
      color: "border-amber-500/40 bg-amber-500/10 text-amber-300",
      activeBg: "bg-amber-600 text-white",
      desc: "Speed tactics, elimination principles, and boundary value approximations."
    }
  ];

  const handleSelectMode = (modeName: string) => {
    setStudyMode(modeName);
    setActiveModes([modeName]);
    setModeNotice(`Adaptive Learning Mode set to "${modeName}". AI Tutors will now adapt their reasoning style.`);
    setTimeout(() => setModeNotice(null), 4000);
  };

  const handleSelectTutor = (agentId: string) => {
    setActiveAgentId(agentId);
    if (onNavigate) {
      onNavigate("agents");
    }
  };

  return (
    <div className="space-y-7 max-w-6xl mx-auto dashboard-theme">
      
      {/* ========================================================================= */}
      {/* 1. CORE VISION & WELCOME BANNER                                           */}
      {/* Communicates immediately: IRIS Personalized AI Learning Ecosystem         */}
      {/* ========================================================================= */}
      <div className="p-6 md:p-8 rounded-3xl glass-panel relative overflow-hidden border-l-4 border-l-primary bg-gradient-to-r from-zinc-950 via-zinc-900/70 to-zinc-950">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mb-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
              <Zap className="w-4 h-4 text-secondary animate-pulse" />
              Intelligent Adaptive Platform • AI Learning Ecosystem
            </div>
            
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white mt-1.5">
              IRIS <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Personalized AI Learning</span>
            </h1>
            
            {/* The Central Mission of IRIS */}
            <p className="text-zinc-300 mt-2.5 text-xs md:text-sm leading-relaxed font-medium bg-zinc-900/60 border border-zinc-800/80 p-3 rounded-2xl">
              <span className="text-secondary font-bold">"IRIS</span> is a personalized AI learning ecosystem where specialized AI tutors teach students according to their subject knowledge, learning profile, learning mode and progress."
            </p>
          </div>

          {/* Quick Real-Time Metrics Summary */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-3 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-center min-w-[90px]">
              <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Streak</div>
              <div className="text-lg font-black text-amber-400 flex items-center justify-center gap-1 font-mono">
                <Flame className="w-4 h-4 text-amber-500 inline" /> {streak}d
              </div>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-center min-w-[90px]">
              <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Profile Score</div>
              <div className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400 font-mono">
                {dna.score}%
              </div>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-center min-w-[90px]">
              <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Level</div>
              <div className="text-lg font-black text-white font-mono">
                Lvl {level}
              </div>
            </div>
          </div>
        </div>

        {modeNotice && (
          <div className="mt-4 p-2.5 rounded-xl bg-primary/10 border border-primary/30 text-primary text-xs font-semibold flex items-center gap-2 animate-float">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{modeNotice}</span>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* FEATURE 1: SPECIALIZED AI TUTORS (CORE UNIQUE FEATURE)                     */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2 tracking-tight">
              <GraduationCap className="w-5 h-5 text-primary" />
              1. Specialized AI Tutors
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Dedicated subject tutors with domain-isolated knowledge retrieval and custom pedagogical identities
            </p>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate("agents")}
              className="text-xs font-bold text-primary hover:text-secondary transition-colors flex items-center gap-1 cursor-pointer"
            >
              Open Tutor Chat <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 6 Tutor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => {
            const isSelected = activeAgentId === agent.id;
            return (
              <div
                key={agent.id}
                onClick={() => handleSelectTutor(agent.id)}
                className={`p-5 rounded-2xl glass-panel border transition-all cursor-pointer group hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? "border-primary/60 bg-primary/5 shadow-[0_0_20px_rgba(139,92,246,0.15)]"
                    : "border-zinc-800/80 hover:border-zinc-700 bg-zinc-950/40"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                      {agent.avatar}
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-zinc-900 text-zinc-400 border border-zinc-800">
                      {agent.id === "math" ? "Exact Reasoning" : agent.id === "code" ? "Practical Logic" : agent.id === "science" ? "Empirical" : agent.id === "lit" ? "Rhetorical" : agent.id === "career" ? "Strategic" : "Scholarly"}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                    {agent.name}
                  </h3>
                  
                  <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {agent.role}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-zinc-500 font-medium">
                    {agent.suggestions ? `${agent.suggestions.length} topics ready` : "Subject specialist"}
                  </span>
                  <span className="text-[11px] font-bold text-primary group-hover:text-secondary flex items-center gap-1 transition-colors">
                    Start Session →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW: FEATURE 2 (LEARNING PROFILE) & FEATURE 3 (ADAPTIVE LEARNING MODES)   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* FEATURE 2: LEARNING PROFILE */}
        <div className="p-6 rounded-3xl glass-panel border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-850 pb-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-400" />
                  2. Student Learning Profile
                </h2>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Cognitive preferences, strengths, and personalized study pacing
                </p>
              </div>
              {onNavigate && (
                <button
                  onClick={() => onNavigate("profile")}
                  className="text-[11px] font-bold text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Edit Profile →
                </button>
              )}
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3 rounded-2xl bg-zinc-950/60 border border-zinc-850 flex justify-between items-center">
                <span className="text-zinc-400">Primary Goal:</span>
                <span className="font-bold text-white text-right max-w-[240px] truncate">{primaryGoal || "Software Engineering"}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-zinc-950/60 border border-zinc-850">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block">Learning Style</span>
                  <span className="text-zinc-200 font-semibold mt-0.5 block truncate">{learningStyle || "Visual Chalkboard"}</span>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-950/60 border border-zinc-850">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block">Daily Commitment</span>
                  <span className="text-teal-400 font-bold mt-0.5 block font-mono">{dailyStudyMinutes} mins / day</span>
                </div>
              </div>

              {/* Strengths & Weaknesses Snapshot */}
              <div className="p-3 rounded-2xl bg-zinc-950/60 border border-zinc-850 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold">Key Strengths</span>
                  <span className="text-[10px] text-emerald-400 font-bold">High Mastery</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {dna.strengths && dna.strengths.slice(0, 3).map((str, i) => (
                    <span key={i} className="text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                      {str}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-850 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 text-[11px]">Overall Mastery:</span>
              <span className="font-bold text-teal-400 font-mono text-sm">{dna.score}%</span>
            </div>
            {onNavigate && (
              <button
                onClick={() => onNavigate("profile")}
                className="text-[11px] font-bold text-teal-400 hover:text-teal-300 transition-colors"
              >
                View Analytics & Goals →
              </button>
            )}
          </div>
        </div>

        {/* FEATURE 3: ADAPTIVE LEARNING MODES */}
        <div className="p-6 rounded-3xl glass-panel border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-850 pb-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  3. Adaptive Learning Modes
                </h2>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Switches tutor reasoning, depth, and questioning tactics
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
                Active: {studyMode}
              </span>
            </div>

            {/* 6 Mode Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              {learningModes.map((mode) => {
                const isActive = studyMode === mode.id || (activeModes && activeModes.includes(mode.id));
                return (
                  <button
                    key={mode.id}
                    onClick={() => handleSelectMode(mode.id)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? `${mode.activeBg} shadow-md`
                        : "bg-zinc-950/60 border-zinc-850 hover:border-zinc-700 text-zinc-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base">{mode.icon}</span>
                      {isActive && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div className="mt-2">
                      <div className="font-bold text-xs">{mode.name}</div>
                      <div className={`text-[9px] mt-0.5 line-clamp-1 ${isActive ? "text-white/80" : "text-zinc-500"}`}>
                        {mode.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-850 text-[11px] text-zinc-400 flex items-center justify-between">
            <span>Pedagogical Engine: Mode Active</span>
            <span className="text-zinc-500 text-[10px]">Tutors dynamically format solutions</span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* ROW: FEATURE 4 (LEARNING WORKSPACE) & FEATURE 5 (LEARNING PROGRESS)       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* FEATURE 4: PERSONALIZED KNOWLEDGE / LEARNING WORKSPACE */}
        <div className="p-6 rounded-3xl glass-panel border border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-850 pb-3 mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                4. Personalized Knowledge & Workspace
              </h2>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Synthesized study notebooks, active recall flashcards, and assessments
              </p>
            </div>
          </div>

          <div className="space-y-3">

            <div
              onClick={() => onNavigate && onNavigate("workspace")}
              className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-850 hover:border-cyan-500/40 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <FolderOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-200 group-hover:text-cyan-300 transition-colors">
                    NotebookLM Learning Workspace
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    Upload papers, generate active recall flashcards and custom quizzes
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-cyan-400 transition-colors" />
            </div>

            <div
              onClick={() => onNavigate && onNavigate("assessments")}
              className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-850 hover:border-cyan-500/40 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-200 group-hover:text-cyan-300 transition-colors">
                    Mistake Bank & Self-Assessments
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    Targeted practice on recorded misconceptions and exam weaknesses
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-cyan-400 transition-colors" />
            </div>
          </div>
        </div>

        {/* FEATURE 5: LEARNING PROGRESS */}
        <div className="p-6 rounded-3xl glass-panel border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-850 pb-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  5. Learning Progress & Schedule
                </h2>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Daily focus agenda and topic comprehension tracking
                </p>
              </div>
              {onNavigate && (
                <button
                  onClick={() => onNavigate("planner")}
                  className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  View Planner →
                </button>
              )}
            </div>

            {/* Focus Agenda preview */}
            <div className="space-y-2.5">
              {activeTasks.length === 0 ? (
                <div className="p-4 rounded-2xl bg-zinc-950/40 text-center text-zinc-500 text-xs">
                  All scheduled study tasks completed for today!
                </div>
              ) : (
                activeTasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="p-3 rounded-2xl bg-zinc-950/60 border border-zinc-850 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-zinc-200">{task.title}</div>
                      <div className="text-[10px] text-zinc-500">{task.subject} • {task.duration} mins</div>
                    </div>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                      {task.scheduledTime}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-850 flex items-center justify-between text-xs">
            <span className="text-zinc-400 text-[11px]">Tasks Remaining Today:</span>
            <span className="font-bold text-emerald-400 font-mono">{activeTasks.length} active</span>
          </div>
        </div>

      </div>

    </div>
  );
}
