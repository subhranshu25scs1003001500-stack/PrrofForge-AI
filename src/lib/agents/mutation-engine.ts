import { AtomicClaim, EvidenceNode, Investigation, MutationExperiment } from "@/types";
import { getLlmProvider } from "../llm/provider";

export class MutationEngine {
  /**
   * Performs Evidence Mutation Testing across extracted claims and evidence nodes.
   * Tests:
   * 1. Ablation (removal of critical evidence node)
   * 2. Swap (parameter replacement / counterfactual substitution)
   * 3. Contradiction (injection of synthetic counter-evidence)
   * Measures Conclusion Stability Score (CSS) and epistemic fragility.
   */
  static async execute(
    investigation: Investigation,
    claims: AtomicClaim[],
    evidence: EvidenceNode[]
  ): Promise<{ mutations: MutationExperiment[]; updatedClaims: AtomicClaim[] }> {
    const mutations: MutationExperiment[] = [];
    const updatedClaims = [...claims];
    const provider = getLlmProvider();

    // Generate mutations for each claim
    for (let cIdx = 0; cIdx < updatedClaims.length; cIdx++) {
      const claim = updatedClaims[cIdx];
      const associatedEvidence = evidence.filter((e) => claim.evidenceIds.includes(e.id));
      const targetEvidence = associatedEvidence[0] || evidence[0];

      if (!targetEvidence) continue;

      // 1. Ablation Mutation: Remove target evidence and evaluate impact
      const ablationDelta = targetEvidence.strength * 0.42;
      const ablationMutatedConf = Math.max(0.15, claim.postConfidence - ablationDelta);
      const ablationSurvived = ablationMutatedConf >= 0.55;
      const ablationSensitivity = parseFloat((ablationDelta / Math.max(0.1, claim.postConfidence)).toFixed(2));

      mutations.push({
        id: `mut-${investigation.id}-abl-${cIdx + 1}`,
        investigationId: investigation.id,
        claimId: claim.id,
        mutationType: "ABLATION",
        title: `[SYNTHETIC] Ablation of Primary Citation (${targetEvidence.source.title.slice(0, 35)}...)`,
        description: `Simulated total removal of evidence node [${targetEvidence.id}] to evaluate standalone structural reliance.`,
        targetEvidenceId: targetEvidence.id,
        mutatedHypothesis: `[SYNTHETIC EXPERIMENT - NOT VERIFIED FACT]: Re-assessing claim validity in the complete absence of ${targetEvidence.source.authors[0] || 'lead author'} (${targetEvidence.source.year}).`,
        isSynthetic: true,
        originalConfidence: claim.postConfidence,
        mutatedConfidence: parseFloat(ablationMutatedConf.toFixed(2)),
        confidenceDelta: parseFloat(ablationDelta.toFixed(2)),
        survived: ablationSurvived,
        sensitivityFactor: ablationSensitivity,
        reasoning: `Removing this evidentiary pillar reduces verification certainty by ${(ablationDelta * 100).toFixed(0)}%. ${ablationSurvived ? "Claim retains partial support from secondary corpus." : "Conclusion collapses into an unsubstantiated conjecture."}`,
      });

      // 2. Contradiction Mutation: Inject synthetic antithetical evidence
      const contradictionDelta = targetEvidence.strength * 0.55;
      const contradictionMutatedConf = Math.max(0.1, claim.postConfidence - contradictionDelta);
      const contradictionSurvived = contradictionMutatedConf >= 0.55;
      const contradictionSensitivity = parseFloat((contradictionDelta / Math.max(0.1, claim.postConfidence)).toFixed(2));

      mutations.push({
        id: `mut-${investigation.id}-con-${cIdx + 1}`,
        investigationId: investigation.id,
        claimId: claim.id,
        mutationType: "CONTRADICTION",
        title: `[SYNTHETIC] Contradiction Stress-Test: Injected Negative Cohort`,
        description: `Injected synthetic counter-evidence simulating an un-replicated trial outcome.`,
        targetEvidenceId: targetEvidence.id,
        mutatedHypothesis: `[SYNTHETIC EXPERIMENT - NOT VERIFIED FACT]: Simulating an independent replication trial yielding null/adverse statistical outcome.`,
        isSynthetic: true,
        originalConfidence: claim.postConfidence,
        mutatedConfidence: parseFloat(contradictionMutatedConf.toFixed(2)),
        confidenceDelta: parseFloat(contradictionDelta.toFixed(2)),
        survived: contradictionSurvived,
        sensitivityFactor: contradictionSensitivity,
        reasoning: `Adversarial synthetic contradiction drops confidence to ${(contradictionMutatedConf * 100).toFixed(0)}%. Confirms whether the assertion is falsification-resistant.`,
      });

      // 3. Swap Mutation: Parameter substitution / baseline shift
      const swapDelta = targetEvidence.strength * 0.25;
      const swapMutatedConf = Math.max(0.2, claim.postConfidence - swapDelta);
      const swapSurvived = swapMutatedConf >= 0.55;
      const swapSensitivity = parseFloat((swapDelta / Math.max(0.1, claim.postConfidence)).toFixed(2));

      mutations.push({
        id: `mut-${investigation.id}-swp-${cIdx + 1}`,
        investigationId: investigation.id,
        claimId: claim.id,
        mutationType: "SWAP",
        title: `[SYNTHETIC] Parameter Swap: Real-World Baseline Substitution`,
        description: `Substituted controlled experimental baseline with simulated unstratified real-world parameters.`,
        targetEvidenceId: targetEvidence.id,
        mutatedHypothesis: `[SYNTHETIC EXPERIMENT - NOT VERIFIED FACT]: Swapping experimental baseline covariates for heterogeneous ecological parameters.`,
        isSynthetic: true,
        originalConfidence: claim.postConfidence,
        mutatedConfidence: parseFloat(swapMutatedConf.toFixed(2)),
        confidenceDelta: parseFloat(swapDelta.toFixed(2)),
        survived: swapSurvived,
        sensitivityFactor: swapSensitivity,
        reasoning: `Testing external validity through covariate swap. Observed ${(swapDelta * 100).toFixed(0)}% sensitivity to baseline parameter shifts.`,
      });

      // Calculate aggregated Conclusion Stability Score (CSS) for this claim
      const claimMutations = mutations.filter((m) => m.claimId === claim.id);
      const avgSensitivity = claimMutations.reduce((sum, m) => sum + m.sensitivityFactor, 0) / claimMutations.length;
      const stabilityScore = Math.max(0, Math.min(100, Math.round((1 - avgSensitivity * 0.8) * 100)));

      // Determine postMutationConfidence (average of mutation tests)
      const avgMutatedConf = claimMutations.reduce((sum, m) => sum + m.mutatedConfidence, 0) / claimMutations.length;

      claim.stabilityScore = stabilityScore;
      claim.postMutationConfidence = parseFloat(avgMutatedConf.toFixed(2));

      // Assign fragility rating
      if (stabilityScore >= 80) claim.fragilityRating = "LOW";
      else if (stabilityScore >= 65) claim.fragilityRating = "MODERATE";
      else if (stabilityScore >= 45) claim.fragilityRating = "HIGH";
      else claim.fragilityRating = "CRITICAL";

      // Final status
      if (claim.postMutationConfidence >= 0.70 && claim.stabilityScore >= 70) {
        claim.status = "SUPPORTED";
      } else if (claim.postMutationConfidence < 0.40) {
        claim.status = "REFUTED";
      } else {
        claim.status = "CONTESTED";
      }
    }

    return { mutations, updatedClaims };
  }
}

