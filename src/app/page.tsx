"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Investigation, InvestigationStage } from "@/types";
import { SEED_INVESTIGATIONS } from "@/lib/storage/adapter";
import { Navbar } from "@/components/layout/Navbar";
import { DocsModal } from "@/components/layout/DocsModal";
import { QueryConsole } from "@/components/investigation/QueryConsole";
import { AgentTimeline } from "@/components/investigation/AgentTimeline";
import { EvidenceGraph } from "@/components/graph/EvidenceGraph";
import { MutationWorkbench } from "@/components/investigation/MutationWorkbench";
import { BaselineComparisonView } from "@/components/investigation/BaselineComparisonView";
import { ExportModal } from "@/components/investigation/ExportModal";
import {
  Network,
  TestTube2,
  Scale,
  FileText,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  AlertCircle,
} from "lucide-react";

export default function Home() {
  const [investigations, setInvestigations] = useState<Investigation[]>(SEED_INVESTIGATIONS);
  const [currentInvestigation, setCurrentInvestigation] = useState<Investigation>(SEED_INVESTIGATIONS[0]);
  const [activeTab, setActiveTab] = useState<"GRAPH" | "MUTATION" | "BASELINE" | "DOSSIER">("GRAPH");
  const [selectedModel, setSelectedModel] = useState<string>("auto");

  const [isLaunching, setIsLaunching] = useState(false);
  const [isStepping, setIsStepping] = useState(false);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [docsModalOpen, setDocsModalOpen] = useState(false);

  // Fetch investigations list on initial load
  useEffect(() => {
    async function loadInvestigations() {
      try {
        const res = await fetch("/api/investigations");
        const data = await res.json();
        if (data.success && Array.isArray(data.investigations) && data.investigations.length > 0) {
          setInvestigations(data.investigations);
          // Set latest as current if none selected
          setCurrentInvestigation((prev) => {
            const found = data.investigations.find((i: Investigation) => i.id === prev.id);
            return found || data.investigations[0];
          });
        }
      } catch (err) {
        console.warn("Could not load investigations from server, using local seed:", err);
      }
    }
    loadInvestigations();
  }, []);

  // Launch a new investigation
  const handleLaunch = async (query: string, domain: string, model = selectedModel) => {
    setIsLaunching(true);
    try {
      const res = await fetch("/api/investigations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, domain, selectedModel: model }),
      });
      const data = await res.json();
      if (data.success && data.investigation) {
        setInvestigations((prev) => [data.investigation, ...prev]);
        setCurrentInvestigation(data.investigation);
        setShowConsole(false);
        setActiveTab("GRAPH");
      }
    } catch (err) {
      console.error("Failed to launch investigation:", err);
    } finally {
      setIsLaunching(false);
    }
  };

  // Execute single bounded serverless step
  const handleStep = async () => {
    if (!currentInvestigation || isStepping || currentInvestigation.stage === "COMPLETED") return;
    setIsStepping(true);
    try {
      const res = await fetch(`/api/investigations/${currentInvestigation.id}/step`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success && data.investigation) {
        setCurrentInvestigation(data.investigation);
        setInvestigations((prev) =>
          prev.map((i) => (i.id === data.investigation.id ? data.investigation : i))
        );

        if (data.isCompleted) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#00F2FE", "#8B5CF6", "#10B981"],
          });
        }
      }
    } catch (err) {
      console.error("Step execution failed:", err);
    } finally {
      setIsStepping(false);
    }
  };

  // Auto-run pipeline to completion with smooth delays
  const handleAutoRun = async () => {
    if (!currentInvestigation || isAutoRunning || currentInvestigation.stage === "COMPLETED") return;
    setIsAutoRunning(true);

    try {
      let currentStage: InvestigationStage = currentInvestigation.stage;
      let activeInv = currentInvestigation;

      while (currentStage !== "COMPLETED") {
        const res = await fetch(`/api/investigations/${activeInv.id}/step`, {
          method: "POST",
        });
        const data = await res.json();
        if (!data.success || !data.investigation) break;

        activeInv = data.investigation;
        currentStage = data.investigation.stage;
        setCurrentInvestigation(data.investigation);
        setInvestigations((prev) =>
          prev.map((i) => (i.id === data.investigation.id ? data.investigation : i))
        );

        if (data.isCompleted) {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#00F2FE", "#8B5CF6", "#10B981"],
          });
          break;
        }

        // Brief delay between serverless steps for visual telemetry
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
    } catch (err) {
      console.error("Auto run failed:", err);
    } finally {
      setIsAutoRunning(false);
    }
  };

  const handleSelectInvestigation = (id: string) => {
    const found = investigations.find((i) => i.id === id);
    if (found) setCurrentInvestigation(found);
  };

  return (
    <div className="min-h-screen bg-[#06080E] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <Navbar
        currentInvestigation={currentInvestigation}
        investigations={investigations}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        onSelectInvestigation={handleSelectInvestigation}
        onNewInvestigation={() => setShowConsole(true)}
        onOpenExport={() => setExportModalOpen(true)}
        onOpenDocs={() => setDocsModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Research Query Console (Collapsible / Modal Banner) */}
        {showConsole && (
          <div className="animate-in fade-in duration-200">
            <QueryConsole
              onLaunch={handleLaunch}
              isLaunching={isLaunching}
              selectedModel={selectedModel}
              onSelectModel={setSelectedModel}
            />
          </div>
        )}

        {/* Current Investigation Active Bar */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 bg-[#0A0F1D]/90 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40 font-semibold">
                {currentInvestigation.domain}
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                ID: {currentInvestigation.id}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-800/40">
                Engine: {currentInvestigation.selectedModel || selectedModel}
              </span>
              {currentInvestigation.verdict && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                  {currentInvestigation.verdict.replace(/_/g, " ")}
                </span>
              )}
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
              &ldquo;{currentInvestigation.query}&rdquo;
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowConsole(!showConsole)}
              className="px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-slate-900 text-cyan-400 hover:bg-slate-800 border border-cyan-500/30 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{showConsole ? "Close Console" : "New Investigation"}</span>
            </button>
          </div>
        </div>

        {/* Agent Execution Timeline Stepper */}
        <AgentTimeline
          investigation={currentInvestigation}
          onStep={handleStep}
          isStepping={isStepping}
          onAutoRun={handleAutoRun}
          isAutoRunning={isAutoRunning}
        />

        {/* View Selection Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("GRAPH")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                activeTab === "GRAPH"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              }`}
            >
              <Network className="w-4 h-4" />
              <span>Evidence Graph</span>
            </button>

            <button
              onClick={() => setActiveTab("MUTATION")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                activeTab === "MUTATION"
                  ? "bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-lg shadow-violet-500/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              }`}
            >
              <TestTube2 className="w-4 h-4 text-violet-400" />
              <span>Mutation Workbench</span>
              <span className="text-[9px] bg-violet-950 px-1.5 py-0.5 rounded text-violet-300 uppercase font-bold border border-violet-800/40">
                Novelty
              </span>
            </button>

            <button
              onClick={() => setActiveTab("BASELINE")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                activeTab === "BASELINE"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>Baseline Comparison & Metrics</span>
            </button>

            <button
              onClick={() => setActiveTab("DOSSIER")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                activeTab === "DOSSIER"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Verification Dossier</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Evidence Graph View */}
        {activeTab === "GRAPH" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <EvidenceGraph investigation={currentInvestigation} />
          </div>
        )}

        {/* Tab 2: Mutation Testing Workbench */}
        {activeTab === "MUTATION" && (
          <div className="animate-in fade-in duration-150">
            <MutationWorkbench investigation={currentInvestigation} />
          </div>
        )}

        {/* Tab 3: Baseline Comparison & Evaluation Metrics */}
        {activeTab === "BASELINE" && (
          <div className="animate-in fade-in duration-150">
            <BaselineComparisonView investigation={currentInvestigation} />
          </div>
        )}

        {/* Tab 4: Full Verification Dossier */}
        {activeTab === "DOSSIER" && (
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 bg-[#090D16]/95 shadow-2xl space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-slate-100">
                  ProofForge AI Verification Dossier
                </h3>
              </div>
              <button
                onClick={() => setExportModalOpen(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 transition"
              >
                Export Dossier (.md / .json)
              </button>
            </div>

            <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {currentInvestigation.executiveReport || (
                <div className="text-slate-500 italic font-mono py-8 text-center">
                  Investigation in progress. Advance stages or click &ldquo;Auto-Run Pipeline&rdquo; to formulate the full verification dossier.
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 py-6 text-center text-xs font-mono text-slate-500 bg-[#04060A]">
        ProofForge AI • Autonomous Epistemic Verification & Evidence Mutation Engine • Built for Vercel Serverless
      </footer>

      {/* Export Modal */}
      <ExportModal
        isOpen={exportModalOpen}
        investigation={currentInvestigation}
        onClose={() => setExportModalOpen(false)}
      />

      {/* Docs & Architecture Modal */}
      <DocsModal
        isOpen={docsModalOpen}
        onClose={() => setDocsModalOpen(false)}
      />
    </div>
  );
}

