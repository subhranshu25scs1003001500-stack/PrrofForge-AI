import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Investigation } from "@/types";

// In-memory persistent cache for serverless invocation scope and local development
const memoryStore = new Map<string, Investigation>();

// Initial seed investigations so users have rich examples immediately upon launching
export const SEED_INVESTIGATIONS: Investigation[] = [
  {
    id: "seed-crispr-longevity",
    query: "Does systemic AAV9-mediated telomerase reverse transcriptase (TERT) gene therapy extend mammalian median lifespan without increasing oncogenesis?",
    domain: "Biotechnology & Cellular Aging",
    stage: "COMPLETED",
    currentStepIndex: 5,
    totalSteps: 5,
    verdict: "EMPIRICALLY_FRAGILE",
    summary: "While AAV9-TERT delivery exhibits 24% median lifespan extension in murine models under caloric standardization, conclusions exhibit high fragility under evidence mutation testing: removal of tumor suppressor p53 baseline controls causes the conclusion stability index to drop sharply by 42%.",
    executiveReport: `### Executive Verification Dossier: AAV9-TERT Gene Therapy

#### 1. Core Synthesis
The hypothesis that systemic TERT gene therapy prolongs median mammalian lifespan without oncogenic escalation is **EMPIRICALLY FRAGILE**. 

Empirical evidence demonstrates telomere elongation and delay of physiological biomarkers of aging in wild-type mice. However, **adversarial skeptic auditing** uncovered significant selection bias: studies predominantly utilize murine cohorts with constitutively active p16/p19/p53 protective cascades.

#### 2. Evidence Mutation Results (Fragility Analysis)
- **Ablation Test (Ablate de Jesus et al. p53-transgenic cohort)**: The conclusion stability plunged from 84% to 42%. The lifespan extension effect was largely attenuated when oncogenic surveillance was mutated to human-equivalent baseline rates.
- **Swap Test (Swap in human primary fibroblast senescence velocity)**: Vector dilution over successive mitoses diminished effective TERT expression by 68%.
- **Contradiction Test (Inject synthetic oncogene amplification data)**: In models subjected to chemical carcinogen exposure, TERT-transduced cohorts exhibited accelerated hepatocarcinoma progression.

#### 3. Epistemic Verdict
**EMPIRICALLY FRAGILE**. Recommended clinical translation pause until targeted non-viral epigenetic reset mechanisms are demonstrated across non-human primates.`,
    claims: [
      {
        id: "c-1",
        investigationId: "seed-crispr-longevity",
        statement: "Adeno-associated virus serotype 9 (AAV9) encoding murine TERT extends median lifespan by 24% when administered to adult (1-year) and 13% in elderly (2-year) mice.",
        category: "empirical",
        priorConfidence: 0.88,
        postConfidence: 0.82,
        postMutationConfidence: 0.51,
        status: "SUPPORTED",
        evidenceIds: ["ev-1", "ev-2"],
        skepticCritiqueIds: ["sk-1"],
        stabilityScore: 58,
        fragilityRating: "HIGH",
        notes: "Effect size shrinks when controlling for cage temperature and calorie density."
      },
      {
        id: "c-2",
        investigationId: "seed-crispr-longevity",
        statement: "TERT-treated cohorts exhibit zero statistically significant increase in spontaneous tumor incidence compared to sham-injected littermates.",
        category: "statistical",
        priorConfidence: 0.79,
        postConfidence: 0.61,
        postMutationConfidence: 0.35,
        status: "CONTESTED",
        evidenceIds: ["ev-3"],
        skepticCritiqueIds: ["sk-2"],
        stabilityScore: 44,
        fragilityRating: "CRITICAL",
        notes: "Cohort sample size (n=38) underpowered to detect rare sarcoma shifts."
      },
      {
        id: "c-3",
        investigationId: "seed-crispr-longevity",
        statement: "AAV9 vector biodistribution achieves effective transduction in post-mitotic cardiac myocytes and hepatic parenchyma without activating germline integration.",
        category: "causal",
        priorConfidence: 0.92,
        postConfidence: 0.89,
        postMutationConfidence: 0.81,
        status: "SUPPORTED",
        evidenceIds: ["ev-4"],
        skepticCritiqueIds: [],
        stabilityScore: 91,
        fragilityRating: "LOW",
        notes: "Episomal maintenance confirmed through qPCR."
      }
    ],
    evidence: [
      {
        id: "ev-1",
        investigationId: "seed-crispr-longevity",
        claimId: "c-1",
        source: {
          id: "src-1",
          title: "Telomerase gene therapy in adult and old mice delays aging and increases longevity without increasing cancer",
          authors: ["de Jesus, B. B.", "Vera, E.", "Schneeberger, K.", "Blasco, M. A."],
          year: 2012,
          publication: "EMBO Molecular Medicine, 4(8):691-704",
          doi: "10.1002/emmm.201200245",
          url: "https://doi.org/10.1002/emmm.201200245",
          credibilityScore: 0.94,
          sampleSize: 74,
          methodology: "AAV9 retro-orbital delivery with bi-weekly metabolic telemetry",
          isPeerReviewed: true,
          isSynthetic: false
        },
        snippet: "Treatment of 1-year and 2-year old mice with an adeno-associated virus expressing mouse TERT had beneficial effects on health and fitness... increasing median lifespan by 24 and 13%, respectively, without causing cancer.",
        relevanceScore: 0.98,
        supportsClaim: true,
        strength: 0.92,
        tags: ["telomerase", "AAV9", "lifespan", "in-vivo"],
        createdAt: "2026-05-10T14:22:00Z"
      },
      {
        id: "ev-2",
        investigationId: "seed-crispr-longevity",
        claimId: "c-1",
        source: {
          id: "src-2",
          title: "Quantitative measurement of telomere length dynamics under viral transduction",
          authors: ["Bernardes de Jesus, B.", "Blasco, M. A."],
          year: 2013,
          publication: "Nature Protocols, 8(6):1113-1128",
          doi: "10.1038/nprot.2013.065",
          credibilityScore: 0.91,
          sampleSize: 120,
          methodology: "High-throughput Q-FISH cytometry",
          isPeerReviewed: true,
          isSynthetic: false
        },
        snippet: "Telomere length increased selectively in critically short telomere subsets across hepatic and myocardial tissues.",
        relevanceScore: 0.89,
        supportsClaim: true,
        strength: 0.86,
        tags: ["Q-FISH", "cytometry", "telomeres"],
        createdAt: "2026-05-10T14:23:00Z"
      },
      {
        id: "ev-3",
        investigationId: "seed-crispr-longevity",
        claimId: "c-2",
        source: {
          id: "src-3",
          title: "Evaluation of neoplastic risk in long-lived telomerase-amplified rodent lineages",
          authors: ["Martinez, P.", "Blasco, M. A."],
          year: 2017,
          publication: "Cancer Cell International, 17:45",
          doi: "10.1186/s12935-017-0415-y",
          credibilityScore: 0.85,
          sampleSize: 38,
          methodology: "Necropsy histological staining across 14 organ systems",
          isPeerReviewed: true,
          isSynthetic: false
        },
        snippet: "No pre-malignant dysplasia was recorded at 24 months post-injection in standard C57BL/6J cohorts, though statistical power for latent sarcomas was bounded below beta=0.80.",
        relevanceScore: 0.91,
        supportsClaim: true,
        strength: 0.68,
        tags: ["neoplasia", "safety", "histology"],
        createdAt: "2026-05-10T14:24:00Z"
      },
      {
        id: "ev-4",
        investigationId: "seed-crispr-longevity",
        claimId: "c-3",
        source: {
          id: "src-4",
          title: "Systemic AAV9 biodistribution and genomic insertion frequency in mammalian organs",
          authors: ["Zincarelli, C.", "Solis, M.", "Farrell, S."],
          year: 2020,
          publication: "Molecular Therapy - Methods & Clinical Development, 18:210-222",
          doi: "10.1016/j.omtm.2020.06.002",
          credibilityScore: 0.95,
          sampleSize: 85,
          methodology: "Droplet digital PCR and long-read sequencing",
          isPeerReviewed: true,
          isSynthetic: false
        },
        snippet: "AAV9 shows high tropism for liver, heart, and skeletal muscle with episomal persistence and chromosomal integration rates below 0.001%.",
        relevanceScore: 0.94,
        supportsClaim: true,
        strength: 0.95,
        tags: ["AAV9", "biodistribution", "biosafety"],
        createdAt: "2026-05-10T14:25:00Z"
      }
    ],
    critiques: [
      {
        id: "sk-1",
        claimId: "c-1",
        challengerAgent: "Skeptic-Alpha (Methodological Reviewer)",
        fallacyType: "SELECTION_BIAS",
        critiqueText: "The 24% lifespan extension in de Jesus et al. was conducted with specific barrier facility pathogen-free housing. When ambient temperature drops below thermoneutrality (28°C), metabolic rate increases and oxidative damage attenuates telomerase protection.",
        severity: "HIGH",
        suggestedStressTest: "Ablate pathogen-free facility baseline or mutate thermal homeostasis parameter to standard 22°C housing."
      },
      {
        id: "sk-2",
        claimId: "c-2",
        challengerAgent: "Skeptic-Beta (Statistical Biostatistician)",
        fallacyType: "SMALL_SAMPLE_SIZE",
        critiqueText: "The necropsy analysis utilized n=38 mice per arm. At this power level, a 15% increase in latent malignant transformation is undetectable at p<0.05. Absence of evidence is conflated with evidence of absence.",
        severity: "CRITICAL",
        suggestedStressTest: "Inject synthetic carcinogen sensitivity perturbation or scale cohort size to simulate low-frequency oncogenesis."
      }
    ],
    mutations: [
      {
        id: "mut-1",
        investigationId: "seed-crispr-longevity",
        claimId: "c-1",
        mutationType: "ABLATION",
        title: "Ablation of de Jesus et al. Pathogen-Free Control Node",
        description: "Removed primary AAV9-TERT longevity citation [ev-1] to measure standalone consensus dependence.",
        targetEvidenceId: "ev-1",
        mutatedHypothesis: "[SYNTHETIC ABLATION] Evaluating claim stability without de Jesus et al. 2012 dataset.",
        isSynthetic: true,
        originalConfidence: 0.88,
        mutatedConfidence: 0.51,
        confidenceDelta: 0.37,
        survived: false,
        sensitivityFactor: 0.42,
        reasoning: "The entire 24% lifespan claim relies disproportionately on this single empirical cohort; remaining literature covers surrogate endpoints (Q-FISH, biomarkers) without survival curves."
      },
      {
        id: "mut-2",
        investigationId: "seed-crispr-longevity",
        claimId: "c-2",
        mutationType: "CONTRADICTION",
        title: "Synthetic Antithesis: Chemical Carcinogen Challenge",
        description: "Injected synthetic evidence simulating low-dose DMBA exposure in TERT-transduced rodent hepatocytes.",
        targetEvidenceId: "ev-3",
        mutatedHypothesis: "[SYNTHETIC CONTRADICTION] Co-administration of low-dose genotoxic stress induces 3.2x focal pre-neoplastic lesions in TERT+ vs TERT- littermates.",
        isSynthetic: true,
        originalConfidence: 0.79,
        mutatedConfidence: 0.35,
        confidenceDelta: 0.44,
        survived: false,
        sensitivityFactor: 0.56,
        reasoning: "Synthetic oncogenic pressure reveals high epistemic fragility. The claim that TERT therapy carries zero neoplastic risk fails adversarial perturbation."
      },
      {
        id: "mut-3",
        investigationId: "seed-crispr-longevity",
        claimId: "c-3",
        mutationType: "SWAP",
        title: "Alternative Baseline: Human Senescent Fibroblast Tropism Swap",
        description: "Swapped murine AAV9 receptor density for human myocardial tissue expression data.",
        targetEvidenceId: "ev-4",
        mutatedHypothesis: "[SYNTHETIC SWAP] Transduction efficiency mapped across human explant tissue models.",
        isSynthetic: true,
        originalConfidence: 0.92,
        mutatedConfidence: 0.81,
        confidenceDelta: 0.11,
        survived: true,
        sensitivityFactor: 0.12,
        reasoning: "Vector tropism maintains high biological stability even under human tissue expression parameters."
      }
    ],
    logs: [
      {
        id: "log-1",
        timestamp: "2026-05-10T14:20:00Z",
        role: "ORCHESTRATOR",
        stage: "CREATED",
        message: "Investigation initialized. Bounded state machine ready for serverless step progression.",
        type: "info"
      },
      {
        id: "log-2",
        timestamp: "2026-05-10T14:21:00Z",
        role: "RESEARCHER",
        stage: "RESEARCHING",
        message: "Retrieved 4 high-credibility peer-reviewed citations across EMBO, Nature Protocols, and Cancer Cell.",
        type: "success",
        durationMs: 1420
      },
      {
        id: "log-3",
        timestamp: "2026-05-10T14:22:15Z",
        role: "CLAIM_EXTRACTOR",
        stage: "EXTRACTING_CLAIMS",
        message: "Extracted 3 atomic propositions: 1 empirical longevity effect, 1 statistical oncogenesis metric, 1 causal vector tropism rule.",
        type: "info",
        durationMs: 980
      },
      {
        id: "log-4",
        timestamp: "2026-05-10T14:23:45Z",
        role: "SKEPTIC",
        stage: "SKEPTIC_AUDIT",
        message: "Adversarial audit completed: identified selection bias in pathogen-free murine housing and severe underpowering in tumor surveillance (n=38).",
        type: "warning",
        durationMs: 1850
      },
      {
        id: "log-5",
        timestamp: "2026-05-10T14:25:30Z",
        role: "MUTATION_ENGINE",
        stage: "MUTATION_TESTING",
        message: "Executed 3 evidence mutations (Ablation, Contradiction, Swap). Conclusion Stability Index: 58% (Fragile).",
        type: "warning",
        durationMs: 2310
      },
      {
        id: "log-6",
        timestamp: "2026-05-10T14:26:00Z",
        role: "VERIFIER",
        stage: "SYNTHESIZING",
        message: "Verification Dossier formulated. Final verdict: EMPIRICALLY_FRAGILE. Export ready.",
        type: "success",
        durationMs: 1100
      }
    ],
    metrics: {
      conclusionStabilityIndex: 58,
      overallConfidence: 61,
      evidenceCoverage: 100,
      skepticChallengeDensity: 0.67,
      mutationResilienceScore: 54,
      epistemicFragilityRisk: "HIGH",
      totalClaimsCount: 3,
      verifiedClaimsCount: 1,
      refutedClaimsCount: 1,
      mutationsConducted: 3
    },
    baselineComparison: {
      standardLlmResponse: {
        answer: "Yes, gene therapy using AAV9 to deliver telomerase reverse transcriptase (TERT) extends lifespan by 24% in mice and does not cause cancer because it restores healthy cellular division without inducing malignant mutations.",
        modelName: "Direct Single-Prompt Baseline (GPT-4o / Gemini Flash)",
        hallucinationRisk: "HIGH",
        unverifiedAssumptions: [
          "Assumed absence of cancer in small murine sample proves human clinical oncogenic safety.",
          "Accepted 24% lifespan figure uncritically without controlling for pathogen-free facility artifacts.",
          "Ignored lack of statistical power (n=38) for rare neoplastic detection."
        ],
        citationAudit: "UNVERIFIED",
        generationDurationMs: 820
      },
      proofForgeVerified: {
        answer: "Systemic AAV9-TERT does show empirical evidence of median lifespan prolongation in specific pathogen-free rodents, but adversarial mutation testing reveals extreme epistemic fragility (CSS 58%). Oncogenic safety claims collapse under carcinogen sensitivity perturbations and sample size adjustments.",
        verdict: "EMPIRICALLY_FRAGILE",
        stabilityScore: 58,
        evidenceCount: 4,
        mutationsApplied: 3,
        auditTrailSummary: "4 peer-reviewed sources audited, 2 critical skeptic fallacies identified, 3 counterfactual mutations executed.",
        resilienceAdvantage: "ProofForge exposed that the safety consensus is an artifact of low statistical power and pathogen-free housing."
      },
      metricsDelta: {
        stabilityImprovement: "+58% stress-tested confidence calibration",
        hallucinationReduction: "Eliminated unchecked clinical safety extrapolation",
        unbackedClaimsCaught: 2
      }
    },
    createdAt: "2026-05-10T14:20:00Z",
    updatedAt: "2026-05-10T14:26:00Z",
    completedAt: "2026-05-10T14:26:00Z"
  }
];

// Initialize seed store
for (const seed of SEED_INVESTIGATIONS) {
  memoryStore.set(seed.id, seed);
}

// Supabase client helper
function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return null;
  }
  return createClient(url, key);
}

export class StorageAdapter {
  private static supabase = getSupabaseClient();

  static async listInvestigations(): Promise<Investigation[]> {
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from("investigations")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((row) => row.data as Investigation);
        }
      } catch (err) {
        console.warn("Supabase list error, falling back to memory store:", err);
      }
    }
    return Array.from(memoryStore.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  static async getInvestigation(id: string): Promise<Investigation | null> {
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from("investigations")
          .select("data")
          .eq("id", id)
          .single();

        if (!error && data?.data) {
          return data.data as Investigation;
        }
      } catch (err) {
        console.warn("Supabase fetch error, checking memory store:", err);
      }
    }
    return memoryStore.get(id) || null;
  }

  static async saveInvestigation(investigation: Investigation): Promise<Investigation> {
    investigation.updatedAt = new Date().toISOString();
    memoryStore.set(investigation.id, investigation);

    if (this.supabase) {
      try {
        await this.supabase.from("investigations").upsert({
          id: investigation.id,
          query: investigation.query,
          domain: investigation.domain,
          stage: investigation.stage,
          verdict: investigation.verdict || null,
          data: investigation,
          updated_at: investigation.updatedAt,
          created_at: investigation.createdAt,
        });
      } catch (err) {
        console.warn("Supabase upsert error, saved to memory store:", err);
      }
    }
    return investigation;
  }

  static async deleteInvestigation(id: string): Promise<boolean> {
    const existed = memoryStore.delete(id);
    if (this.supabase) {
      try {
        await this.supabase.from("investigations").delete().eq("id", id);
      } catch (err) {
        console.warn("Supabase delete error:", err);
      }
    }
    return existed;
  }
}

