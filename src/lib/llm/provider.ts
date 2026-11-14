import {
  SharedLlmService,
  LlmCompletionOptions,
  LlmCompletionResult,
  GroqLlmProvider,
  GeminiLlmProvider,
  MockLlmProvider,
  LlmServiceStatus,
  ProviderStatusInfo,
} from "./llm-service";

export type {
  LlmCompletionOptions,
  LlmCompletionResult,
  LlmServiceStatus,
  ProviderStatusInfo,
};

export {
  SharedLlmService,
  GroqLlmProvider,
  GeminiLlmProvider,
  MockLlmProvider,
};

export interface LlmProvider {
  name: string;
  complete(options: LlmCompletionOptions): Promise<string>;
}

// Wrapper delegating to SharedLlmService
export class SharedLlmProviderWrapper implements LlmProvider {
  name = "ProofForge Shared LLM Service (Groq Primary -> Gemini Fallback)";

  async complete(options: LlmCompletionOptions): Promise<string> {
    const result = await SharedLlmService.complete(options);
    return result.text;
  }
}

// Factory function maintaining backward compatibility while routing to SharedLlmService
export function getLlmProvider(): LlmProvider {
  return new SharedLlmProviderWrapper();
}
