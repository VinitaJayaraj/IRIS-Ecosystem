"use client";

import React, { useState } from "react";
import { useLearning } from "@/context/LearningContext";
import {
  Brain,
  Sparkles,
  TrendingUp,
  Award,
  Target,
  Clock,
  Zap,
  BookOpen,
  Save,
  CheckCircle2,
  Activity,
  Compass,
  Smile,
  ShieldCheck,
  Flame,
  BarChart3
} from "lucide-react";

export default function LearningProfileView() {
  const {
    userName,
    setUserName,
    primaryGoal,
    setPrimaryGoal,
    learningStyle,
    setLearningStyle,
    dailyStudyMinutes,
    setDailyStudyMinutes,
    tutorTone,
    setTutorTone,
    explanationDetail,
    setExplanationDetail,
    dna,
    xp,
    level,
    streak,
    currentMood,
    setCurrentMood,
    currentUser,
    updateStats
  } = useLearning();

  // Local state for editing profile preferences
  const [goalInput, setGoalInput] = useState(primaryGoal || "Software Engineering & Distributed Systems");
  const [styleInput, setStyleInput] = useState(learningStyle || "Visual Chalkboard & Interactive Code");
  const [minutesInput, setMinutesInput] = useState(dailyStudyMinutes || 60);
  const [toneInput, setToneInput] = useState(tutorTone || "Encouraging");
  const [detailInput, setDetailInput] = useState(explanationDetail || "Detailed");
  const [skillLevel, setSkillLevel] = useState("Intermediate");
  const [interestsInput, setInterestsInput] = useState("Algorithms, Linear Algebra, Machine Learning Systems");
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setPrimaryGoal(goalInput);
    setLearningStyle(styleInput);
    setDailyStudyMinutes(minutesInput);
    setTutorTone(toneInput);
    setExplanationDetail(detailInput);

    // Sync to SQLite via FastAPI backend
    try {
      await fetch("http://127.0.0.1:8000/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUser?.id || "usr_101",
          primaryGoal: goalInput,
          learningStyle: styleInput,
          dailyStudyMinutes: minutesInput,
          tutorTone: toneInput,
          explanationDetail: detailInput,
          skillLevel,
          interests: interestsInput
        })
      });
    } catch {
      // Local state is already updated
    }

    setIsSaving(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto profile-theme">
      {/* 1. Header Banner - Growth & Analytics Character */}
      <div className="p-6 md:p-8 rounded-3xl glass-panel relative overflow-hidden border-l-4 border-l-teal-500 bg-gradient-to-r from-teal-950/20 via-zinc-900/60 to-emerald-950/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-widest">
              <Activity className="w-4 h-4 text-teal-400" />
              Personalized Learning Profile
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white mt-1">
              Cognitive Profile & <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Progress Analytics</span>
            </h1>
            <p className="text-zinc-400 mt-2 text-xs md:text-sm max-w-2xl leading-relaxed">
              IRIS adapts each AI tutor's reasoning depth, terminology, and practice exercises to your individual learning pace, subject mastery, and cognitive style.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-3 rounded-2xl bg-zinc-950/60 border border-teal-500/30 text-center">
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Profile Score</div>
              <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400 font-mono">
                {dna.score} / 100
              </div>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-zinc-950/60 border border-zinc-800 text-center">
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Learning Level</div>
              <div className="text-2xl font-black text-white font-mono">
                Lvl {level}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Cognitive Metrics Radar Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Learning Speed", val: dna.stats.learningSpeed, icon: <Zap className="w-4 h-4 text-teal-400" />, color: "text-teal-400", bar: "bg-teal-400" },
          { label: "Retention Rate", val: dna.stats.retentionRate, icon: <Brain className="w-4 h-4 text-emerald-400" />, color: "text-emerald-400", bar: "bg-emerald-400" },
          { label: "Consistency", val: dna.stats.consistency, icon: <Clock className="w-4 h-4 text-cyan-400" />, color: "text-cyan-400", bar: "bg-cyan-400" },
          { label: "Motivation", val: dna.stats.motivation, icon: <Flame className="w-4 h-4 text-amber-400" />, color: "text-amber-400", bar: "bg-amber-400" },
        ].map((stat, idx) => (
          <div key={idx} className="p-4 rounded-2xl glass-panel border border-zinc-800/60 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 flex items-center gap-1.5">
                {stat.icon} {stat.label}
              </span>
              <span className={`text-lg font-black font-mono ${stat.color}`}>{stat.val}%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-900 rounded-full mt-3 overflow-hidden">
              <div className={`h-full ${stat.bar} transition-all duration-700`} style={{ width: `${stat.val}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Core Preferences Configuration Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Preferences & Goals Editor */}
        <div className="lg:col-span-2 p-6 rounded-3xl glass-panel border border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-5">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-teal-400" /> Learning Goals & Preferences
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">Customize how AI tutors shape their pedagogy for your sessions</p>
            </div>
            {isSaved && (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Saved to SQLite
              </span>
            )}
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] text-zinc-400 uppercase tracking-wider font-bold mb-1.5">
                Primary Learning Goal
              </label>
              <input
                type="text"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                placeholder="e.g. Software Engineering & Distributed Systems"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-teal-500 text-white text-xs outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-zinc-400 uppercase tracking-wider font-bold mb-1.5">
                  Preferred Learning Style
                </label>
                <select
                  value={styleInput}
                  onChange={(e) => setStyleInput(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-teal-500 text-zinc-200 text-xs outline-none"
                >
                  <option value="Visual Chalkboard & Interactive Code">Visual Chalkboard & Interactive Code</option>
                  <option value="Step-by-Step Proofs & Formulas">Step-by-Step Proofs & Formulas</option>
                  <option value="Intuitive Analogies & Socratic Dialogue">Intuitive Analogies & Socratic Dialogue</option>
                  <option value="Code-First Practical Implementation">Code-First Practical Implementation</option>
                  <option value="Concise Summary & Rapid Recall">Concise Summary & Rapid Recall</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 uppercase tracking-wider font-bold mb-1.5">
                  Current Subject Skill Level
                </label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-teal-500 text-zinc-200 text-xs outline-none"
                >
                  <option value="Beginner">Beginner (Foundational Principles)</option>
                  <option value="Intermediate">Intermediate (Application & Problem-Solving)</option>
                  <option value="Advanced">Advanced (Rigorous Proofs & Architecture)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] text-zinc-400 uppercase tracking-wider font-bold mb-1.5">
                  Daily Study Minutes
                </label>
                <input
                  type="number"
                  min="15"
                  max="480"
                  step="15"
                  value={minutesInput}
                  onChange={(e) => setMinutesInput(parseInt(e.target.value, 10) || 45)}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-teal-500 text-white text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 uppercase tracking-wider font-bold mb-1.5">
                  Tutor Persona Tone
                </label>
                <select
                  value={toneInput}
                  onChange={(e) => setToneInput(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-teal-500 text-zinc-200 text-xs outline-none"
                >
                  <option value="Encouraging">Encouraging & Patient</option>
                  <option value="Academic">Academic & Rigorous</option>
                  <option value="Socratic">Socratic & Inquiring</option>
                  <option value="Direct">Direct & Concise</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 uppercase tracking-wider font-bold mb-1.5">
                  Explanation Depth
                </label>
                <select
                  value={detailInput}
                  onChange={(e) => setDetailInput(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-teal-500 text-zinc-200 text-xs outline-none"
                >
                  <option value="Concise">Concise (Fast bullet-points)</option>
                  <option value="Detailed">Detailed (Full derivations & steps)</option>
                  <option value="Exhaustive">Exhaustive (Deep theoretical dive)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-zinc-400 uppercase tracking-wider font-bold mb-1.5">
                Key Subject Interests & Focus Areas
              </label>
              <input
                type="text"
                value={interestsInput}
                onChange={(e) => setInterestsInput(e.target.value)}
                placeholder="e.g. Calculus, Dynamic Programming, Classical Mechanics"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-teal-500 text-white text-xs outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold text-xs shadow-md shadow-teal-500/20 flex items-center gap-2 cursor-pointer transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                {isSaving ? "Saving..." : "Save Learning Profile"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Col: Strengths, Weaknesses & Cognitive Focus */}
        <div className="space-y-6">
          
          {/* Strengths & Focus Areas */}
          <div className="p-6 rounded-3xl glass-panel border border-zinc-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 mb-3">
              <Award className="w-4 h-4 text-emerald-400" /> Key Strengths
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {dna.strengths && dna.strengths.length > 0 ? (
                dna.strengths.map((str, i) => (
                  <span key={i} className="text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                    {str}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-zinc-500">Active Strengths building through practice.</span>
              )}
            </div>

            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 mt-5 mb-3">
              <Target className="w-4 h-4 text-teal-400" /> Target Areas for Improvement
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {dna.weaknesses && dna.weaknesses.length > 0 ? (
                dna.weaknesses.map((weak, i) => (
                  <span key={i} className="text-[10px] font-medium bg-teal-500/10 text-teal-300 border border-teal-500/20 px-2.5 py-1 rounded-lg">
                    {weak}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-zinc-500">No active weaknesses logged.</span>
              )}
            </div>
          </div>

          {/* Emotional Focus State */}
          <div className="p-6 rounded-3xl glass-panel border border-zinc-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 mb-1">
              <Smile className="w-4 h-4 text-teal-400" /> Emotional Focus State
            </h3>
            <p className="text-[10px] text-zinc-500 mb-3">Adapts AI explanation pacing to current cognitive state</p>

            <div className="flex flex-wrap gap-1.5">
              {["Focused", "Frustrated", "Bored", "Stressed", "Energized"].map((mood) => (
                <button
                  key={mood}
                  onClick={() => setCurrentMood(mood)}
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                    currentMood === mood
                      ? "bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-sm"
                      : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 4. Learning History & Milestone Timeline */}
      <div className="p-6 rounded-3xl glass-panel border border-zinc-800">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-teal-400" /> Recent Progress Milestones
        </h3>
        <div className="space-y-2.5">
          {dna.history && dna.history.length > 0 ? (
            dna.history.slice(-4).map((h, i) => (
              <div key={i} className="p-3 rounded-2xl bg-zinc-950/60 border border-zinc-850 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-teal-400" />
                  <div>
                    <span className="font-semibold text-zinc-200">Milestone Assessment: {h.date}</span>
                    <span className="text-[10px] text-zinc-500 block">Cognitive profile evaluated across subject interactions</span>
                  </div>
                </div>
                <span className="text-xs font-bold font-mono text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 rounded-lg">
                  Score: {h.score}
                </span>
              </div>
            ))
          ) : (
            <div className="text-xs text-zinc-500 py-3 text-center">Initial profile baseline loaded. Complete tutor sessions to track milestones.</div>
          )}
        </div>
      </div>
    </div>
  );
}
