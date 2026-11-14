import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from "lucide-react";
import { AtomicClaim } from "@/types";

export const ClaimNode = memo(({ data }: { data: { claim: AtomicClaim; onSelect?: (claim: AtomicClaim) => void } }) => {
  const { claim } = data;

  const statusColor =
    claim.status === "SUPPORTED"
      ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
      : claim.status === "REFUTED"
      ? "border-rose-500/40 text-rose-400 bg-rose-500/10"
      : "border-amber-500/40 text-amber-400 bg-amber-500/10";

  const fragilityBg =
    claim.fragilityRating === "LOW"
      ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
      : claim.fragilityRating === "MODERATE"
      ? "text-cyan-400 border-cyan-500/30 bg-cyan-500/10"
      : claim.fragilityRating === "HIGH"
      ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
      : "text-rose-400 border-rose-500/30 bg-rose-500/10";

  return (
    <div
      onClick={() => data.onSelect?.(claim)}
      className="relative group max-w-sm rounded-xl p-3.5 glass-panel border border-slate-700/60 bg-[#0D1322]/95 text-slate-100 shadow-xl transition-all duration-200 hover:border-cyan-400/60 cursor-pointer"
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-cyan-400 !border-2 !border-[#090D16]"
      />

      <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-700/50">
            {claim.category}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Claim #{claim.id.slice(-2)}</span>
        </div>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-medium ${fragilityBg}`}>
          {claim.fragilityRating} Fragility
        </span>
      </div>

      <p className="text-xs text-slate-200 line-clamp-3 leading-snug font-medium mb-3">
        {claim.statement}
      </p>

      {/* Stability and Confidence Bars */}
      <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-400">Conclusion Stability</span>
          <span className="text-cyan-300 font-semibold">{claim.stabilityScore}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              claim.stabilityScore >= 75 ? "bg-emerald-400" : claim.stabilityScore >= 50 ? "bg-cyan-400" : "bg-amber-400"
            }`}
            style={{ width: `${claim.stabilityScore}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
          <span>Prior: {(claim.priorConfidence * 100).toFixed(0)}%</span>
          <span className="text-slate-300 font-medium">Post-Mutation: {(claim.postMutationConfidence * 100).toFixed(0)}%</span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-cyan-400 !border-2 !border-[#090D16]"
      />
    </div>
  );
});

ClaimNode.displayName = "ClaimNode";

