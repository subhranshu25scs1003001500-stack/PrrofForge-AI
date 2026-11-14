import React, { useState } from "react";
import { Investigation, MutationExperiment, MutationType } from "@/types";
import {
  TestTube2,
  Dna,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Sliders,
} from "lucide-react";

interface MutationWorkbenchProps {
  investigation: Investigation;
}

export function MutationWorkbench({ investigation }: MutationWorkbenchProps) {
  const [filterType, setFilterType] = useState<"ALL" | MutationType>("ALL");

  const mutations = investigation.mutations || [];
  const filteredMutations =
    filterType === "ALL"
      ? mutations
      : mutations.filter((m) => m.mutationType === filterType);

  const survivedCount = mutations.filter((m) => m.survived).length;
  const collapsedCount = mutations.filter((m) => !m.survived).length;
  const avgSensitivity =
    mutations.length > 0
      ? (
          mutations.reduce((sum, m) => sum + m.sensitivityFactor, 0) /
          mutations.length
        ).toFixed(2)
      : "0.00";

  return (
    <div className="w-full glass-panel-violet rounded-2xl p-6 border border-violet-500/30 bg-[#0B0918]/95 shadow-2xl space-y-6">
      {/* Novelty Notice Banner */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-violet-950/60 border border-violet-500/40 text-xs font-mono text-violet-200">
        <Info className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-violet-300 uppercase tracking-wide">
            Core Novelty: Adversarial Evidence Mutation Testing
          </span>
          <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed font-sans">
            Rather than relying on static citation counts, ProofForge stress-tests assertions through counterfactual ablation, parameter swaps, and synthetic contradiction injection to measure belief fragility.
            <strong className="text-violet-300 font-mono block mt-1">
              [NOTICE: All mutations below are synthetic perturbation experiments and are never presented as verified empirical facts.]
            </strong>
          </p>
        </div>
      </div>

      {/* Header and Summary KPIs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-violet-900/40">
        <div>
          <div className="flex items-center gap-2">
            <TestTube2 className="w-5 h-5 text-violet-400" />
            <h3 className="text-base font-semibold text-slate-100">
              Evidence Mutation Workbench
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Testing structural consensus resilience against empirical perturbations
          </p>
        </div>

        {/* Mutation KPI Badges */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-slate-400">Total Mutations: </span>
            <span className="text-slate-200 font-bold">{mutations.length}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300">
            <span>Survived: </span>
            <span className="font-bold">{survivedCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300">
            <span>Collapsed: </span>
            <span className="font-bold">{collapsedCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-violet-950/50 border border-violet-500/30 text-violet-300">
            <span>Mean Sensitivity: </span>
            <span className="font-bold">{avgSensitivity}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-slate-400 flex items-center gap-1 mr-2">
          <Sliders className="w-3.5 h-3.5" /> Filter:
        </span>
        {(["ALL", "ABLATION", "CONTRADICTION", "SWAP"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all duration-200 ${
              filterType === type
                ? "bg-violet-600 text-white font-semibold shadow-md shadow-violet-500/30"
                : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Mutation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMutations.map((m) => {
          const typeBadge =
            m.mutationType === "ABLATION"
              ? "text-rose-400 bg-rose-950/50 border-rose-500/40"
              : m.mutationType === "CONTRADICTION"
              ? "text-violet-300 bg-violet-950/50 border-violet-500/40"
              : "text-cyan-300 bg-cyan-950/50 border-cyan-500/40";

          return (
            <div
              key={m.id}
              className="rounded-xl p-4 bg-[#0E0C1F]/90 border border-violet-500/25 shadow-lg flex flex-col justify-between space-y-3 transition-all duration-200 hover:border-violet-400/50"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold uppercase border ${typeBadge}`}>
                    {m.mutationType}
                  </span>
                  <span
                    className={`flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      m.survived
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                    }`}
                  >
                    {m.survived ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <XCircle className="w-3 h-3" />
                    )}
                    {m.survived ? "SURVIVED" : "COLLAPSED"}
                  </span>
                </div>

                <h4 className="text-xs font-semibold text-slate-100 line-clamp-2 leading-snug">
                  {m.title}
                </h4>

                <p className="text-[11px] text-slate-300 line-clamp-2 mt-1.5 leading-relaxed font-sans">
                  {m.description}
                </p>

                <div className="mt-3 p-2 rounded-lg bg-black/50 border border-violet-900/40 font-mono text-[10px] text-violet-200/90 leading-tight">
                  {m.mutatedHypothesis}
                </div>
              </div>

              {/* Confidence Transition Bar */}
              <div className="pt-3 border-t border-violet-950/80 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Confidence Shift</span>
                  <span className="text-slate-200 font-semibold flex items-center gap-1">
                    <span>{(m.originalConfidence * 100).toFixed(0)}%</span>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                    <span className={m.mutatedConfidence >= 0.55 ? "text-emerald-400" : "text-rose-400"}>
                      {(m.mutatedConfidence * 100).toFixed(0)}%
                    </span>
                    <span className="text-slate-400 text-[10px]">
                      (-{(m.confidenceDelta * 100).toFixed(0)}%)
                    </span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Sensitivity Factor: <strong className="text-amber-400">{m.sensitivityFactor}</strong></span>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-violet-950 text-violet-300">
                    Synthetic
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

