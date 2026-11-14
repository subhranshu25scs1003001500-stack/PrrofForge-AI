import { AgentLog, AgentRole, Investigation, InvestigationStage } from "@/types";
import { StorageAdapter } from "../storage/adapter";
import { ResearchAgent } from "./researcher";
import { ClaimAgent } from "./claim-extractor";
import { SkepticAgent } from "./skeptic";
import { MutationEngine } from "./mutation-engine";
import { VerifierAgent } from "./verifier";

export class InvestigationOrchestrator {
  static async createInvestigation(
    query: string,
    domain = "General Scientific & Empirical",
    selectedModel = "auto"
  ): Promise<Investigation> {
    const id = `inv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const investigation: Investigation = {
      id,
      query,
      domain,
      selectedModel,
      stage: "CREATED",
      currentStepIndex: 0,
      totalSteps: 5,
      claims: [],
      evidence: [],
      critiques: [],
      mutations: [],
      logs: [
        {
          id: `log-${Date.now()}-0`,
          timestamp: new Date().toISOString(),
          role: "ORCHESTRATOR",
          stage: "CREATED",
          message: `Investigation registered with model preference "${selectedModel}": "${query.slice(0, 80)}...". Ready for bounded step execution.`,
          type: "info",
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return await StorageAdapter.saveInvestigation(investigation);
  }

  /**
   * Executes exactly ONE bounded step in the investigation pipeline.
   * Prevents serverless timeout and enables live interactive UI progression.
   */
  static async executeNextStep(investigationId: string): Promise<Investigation> {
    const investigation = await StorageAdapter.getInvestigation(investigationId);
    if (!investigation) {
      throw new Error(`Investigation ${investigationId} not found`);
    }

    if (investigation.stage === "COMPLETED") {
      return investigation;
    }

    const startTime = Date.now();

    switch (investigation.stage) {
      case "CREATED": {
        // Step 1: Research Agent
        investigation.stage = "RESEARCHING";
        const evidence = await ResearchAgent.execute(investigation);
        investigation.evidence = evidence;
        investigation.currentStepIndex = 1;

        const durationMs = Date.now() - startTime;
        investigation.logs.push({
          id: `log-${Date.now()}-1`,
          timestamp: new Date().toISOString(),
          role: "RESEARCHER",
          stage: "RESEARCHING",
          message: `Retrieved ${evidence.length} empirical evidence sources with methodology and credibility scores.`,
          type: "success",
          durationMs,
        });
        break;
      }

      case "RESEARCHING": {
        // Step 2: Claim Agent
        investigation.stage = "EXTRACTING_CLAIMS";
        const claims = await ClaimAgent.execute(investigation, investigation.evidence);
        investigation.claims = claims;
        investigation.currentStepIndex = 2;

        const durationMs = Date.now() - startTime;
        investigation.logs.push({
          id: `log-${Date.now()}-2`,
          timestamp: new Date().toISOString(),
          role: "CLAIM_EXTRACTOR",
          stage: "EXTRACTING_CLAIMS",
          message: `Decomposed hypothesis into ${claims.length} atomic verifiable claims.`,
          type: "info",
          durationMs,
        });
        break;
      }

      case "EXTRACTING_CLAIMS": {
        // Step 3: Skeptic Agent
        investigation.stage = "SKEPTIC_AUDIT";
        const { critiques, updatedClaims } = await SkepticAgent.execute(
          investigation,
          investigation.claims,
          investigation.evidence
        );
        investigation.critiques = critiques;
        investigation.claims = updatedClaims;
        investigation.currentStepIndex = 3;

        const durationMs = Date.now() - startTime;
        investigation.logs.push({
          id: `log-${Date.now()}-3`,
          timestamp: new Date().toISOString(),
          role: "SKEPTIC",
          stage: "SKEPTIC_AUDIT",
          message: `Adversarial audit completed: lodged ${critiques.length} methodological challenges and fallacy detections.`,
          type: "warning",
          durationMs,
        });
        break;
      }

      case "SKEPTIC_AUDIT": {
        // Step 4: Mutation Engine (Novelty)
        investigation.stage = "MUTATION_TESTING";
        const { mutations, updatedClaims } = await MutationEngine.execute(
          investigation,
          investigation.claims,
          investigation.evidence
        );
        investigation.mutations = mutations;
        investigation.claims = updatedClaims;
        investigation.currentStepIndex = 4;

        const durationMs = Date.now() - startTime;
        investigation.logs.push({
          id: `log-${Date.now()}-4`,
          timestamp: new Date().toISOString(),
          role: "MUTATION_ENGINE",
          stage: "MUTATION_TESTING",
          message: `Executed ${mutations.length} evidence mutations (Ablation, Contradiction, Swap). Conclusion Stability calculated.`,
          type: "warning",
          durationMs,
        });
        break;
      }

      case "MUTATION_TESTING": {
        // Step 5: Synthesis / Verifier
        investigation.stage = "SYNTHESIZING";
        const synthesis = await VerifierAgent.execute(investigation);
        investigation.verdict = synthesis.verdict;
        investigation.summary = synthesis.summary;
        investigation.executiveReport = synthesis.executiveReport;
        investigation.metrics = synthesis.metrics;
        investigation.baselineComparison = synthesis.baselineComparison;
        investigation.currentStepIndex = 5;
        investigation.stage = "COMPLETED";
        investigation.completedAt = new Date().toISOString();

        const durationMs = Date.now() - startTime;
        investigation.logs.push({
          id: `log-${Date.now()}-5`,
          timestamp: new Date().toISOString(),
          role: "VERIFIER",
          stage: "COMPLETED",
          message: `Final dossier synthesized. Epistemic Verdict: ${synthesis.verdict} (CSI: ${synthesis.metrics.conclusionStabilityIndex}%).`,
          type: "success",
          durationMs,
        });
        break;
      }

      default:
        break;
    }

    return await StorageAdapter.saveInvestigation(investigation);
  }
}

