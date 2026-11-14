import { describe, it, expect } from "vitest";
import { InvestigationOrchestrator } from "../agents/orchestrator";

describe("InvestigationOrchestrator (Serverless Bounded Steps)", () => {
  it("progresses sequentially through bounded stages without long-running synchronous lockup", async () => {
    // 1. Create
    const inv = await InvestigationOrchestrator.createInvestigation(
      "Does ambient temperature shift mitochondrial uncoupling protein 1 (UCP1) activation in brown adipose tissue?"
    );
    expect(inv.stage).toBe("CREATED");
    expect(inv.currentStepIndex).toBe(0);

    // 2. Step 1: Research Agent
    const step1 = await InvestigationOrchestrator.executeNextStep(inv.id);
    expect(step1.stage).toBe("RESEARCHING");
    expect(step1.currentStepIndex).toBe(1);
    expect(step1.evidence.length).toBeGreaterThan(0);

    // 3. Step 2: Claim Agent
    const step2 = await InvestigationOrchestrator.executeNextStep(inv.id);
    expect(step2.stage).toBe("EXTRACTING_CLAIMS");
    expect(step2.currentStepIndex).toBe(2);
    expect(step2.claims.length).toBeGreaterThan(0);

    // 4. Step 3: Skeptic Agent
    const step3 = await InvestigationOrchestrator.executeNextStep(inv.id);
    expect(step3.stage).toBe("SKEPTIC_AUDIT");
    expect(step3.currentStepIndex).toBe(3);
    expect(step3.critiques.length).toBeGreaterThan(0);

    // 5. Step 4: Mutation Engine
    const step4 = await InvestigationOrchestrator.executeNextStep(inv.id);
    expect(step4.stage).toBe("MUTATION_TESTING");
    expect(step4.currentStepIndex).toBe(4);
    expect(step4.mutations.length).toBeGreaterThan(0);

    // 6. Step 5: Synthesis / Verifier
    const step5 = await InvestigationOrchestrator.executeNextStep(inv.id);
    expect(step5.stage).toBe("COMPLETED");
    expect(step5.currentStepIndex).toBe(5);
    expect(step5.verdict).toBeDefined();
    expect(step5.metrics).toBeDefined();
    expect(step5.baselineComparison).toBeDefined();
  });
});

