import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { AlertOctagon, Flame } from "lucide-react";
import { SkepticCritique } from "@/types";

export const SkepticNode = memo(({ data }: { data: { critique: SkepticCritique; onSelect?: (c: SkepticCritique) => void } }) => {
  const { critique } = data;

  const severityColor =
    critique.severity === "CRITICAL"
      ? "border-rose-500/50 bg-rose-950/30 text-rose-300"
      : critique.severity === "HIGH"
      ? "border-amber-500/50 bg-amber-950/30 text-amber-300"
      : "border-yellow-500/50 bg-yellow-950/20 text-yellow-300";

  return (
    <div
      onClick={() => data.onSelect?.(critique)}
      className={`relative group max-w-xs rounded-xl p-3 border ${severityColor} backdrop-blur-md shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-amber-400 !border-2 !border-[#090D16]"
      />

      <div className="flex items-center justify-between gap-1 mb-1.5 pb-1 border-b border-amber-500/20">
        <div className="flex items-center gap-1.5">
          <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[10px] font-mono font-bold tracking-tight">
            ADVERSARIAL SKEPTIC
          </span>
        </div>
        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold border border-current">
          {critique.severity}
        </span>
      </div>

      <div className="text-[10px] font-mono text-amber-300 font-semibold mb-1">
        FALLACY: {critique.fallacyType.replace(/_/g, " ")}
      </div>

      <p className="text-[11px] text-slate-200 line-clamp-3 leading-snug mb-2">
        {critique.critiqueText}
      </p>

      <div className="text-[10px] font-mono text-slate-400 bg-black/40 p-1.5 rounded border border-white/5 line-clamp-2">
        <span className="text-amber-400/90 font-semibold">Stress Test:</span> {critique.suggestedStressTest}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-amber-400 !border-2 !border-[#090D16]"
      />
    </div>
  );
});

SkepticNode.displayName = "SkepticNode";

