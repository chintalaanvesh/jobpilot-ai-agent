-- =====================================================
-- Migration 2: Row Level Security Policies
-- =====================================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- ==================
-- PROFILES POLICIES
-- ==================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (for signup)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ==================
-- RUNS POLICIES
-- ==================

-- Users can view their own runs
CREATE POLICY "Users can view own runs"
  ON runs FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own runs
CREATE POLICY "Users can create own runs"
  ON runs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- System (service role) can update any run (for webhook)
CREATE POLICY "System can update runs"
  ON runs FOR UPDATE
  USING (true);

-- ==================
-- JOBS POLICIES
-- ==================

-- Users can view jobs from their own runs
CREATE POLICY "Users can view jobs from own runs"
  ON jobs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM runs
      WHERE runs.id = jobs.run_id
      AND runs.user_id = auth.uid()
    )
  );

-- System (service role) can insert jobs (for webhook)
CREATE POLICY "System can insert jobs"
  ON jobs FOR INSERT
  WITH CHECK (true);
