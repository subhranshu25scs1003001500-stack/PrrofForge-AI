import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { SharedLlmService, GroqLlmProvider, GeminiLlmProvider } from "../llm/llm-service";

describe("SharedLlmService (Groq Primary -> Gemini Fallback)", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("safely reports status without leaking full API keys", () => {
    process.env.GROQ_API_KEY = "gsk_1234567890abcdef";
    process.env.GEMINI_API_KEY = "AIzaSy1234567890abcdef";

    const status = SharedLlmService.getStatus();
    expect(status.primary.isConfigured).toBe(true);
    expect(status.fallback.isConfigured).toBe(true);
    expect(status.primary.maskedKey).toBe("gsk_...cdef");
    expect(status.fallback.maskedKey).toBe("AIza...cdef");
    expect(status.activeMode).toBe("groq-primary-gemini-fallback");
  });

  it("falls back to Mock Engine when neither Groq nor Gemini keys are set", async () => {
    delete process.env.GROQ_API_KEY;
    delete process.env.GEMINI_API_KEY;
    delete process.env.GOOGLE_API_KEY;

    const result = await SharedLlmService.complete({
      systemPrompt: "You are an agent.",
      userPrompt: "Test hypothesis",
      jsonMode: true,
    });

    expect(result.providerUsed).toBe("mock");
    expect(result.text).toBeDefined();
    expect(result.latencyMs).toBeGreaterThan(0);
  });

  it("executes Groq primary when GROQ_API_KEY is configured", async () => {
    process.env.GROQ_API_KEY = "gsk_mock_valid_key";

    // Mock fetch for Groq API
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: "Groq response: hypothesis supported" } }],
      }),
    });
    global.fetch = mockFetch;

    const result = await SharedLlmService.complete({
      systemPrompt: "Research prompt",
      userPrompt: "Investigate telomerase",
      model: "llama-3.3-70b-versatile",
    });

    expect(result.providerUsed).toBe("groq");
    expect(result.text).toBe("Groq response: hypothesis supported");
    expect(result.failoverOccurred).toBe(false);

    // Verify fetch was called with Groq endpoint and bearer token
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.groq.com/openai/v1/chat/completions",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer gsk_mock_valid_key",
        }),
      })
    );
  });

  it("automatically fails over to Gemini when Groq returns 429 Rate Limit", async () => {
    process.env.GROQ_API_KEY = "gsk_mock_key";
    process.env.GEMINI_API_KEY = "AIza_mock_key";

    // Mock fetch: first calls to Groq return 429 rate limit, then Gemini call succeeds
    const mockFetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes("api.groq.com")) {
        return {
          ok: false,
          status: 429,
          text: async () => "Rate limit reached for model llama-3.3-70b-versatile",
        };
      }
      if (url.includes("generativelanguage.googleapis.com")) {
        return {
          ok: true,
          json: async () => ({
            candidates: [
              {
                content: {
                  parts: [{ text: "Gemini fallback response: empirical verified" }],
                },
              },
            ],
          }),
        };
      }
      throw new Error(`Unexpected URL: ${url}`);
    });
    global.fetch = mockFetch;

    const result = await SharedLlmService.complete({
      systemPrompt: "Skeptic audit",
      userPrompt: "Audit correlation",
    });

    expect(result.providerUsed).toBe("gemini");
    expect(result.text).toBe("Gemini fallback response: empirical verified");
    expect(result.failoverOccurred).toBe(true);
    expect(result.failoverReason).toContain("Groq primary failed");
  });

  it("routes directly to Gemini when requested via model prefix", async () => {
    process.env.GROQ_API_KEY = "gsk_mock_key";
    process.env.GEMINI_API_KEY = "AIza_mock_key";

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: "Direct Gemini 1.5 Pro result" }] } }],
      }),
    });
    global.fetch = mockFetch;

    const result = await SharedLlmService.complete({
      systemPrompt: "Research prompt",
      userPrompt: "Extract claims",
      model: "gemini:gemini-1.5-pro",
    });

    expect(result.providerUsed).toBe("gemini");
    expect(result.text).toBe("Direct Gemini 1.5 Pro result");
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("gemini-1.5-pro"),
      expect.any(Object)
    );
  });
});

