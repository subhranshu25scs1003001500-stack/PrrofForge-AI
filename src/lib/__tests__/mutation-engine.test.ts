import { describe, it, expect } from "vitest";
import { MutationEngine } from "../agents/mutation-engine";
import { AtomicClaim, EvidenceNode, Investigation } from "@/types";

describe("MutationEngine (Novelty Verification)", () => {
  const mockInvestigation: Investigation = {
    id: "test-inv",
    query: "Does daily intermittent fasting induce sustained cellular autophagy in humans?",
    domain: "Metabolic Biology",
    stage: "EXTRACTING_CLAIMS",
    currentStepIndex: 2,
    totalSteps: 5,
    claims: [],
    evidence: [],
    critiques: [],
    mutations: [],
    logs: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockEvidence: EvidenceNode = {
    id: "ev-test-1",
    investigationId: "test-inv",
    source: {
      id: "src-test-1",
      title: "Markers of autophagy in human peripheral blood mononuclear cells during 24h fasting",
      authors: ["Stekovic, S.", "Madeo, F."],
      year: 2021,
      publication: "Cell Metabolism",
      credibilityScore: 0.95,
      sampleSize: 120,
      isPeerReviewed: true,
      isSynthetic: false,
    },
    snippet: "LC3-II to LC3-I conversion ratio increased 2.3-fold following 24 hours of nutrient deprivation.",
    relevanceScore: 0.95,
    supportsClaim: true,
    strength: 0.9,
    tags: ["autophagy", "fasting"],
    createdAt: new Date().toISOString(),
  };

  const mockClaim: AtomicClaim = {
    id: "c-test-1",
    investigationId: "test-inv",
    statement: "A 24-hour fast doubles systemic LC3B-II autophagic flux markers in human PBMCs.",
    category: "empirical",
    priorConfidence: 0.85,
    postConfidence: 0.85,
    postMutationConfidence: 0.85,
    status: "SUPPORTED",
    evidenceIds: ["ev-test-1"],
    skepticCritiqueIds: [],
    stabilityScore: 100,
    fragilityRating: "LOW",
  };

  it("executes Ablation, Contradiction, and Swap mutations", async () => {
    const { mutations, updatedClaims } = await MutationEngine.execute(
      mockInvestigation,
      [mockClaim],
      [mockEvidence]
    );

    // Verify all 3 mutation types generated
    expect(mutations.length).toBe(3);
    const mutationTypes = mutations.map((m) => m.mutationType);
    expect(mutationTypes).toContain("ABLATION");
    expect(mutationTypes).toContain("CONTRADICTION");
    expect(mutationTypes).toContain("SWAP");

    // Check novelty rule: synthetic experiments must be clearly labeled!
    for (const m of mutations) {
      expect(m.isSynthetic).toBe(true);
      expect(m.mutatedHypothesis).toContain("[SYNTHETIC");
      expect(m.mutatedConfidence).toBeLessThan(m.originalConfidence);
      expect(m.confidenceDelta).toBeGreaterThan(0);
    }

    // Check Conclusion Stability Score calculation
    const updated = updatedClaims[0];
    expect(updated.stabilityScore).toBeGreaterThanOrEqual(0);
    expect(updated.stabilityScore).toBeLessThanOrEqual(100);
    expect(["LOW", "MODERATE", "HIGH", "CRITICAL"]).toContain(updated.fragilityRating);
  });
});

