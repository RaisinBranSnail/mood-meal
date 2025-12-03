-- Daily Logs Table for MoodMeal Calendar Feature
-- Run this script in your Supabase SQL Editor

-- Create daily_logs table
CREATE TABLE IF NOT EXISTS daily_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  meals JSONB DEFAULT '[]'::jsonb, -- Array of meal objects: [{name, calories, carbs, protein, fat, meal_type}]
  total_calories NUMERIC(6, 2) DEFAULT 0,
  total_carbs NUMERIC(6, 2) DEFAULT 0,
  total_protein NUMERIC(6, 2) DEFAULT 0,
  total_fat NUMERIC(6, 2) DEFAULT 0,
  water_intake INTEGER DEFAULT 0, -- Number of glasses
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(user_id, date)
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_daily_logs_user_id ON daily_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_logs_date ON daily_logs(date);
CREATE INDEX IF NOT EXISTS idx_daily_logs_user_date ON daily_logs(user_id, date);

-- Enable Row Level Security (RLS)
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for daily_logs
-- Users can only see and modify their own daily logs
CREATE POLICY "Users can view own daily logs"
  ON daily_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily logs"
  ON daily_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily logs"
  ON daily_logs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily logs"
  ON daily_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE TRIGGER update_daily_logs_updated_at
  BEFORE UPDATE ON daily_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add helpful comment
COMMENT ON TABLE daily_logs IS 'Stores daily meal logs, nutrition data, and water intake for calendar view';

