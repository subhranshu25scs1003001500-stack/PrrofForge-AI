export interface LlmCompletionOptions {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
  model?: string;
  preferredProvider?: "auto" | "groq" | "gemini" | "mock" | "openai" | "anthropic";
}

export interface LlmCompletionResult {
  text: string;
  providerUsed: "groq" | "gemini" | "mock" | "openai" | "anthropic";
  modelUsed: string;
  latencyMs: number;
  failoverOccurred: boolean;
  failoverReason?: string;
  attemptsCount: number;
}

export interface ProviderStatusInfo {
  name: string;
  providerId: string;
  isConfigured: boolean;
  defaultModel: string;
  maskedKey: string | null;
  role: "primary" | "fallback" | "alternative" | "mock";
}

export interface LlmServiceStatus {
  activeMode: string;
  primary: ProviderStatusInfo;
  fallback: ProviderStatusInfo;
  alternativeProviders: ProviderStatusInfo[];
  timeoutMs: number;
  maxRetries: number;
  totalRequests: number;
  failoverCount: number;
  lastFailover: {
    timestamp: string;
    from: string;
    to: string;
    reason: string;
  } | null;
}

function maskApiKey(key?: string): string | null {
  if (!key || key.length < 8) return null;
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
}

function isRateLimitError(status: number, message: string): boolean {
  if (status === 429) return true;
  const lower = message.toLowerCase();
  return (
    lower.includes("rate limit") ||
    lower.includes("rate_limit_exceeded") ||
    lower.includes("resource_exhausted") ||
    lower.includes("quota exceeded") ||
    lower.includes("too many requests")
  );
}

// 1. Mock Engine (Deterministic scientific generation fallback)
export class MockLlmProvider {
  name = "Mock Engine";
  providerId = "mock" as const;

  async complete(options: LlmCompletionOptions): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 60));
    const prompt = (options.userPrompt + " " + options.systemPrompt).toLowerCase();

    if (options.jsonMode) {
      if (prompt.includes("skeptic") || prompt.includes("adversarial") || prompt.includes("audit") || prompt.includes("fallac")) {
        return JSON.stringify({
          critiques: [
            {
              claimIndex: 0,
              challengerAgent: "Skeptic-Alpha (Methodology Auditor)",
              fallacyType: "SELECTION_BIAS",
              severity: "HIGH",
              critiqueText: "The reported statistical significance is largely observed under homogenous baseline screening criteria, risking external validity failure in unstratified populations.",
              suggestedStressTest: "Ablate primary homogenous cohort citation or inject heterogeneous synthetic demographic variances.",
              counterEvidenceProposed: "Independent non-stratified observational cohort."
            },
            {
              claimIndex: 1,
              challengerAgent: "Skeptic-Beta (Causal Inference Reviewer)",
              fallacyType: "CORRELATION_VS_CAUSATION",
              severity: "MEDIUM",
              critiqueText: "Observed outcomes correlate with the intervention, but latent confounding variables have not been fully isolated.",
              suggestedStressTest: "Swap mediator baseline variables to simulate unobserved confounders."
            }
          ]
        });
      }

      if (prompt.includes("extract") || prompt.includes("claim") || prompt.includes("atomic")) {
        return JSON.stringify({
          claims: [
            {
              statement: "Primary intervention produces statistically significant differentiation over placebo/control in multi-site cohorts.",
              category: "empirical",
              priorConfidence: 0.86,
              notes: "Derived from meta-analytic consensus."
            },
            {
              statement: "The observed effect is causally driven by primary target modulation rather than secondary systemic compensation.",
              category: "causal",
              priorConfidence: 0.78,
              notes: "Supported by mechanistic biomarker assays."
            },
            {
              statement: "The safety profile exhibits zero statistically elevated rate of adverse secondary events under nominal dosage.",
              category: "statistical",
              priorConfidence: 0.72,
              notes: "Sample power bounded at 80% detection threshold."
            }
          ]
        });
      }

      if (prompt.includes("research") || prompt.includes("evidence") || prompt.includes("source") || prompt.includes("citation")) {
        return JSON.stringify({
          sources: [
            {
              title: "Systematic Review and Meta-Analysis of Empirical Outcomes in Target Cohorts",
              authors: ["Vanderbilt, E.", "Kowalski, J.", "Zhang, W."],
              year: 2024,
              publication: "Journal of Empirical Research, 48(2):112-128",
              doi: "10.1016/j.jer.2024.01.004",
              url: "https://doi.org/10.1016/j.jer.2024.01.004",
              credibilityScore: 0.94,
              sampleSize: 1420,
              methodology: "Double-blind randomized multi-center evaluation",
              isPeerReviewed: true,
              snippet: "Direct intervention demonstrated statistically significant primary outcome improvement (p<0.001, Cohen's d=0.64) across multi-center cohorts.",
              supportsClaim: true,
              strength: 0.92,
              tags: ["meta-analysis", "primary-evidence", "replicated"]
            },
            {
              title: "Longitudinal Replicability and Confounder Sensitivity in Target Systems",
              authors: ["Sterling, M.", "O'Connor, T."],
              year: 2023,
              publication: "Annals of Scientific Verification, 19(4):301-315",
              doi: "10.1038/asv.2023.045",
              url: "https://doi.org/10.1038/asv.2023.045",
              credibilityScore: 0.89,
              sampleSize: 480,
              methodology: "Independent multi-cohort replication study",
              isPeerReviewed: true,
              snippet: "Secondary analysis revealed substantial sensitivity to baseline selection criteria, with effect attenuation in unstratified populations.",
              supportsClaim: false,
              strength: 0.85,
              tags: ["replication", "confounder-analysis"]
            }
          ]
        });
      }

      if (prompt.includes("mutation") || prompt.includes("perturbation")) {
        return JSON.stringify({
          mutations: [
            {
              mutationType: "ABLATION",
              title: "Ablation of Multi-Center Meta-Analysis Anchor Node",
              description: "Removed primary statistical pillar to test structural consensus reliance.",
              isSynthetic: true,
              mutatedConfidence: 0.54,
              survived: false,
              reasoning: "Without the meta-analysis, the evidentiary foundation disperses into small un-replicated studies, dropping confidence by 28%."
            },
            {
              mutationType: "CONTRADICTION",
              title: "Synthetic Antithesis: Unstratified Cohort Failure",
              description: "Injected synthetic non-replication findings simulating broad population variance.",
              isSynthetic: true,
              mutatedConfidence: 0.42,
              survived: false,
              reasoning: "Synthetic contradiction reveals high conclusion fragility when confounding covariates are varied."
            },
            {
              mutationType: "SWAP",
              title: "Parameter Swap: Effect Size Re-anchoring",
              description: "Substituted reported Cohen's d=0.64 with real-world registry baseline d=0.21.",
              isSynthetic: true,
              mutatedConfidence: 0.65,
              survived: true,
              reasoning: "The directional claim holds, but magnitude decreases significantly under real-world effect sizes."
            }
          ]
        });
      }

      return JSON.stringify({ status: "success", data: [] });
    }

    return "ProofForge Mock Engine analysis completed. Multi-agent evaluation verified.";
  }
}

// 2. Groq Primary Provider (Llama-3.3-70b-versatile, llama-3.1-8b-instant)
export class GroqLlmProvider {
  name = "Groq High-Speed Engine";
  providerId = "groq" as const;
  private apiKey: string;
  defaultModel: string;

  constructor(apiKey: string, defaultModel = process.env.GROQ_MODEL || "llama-3.3-70b-versatile") {
    this.apiKey = apiKey;
    this.defaultModel = defaultModel;
  }

  async complete(options: LlmCompletionOptions, timeoutMs = 12000): Promise<string> {
    const model = options.model || this.defaultModel;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: options.systemPrompt },
            { role: "user", content: options.userPrompt },
          ],
          temperature: options.temperature ?? 0.2,
          max_tokens: options.maxTokens ?? 2000,
          response_format: options.jsonMode ? { type: "json_object" } : undefined,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errText = await response.text();
        const err = new Error(`Groq API error [${response.status}]: ${errText}`);
        (err as any).status = response.status;
        (err as any).isRateLimit = isRateLimitError(response.status, errText);
        throw err;
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("Groq API returned an empty completion response");
      }
      return content;
    } catch (err: any) {
      if (err.name === "AbortError") {
        const timeoutErr = new Error(`Groq request timed out after ${timeoutMs}ms`);
        (timeoutErr as any).isTimeout = true;
        throw timeoutErr;
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }
}

// 3. Google Gemini Fallback Provider (gemini-1.5-flash, gemini-1.5-pro, gemini-2.0-flash)
export class GeminiLlmProvider {
  name = "Google Gemini Engine";
  providerId = "gemini" as const;
  private apiKey: string;
  defaultModel: string;

  constructor(apiKey: string, defaultModel = process.env.GEMINI_MODEL || "gemini-1.5-flash") {
    this.apiKey = apiKey;
    this.defaultModel = defaultModel;
  }

  async complete(options: LlmCompletionOptions, timeoutMs = 12000): Promise<string> {
    const model = options.model || this.defaultModel;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: options.systemPrompt }],
          },
          contents: [
            {
              parts: [{ text: options.userPrompt }],
            },
          ],
          generationConfig: {
            temperature: options.temperature ?? 0.2,
            maxOutputTokens: options.maxTokens ?? 2000,
            responseMimeType: options.jsonMode ? "application/json" : "text/plain",
          },
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errText = await response.text();
        const err = new Error(`Gemini API error [${response.status}]: ${errText}`);
        (err as any).status = response.status;
        (err as any).isRateLimit = isRateLimitError(response.status, errText);
        throw err;
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!content) {
        throw new Error("Gemini API returned an empty completion response");
      }
      return content;
    } catch (err: any) {
      if (err.name === "AbortError") {
        const timeoutErr = new Error(`Gemini request timed out after ${timeoutMs}ms`);
        (timeoutErr as any).isTimeout = true;
        throw timeoutErr;
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }
}

// 4. Shared Server-Side LLM Service with Bounded Retries & Failover
export class SharedLlmService {
  private static totalRequests = 0;
  private static failoverCount = 0;
  private static lastFailover: {
    timestamp: string;
    from: string;
    to: string;
    reason: string;
  } | null = null;

  private static getTimeoutMs(): number {
    const envVal = process.env.LLM_TIMEOUT_MS;
    return envVal ? parseInt(envVal, 10) : 12000;
  }

  private static getMaxRetries(): number {
    const envVal = process.env.LLM_MAX_RETRIES;
    return envVal ? parseInt(envVal, 10) : 2;
  }

  /**
   * Safe non-sensitive status report for UI and monitoring
   */
  static getStatus(): LlmServiceStatus {
    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    const primaryConfigured = Boolean(groqKey);
    const fallbackConfigured = Boolean(geminiKey);

    let activeMode = "mock-engine";
    if (primaryConfigured && fallbackConfigured) {
      activeMode = "groq-primary-gemini-fallback";
    } else if (primaryConfigured) {
      activeMode = "groq-only";
    } else if (fallbackConfigured) {
      activeMode = "gemini-only";
    }

    return {
      activeMode,
      primary: {
        name: "Groq",
        providerId: "groq",
        isConfigured: primaryConfigured,
        defaultModel: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        maskedKey: maskApiKey(groqKey),
        role: "primary",
      },
      fallback: {
        name: "Google Gemini",
        providerId: "gemini",
        isConfigured: fallbackConfigured,
        defaultModel: process.env.GEMINI_MODEL || "gemini-1.5-flash",
        maskedKey: maskApiKey(geminiKey),
        role: "fallback",
      },
      alternativeProviders: [
        {
          name: "OpenAI",
          providerId: "openai",
          isConfigured: Boolean(openaiKey),
          defaultModel: process.env.OPENAI_MODEL || "gpt-4o-mini",
          maskedKey: maskApiKey(openaiKey),
          role: "alternative",
        },
        {
          name: "Anthropic",
          providerId: "anthropic",
          isConfigured: Boolean(anthropicKey),
          defaultModel: process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022",
          maskedKey: maskApiKey(anthropicKey),
          role: "alternative",
        },
        {
          name: "Mock Engine",
          providerId: "mock",
          isConfigured: true,
          defaultModel: "deterministic-research-corpus",
          maskedKey: null,
          role: "mock",
        },
      ],
      timeoutMs: this.getTimeoutMs(),
      maxRetries: this.getMaxRetries(),
      totalRequests: this.totalRequests,
      failoverCount: this.failoverCount,
      lastFailover: this.lastFailover,
    };
  }

  /**
   * Main completion method:
   * 1. Attempts Primary (Groq) with bounded retries and exponential backoff
   * 2. Automatically cascades to Fallback (Gemini) on failure or rate-limit
   * 3. Cascades to Mock Engine if both fail or if keys are not set
   */
  static async complete(options: LlmCompletionOptions): Promise<LlmCompletionResult> {
    this.totalRequests++;
    const startTime = Date.now();
    const timeoutMs = this.getTimeoutMs();
    const maxRetries = this.getMaxRetries();

    // Parse model string if prefixed (e.g. "groq:llama-3.3-70b-versatile" or "gemini:gemini-1.5-flash")
    let targetProvider = options.preferredProvider || "auto";
    let targetModel = options.model;

    if (options.model) {
      if (options.model.startsWith("groq:")) {
        targetProvider = "groq";
        targetModel = options.model.replace("groq:", "");
      } else if (options.model.startsWith("gemini:")) {
        targetProvider = "gemini";
        targetModel = options.model.replace("gemini:", "");
      } else if (options.model === "mock" || options.model === "mock:default") {
        targetProvider = "mock";
        targetModel = "deterministic-research-corpus";
      }
    }

    const effectiveOptions: LlmCompletionOptions = {
      ...options,
      model: targetModel,
      preferredProvider: targetProvider,
    };

    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    let attemptsCount = 0;
    let failoverOccurred = false;
    let failoverReason: string | undefined;

    // Check if user specifically requested Mock mode or neither key is set
    if (targetProvider === "mock" || (!groqKey && !geminiKey)) {
      const mock = new MockLlmProvider();
      const text = await mock.complete(effectiveOptions);
      return {
        text,
        providerUsed: "mock",
        modelUsed: "deterministic-research-corpus",
        latencyMs: Date.now() - startTime,
        failoverOccurred: !groqKey && !geminiKey && targetProvider !== "mock",
        failoverReason: !groqKey && !geminiKey ? "No Groq or Gemini API keys configured; operating in zero-cost Mock Mode" : undefined,
        attemptsCount: 1,
      };
    }

    // Step A: Attempt Groq (Primary) if configured and not explicitly bypassed
    if (groqKey && targetProvider !== "gemini") {
      const groqProvider = new GroqLlmProvider(groqKey, targetModel);
      let groqAttempt = 0;
      let lastGroqError: any = null;

      while (groqAttempt <= maxRetries) {
        groqAttempt++;
        attemptsCount++;

        try {
          const text = await groqProvider.complete(effectiveOptions, timeoutMs);
          return {
            text,
            providerUsed: "groq",
            modelUsed: targetModel || groqProvider.defaultModel,
            latencyMs: Date.now() - startTime,
            failoverOccurred: false,
            attemptsCount,
          };
        } catch (err: any) {
          lastGroqError = err;
          const isRetryable = err.isRateLimit || err.isTimeout || (err.status && err.status >= 500);

          if (isRetryable && groqAttempt <= maxRetries) {
            // Exponential backoff with jitter: 200ms, 400ms...
            const delay = Math.min(2500, 200 * Math.pow(2, groqAttempt) + Math.random() * 100);
            await new Promise((r) => setTimeout(r, delay));
            continue;
          }
          break;
        }
      }

      // Groq failed after retries -> Prepare failover
      failoverOccurred = true;
      failoverReason = `Groq primary failed (${lastGroqError?.message || "error"}); falling back to Gemini.`;
      this.failoverCount++;
      this.lastFailover = {
        timestamp: new Date().toISOString(),
        from: "groq",
        to: "gemini",
        reason: lastGroqError?.message || "Unknown error",
      };
      console.warn(`[SharedLlmService] ${failoverReason}`);
    }

    // Step B: Attempt Gemini (Fallback)
    if (geminiKey) {
      const geminiProvider = new GeminiLlmProvider(geminiKey, targetModel);
      let geminiAttempt = 0;
      let lastGeminiError: any = null;

      while (geminiAttempt <= maxRetries) {
        geminiAttempt++;
        attemptsCount++;

        try {
          const text = await geminiProvider.complete(effectiveOptions, timeoutMs);
          return {
            text,
            providerUsed: "gemini",
            modelUsed: targetModel || geminiProvider.defaultModel,
            latencyMs: Date.now() - startTime,
            failoverOccurred,
            failoverReason,
            attemptsCount,
          };
        } catch (err: any) {
          lastGeminiError = err;
          const isRetryable = err.isRateLimit || err.isTimeout || (err.status && err.status >= 500);

          if (isRetryable && geminiAttempt <= maxRetries) {
            const delay = Math.min(2500, 250 * Math.pow(2, geminiAttempt) + Math.random() * 100);
            await new Promise((r) => setTimeout(r, delay));
            continue;
          }
          break;
        }
      }

      // Gemini also failed
      failoverOccurred = true;
      failoverReason = `Both Groq and Gemini failed; falling back to Mock Engine. Gemini error: ${lastGeminiError?.message}`;
      this.failoverCount++;
      this.lastFailover = {
        timestamp: new Date().toISOString(),
        from: "gemini",
        to: "mock",
        reason: lastGeminiError?.message || "Unknown error",
      };
      console.warn(`[SharedLlmService] ${failoverReason}`);
    }

    // Step C: Resilient Mock Engine Safety Net
    const mock = new MockLlmProvider();
    const text = await mock.complete(effectiveOptions);
    return {
      text,
      providerUsed: "mock",
      modelUsed: "deterministic-research-corpus",
      latencyMs: Date.now() - startTime,
      failoverOccurred: true,
      failoverReason: failoverReason || "Operating in zero-cost Mock Mode safety net",
      attemptsCount,
    };
  }
}
