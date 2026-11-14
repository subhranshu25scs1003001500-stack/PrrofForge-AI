import React, { useState } from "react";
import { Investigation, InvestigationStage } from "@/types";
import {
  Search,
  ListTree,
  ShieldAlert,
  TestTube2,
  FileCheck2,
  Play,
  FastForward,
  Loader2,
  Terminal,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface AgentTimelineProps {
  investigation: Investigation;
  onStep: () => Promise<void>;
  isStepping: boolean;
  onAutoRun: () => void;
  isAutoRunning: boolean;
}

const STAGES: {
  key: InvestigationStage;
  label: string;
  agent: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}[] = [
  {
    key: "RESEARCHING",
    label: "Evidence Retrieval",
    agent: "Research Agent",
    icon: Search,
    description: "Crawls empirical citations, peer-reviewed DOIs, and statistical datasets",
  },
  {
    key: "EXTRACTING_CLAIMS",
    label: "Claim Decomposition",
    agent: "Claim Agent",
    icon: ListTree,
    description: "Decomposes complex hypothesis into atomic, verifiable propositions",
  },
  {
    key: "SKEPTIC_AUDIT",
    label: "Adversarial Audit",
    agent: "Skeptic Agent",
    icon: ShieldAlert,
    description: "Detects selection bias, correlation fallacies, and sample underpowering",
  },
  {
    key: "MUTATION_TESTING",
    label: "Mutation Stress Testing",
    agent: "Experiment Agent",
    icon: TestTube2,
    description: "Applies evidence ablation, parameter swap, and synthetic contradiction",
  },
  {
    key: "SYNTHESIZING",
    label: "Dossier Synthesis",
    agent: "Verifier Agent",
    icon: FileCheck2,
    description: "Calculates Conclusion Stability Index (CSI) and issues final verdict",
  },
];

export function AgentTimeline({
  investigation,
  onStep,
  isStepping,
  onAutoRun,
  isAutoRunning,
}: AgentTimelineProps) {
  const [showLogs, setShowLogs] = useState(false);

  const getStageStatus = (stageIndex: number) => {
    const currentIndex = investigation.currentStepIndex;
    if (investigation.stage === "COMPLETED") return "completed";
    if (stageIndex < currentIndex) return "completed";
    if (stageIndex === currentIndex) return "active";
    return "pending";
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-5 border border-slate-800 bg-[#090D16]/90 shadow-2xl">
      {/* Top Header & Resumable Bounded Step Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-bold">
              Multi-Agent Orchestrator
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/40">
              Serverless Bounded Steps
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Phase {investigation.currentStepIndex} of {investigation.totalSteps} • Current Stage:{" "}
            <span className="text-slate-200 font-mono font-semibold">
              {investigation.stage.replace(/_/g, " ")}
            </span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition border border-slate-700/60"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>{showLogs ? "Hide Logs" : `Logs (${investigation.logs.length})`}</span>
          </button>

          {investigation.stage !== "COMPLETED" && (
            <>
              <button
                onClick={onStep}
                disabled={isStepping || isAutoRunning}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-slate-800 text-cyan-300 hover:bg-slate-700 border border-cyan-500/40 transition disabled:opacity-50"
              >
                {isStepping ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
                <span>Step Next</span>
              </button>

              <button
                onClick={onAutoRun}
                disabled={isStepping || isAutoRunning}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg shadow-cyan-500/20 hover:opacity-95 transition disabled:opacity-50"
              >
                {isAutoRunning ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <FastForward className="w-3.5 h-3.5 fill-current" />
                )}
                <span>{isAutoRunning ? "Running Pipeline..." : "Auto-Run Pipeline"}</span>
              </button>
            </>
          )}

          {investigation.stage === "COMPLETED" && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-semibold">Pipeline Verified</span>
            </div>
          )}
        </div>
      </div>

      {/* Stepper Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-5">
        {STAGES.map((s, idx) => {
          const status = getStageStatus(idx);
          const Icon = s.icon;

          return (
            <div
              key={s.key}
              className={`relative rounded-xl p-3.5 transition-all duration-200 border ${
                status === "completed"
                  ? "bg-emerald-950/20 border-emerald-500/30 text-slate-200"
                  : status === "active"
                  ? "bg-cyan-950/40 border-cyan-400 text-slate-100 shadow-lg shadow-cyan-500/10 scale-[1.02]"
                  : "bg-slate-900/40 border-slate-800 text-slate-400"
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <div
                  className={`p-1.5 rounded-lg ${
                    status === "completed"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : status === "active"
                      ? "bg-cyan-500/20 text-cyan-300 animate-pulse"
                      : "bg-slate-800 text-slate-500"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  0{idx + 1}
                </span>
              </div>

              <div className="text-xs font-semibold leading-tight mb-0.5">
                {s.label}
              </div>
              <div className="text-[10px] font-mono text-cyan-400/90 mb-1.5">
                {s.agent}
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {s.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Live Agent Terminal Logs */}
      {showLogs && (
        <div className="mt-5 p-4 rounded-xl bg-[#06080E] border border-slate-800 font-mono text-xs max-h-60 overflow-y-auto space-y-2">
          <div className="text-slate-400 text-[11px] uppercase tracking-wider pb-1 border-b border-slate-800 flex items-center justify-between">
            <span>Agent Orchestration Telemetry Log</span>
            <span>{investigation.logs.length} events logged</span>
          </div>
          {investigation.logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 text-slate-300">
              <span className="text-slate-500 text-[10px] shrink-0">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <span
                className={`text-[10px] px-1.5 rounded uppercase font-bold shrink-0 ${
                  log.type === "success"
                    ? "text-emerald-400 bg-emerald-950/60"
                    : log.type === "warning"
                    ? "text-amber-400 bg-amber-950/60"
                    : "text-cyan-400 bg-cyan-950/60"
                }`}
              >
                {log.role}
              </span>
              <span className="text-[11px] text-slate-200">{log.message}</span>
              {log.durationMs && (
                <span className="text-[10px] text-slate-500 shrink-0 ml-auto">
                  {log.durationMs}ms
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

