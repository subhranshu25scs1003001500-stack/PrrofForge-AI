import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { BookOpen, ExternalLink, Award, FileText } from "lucide-react";
import { EvidenceNode as EvidenceNodeType } from "@/types";

export const EvidenceNodeComponent = memo(({ data }: { data: { evidence: EvidenceNodeType; onSelect?: (evidence: EvidenceNodeType) => void } }) => {
  const { evidence } = data;
  const { source } = evidence;

  return (
    <div
      onClick={() => data.onSelect?.(evidence)}
      className="relative group max-w-xs rounded-xl p-3 glass-panel border border-cyan-500/30 bg-[#0A101D]/90 text-slate-100 shadow-lg hover:border-cyan-400 transition-all duration-200 cursor-pointer"
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-cyan-400 !border-2 !border-[#090D16]"
      />

      <div className="flex items-center justify-between gap-1 mb-1.5 pb-1 border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] font-mono text-cyan-300 font-semibold uppercase">
            {source.isSynthetic ? "Synthetic Artifact" : "Empirical Source"}
          </span>
        </div>
        <span className="text-[10px] font-mono bg-cyan-950 px-1.5 py-0.5 rounded text-cyan-200 border border-cyan-800/40">
          {(source.credibilityScore * 100).toFixed(0)}% Cred
        </span>
      </div>

      <div className="text-xs font-semibold text-slate-200 line-clamp-2 leading-tight mb-1">
        {source.title}
      </div>

      <div className="text-[10px] text-slate-400 truncate mb-2">
        {source.authors[0] || "Unknown"} et al. ({source.year}) • {source.publication}
      </div>

      <div className="p-2 rounded bg-slate-900/80 border border-slate-800/80 text-[11px] text-slate-300 line-clamp-2 italic">
        &ldquo;{evidence.snippet}&rdquo;
      </div>

      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span>n = {source.sampleSize ?? "N/A"}</span>
        <span className={evidence.supportsClaim ? "text-emerald-400" : "text-amber-400"}>
          {evidence.supportsClaim ? "Supports Claim" : "Counters Claim"}
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-cyan-400 !border-2 !border-[#090D16]"
      />
    </div>
  );
});

EvidenceNodeComponent.displayName = "EvidenceNodeComponent";

