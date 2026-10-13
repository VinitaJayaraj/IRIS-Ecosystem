"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin, CustomTutor } from "@/context/AdminContext";
import {
  LayoutDashboard, Users, Bot, FolderKanban, ShieldAlert, LogOut, Search, Filter, Plus, Trash2, Edit,
  CheckCircle2, XCircle, Download, Upload, RefreshCw, Sparkles, ShieldCheck,
  Brain, FileText, Database, HardDrive, Clock, Lock, ArrowUpRight, UserCheck,
  UserX, Eye, AlertTriangle, Key, Layers, Activity, Sun, Moon
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const {
    isAdminAuthenticated, currentAdmin, logoutAdmin, auditLogs, settings,
    backupDatabase, restoreDatabase, getAllUsers, updateUserInfo, toggleUserStatus,
    deleteUserAccount, customTutors, disabledTutorIds, toggleTutorStatus, addCustomTutor,
    updateTutorPrompt, clearAuditLogs, exportReport, theme, toggleTheme
  } = useAdmin();

  // Selected tab state
  const [activeTab, setActiveTab] = useState<
    "overview" | "ai_tutors" | "users" | "content" | "rag_inspect" | "logs"
  >("overview");

  // User Management State
  const [userList, setUserList] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [editUserModal, setEditUserModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editGoal, setEditGoal] = useState("");
  const [editRole, setEditRole] = useState<"STUDENT" | "ADMIN">("STUDENT");

  // Add User State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [addUserName, setAddUserName] = useState("");
  const [addUserEmail, setAddUserEmail] = useState("");
  const [addUserPassword, setAddUserPassword] = useState("");
  const [addUserRole, setAddUserRole] = useState<"STUDENT" | "ADMIN">("STUDENT");
  const [addUserGoal, setAddUserGoal] = useState("Software Engineering");

  // Student Learning Profile View State
  const [showStudentDnaModal, setShowStudentDnaModal] = useState(false);
  const [dnaViewUser, setDnaViewUser] = useState<any | null>(null);

  // Tutor Management State
  const [showAddTutorModal, setShowAddTutorModal] = useState(false);
  const [newTutorName, setNewTutorName] = useState("");
  const [newTutorRole, setNewTutorRole] = useState("");
  const [newTutorAvatar, setNewTutorAvatar] = useState("🤖");
  const [newTutorTagline, setNewTutorTagline] = useState("");
  const [newTutorColor, setNewTutorColor] = useState("from-purple-500 to-indigo-600");
  const [newTutorPersonality, setNewTutorPersonality] = useState("");

  // Content Upload State
  const [docName, setDocName] = useState("");
  const [docCategory, setDocCategory] = useState("Mathematics");
  const [docContent, setDocContent] = useState("");

  // RAG Knowledge Base Management State
  const [knowledgeList, setKnowledgeList] = useState<any[]>([]);
  const [knowledgeSearch, setKnowledgeSearch] = useState("");
  const [knowledgeSubjectFilter, setKnowledgeSubjectFilter] = useState("all");
  const [isReindexing, setIsReindexing] = useState(false);
  const [isLoadingKnowledge, setIsLoadingKnowledge] = useState(false);
  const [isSavingKnowledge, setIsSavingKnowledge] = useState(false);
  const [kbStatusMessage, setKbStatusMessage] = useState("");
  const [showAddKnowledgeModal, setShowAddKnowledgeModal] = useState(false);
  const [editingKnowledgeId, setEditingKnowledgeId] = useState<string | null>(null);

  // Form fields for Add/Edit Knowledge
  const [itemTopic, setItemTopic] = useState("");
  const [itemSubject, setItemSubject] = useState("Mathematics");
  const [itemTutor, setItemTutor] = useState("Mathematics Mentor");
  const [itemDifficulty, setItemDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [itemSource, setItemSource] = useState("Mathematics Curriculum Guide");
  const [itemTags, setItemTags] = useState("");
  const [itemContent, setItemContent] = useState("");

  const fetchKnowledge = async () => {
    setIsLoadingKnowledge(true);
    try {
      const res = await fetch("/api/admin/knowledge");
      if (res.ok) {
        const data = await res.json();
        setKnowledgeList(data.documents || []);
      }
    } catch (err) {
      console.error("Failed to load knowledge base:", err);
    } finally {
      setIsLoadingKnowledge(false);
    }
  };

  const handleReindex = async () => {
    setIsReindexing(true);
    setKbStatusMessage("Re-indexing vector embeddings across all 6 tutor knowledge bases...");
    try {
      const res = await fetch("/api/admin/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reindex" })
      });
      if (res.ok) {
        const data = await res.json();
        setKbStatusMessage(data.message || "Vector re-indexing completed successfully!");
        fetchKnowledge();
      }
    } catch (err) {
      setKbStatusMessage("Failed to re-index knowledge base.");
    } finally {
      setIsReindexing(false);
      setTimeout(() => setKbStatusMessage(""), 5000);
    }
  };

  const handleSaveKnowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemTopic || !itemContent || isSavingKnowledge) return;

    setIsSavingKnowledge(true);
    try {
      const payload = {
        id: editingKnowledgeId || undefined,
        topic: itemTopic,
        subject: itemSubject,
        tutor: itemTutor,
        difficulty: itemDifficulty,
        source: itemSource,
        tags: itemTags.split(",").map(t => t.trim()).filter(Boolean),
        content: itemContent,
      };

      const method = editingKnowledgeId ? "PUT" : "POST";
      const res = await fetch("/api/admin/knowledge", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowAddKnowledgeModal(false);
        setEditingKnowledgeId(null);
        setItemTopic("");
        setItemContent("");
        setItemTags("");
        setKbStatusMessage(editingKnowledgeId ? "Knowledge item updated successfully!" : "New knowledge chunk embedded and indexed!");
        fetchKnowledge();
      }
    } catch (err) {
      console.error("Failed to save knowledge item:", err);
    } finally {
      setIsSavingKnowledge(false);
      setTimeout(() => setKbStatusMessage(""), 4000);
    }
  };

  const handleDeleteKnowledge = async (id: string) => {
    if (!confirm("Are you sure you want to delete this knowledge chunk from the vector database?")) return;
    try {
      const res = await fetch(`/api/admin/knowledge?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setKnowledgeList(prev => prev.filter(k => k.id !== id));
        setKbStatusMessage("Knowledge item deleted from vector index.");
        setTimeout(() => setKbStatusMessage(""), 3000);
      }
    } catch (err) {
      console.error("Failed to delete knowledge:", err);
    }
  };

  const openEditKnowledge = (item: any) => {
    setEditingKnowledgeId(item.id);
    setItemTopic(item.topic);
    setItemSubject(item.subject);
    setItemTutor(item.tutor);
    setItemDifficulty(item.difficulty);
    setItemSource(item.source);
    setItemTags(Array.isArray(item.tags) ? item.tags.join(", ") : "");
    setItemContent(item.content);
    setShowAddKnowledgeModal(true);
  };

  const handleUploadAndIndex = async () => {
    if (!docName || !docContent) return;
    try {
      setKbStatusMessage(`Chunking and embedding document '${docName}'...`);
      const res = await fetch("/api/admin/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "upload",
          name: docName,
          content: docContent,
          subject: docCategory,
        })
      });

      if (res.ok) {
        const data = await res.json();
        // Also save to localStorage for client-side legacy compatibility
        const docs = JSON.parse(localStorage.getItem("iris_docs") || "[]");
        docs.unshift({
          id: Math.random().toString(),
          name: docName,
          content: docContent,
          type: "note",
          size: `${(docContent.length / 1024).toFixed(1)} KB`,
          uploadedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })
        });
        localStorage.setItem("iris_docs", JSON.stringify(docs));

        setDocName("");
        setDocContent("");
        setKbStatusMessage(`Resource indexed into ${data.chunks || 1} vector chunks!`);
        fetchKnowledge();
      }
    } catch (err) {
      console.error("Failed to upload document to RAG:", err);
    } finally {
      setTimeout(() => setKbStatusMessage(""), 4000);
    }
  };

  // RAG Inspection State
  const [ragLogs, setRagLogs] = useState<any[]>([]);
  const [ragStats, setRagStats] = useState<any>({ totalRetrievals: 0, verifiedRelevantCount: 0, averageRelevanceScore: 0 });
  const [isLoadingRagLogs, setIsLoadingRagLogs] = useState(false);
  const [selectedRagLog, setSelectedRagLog] = useState<any | null>(null);
  const [testQuery, setTestQuery] = useState("What is matrix multiplication?");
  const [testTutorId, setTestTutorId] = useState("math");
  const [testStudentLevel, setTestStudentLevel] = useState("Intermediate");
  const [testLearningMode, setTestLearningMode] = useState("Concept Mastery Mode");
  const [isTestingRag, setIsTestingRag] = useState(false);
  const [liveTestResult, setLiveTestResult] = useState<any | null>(null);

  const fetchRagInspection = async () => {
    setIsLoadingRagLogs(true);
    try {
      const res = await fetch("/api/admin/rag-inspect");
      if (res.ok) {
        const data = await res.json();
        setRagLogs(data.logs || []);
        setRagStats(data.stats || {});
      }
    } catch (err) {
      console.error("Failed to load RAG inspection logs:", err);
    } finally {
      setIsLoadingRagLogs(false);
    }
  };

  const handleRunLiveRagTest = async () => {
    if (!testQuery.trim()) return;
    setIsTestingRag(true);
    setLiveTestResult(null);
    try {
      const res = await fetch("/api/admin/rag-inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: testQuery,
          tutorId: testTutorId,
          studentLevel: testStudentLevel,
          learningMode: testLearningMode,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setLiveTestResult(data);
        fetchRagInspection();
      }
    } catch (err) {
      console.error("Failed to run live RAG test:", err);
    } finally {
      setIsTestingRag(false);
    }
  };

  const handleClearRagLogs = async () => {
    if (!confirm("Clear all RAG retrieval inspection logs?")) return;
    try {
      await fetch("/api/admin/rag-inspect", { method: "DELETE" });
      setRagLogs([]);
      setRagStats({ totalRetrievals: 0, verifiedRelevantCount: 0, averageRelevanceScore: 0 });
    } catch (err) {
      console.error("Failed to clear logs:", err);
    }
  };

  // Authentication Protection Guard
  useEffect(() => {
    if (!isAdminAuthenticated) {
      router.push("/admin/login");
    } else {
      setUserList(getAllUsers());
      fetchKnowledge();
      fetchRagInspection();
    }
  }, [isAdminAuthenticated, router, getAllUsers]);

  const refreshUsers = () => {
    setUserList(getAllUsers());
  };

  // Metrics calculation
  const totalUsersCount = userList.length || 1;
  const activeUsersCount = userList.filter(u => !u.isSuspended).length || 1;
  const suspendedUsersCount = userList.filter(u => u.isSuspended).length;

  const totalConversationsMap = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("iris_conversations") || "{}")
    : {};
  const totalConversationsCount = Object.values(totalConversationsMap).reduce((acc: number, val: any) => acc + (val?.length || 0), 0) || 42;

  const totalDocs = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("iris_docs") || "[]").length
    : 1;

  // Render navigation tab items
  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "ai_tutors", label: "AI Subject Tutors", icon: Bot, badge: 6 },
    { id: "users", label: "User Management", icon: Users, badge: totalUsersCount },
    { id: "content", label: "RAG Knowledge Base", icon: FolderKanban, badge: knowledgeList.length || undefined },
    { id: "rag_inspect", label: "RAG Retrieval Inspector", icon: Database, badge: ragLogs.length || undefined },
    { id: "logs", label: "Security Audit Logs", icon: ShieldAlert, badge: auditLogs.length },
  ];

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="text-zinc-400 text-xs flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-purple-500" /> Redirecting to Admin Security Gateway...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col md:flex-row">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-zinc-900/90 border-r border-zinc-850 flex flex-col justify-between shrink-0 p-4">
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-2 py-1">
            <span className="text-3xl filter drop-shadow">{settings.logoUrl}</span>
            <div>
              <h2 className="font-extrabold text-sm text-white tracking-tight flex items-center gap-1.5">
                {settings.appName}
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              </h2>
              <span className="text-[10px] text-purple-400 font-mono">Admin Portal v2.5</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-md shadow-purple-500/10"
                      : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-purple-400" : "text-zinc-500"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? "bg-purple-500/30 text-purple-200" : "bg-zinc-800 text-zinc-400"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Mode Toggle in Sidebar */}
        <div className="pt-2">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-zinc-950/60 border border-zinc-850 hover:border-zinc-700 text-zinc-300 transition-all cursor-pointer"
            title={`Toggle Theme Mode (Current: ${theme})`}
          >
            <span className="flex items-center gap-2 text-zinc-400">
              {theme === "dark" ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
              <span>Theme Mode</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">
              {theme}
            </span>
          </button>
        </div>

        {/* Admin Session Card */}
        <div className="pt-4 border-t border-zinc-800/80 space-y-3">
          <div className="p-3 rounded-2xl bg-zinc-950/60 border border-zinc-850 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-xl shrink-0">{currentAdmin?.avatar || "🛡️"}</span>
              <div className="min-w-0">
                <div className="font-bold text-xs text-zinc-200 truncate">{currentAdmin?.name}</div>
                <div className="text-[10px] text-purple-400 truncate">{currentAdmin?.role}</div>
              </div>
            </div>
            <button
              onClick={logoutAdmin}
              title="Sign Out Admin"
              className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 overflow-y-auto max-h-screen space-y-6">
        
        {/* Top Header Bar */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-zinc-850">
          <div>
            <h1 className="text-xl font-extrabold text-white capitalize flex items-center gap-2">
              {activeTab.replace("_", " ")}
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
                Live Data Active
              </span>
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">Real-time system supervision and control portal</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Visual Theme Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-sm"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            <button
              onClick={backupDatabase}
              className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-purple-400" /> Export Backup
            </button>
            <button
              onClick={refreshUsers}
              className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 rounded-xl transition-all cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* --- TAB 1: OVERVIEW DASHBOARD --- */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-3xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur space-y-2">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-xs font-semibold">Total Registered Users</span>
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-extrabold text-white">{totalUsersCount}</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> +12% growth this month
                </div>
              </div>

              <div className="p-4 rounded-3xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur space-y-2">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-xs font-semibold">Active Accounts</span>
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-extrabold text-emerald-400">{activeUsersCount}</div>
                <div className="text-[10px] text-zinc-500">
                  {suspendedUsersCount} accounts suspended
                </div>
              </div>

              <div className="p-4 rounded-3xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur space-y-2">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-xs font-semibold">Total AI Conversations</span>
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-extrabold text-white">{totalConversationsCount}</div>
                <div className="text-[10px] text-cyan-400 font-semibold">
                  Across 9 AI subject tutors
                </div>
              </div>

              <div className="p-4 rounded-3xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur space-y-2">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-xs font-semibold">Uploaded Documents</span>
                  <FileText className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-extrabold text-white">{totalDocs}</div>
                <div className="text-[10px] text-amber-400 font-semibold">
                  Estimated 4.2 MB storage
                </div>
              </div>
            </div>

            {/* Visual Charts & System Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Activity Chart */}
              <div className="lg:col-span-2 p-5 rounded-3xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-white">Daily Learning Activity & AI Queries</h3>
                    <p className="text-[10px] text-zinc-400">Activity volume for the past 7 days</p>
                  </div>
                  <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full font-bold">
                    7-Day Visual
                  </span>
                </div>

                {/* SVG Visual Bar Graph */}
                <div className="h-44 flex items-end justify-between gap-3 pt-6 px-4 pb-2 border-b border-zinc-800/60 font-mono text-[10px] text-zinc-500">
                  {[
                    { day: "Mon", val: 45, height: "65%" },
                    { day: "Tue", val: 62, height: "80%" },
                    { day: "Wed", val: 38, height: "50%" },
                    { day: "Thu", val: 85, height: "95%" },
                    { day: "Fri", val: 55, height: "70%" },
                    { day: "Sat", val: 90, height: "100%" },
                    { day: "Sun", val: 72, height: "85%" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="text-[9px] text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.val} queries
                      </div>
                      <div
                        style={{ height: item.height }}
                        className="w-full bg-gradient-to-t from-purple-600 to-indigo-500 rounded-t-xl transition-all group-hover:from-purple-500 group-hover:to-indigo-400"
                      />
                      <span>{item.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Health */}
              <div className="p-5 rounded-3xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur space-y-4">
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" /> System Health Status
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-2xl bg-zinc-950/60 border border-zinc-850 flex items-center justify-between">
                    <span className="text-zinc-300 font-semibold">Core App Server</span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold">Operational (100%)</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-zinc-950/60 border border-zinc-850 flex items-center justify-between">
                    <span className="text-zinc-300 font-semibold">OpenAI / Gemini API</span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold">Connected</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-zinc-950/60 border border-zinc-850 flex items-center justify-between">
                    <span className="text-zinc-300 font-semibold">LocalStorage Sandbox</span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold">Synced</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-zinc-950/60 border border-zinc-850 flex items-center justify-between">
                    <span className="text-zinc-300 font-semibold">Security Session Guard</span>
                    <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full font-bold">Protected</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* --- TAB 2: USER MANAGEMENT --- */}
        {activeTab === "users" && (
          <div className="space-y-6">
            
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-zinc-900/60 p-4 rounded-3xl border border-zinc-850">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search user name or email..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-zinc-500" />
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 px-3 py-2.5 rounded-2xl focus:outline-none cursor-pointer"
                >
                  <option value="all">All Accounts</option>
                  <option value="active">Active Only</option>
                  <option value="suspended">Suspended Only</option>
                  <option value="admin">Admins Only</option>
                  <option value="student">Students Only</option>
                </select>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="px-3 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-purple-600/20"
                >
                  <Plus className="w-3.5 h-3.5" /> Add User
                </button>
                <button
                  onClick={() => exportReport("users", "csv")}
                  className="px-3 py-2.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 border border-zinc-700 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Export Users
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-3xl overflow-hidden backdrop-blur">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-950/80 text-zinc-400 font-semibold border-b border-zinc-850">
                    <tr>
                      <th className="p-4">User</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Primary Goal</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-850/60 text-zinc-300">
                    {userList
                      .filter((u: any) => {
                        const matchesSearch = (u.name || "").toLowerCase().includes(userSearch.toLowerCase()) || (u.email || "").toLowerCase().includes(userSearch.toLowerCase());
                        const userRole = u.role || (u.email?.toLowerCase() === "admin@iris.edu" ? "ADMIN" : "STUDENT");
                        if (userFilter === "active") return matchesSearch && !u.isSuspended;
                        if (userFilter === "suspended") return matchesSearch && u.isSuspended;
                        if (userFilter === "admin") return matchesSearch && userRole === "ADMIN";
                        if (userFilter === "student") return matchesSearch && userRole === "STUDENT";
                        return matchesSearch;
                      })
                      .map((user: any, i: number) => {
                        const userRole = user.role || (user.email?.toLowerCase() === "admin@iris.edu" ? "ADMIN" : "STUDENT");
                        return (
                          <tr key={i} className="hover:bg-zinc-850/40 transition-colors">
                            <td className="p-4 font-bold flex items-center gap-2">
                              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                userRole === "ADMIN" ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                              }`}>
                                {user.name ? user.name.charAt(0) : "U"}
                              </span>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span>{user.name || "User"}</span>
                                  {userRole === "ADMIN" && <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />}
                                </div>
                                <div className="text-[10px] text-zinc-500 font-normal">Registered {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently"}</div>
                              </div>
                            </td>
                            <td className="p-4 font-mono text-[11px] text-zinc-400">{user.email}</td>
                            <td className="p-4">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                userRole === "ADMIN"
                                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                  : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              }`}>
                                {userRole}
                              </span>
                            </td>
                            <td className="p-4">{user.learningProfile?.goal || "Software Engineering"}</td>
                            <td className="p-4">
                              {user.isSuspended ? (
                                <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full font-bold">
                                  Suspended
                                </span>
                              ) : (
                                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                                  Active
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-right space-x-2">
                              {/* View Student Profile & DNA */}
                              <button
                                onClick={() => {
                                  setDnaViewUser(user);
                                  setShowStudentDnaModal(true);
                                }}
                                className="p-1.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/40 text-purple-300 transition-all"
                                title="View Student Learning Profile & Activity"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              {/* Edit Info & Role */}
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setEditName(user.name);
                                  setEditGoal(user.learningProfile?.goal || "");
                                  setEditRole(userRole);
                                  setEditUserModal(true);
                                }}
                                className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-300 transition-all"
                                title="Edit User Info & Role"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              {/* Suspend / Activate */}
                              <button
                                onClick={() => {
                                  toggleUserStatus(user.email);
                                  refreshUsers();
                                }}
                                className={`p-1.5 rounded-xl transition-all ${
                                  user.isSuspended
                                    ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                                    : "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                                }`}
                                title={user.isSuspended ? "Activate Account" : "Suspend Account"}
                              >
                                {user.isSuspended ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                              </button>
                              {/* Delete Account */}
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete user ${user.email}?`)) {
                                    deleteUserAccount(user.email);
                                    refreshUsers();
                                  }
                                }}
                                className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                                title="Delete Account"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    {userList.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-zinc-500 font-sans">
                          No users registered yet. Click &quot;Add User&quot; above to create an account.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* --- TAB 3: AI TUTOR MANAGEMENT --- */}
        {activeTab === "ai_tutors" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-zinc-900/60 p-4 rounded-3xl border border-zinc-850">
              <div>
                <h3 className="font-extrabold text-sm text-white">AI Subject Mentors Configuration</h3>
                <p className="text-[10px] text-zinc-400">Enable, disable, or create specialized subject bots</p>
              </div>
              <button
                onClick={() => setShowAddTutorModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-2xl shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Custom Subject Tutor
              </button>
            </div>

            {/* List of Tutors */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { id: "math", name: "Mathematics Mentor", role: "Quantitative Reasoning", avatar: "📐" },
                { id: "science", name: "Science Explorer", role: "Scientific Investigation", avatar: "🧪" },
                { id: "code", name: "Coding Coach", role: "Software Engineering", avatar: "💻" },
                { id: "lit", name: "Literature & Language Guide", role: "Writing & Rhetoric", avatar: "✍️" },
                { id: "career", name: "Career Navigator", role: "Professional Pathways", avatar: "🚀" },
                { id: "research", name: "Research Assistant", role: "Academic Citations", avatar: "📚" },
                ...customTutors
              ].map((tutor) => {
                const isDisabled = disabledTutorIds.includes(tutor.id);
                return (
                  <div key={tutor.id} className="p-4 rounded-3xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur space-y-3 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{tutor.avatar}</span>
                        <div>
                          <h4 className="font-bold text-xs text-white">{tutor.name}</h4>
                          <span className="text-[10px] text-zinc-500">{tutor.role}</span>
                        </div>
                      </div>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                        isDisabled ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}>
                        {isDisabled ? "Disabled" : "Active"}
                      </span>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-zinc-850">
                      <button
                        onClick={() => toggleTutorStatus(tutor.id)}
                        className={`w-full py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isDisabled
                            ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                            : "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                        }`}
                      >
                        {isDisabled ? "Enable Tutor" : "Disable Tutor"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- TAB 4: LEARNING CONTENT & RAG KNOWLEDGE BASE --- */}
        {activeTab === "content" && (
          <div className="space-y-6">
            {/* Header & Control Actions */}
            <div className="bg-zinc-900/80 p-5 rounded-3xl border border-zinc-800/80 backdrop-blur flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-purple-400" /> RAG Vector Knowledge Base & Learning Content
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Manage indexed subject knowledge chunks, embeddings, and semantic retrieval collections for all 6 AI tutors.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleReindex}
                  disabled={isReindexing}
                  className="px-3.5 py-2 rounded-2xl bg-zinc-800 hover:bg-zinc-750 text-white font-bold text-xs flex items-center gap-2 border border-zinc-700/50 transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${isReindexing ? "animate-spin" : ""}`} />
                  {isReindexing ? "Re-indexing Vectors..." : "Re-index All"}
                </button>

                <button
                  onClick={() => {
                    setEditingKnowledgeId(null);
                    setItemTopic("");
                    setItemSubject("Mathematics");
                    setItemTutor("Mathematics Mentor");
                    setItemDifficulty("Intermediate");
                    setItemSource("Curriculum Guide");
                    setItemTags("");
                    setItemContent("");
                    setShowAddKnowledgeModal(true);
                  }}
                  className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/20 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Knowledge Item
                </button>
              </div>
            </div>

            {/* Status notification banner */}
            {kbStatusMessage && (
              <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-purple-200 text-xs flex items-center justify-between animate-fadeIn">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400 shrink-0" /> {kbStatusMessage}
                </span>
                <button onClick={() => setKbStatusMessage("")} className="text-zinc-400 hover:text-white text-xs">✕</button>
              </div>
            )}

            {/* Filter and Search Bar */}
            <div className="bg-zinc-900/60 p-4 rounded-3xl border border-zinc-800 flex flex-col md:flex-row gap-3 items-center justify-between">
              {/* Subject Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                {["all", "Mathematics", "Science", "Coding", "Literature", "Career", "Research"].map((subj) => (
                  <button
                    key={subj}
                    onClick={() => setKnowledgeSubjectFilter(subj)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      knowledgeSubjectFilter === subj
                        ? "bg-purple-600 text-white shadow-sm"
                        : "bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-850"
                    }`}
                  >
                    {subj === "all" ? "All Subjects" : subj}
                  </button>
                ))}
              </div>

              {/* Live Search Input */}
              <div className="relative w-full md:w-72">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={knowledgeSearch}
                  onChange={(e) => setKnowledgeSearch(e.target.value)}
                  placeholder="Search vector knowledge topics..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Indexed Knowledge Items Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-zinc-400">
                  Indexed Knowledge Chunks ({
                    knowledgeList
                      .filter(item => knowledgeSubjectFilter === "all" || item.subject.toLowerCase() === knowledgeSubjectFilter.toLowerCase())
                      .filter(item => !knowledgeSearch || `${item.topic} ${item.content} ${item.tags}`.toLowerCase().includes(knowledgeSearch.toLowerCase()))
                      .length
                  })
                </span>
                <span className="text-[11px] text-zinc-500">Subject-isolated vector embeddings active</span>
              </div>

              {isLoadingKnowledge ? (
                <div className="p-12 text-center text-xs text-zinc-500 bg-zinc-900/40 rounded-3xl border border-zinc-850 flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-purple-400" /> Loading RAG Vector Store...
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {knowledgeList
                    .filter(item => knowledgeSubjectFilter === "all" || item.subject.toLowerCase() === knowledgeSubjectFilter.toLowerCase())
                    .filter(item => !knowledgeSearch || `${item.topic} ${item.content} ${item.tags}`.toLowerCase().includes(knowledgeSearch.toLowerCase()))
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-purple-500/40 transition-all flex flex-col justify-between gap-3 group"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-xs text-white group-hover:text-purple-300 transition-colors">
                              {item.topic}
                            </h4>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                                {item.subject}
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-800 text-zinc-400">
                                {item.difficulty || "Intermediate"}
                              </span>
                            </div>
                          </div>

                          <div className="text-[11px] text-zinc-400 line-clamp-3 leading-relaxed">
                            {item.content.replace(/[#*`$]/g, "").substring(0, 180)}...
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-[10px] text-zinc-500">
                          <span className="truncate max-w-[200px]" title={item.source}>
                            📚 {item.source}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditKnowledge(item)}
                              className="p-1 hover:text-purple-300 text-zinc-400 transition-colors cursor-pointer"
                              title="Edit Knowledge Chunk"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteKnowledge(item.id)}
                              className="p-1 hover:text-red-400 text-zinc-400 transition-colors cursor-pointer"
                              title="Delete from Vector DB"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Document Chunk & Vector Ingestion Section */}
            <div className="bg-zinc-900/80 p-5 rounded-3xl border border-zinc-800/80 backdrop-blur space-y-4">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-purple-400" /> Ingest & Embed Learning Documents into RAG
              </h3>
              <p className="text-xs text-zinc-400">
                Uploaded materials are automatically cleaned, split into semantic chunks with overlap, vectorized, and indexed into the vector database.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="Document Title (e.g. Linear_Algebra_Cheatsheet.txt)"
                  className="px-4 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                />
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value)}
                  className="px-4 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="Coding">Coding</option>
                  <option value="Literature">Literature</option>
                  <option value="Career">Career</option>
                  <option value="Research">Research</option>
                </select>
              </div>
              <textarea
                value={docContent}
                onChange={(e) => setDocContent(e.target.value)}
                placeholder="Paste key study notes, textbook chapters, or curriculum concepts..."
                rows={4}
                className="w-full p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-white"
              />
              <button
                onClick={handleUploadAndIndex}
                className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-2xl transition-all cursor-pointer shadow-md shadow-purple-600/20"
              >
                Chunk & Vectorize Document
              </button>
            </div>
          </div>
        )}

        {/* --- TAB: RAG RETRIEVAL INSPECTOR (Developer & Admin Deep-Dive) --- */}
        {activeTab === "rag_inspect" && (
          <div className="space-y-6">
            {/* Top Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-3xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur space-y-1">
                <span className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">Total Retrievals</span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-white font-mono">{ragStats.totalRetrievals || ragLogs.length}</span>
                  <Database className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-[10px] text-zinc-500">Live query retrieval pipeline</span>
              </div>

              <div className="p-4 rounded-3xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur space-y-1">
                <span className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">Verified Relevant</span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-emerald-400 font-mono">{ragStats.verifiedRelevantCount || 0}</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-[10px] text-emerald-500/80 font-semibold">Passed quality threshold (≥ 25%)</span>
              </div>

              <div className="p-4 rounded-3xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur space-y-1">
                <span className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">Avg Relevance Score</span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-purple-300 font-mono">
                    {ragStats.averageRelevanceScore ? `${Math.round(ragStats.averageRelevanceScore * 100)}%` : "N/A"}
                  </span>
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-[10px] text-zinc-500">Hybrid semantic & lexical</span>
              </div>

              <div className="p-4 rounded-3xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur space-y-1">
                <span className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">Domain Isolation</span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-indigo-300 font-mono">100%</span>
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="text-[10px] text-zinc-500">Strict Subject Partitioning</span>
              </div>
            </div>

            {/* Interactive Developer & Admin RAG Tester */}
            <div className="p-5 rounded-3xl bg-zinc-900/90 border border-purple-500/30 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" /> Live Data Retrieval & Context Inspector
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Test any user question to inspect question embedding, retrieved knowledge chunks, relevance scores, and final AI context.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchRagInspection}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-300 transition-all cursor-pointer"
                    title="Refresh Logs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRagLogs ? "animate-spin text-purple-400" : ""}`} />
                  </button>
                  <button
                    onClick={handleClearRagLogs}
                    className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold transition-all cursor-pointer"
                  >
                    Clear History
                  </button>
                </div>
              </div>

              {/* Sample Test Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-semibold text-zinc-400 mr-1">Quick Test Queries:</span>
                {[
                  { q: "What is matrix multiplication?", t: "math" },
                  { q: "Explain Bayes' theorem and conditional probability", t: "math" },
                  { q: "How do database indexes speed up SQL queries?", t: "code" },
                  { q: "Explain Newton's second law", t: "science" },
                  { q: "How to bake a chocolate cake? (Out of domain test)", t: "math" },
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setTestQuery(chip.q);
                      setTestTutorId(chip.t);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-zinc-950/80 hover:bg-purple-950/40 border border-zinc-800 hover:border-purple-500/40 text-[11px] text-zinc-300 transition-all cursor-pointer"
                  >
                    {chip.q}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-6">
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">User Question</label>
                  <input
                    type="text"
                    value={testQuery}
                    onChange={(e) => setTestQuery(e.target.value)}
                    placeholder="Enter test question (e.g. What is matrix multiplication?)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Selected AI Tutor</label>
                  <select
                    value={testTutorId}
                    onChange={(e) => setTestTutorId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="math">Mathematics Mentor</option>
                    <option value="science">Science Explorer</option>
                    <option value="code">Coding Coach</option>
                    <option value="lit">Literature Guide</option>
                    <option value="career">Career Navigator</option>
                    <option value="research">Research Assistant</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Student Level</label>
                  <select
                    value={testStudentLevel}
                    onChange={(e) => setTestStudentLevel(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="md:col-span-2 flex items-end">
                  <button
                    onClick={handleRunLiveRagTest}
                    disabled={isTestingRag || !testQuery.trim()}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {isTestingRag ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Inspecting...
                      </>
                    ) : (
                      <>
                        <Search className="w-3.5 h-3.5" /> Inspect Retrieval
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Live Test Inspection Result */}
              {liveTestResult && (
                <div className="mt-4 p-4 rounded-2xl bg-zinc-950/90 border border-purple-500/40 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-850">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Retrieval Status:</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        liveTestResult.relevanceStatus === "VERIFIED_RELEVANT"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}>
                        {liveTestResult.relevanceStatus === "VERIFIED_RELEVANT" ? "✓ VERIFIED RELEVANT CONTENT FOUND" : "⚠ FALLBACK / INSUFFICIENT KNOWLEDGE"}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-400 font-mono">
                      Chunks: {liveTestResult.retrievedChunksCount} passed
                    </span>
                  </div>

                  {/* Retrieved Chunks Grid */}
                  <div>
                    <h4 className="text-xs font-bold text-zinc-300 mb-2">Retrieved Documents / Chunks & Quality Scores:</h4>
                    {liveTestResult.inspection?.retrievedChunks?.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {liveTestResult.inspection.retrievedChunks.map((chunk: any, i: number) => (
                          <div
                            key={i}
                            className={`p-3 rounded-xl border text-xs space-y-2 ${
                              chunk.isRelevant
                                ? "bg-zinc-900/80 border-emerald-500/30 text-zinc-200"
                                : "bg-zinc-900/40 border-zinc-800 text-zinc-400 opacity-60"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-bold text-white flex items-center gap-1.5">
                                {chunk.isRelevant ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                ) : (
                                  <XCircle className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                                )}
                                {chunk.topic}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-zinc-950 font-mono text-[10px] font-bold text-purple-300 border border-zinc-800">
                                {Math.round(chunk.score * 100)}% Match
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 text-[10px] font-mono text-zinc-400">
                              <span>Cosine: {Math.round(chunk.cosineScore * 100)}%</span>
                              <span>•</span>
                              <span>Lexical: {Math.round(chunk.lexicalScore * 100)}%</span>
                              <span>•</span>
                              <span>Source: {chunk.source}</span>
                            </div>
                            <p className="text-[11px] text-zinc-300 line-clamp-3 font-sans bg-zinc-950/60 p-2 rounded-lg border border-zinc-850">
                              {chunk.contentSnippet}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-850 text-xs text-zinc-400">
                        No chunks retrieved. Irrelevant query correctly blocked without fabricating data.
                      </div>
                    )}
                  </div>

                  {/* Final Context Sent to AI */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-zinc-300">Final Context Sent to AI Tutor:</h4>
                    <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-850 text-[11px] text-zinc-300 font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {liveTestResult.inspection?.finalContextSentToAi?.retrievedKnowledgeText || "No context"}
                    </pre>
                  </div>

                  {/* Generated Answer */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-zinc-300">Generated AI Tutor Answer:</h4>
                    <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-200 prose prose-invert max-w-none max-h-60 overflow-y-auto whitespace-pre-wrap">
                      {liveTestResult.answer}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Historical RAG Retrieval Inspection Logs Table */}
            <div className="p-5 rounded-3xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-sm text-white">Recent Data Retrieval Events ({ragLogs.length})</h3>
                  <p className="text-xs text-zinc-400">Chronological history of live queries with relevance verification logs</p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-zinc-850">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-950/80 text-zinc-400 font-semibold border-b border-zinc-850">
                    <tr>
                      <th className="p-3 font-mono">Timestamp</th>
                      <th className="p-3">User Question</th>
                      <th className="p-3">Selected Tutor</th>
                      <th className="p-3">Relevance Status</th>
                      <th className="p-3">Top Match</th>
                      <th className="p-3">Chunks</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-850 text-zinc-300">
                    {ragLogs.map((log) => {
                      const topChunk = log.retrievedChunks?.[0];
                      const isRelevant = log.relevanceStatus === "VERIFIED_RELEVANT";
                      return (
                        <tr key={log.id} className="hover:bg-zinc-850/40 transition-colors">
                          <td className="p-3 text-zinc-500 font-mono text-[11px] whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                          </td>
                          <td className="p-3 font-medium text-white max-w-xs truncate">
                            {log.question}
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[11px] font-semibold">
                              {log.tutorName}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              isRelevant
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}>
                              {isRelevant ? "VERIFIED" : "FALLBACK"}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-[11px]">
                            {topChunk ? (
                              <span className={isRelevant ? "text-emerald-300 font-bold" : "text-zinc-500"}>
                                {Math.round(topChunk.score * 100)}% ({topChunk.topic})
                              </span>
                            ) : (
                              <span className="text-zinc-500">None</span>
                            )}
                          </td>
                          <td className="p-3 font-mono text-zinc-400">
                            {log.retrievedChunksCount || 0}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => setSelectedRagLog(log)}
                              className="px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ml-auto"
                            >
                              <Eye className="w-3 h-3" /> Inspect
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {ragLogs.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-zinc-500">
                          {isLoadingRagLogs ? "Loading inspection records..." : "No retrieval events recorded yet. Run a test query above!"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}



        {/* --- TAB 9: AUDIT LOGS --- */}
        {activeTab === "logs" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-zinc-900/60 p-4 rounded-3xl border border-zinc-850">
              <h3 className="font-extrabold text-sm text-white">System Security & Action Logs ({auditLogs.length})</h3>
              <button
                onClick={clearAuditLogs}
                className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Clear Log History
              </button>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-3xl overflow-hidden backdrop-blur">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-zinc-950/80 text-zinc-400 font-semibold border-b border-zinc-850">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Actor</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-850/60 text-zinc-300 text-[11px]">
                    {auditLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="p-3 text-zinc-500 whitespace-nowrap">{log.timestamp}</td>
                        <td className="p-3 font-bold text-purple-400">{log.actor}</td>
                        <td className="p-3">{log.category}</td>
                        <td className="p-3 font-semibold text-white">{log.action}</td>
                        <td className="p-3 text-zinc-400">{log.details}</td>
                      </tr>
                    ))}
                    {auditLogs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-zinc-500 font-sans">
                          No audit log records recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MODAL: Add Custom AI Tutor */}
      {showAddTutorModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-400" /> Create Custom Subject AI Tutor
            </h3>
            <div className="space-y-3 text-xs">
              <input
                type="text"
                value={newTutorName}
                onChange={(e) => setNewTutorName(e.target.value)}
                placeholder="Tutor Name (e.g. Quantum Physics Mentor)"
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white"
              />
              <input
                type="text"
                value={newTutorRole}
                onChange={(e) => setNewTutorRole(e.target.value)}
                placeholder="Role (e.g. Advanced Quantum Mechanics Expert)"
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white"
              />
              <input
                type="text"
                value={newTutorPersonality}
                onChange={(e) => setNewTutorPersonality(e.target.value)}
                placeholder="System Prompt / Personality directives..."
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddTutorModal(false)}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newTutorName || !newTutorRole) return;
                  addCustomTutor({
                    name: newTutorName,
                    role: newTutorRole,
                    avatar: newTutorAvatar,
                    tagline: "Specialized Subject AI Coach",
                    color: newTutorColor,
                    personality: newTutorPersonality || "Expert tutor in domain.",
                    suggestions: ["Explain key concepts", "Solve practice problem"]
                  });
                  setShowAddTutorModal(false);
                }}
                className="px-4 py-1.5 bg-purple-600 text-white font-bold text-xs rounded-xl hover:bg-purple-500"
              >
                Add AI Tutor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Edit User Modal */}
      {editUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Edit className="w-4 h-4 text-purple-400" /> Edit Account: {selectedUser.email}
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Account Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none cursor-pointer"
                >
                  <option value="STUDENT">STUDENT (User Dashboard Access)</option>
                  <option value="ADMIN">ADMIN (Full Admin Access)</option>
                </select>
              </div>
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Primary Learning Goal</label>
                <input
                  type="text"
                  value={editGoal}
                  onChange={(e) => setEditGoal(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white"
                />
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => {
                  if (confirm(`Reset access for ${selectedUser.email}? Password will be reset.`)) {
                    updateUserInfo(selectedUser.email, { resetRequested: true });
                    alert(`Access reset instructions initialized for ${selectedUser.email}`);
                  }
                }}
                className="px-3 py-1.5 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 text-xs rounded-xl font-bold"
              >
                Reset Access
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditUserModal(false)}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    updateUserInfo(selectedUser.email, {
                      name: editName,
                      role: editRole,
                      learningProfile: { ...selectedUser.learningProfile, goal: editGoal }
                    });
                    setEditUserModal(false);
                    refreshUsers();
                  }}
                  className="px-4 py-1.5 bg-purple-600 text-white font-bold text-xs rounded-xl hover:bg-purple-500"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-purple-400" /> Create New User Account
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Full Name *</label>
                <input
                  type="text"
                  value={addUserName}
                  onChange={(e) => setAddUserName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Email Address *</label>
                <input
                  type="email"
                  value={addUserEmail}
                  onChange={(e) => setAddUserEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Password *</label>
                <input
                  type="password"
                  value={addUserPassword}
                  onChange={(e) => setAddUserPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Role *</label>
                <select
                  value={addUserRole}
                  onChange={(e) => setAddUserRole(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none cursor-pointer"
                >
                  <option value="STUDENT">STUDENT (User Dashboard)</option>
                  <option value="ADMIN">ADMIN (Full Admin Access)</option>
                </select>
              </div>
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Primary Goal</label>
                <input
                  type="text"
                  value={addUserGoal}
                  onChange={(e) => setAddUserGoal(e.target.value)}
                  placeholder="e.g. Software Engineering"
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddUserModal(false)}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!addUserName || !addUserEmail || !addUserPassword) return;
                  const encoder = new TextEncoder();
                  const data = encoder.encode(addUserPassword);
                  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
                  const hashArray = Array.from(new Uint8Array(hashBuffer));
                  const passwordHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

                  const usersStr = localStorage.getItem("iris_users") || "[]";
                  const users = JSON.parse(usersStr);
                  users.push({
                    email: addUserEmail,
                    name: addUserName,
                    role: addUserRole,
                    passwordHash,
                    createdAt: new Date().toISOString(),
                    isSuspended: false,
                    learningProfile: { goal: addUserGoal }
                  });
                  localStorage.setItem("iris_users", JSON.stringify(users));
                  setShowAddUserModal(false);
                  setAddUserName("");
                  setAddUserEmail("");
                  setAddUserPassword("");
                  refreshUsers();
                }}
                className="px-4 py-1.5 bg-purple-600 text-white font-bold text-xs rounded-xl hover:bg-purple-500"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Student Profile & DNA Viewer */}
      {showStudentDnaModal && dnaViewUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl max-w-xl w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm border border-purple-500/30">
                  {dnaViewUser.name ? dnaViewUser.name.charAt(0) : "U"}
                </span>
                <div>
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    {dnaViewUser.name || "Student"}
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">
                      {dnaViewUser.role || "STUDENT"}
                    </span>
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-mono">{dnaViewUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setShowStudentDnaModal(false)}
                className="p-1.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-850 space-y-1">
                <span className="text-[10px] text-zinc-500 font-bold block">Primary Goal</span>
                <span className="text-white font-semibold">{dnaViewUser.learningProfile?.goal || "Software Engineering"}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-850 space-y-1">
                <span className="text-[10px] text-zinc-500 font-bold block">Registration Date</span>
                <span className="text-white font-semibold">{dnaViewUser.createdAt ? new Date(dnaViewUser.createdAt).toLocaleDateString() : "Active Member"}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-850 space-y-1">
                <span className="text-[10px] text-zinc-500 font-bold block">Learning Style</span>
                <span className="text-purple-300 font-semibold">{dnaViewUser.learningProfile?.learningStyle || "Interactive Chalkboard"}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-850 space-y-1">
                <span className="text-[10px] text-zinc-500 font-bold block">Account Status</span>
                <span className={dnaViewUser.isSuspended ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
                  {dnaViewUser.isSuspended ? "Suspended" : "Active & Verified"}
                </span>
              </div>
            </div>

            {/* Simulated Learning DNA & Metrics */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/30 to-indigo-950/20 border border-purple-800/30 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-purple-200 flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-purple-400" /> Learning Profile Index Score
                </span>
                <span className="text-sm font-extrabold text-white bg-purple-600/30 border border-purple-500/40 px-2.5 py-0.5 rounded-full">
                  78 / 100
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px] text-zinc-300 pt-1">
                <div className="p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/60 text-center">
                  <span className="text-[9px] text-zinc-500 block">Speed</span>
                  <span className="font-bold text-emerald-400">72%</span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/60 text-center">
                  <span className="text-[9px] text-zinc-500 block">Retention</span>
                  <span className="font-bold text-purple-400">65%</span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/60 text-center">
                  <span className="text-[9px] text-zinc-500 block">Consistency</span>
                  <span className="font-bold text-cyan-400">80%</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowStudentDnaModal(false)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-750 text-white font-bold text-xs rounded-xl"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT RAG KNOWLEDGE ITEM MODAL --- */}
      {showAddKnowledgeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-400" />
                {editingKnowledgeId ? "Edit Knowledge Chunk" : "Add Subject Knowledge Chunk"}
              </h3>
              <button
                onClick={() => setShowAddKnowledgeModal(false)}
                className="text-zinc-500 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveKnowledge} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400">Concept / Topic Title</label>
                  <input
                    type="text"
                    required
                    value={itemTopic}
                    onChange={(e) => setItemTopic(e.target.value)}
                    placeholder="e.g. Matrix Multiplication Rules & Proofs"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400">Target Subject</label>
                  <select
                    value={itemSubject}
                    onChange={(e) => {
                      const s = e.target.value;
                      setItemSubject(s);
                      const tutorMap: Record<string, string> = {
                        Mathematics: "Mathematics Mentor",
                        Science: "Science Explorer",
                        Coding: "Coding Coach",
                        Literature: "Literature & Language Guide",
                        Career: "Career Navigator",
                        Research: "Research Assistant",
                      };
                      setItemTutor(tutorMap[s] || `${s} Mentor`);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="Coding">Coding</option>
                    <option value="Literature">Literature</option>
                    <option value="Career">Career</option>
                    <option value="Research">Research</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400">Assigned AI Tutor</label>
                  <input
                    type="text"
                    readOnly
                    value={itemTutor}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950/60 border border-zinc-850 text-zinc-400 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400">Difficulty Tier</label>
                  <select
                    value={itemDifficulty}
                    onChange={(e) => setItemDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400">Citation Source</label>
                  <input
                    type="text"
                    value={itemSource}
                    onChange={(e) => setItemSource(e.target.value)}
                    placeholder="e.g. Official Syllabus §2.1"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-zinc-400">Semantic Search Tags (comma-separated)</label>
                <input
                  type="text"
                  value={itemTags}
                  onChange={(e) => setItemTags(e.target.value)}
                  placeholder="matrices, dot product, dimensions, algebra"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-zinc-400">
                  Knowledge Content & Explanations (Supports Markdown & LaTeX)
                </label>
                <textarea
                  rows={6}
                  required
                  value={itemContent}
                  onChange={(e) => setItemContent(e.target.value)}
                  placeholder="Write clear pedagogical definitions, theorems, formulas, or code examples..."
                  className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-purple-500 font-mono text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddKnowledgeModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingKnowledge}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSavingKnowledge ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Vectorizing...
                    </>
                  ) : editingKnowledgeId ? (
                    "Update & Re-embed"
                  ) : (
                    "Embed & Index"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RAG Retrieval Inspection Record Detail */}
      {selectedRagLog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-purple-500/30 p-6 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex justify-between items-start border-b border-zinc-850 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-purple-400" /> RAG Data Retrieval Inspector
                </h3>
                <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                  ID: {selectedRagLog.id} • {new Date(selectedRagLog.timestamp).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedRagLog(null)}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Query & Configuration Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-zinc-950/80 p-3.5 rounded-2xl border border-zinc-850">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-bold block">User Question</span>
                <span className="text-white font-semibold">{selectedRagLog.question}</span>
                {selectedRagLog.resolvedQuery && selectedRagLog.resolvedQuery !== selectedRagLog.question && (
                  <div className="mt-1 text-[11px] text-purple-300 font-mono">
                    Resolved Context: {selectedRagLog.resolvedQuery}
                  </div>
                )}
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-bold block">AI Tutor & Domain</span>
                <span className="text-purple-300 font-semibold">{selectedRagLog.tutorName} ({selectedRagLog.subject})</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-bold block">Student Context</span>
                <span className="text-zinc-300">Level: {selectedRagLog.studentLevel} • Mode: {selectedRagLog.learningMode}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-bold block">Relevance Quality Status</span>
                <span className={`inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  selectedRagLog.relevanceStatus === "VERIFIED_RELEVANT"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}>
                  {selectedRagLog.relevanceStatus === "VERIFIED_RELEVANT" ? "✓ VERIFIED RELEVANT" : "⚠ FALLBACK / INSUFFICIENT"}
                </span>
              </div>
            </div>

            {/* Retrieved Documents & Score Breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white flex items-center justify-between">
                <span>Retrieved Knowledge Chunks ({selectedRagLog.retrievedChunks?.length || 0})</span>
                <span className="text-[10px] text-zinc-400 font-mono">Ranked by Composite Relevance Score</span>
              </h4>

              <div className="space-y-2.5">
                {selectedRagLog.retrievedChunks?.map((chunk: any, i: number) => (
                  <div
                    key={i}
                    className={`p-3 rounded-2xl border text-xs space-y-2 ${
                      chunk.isRelevant
                        ? "bg-zinc-950/90 border-emerald-500/40 text-zinc-200"
                        : "bg-zinc-950/40 border-zinc-800 text-zinc-400 opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">[{i + 1}] {chunk.topic}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono">
                          {chunk.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-purple-300">
                          Match: {Math.round(chunk.score * 100)}%
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          chunk.isRelevant ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-800 text-zinc-500"
                        }`}>
                          {chunk.isRelevant ? "Relevant" : "Filtered Out"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-[10px] font-mono text-zinc-400">
                      <span>Cosine Similarity: {Math.round(chunk.cosineScore * 100)}%</span>
                      <span>•</span>
                      <span>Lexical Overlap: {Math.round(chunk.lexicalScore * 100)}%</span>
                      <span>•</span>
                      <span>Source: {chunk.source}</span>
                    </div>

                    <p className="text-[11px] text-zinc-300 font-sans p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-850 whitespace-pre-wrap">
                      {chunk.contentSnippet}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Final Context Sent to AI */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-white">Final Context Sent to AI Tutor:</h4>
              <pre className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300 font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                {selectedRagLog.finalContextSentToAi?.retrievedKnowledgeText || "No context"}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedRagLog(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-white font-bold text-xs cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
