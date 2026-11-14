import React from "react";
import { X, ShieldCheck, Dna, Server, Cpu, Database, Check } from "lucide-react";

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DocsModal({ isOpen, onClose }: DocsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl glass-panel-glow border border-cyan-500/40 bg-[#0B0F19] p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-semibold text-slate-100">
              ProofForge AI: System Architecture & Vercel Specification
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Core Novelty */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-violet-300">
            <Dna className="w-4 h-4 text-violet-400" />
            <span>The Novelty: Evidence Mutation Testing</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Inspired by mutation testing in software engineering, ProofForge does not stop at surface-level citation matching. It subjects assertions to 3 distinct perturbation vectors:
          </p>
          <ul className="text-xs text-slate-400 space-y-1 font-mono pl-3 list-disc">
            <li><strong className="text-cyan-300">Ablation Testing:</strong> Deletes primary supporting citations to measure structural dependency.</li>
            <li><strong className="text-violet-300">Parameter Swapping:</strong> Replaces controlled experimental covariates with heterogeneous real-world parameters.</li>
            <li><strong className="text-amber-300">Contradiction Injection:</strong> Injects synthetic counterfactual antitheses to test confirmation bias.</li>
          </ul>
          <div className="p-2.5 rounded-lg bg-violet-950/40 border border-violet-500/30 text-[11px] font-mono text-violet-300">
            <strong>Safety Mandate:</strong> All synthetic mutations are explicitly labeled and never presented as verified empirical facts.
          </div>
        </div>

        {/* 2. Vercel Serverless Bounded Step Architecture */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-cyan-300">
            <Server className="w-4 h-4 text-cyan-400" />
            <span>Vercel Serverless Bounded Step Engine</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            To eliminate serverless execution timeouts (10s free / 60s pro), ProofForge rejects long monolithic agent loops. Instead, each stage is executed as a discrete, bounded serverless step:
          </p>
          <div className="p-3 rounded-xl bg-black/60 border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
            <div>POST /api/investigations &rarr; Creates investigation in CREATED state</div>
            <div>POST /api/investigations/:id/step &rarr; Executes bounded step (1-2s latency)</div>
            <div>Step 1: Research Agent &bull; Step 2: Claim Agent &bull; Step 3: Skeptic Agent &bull; Step 4: Mutation Engine &bull; Step 5: Verifier Synthesis</div>
          </div>
        </div>

        {/* 3. Persistence & Fallback */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Persistence & Zero-Config Fallback</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            ProofForge includes a dual-mode Storage Adapter. When <code className="text-cyan-300">NEXT_PUBLIC_SUPABASE_URL</code> is configured, it persists to PostgreSQL. When keys are not set, it operates with zero configuration using resilient in-memory storage, ensuring 100% turnkey testing without requiring paid third-party accounts.
          </p>
        </div>

        {/* 4. Supported LLM Providers: Groq & Gemini Architecture */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-cyan-300">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Shared Server-Side LLM Service (Groq Primary &rarr; Gemini Fallback)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            ProofForge AI implements a fault-tolerant multi-provider LLM pipeline:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-slate-200">
              <span className="text-cyan-400 font-bold block uppercase">Primary: Groq</span>
              <span className="text-[11px] text-slate-300">Llama 3.3 70B &bull; Llama 3.1 8B</span>
              <span className="text-[10px] text-slate-400 block mt-1">High-throughput sub-second responses</span>
            </div>
            <div className="p-3 rounded-xl bg-violet-950/40 border border-violet-500/40 text-slate-200">
              <span className="text-violet-400 font-bold block uppercase">Fallback: Gemini</span>
              <span className="text-[11px] text-slate-300">Gemini 1.5 Flash &bull; 1.5 Pro</span>
              <span className="text-[10px] text-slate-400 block mt-1">Automatic cascade on Groq 429/timeout</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200">
              <span className="text-emerald-400 font-bold block uppercase">Safety: Mock Engine</span>
              <span className="text-[11px] text-slate-300">Deterministic Corpus</span>
              <span className="text-[10px] text-slate-400 block mt-1">Zero-cost offline verification</span>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-black/60 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
            <div><strong className="text-cyan-300">Bounded Retries:</strong> 2 retries with exponential backoff &amp; jitter before cascading.</div>
            <div><strong className="text-cyan-300">Rate-Limit &amp; Timeout:</strong> AbortController with configurable 12s timeout &amp; 429 detection.</div>
            <div><strong className="text-cyan-300">Security:</strong> API keys (GROQ_API_KEY, GEMINI_API_KEY) are kept strictly server-side.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

