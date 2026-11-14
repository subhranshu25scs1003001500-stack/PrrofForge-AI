import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Dna, Check, X, TestTube2 } from "lucide-react";
import { MutationExperiment } from "@/types";

export const MutationNode = memo(({ data }: { data: { mutation: MutationExperiment; onSelect?: (m: MutationExperiment) => void } }) => {
  const { mutation } = data;

  const typeColor =
    mutation.mutationType === "ABLATION"
      ? "text-rose-400 bg-rose-500/10 border-rose-500/30"
      : mutation.mutationType === "CONTRADICTION"
      ? "text-violet-400 bg-violet-500/10 border-violet-500/30"
      : "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";

  return (
    <div
      onClick={() => data.onSelect?.(mutation)}
      className="relative group max-w-xs rounded-xl p-3 glass-panel-violet border border-violet-500/40 bg-[#130E26]/95 text-slate-100 shadow-xl transition-all duration-200 hover:border-violet-400 cursor-pointer"
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-violet-400 !border-2 !border-[#090D16]"
      />

      <div className="flex items-center justify-between gap-1 mb-1.5 pb-1 border-b border-violet-500/20">
        <div className="flex items-center gap-1.5">
          <TestTube2 className="w-3.5 h-3.5 text-violet-400" />
          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-bold border ${typeColor}`}>
            {mutation.mutationType}
          </span>
        </div>
        <span className="text-[9px] font-mono text-violet-300 font-semibold bg-violet-950 px-1.5 py-0.5 rounded border border-violet-800/40">
          SYNTHETIC SIMULATION
        </span>
      </div>

      <div className="text-xs font-semibold text-slate-200 line-clamp-1 mb-1">
        {mutation.title}
      </div>

      <div className="p-1.5 rounded bg-black/40 border border-violet-900/40 text-[10px] text-slate-300 line-clamp-2 font-mono mb-2">
        {mutation.mutatedHypothesis}
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono border-t border-violet-900/40 pt-1.5">
        <span className="text-slate-400">
          {(mutation.originalConfidence * 100).toFixed(0)}% → {(mutation.mutatedConfidence * 100).toFixed(0)}%
        </span>
        <span className={`flex items-center gap-1 font-semibold ${mutation.survived ? "text-emerald-400" : "text-rose-400"}`}>
          {mutation.survived ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
          {mutation.survived ? "Survived" : "Collapsed"}
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-violet-400 !border-2 !border-[#090D16]"
      />
    </div>
  );
});

MutationNode.displayName = "MutationNode";

