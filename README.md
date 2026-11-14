# ProofForge AI 🔬

> **Production-Ready, Vercel-Deployable Generative AI Epistemic Verification Engine**  
> Decomposing scientific hypotheses into atomic claims, adversarial skeptic audits, and counterfactual **Evidence Mutation Testing**.

[![CI](https://github.com/proofforge/proofforge-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/proofforge/proofforge-ai/actions)
[![Vercel Ready](https://img.shields.io/badge/Vercel-Serverless%20Ready-00F2FE?logo=vercel)](https://vercel.com)
[![Next.js](https://img.shields.io/badge/Next.js-14%20App%20Router-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org)
[![React Flow](https://img.shields.io/badge/@xyflow/react-12.x-8B5CF6)](https://reactflow.dev)

---

## 🌟 Overview & The Core Novelty

Conventional LLM search engines either invent plausible-sounding citations (hallucinations) or present static lists of URLs without assessing how fragile the conclusion is.

**ProofForge AI** treats empirical assertions like testable software code:
1. **Research Agent (`RESEARCHER`)**: Gathers real literature citations, DOIs, sample sizes ($n$), and methodology snippets.
2. **Claim Agent (`CLAIM_EXTRACTOR`)**: Deconstructs complex queries into atomic, verifiable propositions classified into empirical, statistical, causal, or definitional categories.
3. **Skeptic Agent (`SKEPTIC`)**: Performs adversarial peer review, flagging hidden selection bias, small sample sizes, correlation vs causation leaps, and confirmation bias.
4. **Experiment Agent (`MUTATION_ENGINE` — THE NOVELTY)**:
   - **Ablation Mutation**: Deletes primary evidentiary pillars to test if the conclusion collapses without that specific source.
   - **Parameter Swap**: Substitutes experimental parameters for heterogeneous real-world baselines.
   - **Contradiction Injection**: Injects synthetic antitheses to quantify confirmation bias.
   - Calculates the **Conclusion Stability Score (CSS)** and **Fragility Rating**.
   > *Safety Mandate: All simulated mutations are explicitly labeled `[SYNTHETIC EXPERIMENT - NOT VERIFIED FACT]` to avoid fabricating evidence.*
5. **Synthesis Agent (`VERIFIER`)**: Integrates the graph topology and perturbation sensitivity into an executive verification dossier with a definitive verdict (`ROBUST_VERIFIED`, `EMPIRICALLY_FRAGILE`, `CONTRADICTED`, `INSUFFICIENT_DATA`).

---

## 🚀 Key Features

- **Interactive React Flow Evidence Graph**: Directed acyclic graph linking Root Hypothesis $\to$ Atomic Claims $\to$ Empirical Citations $\to$ Skeptic Critiques $\to$ Mutation Tests. Interactive slide-out drawer on node click.
- **Vercel Serverless Bounded Step Architecture**: Avoids long-running synchronous timeouts. Discrete, resumable state machine steps (`POST /api/investigations/[id]/step`) execute in 1–2 seconds.
- **Evidence Mutation Workbench**: Visual breakdown of belief shifts before and after ablation, swap, and contradiction experiments.
- **Baseline Comparison Matrix**: Side-by-side comparison of standard single-prompt LLM answers (high hallucination/blind assumption risk) vs ProofForge verified pipeline.
- **Turnkey Mock Mode**: Works 100% out of the box with rich scientific datasets without requiring paid LLM API keys or Supabase credentials.
- **Supabase Persistence & Fallback**: Automatic PostgreSQL storage when configured; seamless in-memory fallback for instant local evaluation.
- **Export Formats**: Instant download in Markdown (`.md`), full telemetry data (`.json`), or print-ready PDF view.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 App Router (React 18, TypeScript)
- **Styling**: Tailwind CSS, Dark Charcoal & Cyber Neon Palette (`#06080E`, Cyan `#00F2FE`, Violet `#8B5CF6`)
- **Graph Visualization**: `@xyflow/react` (React Flow 12)
- **Animations**: Framer Motion & Canvas Confetti
- **Multi-Agent Orchestrator**: Modular TypeScript bounded state machine
- **Testing**: Vitest (`npm run test`)
- **Persistence**: Supabase JS Client with In-Memory Storage Adapter fallback
- **Deployment**: Vercel Serverless & GitHub Actions CI

---

## ⚡ LLM Architecture: Groq (Primary) + Gemini (Fallback)

ProofForge AI features a shared server-side LLM service designed for speed, resilience, and API-key safety:

- **Primary Provider**: **Groq** (`llama-3.3-70b-versatile`, `llama-3.1-8b-instant`) for ultra-low-latency agent inferences.
- **Fallback Provider**: **Google Gemini** (`gemini-1.5-flash`, `gemini-1.5-pro`) automatically cascades if Groq experiences rate limits (HTTP 429), timeouts, or service interruptions.
- **Safety Net**: Built-in deterministic Mock Engine if no external keys are configured.
- **Bounded Retries with Exponential Backoff & Jitter**: Automatically retries transient errors up to 2 times before triggering failover.
- **Timeouts**: AbortController-enforced 12,000ms bounds preventing hung serverless instances.
- **Provider Status Indicator & Model Selector**: Live UI diagnostics displaying key status, active provider, and dynamic model switching.

---

## ⚡ Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/your-username/proofforge-ai.git
cd proofforge-ai
npm install
```

### 2. Configure Environment (Optional)
ProofForge runs **out of the box in Mock Mode** with zero API keys required. To connect Groq and Gemini:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# 1. Primary: Groq (https://console.groq.com/keys)
GROQ_API_KEY=gsk_your_groq_key_here
GROQ_MODEL=llama-3.3-70b-versatile

# 2. Fallback: Google Gemini (https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=AIzaSy_your_gemini_key_here
GEMINI_MODEL=gemini-1.5-flash

# 3. LLM Service Bounds
LLM_TIMEOUT_MS=12000
LLM_MAX_RETRIES=2
LLM_PRIMARY_PROVIDER=groq
LLM_FALLBACK_PROVIDER=gemini

# 4. Optional Supabase for PostgreSQL persistence
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Run Development Server
\`\`\`bash
npm run dev
\`\`\`
Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Automated Tests
\`\`\`bash
npm run test
\`\`\`

### 5. Build for Production
\`\`\`bash
npm run build
\`\`\`

---

## ☁️ Vercel Deployment

Deploying ProofForge AI to Vercel takes less than 2 minutes:

1. Push your repository to GitHub.
2. Import the project into your [Vercel Dashboard](https://vercel.com/new).
3. (Optional) In **Project Settings $\to$ Environment Variables**, add your keys:
   - `LLM_PROVIDER` (defaults to `mock` if left unset)
   - `OPENAI_API_KEY` or `GEMINI_API_KEY` (if using live AI)
   - `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (if using PostgreSQL)
4. Click **Deploy**.

Because ProofForge uses **bounded serverless step execution** (`POST /api/investigations/[id]/step`), requests stay well within Vercel's execution time limits (10s free / 60s pro).

---

## 🗄️ Supabase PostgreSQL Setup (Optional)

To enable persistent cloud storage across sessions:
1. Create a project on [Supabase](https://supabase.com).
2. Go to the **SQL Editor** and execute `supabase/schema.sql`:
   \`\`\`sql
   CREATE TABLE IF NOT EXISTS public.investigations (
     id TEXT PRIMARY KEY,
     query TEXT NOT NULL,
     domain TEXT NOT NULL DEFAULT 'General Scientific & Empirical',
     stage TEXT NOT NULL DEFAULT 'CREATED',
     verdict TEXT,
     data JSONB NOT NULL,
     created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
     updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
   );
   \`\`\`
3. Copy your Project URL and Anon/Service-Role Keys into your Vercel Environment Variables.

---

## 🧪 Pipeline Flow

\`\`\`
User Query 
   │
   ▼
[1. Research Agent] ─────► Gathers peer-reviewed citations & DOIs
   │
   ▼
[2. Claim Extractor] ────► Decomposes into atomic testable claims
   │
   ▼
[3. Skeptic Agent] ──────► Challenges fallacies & selection bias
   │
   ▼
[4. Mutation Engine] ────► Ablation, parameter swap & synthetic contradiction
   │
   ▼
[5. Synthesis Verifier] ─► Calculates CSI & renders Verification Dossier
\`\`\`

---

## 📄 License
MIT License. Created for the Generative AI Research & Verification community.

