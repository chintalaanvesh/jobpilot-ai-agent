-- =====================================================
-- Migration 3: Storage Bucket Setup
-- =====================================================

-- Create resumes bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: Users can only access their own resumes

-- Users can upload their own resume
CREATE POLICY "Users can upload own resume"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'resumes'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can read their own resume
CREATE POLICY "Users can read own resume"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'resumes'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can update their own resume
CREATE POLICY "Users can update own resume"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'resumes'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can delete their own resume
CREATE POLICY "Users can delete own resume"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'resumes'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
