-- Liked Recipes Table for MoodMeal
-- Run this script in your Supabase SQL Editor

-- Create liked_recipes table
CREATE TABLE IF NOT EXISTS liked_recipes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(user_id, recipe_id)
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_liked_recipes_user_id ON liked_recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_liked_recipes_recipe_id ON liked_recipes(recipe_id);

-- Enable Row Level Security (RLS)
ALTER TABLE liked_recipes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for liked_recipes
-- Users can only see and modify their own liked recipes
CREATE POLICY "Users can view own liked recipes"
  ON liked_recipes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own liked recipes"
  ON liked_recipes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own liked recipes"
  ON liked_recipes FOR DELETE
  USING (auth.uid() = user_id);

-- Add helpful comment
COMMENT ON TABLE liked_recipes IS 'Stores user liked/favorited recipes';


