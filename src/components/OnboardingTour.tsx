"use client";

import React, { useState } from "react";
import { useLearning } from "@/context/LearningContext";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, Navigation, X, ChevronRight, ChevronLeft, ShieldAlert } from "lucide-react";

export default function OnboardingTour() {
  const { showOnboarding, setShowOnboarding, userName } = useLearning();
  const [tourStep, setTourStep] = useState(0);

  if (!showOnboarding) return null;

  const tourSteps = [
    {
      title: "Welcome to IRIS Ecosystem!",
      desc: `Welcome, ${userName || "Learner"}! IRIS is your personalized Learning Operating System. We have created your learner profile, initialized your Learning Profile, and custom-assigned AI Subject Mentors based on your assessment results. Let's explore your interface!`,
      icon: <Brain className="w-8 h-8 text-primary animate-pulse" />,
      highlightSelector: "logo-container"
    },
    {
      title: "AI Study Modes",
      desc: "IRIS offers specialized AI Study Modes including Active Recall, Feynman Explainer, Socratic Dialogue, and Spaced Practice. Based on your learning style, IRIS recommends the ideal mode to boost concept absorption.",
      icon: <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />,
      highlightSelector: "study-modes-section"
    },
    {
      title: "Upload Study Notes & Documents",
      desc: "Head over to the Notebook workspace to upload PDF slides, lecture notes, or textbooks. IRIS scans the files to generate revision flashcards, custom practice questions, and mistakes tracking logs.",
      icon: <Brain className="w-8 h-8 text-emerald-400" />,
      highlightSelector: "upload-workspace"
    },
    {
      title: "Your Personalized Learning Profile",
      desc: "This visualizer tracks your cognitive learning progress in real-time. As you answer quizzes, read notes, and review mistake logs, your learning speed, retention rate, and consistency index scale dynamically. Watch your score grow!",
      icon: <Sparkles className="w-8 h-8 text-secondary" />,
      highlightSelector: "dna-visualizer"
    },
    {
      title: "Interactive AI Mentors",
      desc: "In the 'AI Tutors' tab, chat directly with specialized mentors like the Mathematics Mentor or Coding Coach. Enter your OpenAI API key in Settings to activate real-time LLM reasoning capabilities, or study with simulated training bots offline.",
      icon: <Navigation className="w-8 h-8 text-amber-500 animate-bounce" />,
      highlightSelector: "ai-tutors"
    },
    {
      title: "Dynamic Study Planner",
      desc: "Organize tasks and track priorities in the Study Planner. If you enable daily learning reminders, IRIS will automatically generate customized spaced recall notifications for weak subjects to keep you on schedule.",
      icon: <Brain className="w-8 h-8 text-rose-500" />,
      highlightSelector: "study-planner"
    },
    {
      title: "Core Config Drawer",
      desc: "Click the Settings gear icon in the top right to customize your preferences anytime. Switch active study modes, input credentials, configure daily study targets, and export your offline Knowledge Vault.",
      icon: <Sparkles className="w-8 h-8 text-primary" />,
      highlightSelector: "settings-icon"
    }
  ];

  const handleNext = () => {
    if (tourStep < tourSteps.length - 1) {
      setTourStep(prev => prev + 1);
    } else {
      setShowOnboarding(false);
    }
  };

  const handlePrev = () => {
    if (tourStep > 0) {
      setTourStep(prev => prev - 1);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
        
        {/* Spotlight Circle or Indicator Box overlay effect */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {tourStep === 0 && (
            <div className="absolute top-4 left-4 w-48 h-16 border-2 border-primary border-dashed rounded-xl animate-pulse" />
          )}
          {tourStep === 1 && (
            <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 border-2 border-secondary border-dashed rounded-3xl animate-pulse" />
          )}
          {tourStep === 2 && (
            <div className="absolute top-12 right-20 w-44 h-12 border-2 border-amber-500 border-dashed rounded-xl animate-pulse" />
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg rounded-3xl glass-panel border border-zinc-800 bg-[#09090c] p-8 shadow-[0_0_35px_rgba(139,92,246,0.3)] z-50 relative text-left"
        >
          {/* Close button */}
          <button
            onClick={() => setShowOnboarding(false)}
            className="absolute top-6 right-6 text-zinc-500 hover:text-zinc-300 transition-colors"
            title="Skip Onboarding Tutorial"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Dialog Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800/80">
              {tourSteps[tourStep].icon}
            </div>
            <div>
              <span className="text-[10px] text-primary font-black uppercase tracking-wider">IRIS onboarding tutorial</span>
              <h3 className="text-lg font-black text-white">{tourSteps[tourStep].title}</h3>
            </div>
          </div>

          {/* Dialog Body */}
          <div className="min-h-[110px] mb-8">
            <p className="text-xs text-zinc-400 leading-relaxed">
              {tourSteps[tourStep].desc}
            </p>
          </div>

          {/* Dialog Footer Actions */}
          <div className="flex justify-between items-center border-t border-zinc-900 pt-5">
            {/* Step Counter */}
            <span className="text-xs text-zinc-500 font-bold">
              Step {tourStep + 1} of {tourSteps.length}
            </span>

            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                disabled={tourStep === 0}
                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 disabled:opacity-30 px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-850 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              
              <button
                onClick={handleNext}
                className="flex items-center gap-1 text-xs text-white bg-primary hover:bg-primary/95 font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.2)]"
              >
                {tourStep === tourSteps.length - 1 ? "Finish Tour" : "Next Module"} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
