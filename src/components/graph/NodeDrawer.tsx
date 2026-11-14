import React from "react";
import { X, ExternalLink, ShieldAlert, Award, Dna, FileText, CheckCircle2, AlertTriangle } from "lucide-react";
import { AtomicClaim, EvidenceNode, SkepticCritique, MutationExperiment } from "@/types";

interface NodeDrawerProps {
  isOpen: boolean;
  item: {
    type: "claim" | "evidence" | "skeptic" | "mutation";
    data: any;
  } | null;
  onClose: () => void;
}

export function NodeDrawer({ isOpen, item, onClose }: NodeDrawerProps) {
  if (!isOpen || !item) return null;

  return (
    <div className="absolute top-0 right-0 bottom-0 w-96 max-w-full bg-[#0D1322]/95 backdrop-blur-xl border-l border-slate-700/80 shadow-2xl z-30 flex flex-col p-6 overflow-y-auto animate-in slide-in-from-right duration-200">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          {item.type === "claim" && <Award className="w-5 h-5 text-cyan-400" />}
          {item.type === "evidence" && <FileText className="w-5 h-5 text-emerald-400" />}
          {item.type === "skeptic" && <ShieldAlert className="w-5 h-5 text-amber-400" />}
          {item.type === "mutation" && <Dna className="w-5 h-5 text-violet-400" />}
          <span className="text-xs uppercase font-mono font-bold tracking-wider text-slate-300">
            Node Inspector • {item.type}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-5 space-y-5 text-sm text-slate-200">
        {/* CLAIM INSPECTOR */}
        {item.type === "claim" && (
          <ClaimDetails claim={item.data as AtomicClaim} />
        )}

        {/* EVIDENCE INSPECTOR */}
        {item.type === "evidence" && (
          <EvidenceDetails evidence={item.data as EvidenceNode} />
        )}

        {/* SKEPTIC CRITIQUE INSPECTOR */}
        {item.type === "skeptic" && (
          <SkepticDetails critique={item.data as SkepticCritique} />
        )}

        {/* MUTATION EXPERIMENT INSPECTOR */}
        {item.type === "mutation" && (
          <MutationDetails mutation={item.data as MutationExperiment} />
        )}
      </div>
    </div>
  );
}

function ClaimDetails({ claim }: { claim: AtomicClaim }) {
  return (
    <>
      <div>
        <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold">
          Atomic Proposition
        </span>
        <h4 className="text-sm font-medium text-slate-100 mt-1 leading-snug">
          {claim.statement}
        </h4>
      </div>

      <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono">
        <div>
          <span className="text-slate-400 text-[10px]">Category</span>
          <div className="text-cyan-300 font-semibold uppercase">{claim.category}</div>
        </div>
        <div>
          <span className="text-slate-400 text-[10px]">Status</span>
          <div className="text-slate-200 font-semibold">{claim.status}</div>
        </div>
        <div>
          <span className="text-slate-400 text-[10px]">Prior Confidence</span>
          <div className="text-slate-200">{(claim.priorConfidence * 100).toFixed(0)}%</div>
        </div>
        <div>
          <span className="text-slate-400 text-[10px]">Post-Mutation Stability</span>
          <div className="text-cyan-400 font-bold">{claim.stabilityScore}%</div>
        </div>
      </div>

      <div>
        <span className="text-[10px] font-mono uppercase text-slate-400">Fragility Classification</span>
        <div className="mt-1 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono">
            <span>Risk Level:</span>
            <span className="font-bold text-cyan-300">{claim.fragilityRating}</span>
          </div>
          {claim.notes && (
            <p className="text-xs text-slate-400 mt-2 italic leading-relaxed">
              {claim.notes}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

function EvidenceDetails({ evidence }: { evidence: EvidenceNode }) {
  const { source } = evidence;
  return (
    <>
      <div>
        <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold">
          Publication Source
        </span>
        <h4 className="text-sm font-semibold text-slate-100 mt-1">
          {source.title}
        </h4>
        <div className="text-xs text-slate-400 mt-1">
          {source.authors.join(", ")} ({source.year})
        </div>
        <div className="text-xs text-cyan-400/90 font-mono mt-0.5">
          {source.publication}
        </div>
      </div>

      {source.url && (
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:underline font-mono bg-cyan-950/40 px-3 py-1.5 rounded-lg border border-cyan-800/40"
        >
          <span>View DOI / Research Entry</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}

      <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono">
        <div>
          <span className="text-slate-400 text-[10px]">Credibility Score</span>
          <div className="text-emerald-400 font-bold">{(source.credibilityScore * 100).toFixed(0)}%</div>
        </div>
        <div>
          <span className="text-slate-400 text-[10px]">Sample Cohort</span>
          <div className="text-slate-200">n = {source.sampleSize ?? "N/A"}</div>
        </div>
        <div>
          <span className="text-slate-400 text-[10px]">Peer-Reviewed</span>
          <div className="text-slate-200">{source.isPeerReviewed ? "Yes" : "No"}</div>
        </div>
        <div>
          <span className="text-slate-400 text-[10px]">Alignment</span>
          <div className={evidence.supportsClaim ? "text-emerald-400" : "text-amber-400"}>
            {evidence.supportsClaim ? "Supports Claim" : "Counters"}
          </div>
        </div>
      </div>

      <div>
        <span className="text-[10px] font-mono uppercase text-slate-400">Direct Empirical Excerpt</span>
        <div className="mt-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs italic text-slate-300 leading-relaxed">
          &ldquo;{evidence.snippet}&rdquo;
        </div>
      </div>

      {source.methodology && (
        <div>
          <span className="text-[10px] font-mono uppercase text-slate-400">Methodology</span>
          <p className="text-xs text-slate-300 mt-1 font-mono">
            {source.methodology}
          </p>
        </div>
      )}
    </>
  );
}

function SkepticDetails({ critique }: { critique: SkepticCritique }) {
  return (
    <>
      <div>
        <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold">
          Challenger Agent Audit
        </span>
        <h4 className="text-sm font-semibold text-slate-100 mt-1">
          {critique.challengerAgent}
        </h4>
        <div className="text-xs font-mono text-amber-300 mt-1 font-bold">
          Detected: {critique.fallacyType.replace(/_/g, " ")}
        </div>
      </div>

      <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-slate-200 leading-relaxed">
        {critique.critiqueText}
      </div>

      <div>
        <span className="text-[10px] font-mono uppercase text-slate-400">
          Prescribed Stress Test
        </span>
        <div className="mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300">
          {critique.suggestedStressTest}
        </div>
      </div>

      {critique.counterEvidenceProposed && (
        <div>
          <span className="text-[10px] font-mono uppercase text-slate-400">
            Suggested Counter-Corpus
          </span>
          <div className="mt-1 text-xs text-slate-300 font-mono">
            {critique.counterEvidenceProposed}
          </div>
        </div>
      )}
    </>
  );
}

function MutationDetails({ mutation }: { mutation: MutationExperiment }) {
  return (
    <>
      <div className="p-2.5 rounded-lg bg-violet-950/40 border border-violet-500/40 text-[11px] font-mono text-violet-300 leading-tight">
        <span className="font-bold">NOTICE:</span> Synthetic perturbation experiment. Created to test conclusion sensitivity; not verified fact.
      </div>

      <div>
        <span className="text-[10px] font-mono uppercase text-violet-400 font-semibold">
          Mutation Experiment
        </span>
        <h4 className="text-sm font-semibold text-slate-100 mt-1">
          {mutation.title}
        </h4>
        <div className="text-xs text-slate-400 mt-1">
          Type: <span className="text-violet-300 font-mono font-bold">{mutation.mutationType}</span>
        </div>
      </div>

      <div>
        <span className="text-[10px] font-mono uppercase text-slate-400">Mutated Hypothesis Condition</span>
        <div className="mt-1 p-3 rounded-xl bg-slate-950 border border-violet-900/40 text-xs font-mono text-slate-300">
          {mutation.mutatedHypothesis}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono">
        <div>
          <span className="text-slate-400 text-[10px]">Original Conf</span>
          <div className="text-slate-200">{(mutation.originalConfidence * 100).toFixed(0)}%</div>
        </div>
        <div>
          <span className="text-slate-400 text-[10px]">Mutated Conf</span>
          <div className="text-violet-300 font-bold">{(mutation.mutatedConfidence * 100).toFixed(0)}%</div>
        </div>
        <div>
          <span className="text-slate-400 text-[10px]">Sensitivity Rate</span>
          <div className="text-amber-400">{mutation.sensitivityFactor}</div>
        </div>
        <div>
          <span className="text-slate-400 text-[10px]">Test Result</span>
          <div className={mutation.survived ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
            {mutation.survived ? "SURVIVED" : "COLLAPSED"}
          </div>
        </div>
      </div>

      <div>
        <span className="text-[10px] font-mono uppercase text-slate-400">Engine Analysis</span>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          {mutation.reasoning}
        </p>
      </div>
    </>
  );
}

