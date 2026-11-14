import React, { useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  MarkerType,
} from "@xyflow/react";
import { Investigation, AtomicClaim, EvidenceNode, SkepticCritique, MutationExperiment } from "@/types";
import { HypothesisNode } from "./nodes/HypothesisNode";
import { ClaimNode } from "./nodes/ClaimNode";
import { EvidenceNodeComponent } from "./nodes/EvidenceNode";
import { SkepticNode } from "./nodes/SkepticNode";
import { MutationNode } from "./nodes/MutationNode";
import { NodeDrawer } from "./NodeDrawer";
import { Network, Maximize2, Sparkles, Filter } from "lucide-react";

const nodeTypes = {
  hypothesis: HypothesisNode,
  claim: ClaimNode,
  evidence: EvidenceNodeComponent,
  skeptic: SkepticNode,
  mutation: MutationNode,
};

interface EvidenceGraphProps {
  investigation: Investigation;
}

export function EvidenceGraph({ investigation }: EvidenceGraphProps) {
  const [selectedItem, setSelectedItem] = useState<{
    type: "claim" | "evidence" | "skeptic" | "mutation";
    data: any;
  } | null>(null);

  const [activeFilter, setActiveFilter] = useState<"ALL" | "CLAIMS" | "EVIDENCE" | "MUTATIONS">("ALL");

  // Construct graph nodes and edges
  const { nodes, edges } = useMemo(() => {
    const nodesList: Node[] = [];
    const edgesList: Edge[] = [];

    // 1. Root Hypothesis Node
    nodesList.push({
      id: "root-hypothesis",
      type: "hypothesis",
      position: { x: 420, y: 30 },
      data: { query: investigation.query, domain: investigation.domain },
    });

    const claims = investigation.claims || [];
    const evidence = investigation.evidence || [];
    const critiques = investigation.critiques || [];
    const mutations = investigation.mutations || [];

    // Horizontal spacing calculations
    const claimSpacing = 360;
    const startX = 420 - ((claims.length - 1) * claimSpacing) / 2;

    // 2. Claim Nodes
    claims.forEach((claim, cIdx) => {
      const claimX = startX + cIdx * claimSpacing;
      const claimY = 220;
      const claimNodeId = `claim-${claim.id}`;

      nodesList.push({
        id: claimNodeId,
        type: "claim",
        position: { x: claimX, y: claimY },
        data: {
          claim,
          onSelect: (c: AtomicClaim) => setSelectedItem({ type: "claim", data: c }),
        },
      });

      // Edge from hypothesis to claim
      edgesList.push({
        id: `edge-hypo-${claim.id}`,
        source: "root-hypothesis",
        target: claimNodeId,
        animated: true,
        style: { stroke: "#00F2FE", strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#00F2FE" },
      });

      // 3. Evidence Nodes attached to this claim
      const claimEvs = evidence.filter((e) => claim.evidenceIds.includes(e.id));
      claimEvs.forEach((ev, evIdx) => {
        const evNodeId = `ev-${ev.id}`;
        // Avoid duplicate evidence nodes if linked to multiple claims
        if (!nodesList.some((n) => n.id === evNodeId)) {
          const evX = claimX - 160 + evIdx * 320;
          const evY = 460;

          nodesList.push({
            id: evNodeId,
            type: "evidence",
            position: { x: evX, y: evY },
            data: {
              evidence: ev,
              onSelect: (e: EvidenceNode) => setSelectedItem({ type: "evidence", data: e }),
            },
          });
        }

        edgesList.push({
          id: `edge-${claimNodeId}-${evNodeId}`,
          source: claimNodeId,
          target: evNodeId,
          style: {
            stroke: ev.supportsClaim ? "#10B981" : "#F59E0B",
            strokeWidth: 1.5,
            strokeDasharray: ev.supportsClaim ? undefined : "4,4",
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: ev.supportsClaim ? "#10B981" : "#F59E0B",
          },
        });
      });

      // 4. Skeptic Critique Nodes attached to this claim
      const claimCritiques = critiques.filter((cr) => cr.claimId === claim.id);
      claimCritiques.forEach((critique, crIdx) => {
        const critNodeId = `crit-${critique.id}`;
        const critX = claimX + 180 + crIdx * 280;
        const critY = 460 + crIdx * 80;

        nodesList.push({
          id: critNodeId,
          type: "skeptic",
          position: { x: critX, y: critY },
          data: {
            critique,
            onSelect: (cr: SkepticCritique) => setSelectedItem({ type: "skeptic", data: cr }),
          },
        });

        edgesList.push({
          id: `edge-${claimNodeId}-${critNodeId}`,
          source: claimNodeId,
          target: critNodeId,
          style: { stroke: "#EF4444", strokeWidth: 1.8, strokeDasharray: "5,5" },
          markerEnd: { type: MarkerType.ArrowClosed, color: "#EF4444" },
        });
      });

      // 5. Mutation Nodes attached to this claim
      const claimMutations = mutations.filter((m) => m.claimId === claim.id);
      claimMutations.forEach((mut, mIdx) => {
        const mutNodeId = `mut-${mut.id}`;
        const mutX = claimX - 140 + mIdx * 270;
        const mutY = 700 + (mIdx % 2) * 50;

        nodesList.push({
          id: mutNodeId,
          type: "mutation",
          position: { x: mutX, y: mutY },
          data: {
            mutation: mut,
            onSelect: (m: MutationExperiment) => setSelectedItem({ type: "mutation", data: m }),
          },
        });

        edgesList.push({
          id: `edge-${claimNodeId}-${mutNodeId}`,
          source: claimNodeId,
          target: mutNodeId,
          style: { stroke: "#8B5CF6", strokeWidth: 1.6, strokeDasharray: "3,3" },
          markerEnd: { type: MarkerType.ArrowClosed, color: "#8B5CF6" },
        });
      });
    });

    return { nodes: nodesList, edges: edgesList };
  }, [investigation]);

  return (
    <div className="relative w-full h-[680px] rounded-2xl overflow-hidden glass-panel border border-slate-800 bg-[#06080E] shadow-2xl">
      {/* Top Overlay Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-[#0D1322]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-700/80 shadow-lg text-xs font-mono">
          <Network className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300 font-medium">Interactive Evidentiary Graph</span>
          <span className="text-cyan-400 font-bold ml-1">
            {nodes.length} Nodes • {edges.length} Edges
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 pointer-events-auto bg-[#0D1322]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-lg text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm" />
            <span className="text-slate-300">Claim</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-slate-300">Empirical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-slate-300">Skeptic</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-400" />
            <span className="text-slate-300">Synthetic Mutation</span>
          </div>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={1.8}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#1E293B" gap={24} size={1.2} />
        <Controls position="bottom-right" />
        <MiniMap
          position="bottom-left"
          nodeStrokeWidth={3}
          nodeColor={(n) => {
            if (n.type === "hypothesis") return "#00F2FE";
            if (n.type === "claim") return "#38BDF8";
            if (n.type === "evidence") return "#10B981";
            if (n.type === "skeptic") return "#EF4444";
            if (n.type === "mutation") return "#8B5CF6";
            return "#475569";
          }}
          maskColor="rgba(6, 8, 14, 0.75)"
          style={{ background: "#0D1322", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)" }}
        />
      </ReactFlow>

      {/* Node Inspection Drawer */}
      <NodeDrawer
        isOpen={selectedItem !== null}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}

