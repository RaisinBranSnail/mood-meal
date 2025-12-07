# Supabase Database Setup Guide for MoodMeal

This guide will help you set up a new Supabase database for your MoodMeal project.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Fill in the details:
   - **Name**: `mood-meals` (or your preferred name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Free tier is fine for development
5. Click **"Create new project"**
6. Wait 2-3 minutes for the project to be created

## Step 2: Get Your API Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (the `anon` key, not the `service_role` key)

## Step 3: Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy and paste the SQL from `supabase-schema.sql` (see below)
4. Click **"Run"** to execute the SQL
5. You should see "Success. No rows returned"

## Step 4: Set Up Row Level Security (RLS)

The SQL script includes RLS policies, but verify they're enabled:

1. Go to **Authentication** → **Policies**
2. Make sure RLS is enabled for both tables:
   - `user_profiles`
   - `activity_logs`

## Step 5: Configure Environment Variables

1. Create a `.env` file in `nutrition-app/mood-meals/` (if it doesn't exist)
2. Add your credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=your_project_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**Important**: Replace `your_project_url_here` and `your_anon_key_here` with your actual values from Step 2.

## Step 6: Test the Connection

1. Run your app: `npm run web` or `npm start`
2. Try to sign up/login
3. Check the browser console for any errors
4. In Supabase dashboard, go to **Table Editor** → `user_profiles` to see if data is being saved

## Troubleshooting

### "relation does not exist" error
- Make sure you ran the SQL script in Step 3
- Check that tables exist in **Table Editor**

### "new row violates row-level security policy" error
- Verify RLS policies are enabled (Step 4)
- Check that the user is authenticated before trying to insert data

### Authentication not working
- Make sure you're using the correct `anon` key (not `service_role`)
- Verify your project URL is correct
- Check that email authentication is enabled in **Authentication** → **Providers**

## Database Schema Overview

### `user_profiles` table
Stores user onboarding and profile data:
- `user_id` - Links to Supabase auth user
- `name` - User's display name
- `food_goal` - 'lose', 'healthy', or 'gain'
- `gender` - 'female', 'male', or 'other'
- `age` - User's age
- `height` - Height in centimeters
- `weight` - Current weight in kg
- `ideal_weight_kg` - Target weight in kg
- `activity_level` - 'low', 'moderate', or 'high'
- `diet_type` - 'clean', 'mediterranean', 'keto', or 'lowcarb'
- `water_goal` - Daily water intake goal (glasses)

### `activity_logs` table
Tracks daily activity streaks:
- `user_id` - Links to Supabase auth user
- `date` - Date of the activity
- `was_active` - Boolean indicating if user was active that day

## Next Steps

Once your database is set up:
1. Test user registration
2. Complete the onboarding flow
3. Verify data is being saved correctly
4. Test the activity streak feature

For production deployment, make sure to:
- Set environment variables in Vercel/your hosting platform
- Enable email confirmation if needed
- Set up proper backup strategies





