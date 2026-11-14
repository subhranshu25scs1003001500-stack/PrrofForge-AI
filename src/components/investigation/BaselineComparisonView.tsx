import React from "react";
import { Investigation } from "@/types";
import {
  Scale,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
  Activity,
  Zap,
} from "lucide-react";

interface BaselineComparisonViewProps {
  investigation: Investigation;
}

export function BaselineComparisonView({ investigation }: BaselineComparisonViewProps) {
  const metrics = investigation.metrics;
  const comparison = investigation.baselineComparison;

  if (!metrics || !comparison) {
    return (
      <div className="w-full glass-panel rounded-2xl p-6 border border-slate-800 text-center text-slate-400 font-mono text-sm">
        Pipeline in progress. Metrics and baseline comparison will generate upon final synthesis.
      </div>
    );
  }

  const fragilityColor =
    metrics.epistemicFragilityRisk === "LOW"
      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
      : metrics.epistemicFragilityRisk === "MODERATE"
      ? "text-cyan-400 bg-cyan-500/10 border-cyan-500/30"
      : metrics.epistemicFragilityRisk === "HIGH"
      ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
      : "text-rose-400 bg-rose-500/10 border-rose-500/30";

  return (
    <div className="w-full space-y-6">
      {/* 4 Quantitative Metric Cards (No fake metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="glass-panel rounded-2xl p-4 border border-cyan-500/20 bg-[#0C1220]/90">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
              Conclusion Stability Index
            </span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-300">
            {metrics.conclusionStabilityIndex}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Resistance to evidence ablation & parameter swaps
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel rounded-2xl p-4 border border-emerald-500/20 bg-[#0A161C]/90">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
              Evidence Coverage
            </span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-300">
            {metrics.evidenceCoverage}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Propositions anchored to empirical trials
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel rounded-2xl p-4 border border-violet-500/20 bg-[#120F24]/90">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
              Mutation Resilience
            </span>
            <Zap className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-violet-300">
            {metrics.mutationResilienceScore}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {metrics.mutationsConducted} synthetic perturbations tested
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-700/60 bg-[#0E1322]/90">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
              Epistemic Fragility Risk
            </span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-1">
            <span className={`inline-block px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase border ${fragilityColor}`}>
              {metrics.epistemicFragilityRisk} RISK
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Density: {metrics.skepticChallengeDensity} challenges / claim
          </div>
        </div>
      </div>

      {/* Side-by-Side Baseline Comparison View */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 bg-[#090D16]/95 shadow-2xl">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
          <Scale className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-semibold text-slate-100">
            Baseline Evaluation: Standard Single-Prompt LLM vs ProofForge AI
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Naive Baseline */}
          <div className="rounded-xl p-5 bg-[#0F131D] border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-mono text-slate-300 font-semibold uppercase">
                  Standard LLM Baseline
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-500/30 font-bold uppercase">
                {comparison.standardLlmResponse.hallucinationRisk} Risk
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500">Typical Direct Response</span>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed italic bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                &ldquo;{comparison.standardLlmResponse.answer}&rdquo;
              </p>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500">Unchecked Blind Assumptions</span>
              <ul className="mt-1 space-y-1.5 text-xs text-slate-400">
                {comparison.standardLlmResponse.unverifiedAssumptions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-rose-400 font-bold mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-500 flex justify-between">
              <span>Citation Audit: {comparison.standardLlmResponse.citationAudit}</span>
              <span>Latency: {comparison.standardLlmResponse.generationDurationMs}ms</span>
            </div>
          </div>

          {/* Right: ProofForge Verified */}
          <div className="rounded-xl p-5 bg-[#0B1524] border border-cyan-500/30 space-y-4 shadow-lg shadow-cyan-950/20">
            <div className="flex items-center justify-between pb-3 border-b border-cyan-900/40">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono text-cyan-300 font-bold uppercase">
                  ProofForge Verified Pipeline
                </span>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/50 font-bold uppercase">
                {comparison.proofForgeVerified.verdict.replace(/_/g, " ")}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-cyan-400/90">Calibrated Synthesis</span>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed bg-[#060B14] p-3 rounded-lg border border-cyan-800/30 font-medium">
                {comparison.proofForgeVerified.answer}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-cyan-400/90">Multi-Agent Verification Advantage</span>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {comparison.proofForgeVerified.resilienceAdvantage}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-cyan-900/40 text-[11px] font-mono text-cyan-300/80">
              <div className="bg-cyan-950/40 p-2 rounded border border-cyan-900/30">
                <span className="text-[10px] text-slate-400 block">Stability Gain</span>
                <span className="font-bold text-cyan-300">{comparison.metricsDelta.stabilityImprovement}</span>
              </div>
              <div className="bg-cyan-950/40 p-2 rounded border border-cyan-900/30">
                <span className="text-[10px] text-slate-400 block">Fragile Claims Caught</span>
                <span className="font-bold text-amber-300">{comparison.metricsDelta.unbackedClaimsCaught} propositions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

