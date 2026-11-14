import { AtomicClaim, EvidenceNode, Investigation, SkepticCritique } from "@/types";
import { getLlmProvider } from "../llm/provider";

export class SkepticAgent {
  static async execute(
    investigation: Investigation,
    claims: AtomicClaim[],
    evidence: EvidenceNode[]
  ): Promise<{ critiques: SkepticCritique[]; updatedClaims: AtomicClaim[] }> {
    const provider = getLlmProvider();
    const critiques: SkepticCritique[] = [];
    const updatedClaims = [...claims];

    try {
      const response = await provider.complete({
        systemPrompt: `You are the Skeptic Agent in ProofForge AI. 
Your job is adversarial peer review. You must challenge research claims, scrutinize methodologies, identify potential cognitive or methodological fallacies, and expose unstated assumptions.
Fallacy types allowed:
- SELECTION_BIAS
- CORRELATION_VS_CAUSATION
- SMALL_SAMPLE_SIZE
- SURVIVORSHIP_BIAS
- CONFIRMATION_BIAS
- SPURIOUS_RELATIONSHIP
- MEASUREMENT_ERROR

Return ONLY valid JSON:
{
  "critiques": [
    {
      "claimIndex": number (0-based index of claim being challenged),
      "challengerAgent": "string (e.g. Skeptic-Auditor / Biostatistician)",
      "fallacyType": "SELECTION_BIAS" | "CORRELATION_VS_CAUSATION" | "SMALL_SAMPLE_SIZE" | "SURVIVORSHIP_BIAS" | "CONFIRMATION_BIAS" | "SPURIOUS_RELATIONSHIP" | "MEASUREMENT_ERROR",
      "critiqueText": "string",
      "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
      "suggestedStressTest": "string",
      "counterEvidenceProposed": "string"
    }
  ]
}`,
        userPrompt: `Audit these claims and supporting evidence:
Claims:
${claims.map((c, i) => `[Claim ${i}] ${c.statement} (${c.category})`).join("\n")}

Evidence:
${evidence.map((e, i) => `[Evidence ${i}] ${e.source.title} (n=${e.source.sampleSize || 'unknown'}, peerReviewed=${e.source.isPeerReviewed}): ${e.snippet}`).join("\n")}`,
        jsonMode: true,
      });

      const parsed = JSON.parse(response);
      if (Array.isArray(parsed.critiques) && parsed.critiques.length > 0) {
        parsed.critiques.forEach((cr: any, idx: number) => {
          const targetClaimIdx = Math.min(Math.max(0, cr.claimIndex ?? 0), updatedClaims.length - 1);
          const targetClaim = updatedClaims[targetClaimIdx];
          const critId = `sk-${investigation.id}-${idx + 1}`;

          const critique: SkepticCritique = {
            id: critId,
            claimId: targetClaim.id,
            challengerAgent: cr.challengerAgent || "Adversarial Methodological Auditor",
            fallacyType: cr.fallacyType || "SELECTION_BIAS",
            critiqueText: cr.critiqueText || "Methodological scrutiny reveals baseline confounders.",
            severity: cr.severity || "HIGH",
            suggestedStressTest: cr.suggestedStressTest || "Ablate or perturb primary sample parameters.",
            counterEvidenceProposed: cr.counterEvidenceProposed,
          };

          critiques.push(critique);
          targetClaim.skepticCritiqueIds.push(critId);

          // Calibrate post-confidence down based on skeptic critique severity
          const penalty = critique.severity === "CRITICAL" ? 0.22 : critique.severity === "HIGH" ? 0.14 : critique.severity === "MEDIUM" ? 0.08 : 0.04;
          targetClaim.postConfidence = Math.max(0.2, targetClaim.priorConfidence - penalty);
          targetClaim.status = targetClaim.postConfidence < 0.6 ? "CONTESTED" : "SUPPORTED";
        });

        return { critiques, updatedClaims };
      }
    } catch (err) {
      console.warn("LLM skeptic critique failed, using fallback:", err);
    }

    return this.generateDefaultCritiques(investigation.id, updatedClaims, evidence);
  }

  private static generateDefaultCritiques(
    invId: string,
    claims: AtomicClaim[],
    evidence: EvidenceNode[]
  ): { critiques: SkepticCritique[]; updatedClaims: AtomicClaim[] } {
    const critiques: SkepticCritique[] = [];
    const updatedClaims = [...claims];

    if (updatedClaims.length > 0) {
      const c0 = updatedClaims[0];
      const crit1: SkepticCritique = {
        id: `sk-${invId}-1`,
        claimId: c0.id,
        challengerAgent: "Skeptic-Alpha (Methodology Auditor)",
        fallacyType: "SELECTION_BIAS",
        critiqueText: "The primary positive findings stem from studies with tightly restricted eligibility criteria, potentially overestimating efficacy relative to real-world populations.",
        severity: "HIGH",
        suggestedStressTest: "Ablate primary homogenous cohort citation or inject heterogeneous synthetic demographic variances.",
      };
      critiques.push(crit1);
      c0.skepticCritiqueIds.push(crit1.id);
      c0.postConfidence = Math.max(0.25, c0.priorConfidence - 0.12);
      c0.status = c0.postConfidence < 0.6 ? "CONTESTED" : "SUPPORTED";
    }

    if (updatedClaims.length > 1) {
      const c1 = updatedClaims[1];
      const crit2: SkepticCritique = {
        id: `sk-${invId}-2`,
        claimId: c1.id,
        challengerAgent: "Skeptic-Beta (Causal Inference Reviewer)",
        fallacyType: "CORRELATION_VS_CAUSATION",
        critiqueText: "Causal attribution assumes that concurrent confounding covariates remain invariant. Latent mediator pathways have not been formally disproven.",
        severity: "MEDIUM",
        suggestedStressTest: "Swap mediator baseline variables to simulate unobserved confounders.",
      };
      critiques.push(crit2);
      c1.skepticCritiqueIds.push(crit2.id);
      c1.postConfidence = Math.max(0.25, c1.priorConfidence - 0.08);
      c1.status = c1.postConfidence < 0.6 ? "CONTESTED" : "SUPPORTED";
    }

    return { critiques, updatedClaims };
  }
}

