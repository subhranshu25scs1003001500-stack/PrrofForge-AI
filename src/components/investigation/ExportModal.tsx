import React, { useState } from "react";
import { Investigation } from "@/types";
import { X, Download, FileText, Code2, Copy, Check, Printer } from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  investigation: Investigation;
  onClose: () => void;
}

export function ExportModal({ isOpen, investigation, onClose }: ExportModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownloadMarkdown = () => {
    window.open(`/api/investigations/${investigation.id}/export?format=markdown`, "_blank");
  };

  const handleDownloadJson = () => {
    window.open(`/api/investigations/${investigation.id}/export?format=json`, "_blank");
  };

  const handleCopySummary = () => {
    const text = investigation.executiveReport || investigation.summary || "";
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl glass-panel-glow border border-cyan-500/40 bg-[#0B0F19] p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-semibold text-slate-100">
              Export Verification Dossier
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dossier Meta Summary */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs font-mono">
          <div className="text-slate-400">
            Investigation ID: <span className="text-cyan-300 font-bold">{investigation.id}</span>
          </div>
          <div className="text-slate-400">
            Epistemic Verdict:{" "}
            <span className="text-emerald-400 font-bold uppercase">
              {investigation.verdict?.replace(/_/g, " ") || "IN_PROGRESS"}
            </span>
          </div>
          <div className="text-slate-400">
            Conclusion Stability Index:{" "}
            <span className="text-cyan-300 font-bold">
              {investigation.metrics?.conclusionStabilityIndex ?? "N/A"}%
            </span>
          </div>
        </div>

        {/* Preview snippet */}
        <div className="max-h-56 overflow-y-auto p-4 rounded-xl bg-[#06080E] border border-slate-800 text-xs text-slate-300 font-sans leading-relaxed whitespace-pre-wrap">
          {investigation.executiveReport || investigation.summary || "Generating verification dossier..."}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={handleDownloadMarkdown}
            className="flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-mono font-semibold bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900/50 transition"
          >
            <Download className="w-4 h-4" />
            <span>Markdown (.md)</span>
          </button>

          <button
            onClick={handleDownloadJson}
            className="flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-mono font-semibold bg-violet-950/60 text-violet-300 border border-violet-500/40 hover:bg-violet-900/50 transition"
          >
            <Code2 className="w-4 h-4" />
            <span>Data (.json)</span>
          </button>

          <button
            onClick={handleCopySummary}
            className="flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-mono font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Copied!" : "Copy Report"}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-mono font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}

