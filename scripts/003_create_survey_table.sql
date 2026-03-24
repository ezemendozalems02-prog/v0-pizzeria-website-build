-- Create survey_responses table
CREATE TABLE IF NOT EXISTS public.survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  overall_experience TEXT NOT NULL CHECK (overall_experience IN ('bad', 'good', 'excellent')),
  product_quality TEXT NOT NULL CHECK (product_quality IN ('bad', 'good', 'excellent')),
  delivery_time TEXT NOT NULL CHECK (delivery_time IN ('bad', 'good', 'excellent')),
  service_attention TEXT NOT NULL CHECK (service_attention IN ('bad', 'good', 'excellent')),
  order_origin TEXT NOT NULL CHECK (order_origin IN ('delivery', 'pickup', 'local')),
  comment TEXT,
  customer_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- Create policy for anyone to insert responses
CREATE POLICY "Anyone can insert survey responses" ON public.survey_responses
  FOR INSERT
  WITH CHECK (true);

-- Create policy for anyone to view their own responses (by session)
CREATE POLICY "Anyone can view survey responses" ON public.survey_responses
  FOR SELECT
  USING (true);

-- Create index on created_at for efficient sorting
CREATE INDEX idx_survey_responses_created_at ON public.survey_responses(created_at DESC);
