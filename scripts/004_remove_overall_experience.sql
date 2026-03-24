-- Remove overall_experience column from survey_responses
-- This column is no longer used by the application
ALTER TABLE public.survey_responses DROP COLUMN IF EXISTS overall_experience;
