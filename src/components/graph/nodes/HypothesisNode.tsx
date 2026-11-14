import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Sparkles, Compass } from "lucide-react";

export const HypothesisNode = memo(({ data }: { data: { query: string; domain: string } }) => {
  return (
    <div className="relative group max-w-sm rounded-xl p-4 glass-panel-glow border-cyan-400/50 bg-[#0D1322]/95 text-slate-100 shadow-2xl transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-cyan-500/20">
        <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300">
          <Compass className="w-4 h-4 animate-spin-slow" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 font-semibold">
            Root Research Hypothesis
          </span>
          <div className="text-[11px] text-slate-400 truncate">{data.domain}</div>
        </div>
      </div>

      <p className="text-xs font-medium leading-relaxed text-slate-200 line-clamp-3">
        &ldquo;{data.query}&rdquo;
      </p>

      <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-cyan-300/80">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" /> Ground Zero
        </span>
        <span className="bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/30">
          Decomposition Anchor
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-cyan-400 !border-2 !border-[#090D16]"
      />
    </div>
  );
});

HypothesisNode.displayName = "HypothesisNode";

