-- ============================================================
-- ProofForge AI: Supabase PostgreSQL Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Investigations Table
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

-- Index for fast retrieval ordered by creation time
CREATE INDEX IF NOT EXISTS idx_investigations_created_at ON public.investigations (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_investigations_stage ON public.investigations (stage);

-- Optional Row Level Security (RLS)
ALTER TABLE public.investigations ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for sharing investigations)
CREATE POLICY "Allow public read access on investigations"
  ON public.investigations
  FOR SELECT
  USING (true);

-- Allow authenticated or service role write access
CREATE POLICY "Allow service role write access on investigations"
  ON public.investigations
  FOR ALL
  USING (true)
  WITH CHECK (true);

