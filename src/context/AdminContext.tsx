"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "Super Admin" | "Content Manager" | "Support Admin";
  avatar?: string;
  twoFactorEnabled: boolean;
  lastLogin: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  category: "Admin Login" | "User Action" | "AI Request" | "Security" | "System Change";
  actor: string;
  action: string;
  details: string;
  status: "Success" | "Warning" | "Failure";
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  category: "General" | "System Maintenance" | "New Feature" | "Alert";
  targetRole: "All Users" | "Students" | "Premium";
  createdAt: string;
  scheduledTime?: string;
  sentBy: string;
}

export interface SystemSettings {
  appName: string;
  logoUrl: string;
  defaultTheme: "dark" | "light";
  aiModel: string;
  apiKeyOverride: string;
  maxConversationsPerUser: number;
  storageLimitMb: number;
  sessionTimeoutMins: number;
  emailSmtpHost: string;
  emailSmtpPort: number;
  securityLockoutThreshold: number;
  autoBackupEnabled: boolean;
}

export interface CustomTutor {
  id: string;
  name: string;
  role: string;
  avatar: string;
  tagline: string;
  color: string;
  personality: string;
  enabled: boolean;
  suggestions: string[];
}

interface AdminContextType {
  // Auth
  isAdminAuthenticated: boolean;
  currentAdmin: AdminUser | null;
  loginAdmin: (email: string, pass: string, otp?: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string; requireOtp?: boolean }>;
  logoutAdmin: () => void;
  resetAdminPassword: (email: string) => boolean;

  // Audit Logs
  auditLogs: AuditLog[];
  addAuditLog: (category: AuditLog["category"], action: string, details: string, status?: AuditLog["status"]) => void;
  clearAuditLogs: () => void;

  // Announcements & Notifications
  announcements: Announcement[];
  createAnnouncement: (title: string, message: string, category: Announcement["category"], targetRole: Announcement["targetRole"], scheduledTime?: string) => void;
  deleteAnnouncement: (id: string) => void;

  // System Settings
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  backupDatabase: () => void;
  restoreDatabase: (jsonStr: string) => boolean;

  // User Management Proxy Actions
  getAllUsers: () => any[];
  updateUserInfo: (email: string, updatedData: any) => boolean;
  toggleUserStatus: (email: string) => boolean;
  deleteUserAccount: (email: string) => boolean;

  // AI Tutor Management
  customTutors: CustomTutor[];
  disabledTutorIds: string[];
  toggleTutorStatus: (tutorId: string) => void;
  addCustomTutor: (tutor: Omit<CustomTutor, "id" | "enabled">) => void;
  updateTutorPrompt: (tutorId: string, name: string, role: string, personality: string) => void;

  // Report Generator
  exportReport: (type: "users" | "ai_usage" | "progress" | "logs", format: "csv" | "json" | "pdf") => void;

  // Visual Theme Mode
  theme: "dark" | "light";
  toggleTheme: () => void;
}

const DEFAULT_ADMIN_SETTINGS: SystemSettings = {
  appName: "IRIS Study OS",
  logoUrl: "🎓",
  defaultTheme: "dark",
  aiModel: "gpt-4o-mini",
  apiKeyOverride: "",
  maxConversationsPerUser: 100,
  storageLimitMb: 500,
  sessionTimeoutMins: 60,
  emailSmtpHost: "smtp.iris.edu",
  emailSmtpPort: 587,
  securityLockoutThreshold: 5,
  autoBackupEnabled: true,
};

const DEFAULT_ADMIN_USER: AdminUser = {
  id: "admin-01",
  email: "admin@iris.edu",
  name: "System Administrator",
  role: "Super Admin",
  avatar: "🛡️",
  twoFactorEnabled: false,
  lastLogin: new Date().toLocaleString(),
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_ADMIN_SETTINGS);
  const [customTutors, setCustomTutors] = useState<CustomTutor[]>([]);
  const [disabledTutorIds, setDisabledTutorIds] = useState<string[]>([]);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // LocalStorage helper
  const saveState = (key: string, val: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, typeof val === "string" ? val : JSON.stringify(val));
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(nextTheme);
      document.documentElement.setAttribute("data-theme", nextTheme);
    }
    saveState("iris_theme", nextTheme);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("iris-theme-change", { detail: nextTheme }));
    }
  };

  // Restore Admin Session and Data
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Restore Theme
      const savedTheme = (localStorage.getItem("iris_theme") as "dark" | "light") || "dark";
      setTheme(savedTheme);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);

      const handleThemeChange = (e: any) => {
        const newTheme = e.detail || (localStorage.getItem("iris_theme") as "dark" | "light") || "dark";
        setTheme(newTheme);
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
      };
      window.addEventListener("iris-theme-change", handleThemeChange);
      window.addEventListener("storage", handleThemeChange);

      // Restore Admin Session
      const savedAdminSession = localStorage.getItem("iris_admin_session");
      if (savedAdminSession) {
        try {
          const sessionObj = JSON.parse(savedAdminSession);
          if (sessionObj.expiresAt > new Date().getTime()) {
            setIsAdminAuthenticated(true);
            setCurrentAdmin(sessionObj.admin);
          } else {
            localStorage.removeItem("iris_admin_session");
          }
        } catch (e) {
          console.error("Failed to restore admin session", e);
        }
      }

      // Restore Audit Logs
      const savedLogs = localStorage.getItem("iris_admin_logs");
      if (savedLogs) setAuditLogs(JSON.parse(savedLogs));

      // Restore Announcements
      const savedAnnouncements = localStorage.getItem("iris_announcements");
      if (savedAnnouncements) setAnnouncements(JSON.parse(savedAnnouncements));

      // Restore Settings
      const savedSettings = localStorage.getItem("iris_admin_settings");
      if (savedSettings) setSettings(JSON.parse(savedSettings));

      // Restore Custom Tutors & Disabled Status
      const savedCustomTutors = localStorage.getItem("iris_custom_tutors");
      if (savedCustomTutors) setCustomTutors(JSON.parse(savedCustomTutors));

      const savedDisabledTutors = localStorage.getItem("iris_disabled_tutors");
      if (savedDisabledTutors) setDisabledTutorIds(JSON.parse(savedDisabledTutors));
    }
  }, []);

  const addAuditLog = (category: AuditLog["category"], action: string, details: string, status: AuditLog["status"] = "Success") => {
    const newLog: AuditLog = {
      id: Math.random().toString(),
      timestamp: new Date().toLocaleString(),
      category,
      actor: currentAdmin?.name || "System",
      action,
      details,
      status,
    };
    setAuditLogs(prev => {
      const nextLogs = [newLog, ...prev].slice(0, 200);
      saveState("iris_admin_logs", nextLogs);
      return nextLogs;
    });
  };

  const clearAuditLogs = () => {
    setAuditLogs([]);
    saveState("iris_admin_logs", []);
  };

  const loginAdmin = async (email: string, pass: string, otp?: string, rememberMe?: boolean) => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Check default admin account
    if (cleanEmail === "admin@iris.edu" && pass === "Admin@123456") {
      const adminObj: AdminUser = {
        ...DEFAULT_ADMIN_USER,
        lastLogin: new Date().toLocaleString(),
      };

      setIsAdminAuthenticated(true);
      setCurrentAdmin(adminObj);

      const duration = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000;
      saveState("iris_admin_session", {
        admin: adminObj,
        expiresAt: new Date().getTime() + duration,
      });

      addAuditLog("Admin Login", "Super Admin Authenticated", `Email: ${email} logged in successfully.`);
      return { success: true };
    }

    // Check registered accounts for ADMIN role
    if (typeof window !== "undefined") {
      const users = JSON.parse(localStorage.getItem("iris_users") || "[]");
      const user = users.find((u: any) => u.email.toLowerCase() === cleanEmail);

      if (user) {
        if (user.role !== "ADMIN") {
          addAuditLog("Admin Login", "Denied Non-Admin Login", `Student account ${email} attempted Admin access.`, "Warning");
          return { success: false, error: "Access Denied: Student accounts cannot access the Admin Panel." };
        }

        // Verify password hash
        const encoder = new TextEncoder();
        const data = encoder.encode(pass);
        const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashedInput = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

        if (user.passwordHash === hashedInput) {
          const adminObj: AdminUser = {
            id: user.email,
            email: user.email,
            name: user.name,
            role: "Super Admin",
            avatar: "🛡️",
            twoFactorEnabled: false,
            lastLogin: new Date().toLocaleString(),
          };

          setIsAdminAuthenticated(true);
          setCurrentAdmin(adminObj);

          const duration = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000;
          saveState("iris_admin_session", {
            admin: adminObj,
            expiresAt: new Date().getTime() + duration,
          });

          addAuditLog("Admin Login", "Admin User Authenticated", `Admin ${email} logged in successfully.`);
          return { success: true };
        }
      }
    }

    addAuditLog("Admin Login", "Failed Admin Login Attempt", `Email: ${email} supplied invalid credentials.`, "Failure");
    return { success: false, error: "Invalid admin credentials. Default credentials: admin@iris.edu / Admin@123456" };
  };

  const logoutAdmin = () => {
    addAuditLog("Admin Login", "Admin Logout", `Admin ${currentAdmin?.email || ""} signed out.`);
    setIsAdminAuthenticated(false);
    setCurrentAdmin(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("iris_admin_session");
    }
  };

  const resetAdminPassword = (email: string): boolean => {
    addAuditLog("Security", "Admin Password Reset", `Password reset requested for admin email: ${email}`);
    return true;
  };

  // Announcements
  const createAnnouncement = (
    title: string, 
    message: string, 
    category: Announcement["category"], 
    targetRole: Announcement["targetRole"], 
    scheduledTime?: string
  ) => {
    const newAnn: Announcement = {
      id: Math.random().toString(),
      title,
      message,
      category,
      targetRole,
      createdAt: new Date().toLocaleString(),
      scheduledTime,
      sentBy: currentAdmin?.name || "Admin",
    };
    const nextAnn = [newAnn, ...announcements];
    setAnnouncements(nextAnn);
    saveState("iris_announcements", nextAnn);
    addAuditLog("System Change", "Broadcast Announcement", `Created announcement "${title}" for ${targetRole}`);
  };

  const deleteAnnouncement = (id: string) => {
    const nextAnn = announcements.filter(a => a.id !== id);
    setAnnouncements(nextAnn);
    saveState("iris_announcements", nextAnn);
  };

  // System Settings
  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    const nextSettings = { ...settings, ...newSettings };
    setSettings(nextSettings);
    saveState("iris_admin_settings", nextSettings);
    addAuditLog("System Change", "Updated System Settings", `Updated configuration options.`);
  };

  const backupDatabase = () => {
    if (typeof window === "undefined") return;
    const backupData = {
      timestamp: new Date().toISOString(),
      users: JSON.parse(localStorage.getItem("iris_users") || "[]"),
      conversations: JSON.parse(localStorage.getItem("iris_conversations") || "{}"),
      documents: JSON.parse(localStorage.getItem("iris_docs") || "[]"),
      tasks: JSON.parse(localStorage.getItem("iris_tasks") || "[]"),
      quizzes: JSON.parse(localStorage.getItem("iris_quizzes") || "[]"),
      settings,
      auditLogs,
      announcements
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `iris_system_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addAuditLog("System Change", "Database Backup Downloaded", "Generated full system database export.");
  };

  const restoreDatabase = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.users) localStorage.setItem("iris_users", JSON.stringify(data.users));
      if (data.conversations) localStorage.setItem("iris_conversations", JSON.stringify(data.conversations));
      if (data.documents) localStorage.setItem("iris_docs", JSON.stringify(data.documents));
      if (data.tasks) localStorage.setItem("iris_tasks", JSON.stringify(data.tasks));
      if (data.quizzes) localStorage.setItem("iris_quizzes", JSON.stringify(data.quizzes));
      if (data.settings) {
        setSettings(data.settings);
        saveState("iris_admin_settings", data.settings);
      }
      addAuditLog("System Change", "Database Restored", "Successfully restored system state from backup JSON.");
      return true;
    } catch (e) {
      console.error("Database restore failed", e);
      return false;
    }
  };

  // User Management
  const getAllUsers = () => {
    if (typeof window === "undefined") return [];
    try {
      const users = JSON.parse(localStorage.getItem("iris_users") || "[]");
      if (users.length === 0) {
        const defaultUsers = [
          {
            id: "usr_101",
            name: "Alex Mercer",
            email: "alex.mercer@stanford.edu",
            role: "STUDENT",
            status: "active",
            isSuspended: false,
            createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
            learningProfile: {
              goal: "Software Engineering & Distributed Systems",
              learningStyle: "Visual Chalkboard & Interactive Code",
              dailyStudyMinutes: 60
            }
          },
          {
            id: "usr_102",
            name: "Elena Rostova",
            email: "elena.rostova@mit.edu",
            role: "STUDENT",
            status: "active",
            isSuspended: false,
            createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
            learningProfile: {
              goal: "Quantum Mechanics & Differential Equations",
              learningStyle: "Step-by-Step Proofs & Formulas",
              dailyStudyMinutes: 90
            }
          },
          {
            id: "admin_01",
            name: "System Administrator",
            email: "admin@iris.edu",
            role: "ADMIN",
            status: "active",
            isSuspended: false,
            createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
            learningProfile: {
              goal: "System Orchestration & Security Oversight",
              learningStyle: "Analytical Architecture",
              dailyStudyMinutes: 120
            }
          }
        ];
        localStorage.setItem("iris_users", JSON.stringify(defaultUsers));
        return defaultUsers;
      }
      return users;
    } catch (e) {
      return [];
    }
  };

  const updateUserInfo = (email: string, updatedData: any): boolean => {
    if (typeof window === "undefined") return false;
    const users = getAllUsers();
    const idx = users.findIndex((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updatedData };
      localStorage.setItem("iris_users", JSON.stringify(users));
      addAuditLog("User Action", "Updated User Profile", `Updated account details for user: ${email}`);
      return true;
    }
    return false;
  };

  const toggleUserStatus = (email: string): boolean => {
    if (typeof window === "undefined") return false;
    const users = getAllUsers();
    const idx = users.findIndex((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (idx !== -1) {
      const isSuspended = users[idx].isSuspended;
      users[idx].isSuspended = !isSuspended;
      localStorage.setItem("iris_users", JSON.stringify(users));
      addAuditLog("User Action", isSuspended ? "Activated User Account" : "Suspended User Account", `Account status changed for: ${email}`);
      return true;
    }
    return false;
  };

  const deleteUserAccount = (email: string): boolean => {
    if (typeof window === "undefined") return false;
    const users = getAllUsers();
    const filtered = users.filter((u: any) => u.email.toLowerCase() !== email.toLowerCase());
    localStorage.setItem("iris_users", JSON.stringify(filtered));
    addAuditLog("User Action", "Deleted User Account", `Removed user: ${email}`);
    return true;
  };

  // AI Tutor Management
  const toggleTutorStatus = (tutorId: string) => {
    let nextDisabled: string[];
    if (disabledTutorIds.includes(tutorId)) {
      nextDisabled = disabledTutorIds.filter(id => id !== tutorId);
    } else {
      nextDisabled = [...disabledTutorIds, tutorId];
    }
    setDisabledTutorIds(nextDisabled);
    saveState("iris_disabled_tutors", nextDisabled);
    addAuditLog("System Change", "Tutor Status Toggled", `Tutor ${tutorId} status updated.`);
  };

  const addCustomTutor = (tutorData: Omit<CustomTutor, "id" | "enabled">) => {
    const newTutor: CustomTutor = {
      ...tutorData,
      id: `custom_${Date.now()}`,
      enabled: true,
    };
    const nextCustom = [...customTutors, newTutor];
    setCustomTutors(nextCustom);
    saveState("iris_custom_tutors", nextCustom);
    addAuditLog("System Change", "Added Custom AI Tutor", `Created new tutor: ${tutorData.name}`);
  };

  const updateTutorPrompt = (tutorId: string, name: string, role: string, personality: string) => {
    const nextCustom = customTutors.map(ct => (ct.id === tutorId ? { ...ct, name, role, personality } : ct));
    setCustomTutors(nextCustom);
    saveState("iris_custom_tutors", nextCustom);
    addAuditLog("System Change", "Updated AI Tutor Prompt", `Updated configuration for tutor: ${name}`);
  };

  // Report Export Helper
  const exportReport = (type: "users" | "ai_usage" | "progress" | "logs", format: "csv" | "json" | "pdf") => {
    if (typeof window === "undefined") return;

    let exportContent = "";
    const users = getAllUsers();
    const conversations = JSON.parse(localStorage.getItem("iris_conversations") || "{}");

    if (type === "users") {
      if (format === "csv") {
        exportContent = "Name,Email,Created At,Status,Primary Goal\n" + 
          users.map((u: any) => `"${u.name}","${u.email}","${u.createdAt}","${u.isSuspended ? "Suspended" : "Active"}","${u.learningProfile?.goal || "General"}"`).join("\n");
      } else {
        exportContent = JSON.stringify(users, null, 2);
      }
    } else if (type === "logs") {
      if (format === "csv") {
        exportContent = "Timestamp,Actor,Category,Action,Details,Status\n" +
          auditLogs.map(l => `"${l.timestamp}","${l.actor}","${l.category}","${l.action}","${l.details}","${l.status}"`).join("\n");
      } else {
        exportContent = JSON.stringify(auditLogs, null, 2);
      }
    } else {
      exportContent = JSON.stringify({ type, conversations, users, exportedAt: new Date().toISOString() }, null, 2);
    }

    if (format === "pdf") {
      window.print();
      return;
    }

    const mime = format === "csv" ? "text/csv" : "application/json";
    const blob = new Blob([exportContent], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `iris_${type}_report_${new Date().toISOString().slice(0, 10)}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addAuditLog("System Change", "Report Exported", `Downloaded ${type} report in ${format.toUpperCase()} format.`);
  };

  return (
    <AdminContext.Provider
      value={{
        isAdminAuthenticated,
        currentAdmin,
        loginAdmin,
        logoutAdmin,
        resetAdminPassword,
        auditLogs,
        addAuditLog,
        clearAuditLogs,
        announcements,
        createAnnouncement,
        deleteAnnouncement,
        settings,
        updateSettings,
        backupDatabase,
        restoreDatabase,
        getAllUsers,
        updateUserInfo,
        toggleUserStatus,
        deleteUserAccount,
        customTutors,
        disabledTutorIds,
        toggleTutorStatus,
        addCustomTutor,
        updateTutorPrompt,
        exportReport,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
