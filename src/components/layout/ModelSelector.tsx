import React from "react";
import { Cpu, Sparkles } from "lucide-react";

export interface ModelOption {
  id: string;
  label: string;
  provider: "groq" | "gemini" | "mock" | "auto";
  badge: string;
}

export const MODEL_OPTIONS: ModelOption[] = [
  {
    id: "auto",
    label: "Auto: Groq Primary → Gemini Fallback",
    provider: "auto",
    badge: "Recommended",
  },
  {
    id: "groq:llama-3.3-70b-versatile",
    label: "Groq: Llama 3.3 70B Versatile",
    provider: "groq",
    badge: "Fast & Deep",
  },
  {
    id: "groq:llama-3.1-8b-instant",
    label: "Groq: Llama 3.1 8B Instant",
    provider: "groq",
    badge: "Ultra-Fast",
  },
  {
    id: "gemini:gemini-1.5-flash",
    label: "Gemini: 1.5 Flash",
    provider: "gemini",
    badge: "Balanced",
  },
  {
    id: "gemini:gemini-1.5-pro",
    label: "Gemini: 1.5 Pro",
    provider: "gemini",
    badge: "High Reasoning",
  },
  {
    id: "mock:default",
    label: "Mock Engine (Deterministic)",
    provider: "mock",
    badge: "Zero-Cost",
  },
];

interface ModelSelectorProps {
  value: string;
  onChange: (modelId: string) => void;
  className?: string;
  compact?: boolean;
}

export function ModelSelector({ value, onChange, className = "", compact = false }: ModelSelectorProps) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`bg-slate-900 border border-slate-700/80 hover:border-cyan-500/50 text-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-400 font-mono transition cursor-pointer appearance-none ${
          compact ? "text-[11px] px-3 py-1.5 pr-8" : "text-xs px-3.5 py-2 pr-8"
        }`}
      >
        {MODEL_OPTIONS.map((opt) => (
          <option key={opt.id} value={opt.id} className="bg-[#0D1322] text-slate-200">
            {opt.label} ({opt.badge})
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
        <Cpu className="w-3.5 h-3.5 text-cyan-400" />
      </div>
    </div>
  );
}

