"use client";

import React, { useState, useEffect } from "react";
import { useLearning } from "@/context/LearningContext";
import { Bell, X, Check, Trash2, Sparkles, AlertTriangle, Calendar, Award, Info, RefreshCw } from "lucide-react";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: "ai" | "reminder" | "exam" | "achievement" | "admin";
  read: boolean;
}

export default function NotificationCenterDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { streak, level, examDate, currentMood, dna } = useLearning();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Load and seed notifications
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedNotifs = localStorage.getItem("iris_notifications");
      let notifList: NotificationItem[] = savedNotifs ? JSON.parse(savedNotifs) : [];

      // If empty, generate dynamic Seed Notifications matching real state
      if (notifList.length === 0) {
        const nowStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        notifList = [
          {
            id: "n1",
            title: "Retention Warning: Classical Mechanics",
            message: `Your memory retention score is at ${dna.stats.retentionRate}%. Schedule a 10-minute revision session today.`,
            timestamp: nowStr,
            category: "ai",
            read: false,
          },
          {
            id: "n2",
            title: "Study Streak Milestone!",
            message: `You've maintained a ${streak}-day active learning streak! +50 XP granted.`,
            timestamp: "1 hour ago",
            category: "achievement",
            read: false,
          },
          {
            id: "n3",
            title: examDate ? `Exam Countdown: ${examDate}` : "Upcoming Assessment Drill",
            message: examDate ? `Target exam date set for ${examDate}. Dynamic study mode switched to Exam Prep.` : "Check your study planner checklist for today's goals.",
            timestamp: "3 hours ago",
            category: "exam",
            read: true,
          },
        ];

        // Fetch Admin Announcements if present in localStorage
        const adminAnn = localStorage.getItem("iris_announcements");
        if (adminAnn) {
          try {
            const annArr = JSON.parse(adminAnn);
            annArr.forEach((ann: any) => {
              notifList.unshift({
                id: `ann-${ann.id}`,
                title: `📢 Announcement: ${ann.title}`,
                message: ann.message,
                timestamp: ann.createdAt,
                category: "admin",
                read: false,
              });
            });
          } catch (e) {
            console.error("Failed to parse admin announcements", e);
          }
        }

        localStorage.setItem("iris_notifications", JSON.stringify(notifList));
      }

      setNotifications(notifList);
    }
  }, [streak, level, examDate, currentMood, dna]);

  const saveNotifs = (list: NotificationItem[]) => {
    setNotifications(list);
    if (typeof window !== "undefined") {
      localStorage.setItem("iris_notifications", JSON.stringify(list));
    }
  };

  const toggleReadStatus = (id: string) => {
    const updated = notifications.map(n => (n.id === id ? { ...n, read: !n.read } : n));
    saveNotifs(updated);
  };

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotifs(updated);
  };

  const deleteNotif = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    saveNotifs(updated);
  };

  const clearAllNotifs = () => {
    saveNotifs([]);
  };

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredList = notifications.filter(n => {
    if (filterCategory === "all") return true;
    return n.category === filterCategory;
  });

  const getCategoryIcon = (cat: NotificationItem["category"]) => {
    switch (cat) {
      case "ai": return <Sparkles className="w-4 h-4 text-purple-400" />;
      case "achievement": return <Award className="w-4 h-4 text-amber-400" />;
      case "exam": return <Calendar className="w-4 h-4 text-cyan-400" />;
      case "admin": return <Info className="w-4 h-4 text-pink-400" />;
      default: return <Bell className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-zinc-900 border-l border-zinc-800 h-full flex flex-col justify-between shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-850 flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white flex items-center gap-2">
                Notification Center
                {unreadCount > 0 && (
                  <span className="text-[10px] bg-purple-500 text-white font-bold px-2 py-0.5 rounded-full">
                    {unreadCount} New
                  </span>
                )}
              </h2>
              <p className="text-[10px] text-zinc-500">AI Alerts & System Announcements</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="p-3 border-b border-zinc-850 bg-zinc-950/40 flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: "all", label: "All" },
            { id: "ai", label: "AI Insights" },
            { id: "achievement", label: "Badges" },
            { id: "exam", label: "Exam/Planner" },
            { id: "admin", label: "Announcements" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${
                filterCategory === cat.id
                  ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                  : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredList.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-xs space-y-2">
              <Check className="w-8 h-8 text-emerald-400 mx-auto opacity-50" />
              <p>No notifications in this category.</p>
            </div>
          ) : (
            filteredList.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border transition-all relative group ${
                  item.read
                    ? "bg-zinc-950/40 border-zinc-850 opacity-75"
                    : "bg-purple-950/20 border-purple-500/30 text-white shadow-md shadow-purple-500/5"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    {getCategoryIcon(item.category)}
                    <span className={item.read ? "text-zinc-300" : "text-purple-300"}>{item.title}</span>
                  </div>
                  <span className="text-[9px] text-zinc-500 font-mono">{item.timestamp}</span>
                </div>

                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{item.message}</p>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-zinc-850/60 text-[10px]">
                  <button
                    onClick={() => toggleReadStatus(item.id)}
                    className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
                  >
                    {item.read ? "Mark as Unread" : "Mark as Read"}
                  </button>
                  <button
                    onClick={() => deleteNotif(item.id)}
                    className="text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-zinc-950 border-t border-zinc-850 flex justify-between items-center px-4 text-xs">
          <button
            onClick={markAllRead}
            className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
          >
            Mark All as Read
          </button>
          <button
            onClick={clearAllNotifs}
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Clear All
          </button>
        </div>

      </div>
    </div>
  );
}
