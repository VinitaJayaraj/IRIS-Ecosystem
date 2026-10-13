"use client";

import React, { useState } from "react";
import { useLearning, StudyTask } from "@/context/LearningContext";
import { Calendar, Clock, Plus, Trash2, CheckSquare, Square, AlertCircle, Sparkles } from "lucide-react";

export default function PlannerView() {
  const {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    dna
  } = useLearning();

  // Task form state
  const [taskTitle, setTaskTitle] = useState("");
  const [taskSubject, setTaskSubject] = useState("Mathematics");
  const [taskDuration, setTaskDuration] = useState(30);
  const [taskPriority, setTaskPriority] = useState<StudyTask["priority"]>("medium");
  const [taskTime, setTaskTime] = useState("18:00");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    addTask(taskTitle, taskSubject, taskDuration, taskPriority, taskTime);
    setTaskTitle("");
  };

  const getPriorityStyle = (priority: StudyTask["priority"]) => {
    switch (priority) {
      case "high": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "medium": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "low": default: return "bg-zinc-800 text-zinc-400 border-zinc-750";
    }
  };

  const applyRecommendation = (subj: string, time: string, duration: number) => {
    setTaskTitle(`Focus Study on ${subj}`);
    setTaskSubject(subj);
    setTaskDuration(duration);
    setTaskTime(time);
    setTaskPriority("high");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left Column: Calendar List */}
      <div className="lg:col-span-2 space-y-6">
        <div className="p-6 rounded-3xl glass-panel relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

          <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" /> Study Planner Agenda
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">Organize daily study commitments. Completing tasks upgrades Learning Profile stats.</p>
            </div>
            <span className="text-xs bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded-lg text-zinc-400 font-mono font-bold">
              {tasks.length} sessions
            </span>
          </div>

          {/* Task checklist */}
          <div className="space-y-2.5">
            {tasks.length === 0 ? (
              <div className="text-zinc-500 text-xs italic py-8 text-center">No study tasks scheduled yet. Start adding focus blocks!</div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                    task.completed
                      ? "bg-zinc-950/20 border-zinc-900 opacity-60"
                      : "bg-zinc-950/40 border-zinc-850 hover:border-zinc-800"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="text-zinc-500 hover:text-primary transition-all cursor-pointer shrink-0"
                    >
                      {task.completed ? (
                        <CheckSquare className="w-5 h-5 text-success" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                    
                    <div className="min-w-0">
                      <div className={`font-bold text-xs truncate ${task.completed ? "line-through text-zinc-500" : "text-zinc-200"}`}>
                        {task.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] bg-zinc-900 text-zinc-500 px-1.5 py-0.5 rounded font-medium">
                          {task.subject}
                        </span>
                        <span className="text-[9px] text-zinc-500 font-bold flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" /> {task.duration} mins • {task.scheduledTime}
                        </span>
                        <span className={`text-[8px] font-extrabold uppercase border px-1.5 rounded-full ${getPriorityStyle(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1 rounded bg-zinc-900/60 hover:bg-red-500/10 hover:text-red-400 text-zinc-500 transition-all border border-zinc-850 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Cognitive Timeline insights panel */}
        <div className="p-6 rounded-3xl glass-panel border border-primary/20 bg-primary/5">
          <h3 className="text-sm font-bold flex items-center gap-1.5 text-white">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" /> Profile Adaptive Insights
          </h3>
          <div className="mt-3 space-y-3">
            <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-850 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div>
                <h4 className="font-bold text-primary">Mathematics Optimal Phase</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Studying Mathematics between 6:00 PM and 8:00 PM increases retention rate by 28% for your profile.
                </p>
              </div>
              <button
                onClick={() => applyRecommendation("Mathematics", "18:00", 25)}
                className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 font-bold text-[10px] py-1 px-2.5 rounded-lg transition-all cursor-pointer whitespace-nowrap align-self-start"
              >
                Apply Block
              </button>
            </div>
            <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-850 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div>
                <h4 className="font-bold text-secondary">Coding Deep Focus Window</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Your code logic capacity peaks in the late evening. Coding Coach recommends a 40-minute block at 8 PM.
                </p>
              </div>
              <button
                onClick={() => applyRecommendation("Coding", "20:00", 40)}
                className="bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/30 font-bold text-[10px] py-1 px-2.5 rounded-lg transition-all cursor-pointer whitespace-nowrap align-self-start"
              >
                Apply Block
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Schedule New Session */}
      <div className="p-6 rounded-3xl glass-panel h-fit">
        <h3 className="text-md font-bold flex items-center gap-1.5 mb-3 text-white">
          <Plus className="w-4 h-4 text-primary" /> Schedule Focus Block
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Session Name</label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. Practice Limits Problems"
              className="w-full mt-1 px-3 py-2 rounded-xl glass-input text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Subject Area</label>
              <select
                value={taskSubject}
                onChange={(e) => setTaskSubject(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl glass-input text-xs text-white bg-zinc-950"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="Coding">Coding</option>
                <option value="Literature">Literature</option>
                <option value="Career">Career Paths</option>
                <option value="Research">Research Assist</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Target Hour</label>
              <input
                type="time"
                value={taskTime}
                onChange={(e) => setTaskTime(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl glass-input text-xs text-white"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
              <span>Session Duration</span>
              <span className="text-primary font-bold">{taskDuration} minutes</span>
            </div>
            <input
              type="range"
              min="15"
              max="90"
              step="5"
              value={taskDuration}
              onChange={(e) => setTaskDuration(parseInt(e.target.value))}
              className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-primary mt-1"
            />
          </div>

          <div>
            <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Task Priority</label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {["low", "medium", "high"].map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setTaskPriority(p as any)}
                  className={`py-1.5 rounded-xl border text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    taskPriority === p
                      ? p === "high"
                        ? "bg-red-500/20 border-red-500 text-red-400"
                        : p === "medium"
                        ? "bg-amber-500/20 border-amber-500 text-amber-400"
                        : "bg-zinc-800 border-zinc-700 text-zinc-200"
                      : "bg-zinc-950/40 border-zinc-850 text-zinc-500 hover:border-zinc-800"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/95 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Create Focus Block
          </button>
        </form>
      </div>

    </div>
  );
}
