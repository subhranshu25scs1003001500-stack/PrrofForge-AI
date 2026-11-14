import React, { useState } from "react";
import { Sparkles, Terminal, Compass, ArrowRight, Loader2, BookOpen, Cpu } from "lucide-react";
import { ModelSelector } from "../layout/ModelSelector";

interface QueryConsoleProps {
  onLaunch: (query: string, domain: string, model: string) => Promise<void>;
  isLaunching: boolean;
  selectedModel: string;
  onSelectModel: (model: string) => void;
}

const RESEARCH_PRESETS = [
  {
    domain: "Biotechnology & Aging",
    title: "AAV9-TERT Telomerase Therapy",
    query: "Does systemic AAV9-mediated telomerase reverse transcriptase (TERT) gene therapy extend mammalian median lifespan without increasing spontaneous oncogenesis?",
  },
  {
    domain: "Quantum Computing",
    title: "Superconducting Quantum Advantage",
    query: "Does random circuit sampling on superconducting transmon qubit processors demonstrate unbridgeable computational advantage over classical tensor network simulation?",
  },
  {
    domain: "Metabolic Pharmacology",
    title: "Rapamycin mTORC1 vs mTORC2",
    query: "Does chronic intermittent rapamycin administration prolong mammalian healthspan without inducing mTORC2-mediated insulin resistance and immunosuppression?",
  },
  {
    domain: "Condensed Matter Physics",
    title: "Hydride Superconductivity",
    query: "Can room-temperature superconductivity in carbonaceous sulfur hydrides be independently replicated under diamond anvil cell pressures without background subtraction artifacts?",
  },
];

export function QueryConsole({
  onLaunch,
  isLaunching,
  selectedModel,
  onSelectModel,
}: QueryConsoleProps) {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("Biotechnology & Aging");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLaunching) return;
    await onLaunch(query.trim(), domain, selectedModel);
  };

  const handleSelectPreset = (preset: typeof RESEARCH_PRESETS[0]) => {
    setQuery(preset.query);
    setDomain(preset.domain);
  };

  return (
    <div className="w-full glass-panel-glow rounded-2xl p-6 border border-cyan-500/30 bg-[#090E1A]/95 shadow-2xl relative overflow-hidden">
      {/* Decorative Cyber Background Grids */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-cyan-500/20">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">
                Research Inquiry & Epistemic Forge Console
              </h2>
              <p className="text-xs text-slate-400">
                Deconstruct assertions into testable claims, adversarial audits, and mutation experiments
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-300/80 bg-cyan-950/60 px-3 py-1.5 rounded-xl border border-cyan-800/40">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Groq Primary & Gemini Fallback Active</span>
          </div>
        </div>

        {/* Quick Presets */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mb-2">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>High-Impact Research Presets:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {RESEARCH_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(p)}
                className="text-left p-2.5 rounded-xl bg-slate-900/80 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 transition-all duration-200 group"
              >
                <div className="text-[10px] font-mono text-cyan-400/90 truncate">
                  {p.domain}
                </div>
                <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition line-clamp-1 mt-0.5">
                  {p.title}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Query Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Research Hypothesis or Epistemic Proposition:</span>
              <span>{query.length} chars</span>
            </div>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Does intermittent fasting activate sustained macroautophagy in human peripheral blood mononuclear cells without confounding caloric reduction?"
              rows={3}
              className="w-full rounded-xl bg-[#06080E]/90 border border-slate-700/80 focus:border-cyan-400 p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Domain:</span>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="text-xs font-mono bg-slate-900 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg focus:outline-none focus:border-cyan-400"
                >
                  <option value="Biotechnology & Aging">Biotechnology & Cellular Aging</option>
                  <option value="Quantum Computing">Quantum Computing & Physics</option>
                  <option value="Metabolic Pharmacology">Metabolic Pharmacology & Medicine</option>
                  <option value="Condensed Matter Physics">Condensed Matter Physics</option>
                  <option value="Artificial Intelligence">Artificial Intelligence & Cognition</option>
                  <option value="Macroeconomics & Policy">Macroeconomics & Complex Systems</option>
                </select>
              </div>

              {/* Model Selection Dropdown in Console */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">LLM Engine:</span>
                <ModelSelector
                  value={selectedModel}
                  onChange={onSelectModel}
                  compact
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLaunching || !query.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 shadow-lg shadow-cyan-400/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
            >
              {isLaunching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Launching Pipeline...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-black" />
                  <span>Launch Investigation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
