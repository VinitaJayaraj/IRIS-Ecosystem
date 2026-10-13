"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";
import { ShieldCheck, Lock, Mail, KeyRound, Sparkles, ArrowRight, AlertCircle, CheckCircle2, RefreshCw, Sun, Moon } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin, isAdminAuthenticated, resetAdminPassword, theme, toggleTheme } = useAdmin();

  const [email, setEmail] = useState("admin@iris.edu");
  const [password, setPassword] = useState("Admin@123456");
  const [otpCode, setOtpCode] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [requireOtp, setRequireOtp] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  useEffect(() => {
    if (isAdminAuthenticated) {
      router.push("/admin/dashboard");
    }
  }, [isAdminAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsSubmitting(true);

    try {
      const res = await loginAdmin(email, password, otpCode, rememberMe);
      if (res.success) {
        setSuccessMsg("Authentication successful! Redirecting to Admin Portal...");
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 800);
      } else if (res.requireOtp) {
        setRequireOtp(true);
        setSuccessMsg("OTP code sent to admin mobile/email. Please enter 6-digit pin.");
      } else {
        setErrorMsg(res.error || "Authentication failed.");
      }
    } catch (err) {
      setErrorMsg("An unexpected server error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    resetAdminPassword(forgotEmail);
    setSuccessMsg(`Password reset instructions sent to ${forgotEmail}`);
    setShowForgotModal(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Top right Theme Toggler */}
      <div className="absolute top-6 right-6 z-20">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition-all shadow-md cursor-pointer"
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
        >
          {theme === "dark" ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-500" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Panel */}
      <div className="w-full max-w-md bg-zinc-900/80 border border-zinc-800/80 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative z-10 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-400 mb-2">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">IRIS Admin Portal</h1>
          <p className="text-xs text-zinc-400">Secure Management & Control Center</p>
        </div>

        {/* Demo Notice */}
        <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/20 text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-purple-300 font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Default Admin Credentials:
          </div>
          <div className="text-zinc-400 font-mono text-[11px] flex justify-between">
            <span>Email: <strong className="text-zinc-200">admin@iris.edu</strong></span>
            <span>Pass: <strong className="text-zinc-200">Admin@123456</strong></span>
          </div>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-purple-400" /> Administrator Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@iris.edu"
              className="w-full px-4 py-3 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500/60 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-purple-400" /> Admin Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setShowForgotModal(true);
                }}
                className="text-[11px] text-purple-400 hover:text-purple-300 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500/60 transition-all"
            />
          </div>

          {/* OTP Input if required */}
          {requireOtp && (
            <div className="space-y-1.5 animate-fadeIn">
              <label className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-purple-400" /> 6-Digit 2FA OTP Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                className="w-full px-4 py-3 rounded-2xl bg-zinc-950/80 border border-purple-500/40 text-center font-mono text-sm tracking-widest text-white focus:outline-none"
              />
            </div>
          )}

          {/* Remember Me Toggle */}
          <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-zinc-950 border-zinc-800 text-purple-500 focus:ring-0 accent-purple-500"
              />
              <span>Remember admin session (30 days)</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Authenticating...
              </>
            ) : (
              <>
                Access Admin Portal <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Back link */}
        <div className="text-center pt-2">
          <a
            href="/"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← Back to Student Workspace
          </a>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-purple-400" /> Reset Admin Password
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Enter your registered administrator email address to receive password reset authorization links.
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-3">
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="admin@iris.edu"
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-500"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
