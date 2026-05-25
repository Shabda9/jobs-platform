-- Run in Supabase Dashboard → SQL Editor if uploads still fail with RLS errors.
-- Backend uploads should use SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).
-- These policies are a fallback for INSERT into the private "resumes" bucket.

-- Allow service role to manage objects in resumes bucket
CREATE POLICY "Service role insert resumes"
ON storage.objects
FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Service role select resumes"
ON storage.objects
FOR SELECT
TO service_role
USING (bucket_id = 'resumes');

CREATE POLICY "Service role update resumes"
ON storage.objects
FOR UPDATE
TO service_role
USING (bucket_id = 'resumes')
WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Service role delete resumes"
ON storage.objects
FOR DELETE
TO service_role
USING (bucket_id = 'resumes');
