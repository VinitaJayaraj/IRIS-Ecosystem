"use client";

import React from "react";
import { AdminProvider } from "@/context/AdminContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <div className="min-h-screen transition-colors duration-300 selection:bg-purple-500 selection:text-white font-sans">
        {children}
      </div>
    </AdminProvider>
  );
}
