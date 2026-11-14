import React, { useState } from "react";
import {
  ShieldCheck,
  Sparkles,
  Download,
  FolderOpen,
  Github,
  PlusCircle,
  HelpCircle,
} from "lucide-react";
import { Investigation } from "@/types";
import { ProviderStatusIndicator } from "./ProviderStatusIndicator";
import { ModelSelector } from "./ModelSelector";

interface NavbarProps {
  currentInvestigation: Investigation;
  investigations: Investigation[];
  selectedModel: string;
  onSelectModel: (model: string) => void;
  onSelectInvestigation: (id: string) => void;
  onNewInvestigation: () => void;
  onOpenExport: () => void;
  onOpenDocs: () => void;
}

export function Navbar({
  currentInvestigation,
  investigations,
  selectedModel,
  onSelectModel,
  onSelectInvestigation,
  onNewInvestigation,
  onOpenExport,
  onOpenDocs,
}: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800 bg-[#06080E]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-600 shadow-lg shadow-cyan-500/20">
            <ShieldCheck className="w-5 h-5 text-black stroke-[2.5]" />
            <div className="absolute inset-0 rounded-xl bg-cyan-400/20 animate-ping pointer-events-none" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-white">
                ProofForge<span className="text-cyan-400 font-mono">.AI</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                v1.1-groq-gemini
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 hidden xl:block">
              Evidence Mutation & Epistemic Verification Engine
            </p>
          </div>
        </div>

        {/* Center Left: Investigation Switcher */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs font-mono text-slate-200 hover:border-cyan-500/50 transition max-w-[200px] md:max-w-xs truncate"
          >
            <FolderOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">
              {currentInvestigation.query.slice(0, 28)}...
            </span>
            <span className="text-[10px] text-slate-500 shrink-0">
              ({investigations.length})
            </span>
          </button>

          {dropdownOpen && (
            <div className="absolute top-full mt-2 left-0 w-80 max-h-72 overflow-y-auto rounded-xl bg-[#0D1322] border border-slate-700 shadow-2xl p-2 z-50 space-y-1">
              <div className="text-[10px] uppercase font-mono text-slate-400 px-2 py-1 font-semibold">
                Saved Investigations
              </div>
              {investigations.map((inv) => (
                <button
                  key={inv.id}
                  onClick={() => {
                    onSelectInvestigation(inv.id);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg text-xs font-sans transition flex flex-col gap-0.5 ${
                    inv.id === currentInvestigation.id
                      ? "bg-cyan-950/60 text-cyan-300 border border-cyan-800/40"
                      : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <span className="font-medium line-clamp-1">{inv.query}</span>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>{inv.domain}</span>
                    <span className="uppercase text-slate-400 font-semibold">{inv.stage}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Center Right: Model Selection Dropdown & Provider Status Indicator */}
        <div className="flex items-center gap-2">
          {/* Model Selection Dropdown */}
          <div className="hidden lg:block">
            <ModelSelector
              value={selectedModel}
              onChange={onSelectModel}
              compact
            />
          </div>

          {/* Provider Status Indicator */}
          <ProviderStatusIndicator />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNewInvestigation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/40 transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden md:inline">New Query</span>
          </button>

          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={onOpenDocs}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition"
            title="System Architecture & Vercel Specs"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
