"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
}

let toastListener: ((toast: ToastMessage) => void) | null = null;

export const showToast = (title: string, message: string, type: ToastMessage["type"] = "info") => {
  if (toastListener) {
    toastListener({
      id: Math.random().toString(),
      type,
      title,
      message,
    });
  }
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    toastListener = (newToast) => {
      setToasts(prev => [...prev, newToast]);
      setTimeout(() => {
        removeToast(newToast.id);
      }, 4000);
    };
    return () => {
      toastListener = null;
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  if (toasts.length === 0) return null;

  const getToastIcon = (type: ToastMessage["type"]) => {
    switch (type) {
      case "success": return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case "error": return <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      default: return <Info className="w-4 h-4 text-purple-400 shrink-0" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-2xl backdrop-blur-xl flex items-start justify-between gap-3 animate-fadeIn border-l-4 border-l-purple-500"
        >
          <div className="flex items-start gap-2.5">
            {getToastIcon(t.type)}
            <div>
              <div className="font-bold text-xs text-white">{t.title}</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">{t.message}</div>
            </div>
          </div>
          <button onClick={() => removeToast(t.id)} className="text-zinc-500 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
