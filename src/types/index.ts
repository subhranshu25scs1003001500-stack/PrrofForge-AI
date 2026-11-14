export type AgentRole = 
  | "ORCHESTRATOR"
  | "RESEARCHER"
  | "CLAIM_EXTRACTOR"
  | "SKEPTIC"
  | "MUTATION_ENGINE"
  | "VERIFIER";

export type InvestigationStage =
  | "CREATED"
  | "RESEARCHING"
  | "EXTRACTING_CLAIMS"
  | "SKEPTIC_AUDIT"
  | "MUTATION_TESTING"
  | "SYNTHESIZING"
  | "COMPLETED"
  | "FAILED";

export type ClaimCategory = "empirical" | "statistical" | "causal" | "definitional" | "predictive";

export type VerificationVerdict = 
  | "ROBUST_VERIFIED"
  | "EMPIRICALLY_FRAGILE"
  | "CONTRADICTED"
  | "INSUFFICIENT_DATA";

export type MutationType = "ABLATION" | "SWAP" | "CONTRADICTION";

export interface EvidenceSource {
  id: string;
  title: string;
  authors: string[];
  year: number;
  publication: string;
  url?: string;
  doi?: string;
  credibilityScore: number; // 0.0 - 1.0
  sampleSize?: number;
  methodology?: string;
  isPeerReviewed: boolean;
  isSynthetic: boolean; // MUST be true for simulated mutations
}

export interface EvidenceNode {
  id: string;
  investigationId: string;
  claimId?: string;
  source: EvidenceSource;
  snippet: string;
  relevanceScore: number; // 0.0 - 1.0
  supportsClaim: boolean; // true = supports, false = counters
  strength: number; // 0.0 - 1.0
  tags: string[];
  createdAt: string;
}

export interface AtomicClaim {
  id: string;
  investigationId: string;
  statement: string;
  category: ClaimCategory;
  priorConfidence: number; // Initial assessed probability (0.0 - 1.0)
  postConfidence: number; // Confidence after evidence & skeptic (0.0 - 1.0)
  postMutationConfidence: number; // Confidence after evidence mutation stress tests (0.0 - 1.0)
  status: "PENDING" | "SUPPORTED" | "CONTESTED" | "REFUTED";
  evidenceIds: string[];
  skepticCritiqueIds: string[];
  stabilityScore: number; // 0 - 100% conclusion stability
  fragilityRating: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  notes?: string;
}

export interface SkepticCritique {
  id: string;
  claimId: string;
  challengerAgent: string;
  fallacyType: 
    | "SELECTION_BIAS"
    | "CORRELATION_VS_CAUSATION"
    | "SMALL_SAMPLE_SIZE"
    | "SURVIVORSHIP_BIAS"
    | "CONFIRMATION_BIAS"
    | "SPURIOUS_RELATIONSHIP"
    | "MEASUREMENT_ERROR";
  critiqueText: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  suggestedStressTest: string;
  counterEvidenceProposed?: string;
}

export interface MutationExperiment {
  id: string;
  investigationId: string;
  claimId: string;
  mutationType: MutationType;
  title: string;
  description: string;
  targetEvidenceId: string;
  mutatedHypothesis: string;
  isSynthetic: true; // Novelty rule: clearly labeled synthetic evidence
  originalConfidence: number;
  mutatedConfidence: number;
  confidenceDelta: number; // original - mutated
  survived: boolean; // true if claim still held despite mutation
  sensitivityFactor: number; // rate of collapse under mutation
  reasoning: string;
}

export interface AgentLog {
  id: string;
  timestamp: string;
  role: AgentRole;
  stage: InvestigationStage;
  message: string;
  type: "info" | "success" | "warning" | "error" | "telemetry";
  durationMs?: number;
  metadata?: Record<string, unknown>;
}

export interface EvaluationMetrics {
  conclusionStabilityIndex: number; // 0 - 100%
  overallConfidence: number; // 0 - 100%
  evidenceCoverage: number; // percentage of claims with empirical backing
  skepticChallengeDensity: number; // number of critiques per claim
  mutationResilienceScore: number; // 0 - 100% resistance to synthetic perturbations
  epistemicFragilityRisk: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  totalClaimsCount: number;
  verifiedClaimsCount: number;
  refutedClaimsCount: number;
  mutationsConducted: number;
}

export interface BaselineComparison {
  standardLlmResponse: {
    answer: string;
    modelName: string;
    hallucinationRisk: "HIGH" | "MEDIUM" | "LOW";
    unverifiedAssumptions: string[];
    citationAudit: "UNVERIFIED" | "PARTIALLY_VALIDATED";
    generationDurationMs: number;
  };
  proofForgeVerified: {
    answer: string;
    verdict: VerificationVerdict;
    stabilityScore: number;
    evidenceCount: number;
    mutationsApplied: number;
    auditTrailSummary: string;
    resilienceAdvantage: string;
  };
  metricsDelta: {
    stabilityImprovement: string;
    hallucinationReduction: string;
    unbackedClaimsCaught: number;
  };
}

export interface Investigation {
  id: string;
  query: string;
  domain: string;
  selectedModel?: string;
  stage: InvestigationStage;
  currentStepIndex: number;
  totalSteps: number;
  verdict?: VerificationVerdict;
  summary?: string;
  executiveReport?: string;
  claims: AtomicClaim[];
  evidence: EvidenceNode[];
  critiques: SkepticCritique[];
  mutations: MutationExperiment[];
  logs: AgentLog[];
  metrics?: EvaluationMetrics;
  baselineComparison?: BaselineComparison;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

