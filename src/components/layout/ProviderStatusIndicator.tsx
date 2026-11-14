import React, { useState, useEffect } from "react";
import { Cpu, Zap, ShieldCheck, ChevronDown, RefreshCw, AlertTriangle, CheckCircle2, Play, Activity } from "lucide-react";
import { LlmServiceStatus } from "@/lib/llm/llm-service";

export function ProviderStatusIndicator() {
  const [status, setStatus] = useState<LlmServiceStatus | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/llm/status");
      const data = await res.json();
      if (data.success) {
        setStatus(data.status);
      }
    } catch (err) {
      console.warn("Could not fetch LLM status:", err);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Poll every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRunDiagnostic = async (provider = "auto") => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/llm/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferredProvider: provider }),
      });
      const data = await res.json();
      setTestResult(data.result);
      fetchStatus();
    } catch (err: any) {
      setTestResult({ error: err.message });
    } finally {
      setIsTesting(false);
    }
  };

  const isGroqActive = status?.primary.isConfigured;
  const isGeminiActive = status?.fallback.isConfigured;

  return (
    <div className="relative">
      {/* Trigger Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-cyan-500/50 transition-all text-xs font-mono shadow-md"
        title="View Server-Side LLM Provider Health & Failover Architecture"
      >
        <div className="relative flex items-center justify-center">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span
            className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${
              isGroqActive ? "bg-cyan-400 animate-ping" : isGeminiActive ? "bg-violet-400 animate-ping" : "bg-emerald-400"
            }`}
          />
        </div>

        <div className="flex items-center gap-1.5 text-slate-200">
          <span className="font-semibold text-[11px]">
            {isGroqActive ? (
              <span className="text-cyan-300">Groq Primary</span>
            ) : isGeminiActive ? (
              <span className="text-violet-300">Gemini Active</span>
            ) : (
              <span className="text-slate-300">Mock Engine</span>
            )}
          </span>
          <span className="text-[10px] text-slate-400 hidden md:inline">
            {isGroqActive ? "→ Gemini Fallback" : "(Zero-Cost)"}
          </span>
        </div>

        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-84 sm:w-96 rounded-2xl glass-panel-glow border border-slate-700 bg-[#0B0F19]/95 backdrop-blur-2xl shadow-2xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                Shared LLM Provider Architecture
              </span>
            </div>
            <button
              onClick={fetchStatus}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
              title="Refresh provider status"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>

          {/* Primary & Fallback Pipeline */}
          <div className="space-y-2.5 text-xs font-mono">
            {/* Primary: Groq */}
            <div className={`p-3 rounded-xl border ${isGroqActive ? "bg-cyan-950/30 border-cyan-500/40" : "bg-slate-900/60 border-slate-800"}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  Primary: Groq
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold ${isGroqActive ? "bg-cyan-950 text-cyan-300 border border-cyan-700/50" : "bg-slate-800 text-slate-400"}`}>
                  {isGroqActive ? "Configured" : "No Key Set"}
                </span>
              </div>
              <div className="text-[11px] text-slate-300">
                Model: <span className="font-semibold text-slate-100">{status?.primary.defaultModel || "llama-3.3-70b-versatile"}</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Key: {status?.primary.maskedKey || "Not in environment (falling back)"}
              </div>
            </div>

            {/* Fallback: Gemini */}
            <div className={`p-3 rounded-xl border ${isGeminiActive ? "bg-violet-950/30 border-violet-500/40" : "bg-slate-900/60 border-slate-800"}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-violet-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-violet-400" />
                  Fallback: Google Gemini
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold ${isGeminiActive ? "bg-violet-950 text-violet-300 border border-violet-700/50" : "bg-slate-800 text-slate-400"}`}>
                  {isGeminiActive ? "Configured" : "No Key Set"}
                </span>
              </div>
              <div className="text-[11px] text-slate-300">
                Model: <span className="font-semibold text-slate-100">{status?.fallback.defaultModel || "gemini-1.5-flash"}</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Key: {status?.fallback.maskedKey || "Not in environment (using mock)"}
              </div>
            </div>
          </div>

          {/* Failover & Reliability Rules */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Timeout:</span>
              <span className="text-slate-200">{status?.timeoutMs ?? 12000}ms</span>
            </div>
            <div className="flex justify-between">
              <span>Bounded Retries:</span>
              <span className="text-slate-200">{status?.maxRetries ?? 2} attempts (exp backoff)</span>
            </div>
            <div className="flex justify-between">
              <span>Failover Events:</span>
              <span className="text-amber-300 font-bold">{status?.failoverCount ?? 0}</span>
            </div>
          </div>

          {/* Test Trigger */}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => handleRunDiagnostic("auto")}
              disabled={isTesting}
              className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-xs font-mono font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 transition disabled:opacity-50"
            >
              {isTesting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
              <span>{isTesting ? "Testing LLM Engine..." : "Test Groq / Gemini Pipeline"}</span>
            </button>

            {testResult && (
              <div className="mt-3 p-2.5 rounded-xl bg-black/60 border border-slate-800 font-mono text-[10px] space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Provider Used: <strong className="text-cyan-300">{testResult.providerUsed}</strong></span>
                  <span>{testResult.latencyMs}ms</span>
                </div>
                <div className="text-slate-300 line-clamp-3">
                  &ldquo;{testResult.text || testResult.error}&rdquo;
                </div>
                {testResult.failoverOccurred && (
                  <div className="text-amber-400 text-[9px]">
                    Failover: {testResult.failoverReason}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

