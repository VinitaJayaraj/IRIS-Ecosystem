"use client";

import React, { useState } from "react";
import { LearningProvider, useLearning } from "@/context/LearningContext";
import DashboardView from "@/components/DashboardView";
import AgentsView from "@/components/AgentsView";
import NotebookWorkspace from "@/components/NotebookWorkspace";
import PlannerView from "@/components/PlannerView";
import AssessmentView from "@/components/AssessmentView";
import AuthView from "@/components/AuthView";
import OnboardingTour from "@/components/OnboardingTour";
import GlobalSearchModal from "@/components/GlobalSearchModal";
import NotificationCenterDrawer from "@/components/NotificationCenterDrawer";
import ToastContainer from "@/components/ToastContainer";
import LearningProfileView from "@/components/LearningProfileView";
import {
  Brain,
  Sliders,
  Settings,
  Sun,
  Moon,
  LayoutDashboard,
  GraduationCap,
  FolderOpen,
  Calendar,
  ClipboardCheck,
  Flame,
  Award,
  LogOut,
  Search,
  Bell,
  Activity
} from "lucide-react";

function MainAppShell() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "agents" | "profile" | "workspace" | "planner" | "assessments">("dashboard");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const {
    theme,
    toggleTheme,
    apiKey,
    setApiKey,
    streak,
    level,
    xp,
    userName,
    setUserName,
    primaryGoal,
    setPrimaryGoal,
    learningStyle,
    setLearningStyle,
    dailyStudyMinutes,
    setDailyStudyMinutes,
    studyMode,
    setStudyMode,
    userInterests,
    setUserInterests,
    offlineMode,
    setOfflineMode,
    downloadKnowledgeVault,
    examDate,
    setExamDate,
    scheduledInterviewDate,
    setScheduledInterviewDate,
    confidenceScore,
    setConfidenceScore,
    subjectComplexity,
    setSubjectComplexity,
    autoModeEnabled,
    setAutoModeEnabled,
    activeModes,
    setActiveModes,
    lastRevisionDate,
    setLastRevisionDate,
    recommendStudyModes,
    logout,
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    voiceAssistance,
    setVoiceAssistance,
    textToSpeech,
    setTextToSpeech,
    setShowOnboarding,
    dna
  } = useLearning();

  const renderActiveTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardView onNavigate={(tab) => setActiveTab(tab)} />;
      case "agents":
        return <AgentsView />;
      case "profile":
        return <LearningProfileView />;
      case "workspace":
        return <NotebookWorkspace />;
      case "planner":
        return <PlannerView />;
      case "assessments":
        return <AssessmentView />;
      default:
        return <DashboardView onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "agents", label: "AI Tutors", icon: <GraduationCap className="w-4 h-4" /> },
    { id: "profile", label: "Learning Profile", icon: <Activity className="w-4 h-4" /> },
    { id: "workspace", label: "Workspace LM", icon: <FolderOpen className="w-4 h-4" /> },
    { id: "planner", label: "Study Planner", icon: <Calendar className="w-4 h-4" /> },
    { id: "assessments", label: "Assessments", icon: <ClipboardCheck className="w-4 h-4" /> },
  ] as const;

  const isEmergency = studyMode === "Emergency Rescue";

  return (
    <div
      className="flex-1 flex flex-col min-h-screen relative"
      style={isEmergency ? {
        "--color-primary": "#f43f5e",
        "--color-primary-glow": "rgba(244, 63, 94, 0.15)"
      } as any : undefined}
    >
      {/* Top Banner Header */}
      <header className="sticky top-0 z-40 glass-panel border-x-0 border-t-0 border-b border-zinc-800/40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab("dashboard")}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight text-white">IRIS</span>
            <span className="text-[8px] block text-zinc-500 font-bold tracking-widest uppercase">Learning OS v1.0</span>
          </div>
        </div>

        {/* Action Controls & Gamification summary */}
        <div className="flex items-center gap-4">
          {/* XP & Level progress bar (Header summary) */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold">
              <Flame className="w-3.5 h-3.5" /> Streak: {streak}d
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-400 font-bold">Level {level}</span>
              <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                  style={{ width: `${(xp % 1500) / 15}%` }}
                />
              </div>
              <span className="text-[9px] text-zinc-500 font-semibold">{xp} XP</span>
            </div>
          </div>

          {/* Streamlined Active Learning Mode Selector */}
          <div className="relative shrink-0">
            <select
              value={studyMode}
              onChange={(e) => {
                setStudyMode(e.target.value);
                setActiveModes([e.target.value]);
              }}
              className="text-xs font-semibold bg-zinc-950/80 border border-zinc-800 hover:border-primary/50 px-3 py-1.5 rounded-xl text-zinc-200 cursor-pointer focus:outline-none transition-all shadow-sm"
              title="Active Learning Mode"
            >
              <option value="Deep Learning">🧠 Deep Learning</option>
              <option value="Exam Prep">📝 Exam Prep</option>
              <option value="Quick Revision">⚡ Quick Revision</option>
              <option value="Concept Mastery">🏆 Concept Mastery</option>
              <option value="Interview Prep">💼 Interview Prep</option>
              <option value="Competitive Exam">🎯 Competitive Exam</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 border-l border-zinc-800/60 pl-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              title="Global Search (Ctrl+K)"
              className="px-2.5 py-1.5 rounded-xl bg-zinc-950/40 border border-zinc-850 hover:border-purple-500/50 text-zinc-400 hover:text-purple-300 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              <Search className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden lg:inline text-[11px]">Search</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] bg-zinc-900 text-zinc-500 rounded font-mono border border-zinc-800">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={() => setIsNotifOpen(true)}
              title="Notification Center"
              className="p-2 rounded-xl bg-zinc-950/40 border border-zinc-850 hover:border-purple-500/50 text-zinc-400 hover:text-purple-300 transition-all cursor-pointer relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full" />
            </button>

            <button
              onClick={toggleTheme}
              title="Toggle system theme"
              className="p-2 rounded-xl bg-zinc-950/40 border border-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            <button
              onClick={() => setIsSettingsOpen(true)}
              title="Configure learning variables"
              className="p-2 rounded-xl bg-zinc-950/40 border border-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={logout}
              title="Log out of session"
              className="p-2 rounded-xl bg-zinc-950/40 border border-zinc-850 hover:border-red-750/60 text-zinc-400 hover:text-red-400 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Offline Sync Banner */}
      {offlineMode && (
        <div className="bg-red-500/10 border-b border-red-500/20 text-red-400 text-[10px] py-1.5 px-6 flex items-center justify-between font-bold">
          <span>⚠️ Offline Learning Active - Progress will synchronize on reconnect.</span>
          <button onClick={() => setOfflineMode(false)} className="text-[9px] font-extrabold bg-red-500/20 hover:bg-red-500/30 px-2 py-0.5 rounded border border-red-500/30 cursor-pointer">Go Online</button>
        </div>
      )}

      {/* Main Terminal Frame */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Sidebar Navigation Panel */}
        <aside className="w-full md:w-60 glass-panel border-y-0 border-l-0 border-r border-zinc-800/40 p-4 flex flex-col justify-between gap-6 shrink-0">
          <div className="space-y-1.5">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold px-3 mb-2">Systems Menu</div>
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                      : "bg-transparent text-zinc-400 hover:text-zinc-200 border border-transparent hover:bg-zinc-900/40"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Quick learning profile mini status */}
          <div
            onClick={() => setActiveTab("profile")}
            className="p-3 bg-zinc-950/40 border border-zinc-850 hover:border-teal-500/40 rounded-2xl text-[10px] space-y-1.5 cursor-pointer transition-all group"
          >
            <div className="font-extrabold text-zinc-400 group-hover:text-teal-400 flex items-center justify-between uppercase tracking-wide transition-colors">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-teal-400" /> Learning Profile
              </span>
              <span className="text-[9px] text-zinc-500 group-hover:text-teal-400">View →</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-zinc-500">Mastery Index</span>
              <span className="text-teal-400 font-bold">{dna.score}%</span>
            </div>
            <div className="w-full h-1 bg-zinc-850 rounded-full overflow-hidden">
              <div className="h-full bg-teal-400 transition-all duration-500" style={{ width: `${dna.score}%` }} />
            </div>
          </div>
        </aside>

        {/* Content Panel Frame */}
        <main className={`flex-1 p-6 md:p-8 max-w-full overflow-x-hidden ${
          activeTab === "dashboard" ? "theme-dashboard" :
          activeTab === "agents" ? "theme-tutors" :
          activeTab === "profile" ? "theme-profile" :
          "theme-default"
        }`}>
          {renderActiveTab()}
        </main>

      </div>

      {/* Global Settings Drawer Side-Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md h-full bg-zinc-950 border-l border-zinc-800 p-6 flex flex-col justify-between animate-float">
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                  <Sliders className="w-5 h-5 text-primary" /> IRIS Core Config
                </h2>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="text-zinc-500 hover:text-zinc-300 text-xs font-semibold"
                >
                  Close
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-sans">OpenAI API Key</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-or-..."
                    className="w-full mt-1.5 px-3 py-2.5 rounded-xl glass-input text-xs text-white"
                  />
                  <p className="text-[10px] text-zinc-500 mt-2 leading-relaxed">
                    Optional. Enter your OpenAI key to unlock live LLM reasoning for the 6 tutor agents. Leaving this empty runs the built-in simulated training nodes offline.
                  </p>
                </div>

                <div className="border-t border-zinc-800/40 pt-4 space-y-4">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Account Preferences</h3>
                  
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-sans">User Profile Name</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full mt-1.5 px-3 py-2.5 rounded-xl glass-input text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-sans">Primary Learning Goal</label>
                    <select
                      value={primaryGoal}
                      onChange={(e) => setPrimaryGoal(e.target.value)}
                      className="w-full mt-1.5 px-3 py-2.5 rounded-xl glass-input text-xs text-white bg-zinc-950"
                    >
                      <option value="Software Engineering">Software Engineering</option>
                      <option value="Data Science & ML">Data Science & ML</option>
                      <option value="Quantitative Finance">Quantitative Finance</option>
                      <option value="Theoretical Physics">Theoretical Physics</option>
                      <option value="Literary Studies & Writing">Literary Studies & Writing</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-sans">Preferred Learning Style</label>
                    <select
                      value={learningStyle}
                      onChange={(e) => setLearningStyle(e.target.value)}
                      className="w-full mt-1.5 px-3 py-2.5 rounded-xl glass-input text-xs text-white bg-zinc-950"
                    >
                      <option value="Visual Chalkboard">Visual Chalkboard</option>
                      <option value="Applied Coding Labs">Applied Coding Labs</option>
                      <option value="Interactive Simulations">Interactive Simulations</option>
                      <option value="Critical Rhetoric">Critical Rhetoric</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                      <span>Daily Study Target</span>
                      <span className="text-primary font-bold">{dailyStudyMinutes} minutes</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="120"
                      step="5"
                      value={dailyStudyMinutes}
                      onChange={(e) => setDailyStudyMinutes(parseInt(e.target.value))}
                      className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-primary mt-1.5"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-sans">Personal Learning Interests</label>
                    <select
                      value={userInterests}
                      onChange={(e) => setUserInterests(e.target.value)}
                      className="w-full mt-1.5 px-3 py-2.5 rounded-xl glass-input text-xs text-white bg-zinc-950"
                    >
                      <option value="General">General / Academic</option>
                      <option value="Sports">Sports Enthusiast</option>
                      <option value="Gaming">Gaming & Mechanics</option>
                      <option value="Music">Music & Waves</option>
                    </select>
                  </div>

                  <div className="border-t border-zinc-800/40 pt-4 space-y-4">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Study Mode Generator</h3>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-850">
                      <div>
                        <div className="text-[10px] font-bold text-zinc-200 uppercase">Auto Mode Switching</div>
                        <p className="text-[8px] text-zinc-500 leading-normal mt-0.5">Let IRIS optimize active study modes dynamically based on stats and dates.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAutoModeEnabled(!autoModeEnabled)}
                        className={`text-[9px] font-extrabold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          autoModeEnabled
                            ? "bg-primary/20 text-primary border-primary/30"
                            : "bg-zinc-950/40 text-zinc-500 border-zinc-850"
                        }`}
                      >
                        {autoModeEnabled ? "ACTIVE" : "INACTIVE"}
                      </button>
                    </div>

                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-sans">Upcoming Exam Date</label>
                      <input
                        type="date"
                        value={examDate}
                        onChange={(e) => setExamDate(e.target.value)}
                        className="w-full mt-1.5 px-3 py-2.5 rounded-xl glass-input text-xs text-white bg-zinc-950 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-sans">Scheduled Interview Date</label>
                      <input
                        type="date"
                        value={scheduledInterviewDate}
                        onChange={(e) => setScheduledInterviewDate(e.target.value)}
                        className="w-full mt-1.5 px-3 py-2.5 rounded-xl glass-input text-xs text-white bg-zinc-950 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-sans">Last Revision Date</label>
                      <input
                        type="date"
                        value={lastRevisionDate}
                        onChange={(e) => setLastRevisionDate(e.target.value)}
                        className="w-full mt-1.5 px-3 py-2.5 rounded-xl glass-input text-xs text-white bg-zinc-950 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-sans">Subject Complexity</label>
                      <select
                        value={subjectComplexity}
                        onChange={(e) => setSubjectComplexity(e.target.value)}
                        className="w-full mt-1.5 px-3 py-2.5 rounded-xl glass-input text-xs text-white bg-zinc-950"
                      >
                        <option value="Low">Low (Basic Fundamentals)</option>
                        <option value="Medium">Medium (Intermediate Theory)</option>
                        <option value="High">High (Complex / Advanced Concepts)</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                        <span>Current Confidence level</span>
                        <span className="text-secondary font-bold">{confidenceScore}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        step="5"
                        value={confidenceScore}
                        onChange={(e) => setConfidenceScore(parseInt(e.target.value))}
                        className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-secondary mt-1.5"
                      />
                    </div>

                    <div className="border-t border-zinc-800/45 pt-4 space-y-4">
                      <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Accessibility Controls</h3>
                      
                      {/* Font Size */}
                      <div>
                        <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-sans">Font Size Scaling</label>
                        <select
                          value={fontSize}
                          onChange={(e) => setFontSize(e.target.value as any)}
                          className="w-full mt-1.5 px-3 py-2.5 rounded-xl glass-input text-xs text-white bg-zinc-950"
                        >
                          <option value="normal">Normal</option>
                          <option value="large">Large</option>
                          <option value="extra-large">Extra Large</option>
                        </select>
                      </div>

                      {/* Switch options */}
                      <div className="space-y-2.5">
                        <label className="flex justify-between items-center cursor-pointer">
                          <span className="text-xs text-zinc-300 font-medium">👁️ High Contrast Mode</span>
                          <input 
                            type="checkbox" 
                            checked={highContrast}
                            onChange={(e) => setHighContrast(e.target.checked)}
                            className="rounded border-zinc-850 bg-zinc-950 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                          />
                        </label>

                        <label className="flex justify-between items-center cursor-pointer">
                          <span className="text-xs text-zinc-300 font-medium">🗣️ Voice Assistance Support</span>
                          <input 
                            type="checkbox" 
                            checked={voiceAssistance}
                            onChange={(e) => setVoiceAssistance(e.target.checked)}
                            className="rounded border-zinc-850 bg-zinc-950 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                          />
                        </label>

                        <label className="flex justify-between items-center cursor-pointer">
                          <span className="text-xs text-zinc-300 font-medium">📢 Text-to-Speech Prompts</span>
                          <input 
                            type="checkbox" 
                            checked={textToSpeech}
                            onChange={(e) => setTextToSpeech(e.target.checked)}
                            className="rounded border-zinc-850 bg-zinc-950 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                          />
                        </label>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-zinc-900 bg-zinc-950/40 space-y-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setShowOnboarding(true);
                  setIsSettingsOpen(false);
                }}
                className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-750 text-zinc-350 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer text-center"
              >
                🔄 Replay Welcome Tour
              </button>

              <button
                type="button"
                onClick={downloadKnowledgeVault}
                className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-750 text-zinc-300 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer text-center"
              >
                📥 Export Knowledge Vault (JSON)
              </button>
              
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="w-full bg-primary hover:bg-primary/95 text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer text-center"
              >
                Apply Configurations
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTab={(tab, agentId) => {
          setActiveTab(tab as any);
        }}
      />

      {/* Notification Center Drawer */}
      <NotificationCenterDrawer
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
      />

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
}

function MainAppWrapper() {
  const { isAuthenticated } = useLearning();

  if (!isAuthenticated) {
    return <AuthView />;
  }

  return (
    <>
      <MainAppShell />
      <OnboardingTour />
    </>
  );
}

export default function Home() {
  return (
    <LearningProvider>
      <MainAppWrapper />
    </LearningProvider>
  );
}
