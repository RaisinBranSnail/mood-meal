# Supabase Authentication Setup Guide

This guide will help you enable email and Google authentication for your MoodMeal app.

## Step 1: Enable Email Authentication

1. **Go to Authentication Settings**
   - In your Supabase dashboard, click **"Authentication"** in the left sidebar (under Configuration)
   - Click **"Providers"** tab

2. **Enable Email Provider**
   - Find **"Email"** in the list of providers
   - Toggle it **ON** (it should be enabled by default)
   - Configure the settings:
     - **Enable email confirmations**: Toggle OFF for development (users can sign in immediately)
     - **Enable email change confirmations**: Toggle ON (recommended)
     - **Secure email change**: Toggle ON (recommended)

3. **Email Templates (Optional)**
   - You can customize email templates under **"Email Templates"** tab
   - For development, the default templates work fine

## Step 2: Enable Google OAuth

### Part A: Get Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit [https://console.cloud.google.com](https://console.cloud.google.com)
   - Sign in with your Google account

2. **Create a New Project (or select existing)**
   - Click the project dropdown at the top
   - Click **"New Project"**
   - Name it: `MoodMeal` (or your preferred name)
   - Click **"Create"**

3. **Enable Google+ API**
   - Go to **"APIs & Services"** → **"Library"**
   - Search for **"Google+ API"** or **"Google Identity"**
   - Click on it and click **"Enable"**

4. **Create OAuth 2.0 Credentials**
   - Go to **"APIs & Services"** → **"Credentials"**
   - Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
   - If prompted, configure the OAuth consent screen first:
     - Choose **"External"** (unless you have a Google Workspace)
     - Fill in:
       - **App name**: `MoodMeal`
       - **User support email**: Your email
       - **Developer contact**: Your email
     - Click **"Save and Continue"** through the steps
     - Click **"Back to Dashboard"**

5. **Create OAuth Client ID**
   - Application type: **"Web application"**
   - Name: `MoodMeal Web`
   - **Authorized JavaScript origins**:
     - Add: `https://wjmjibznrkzmfxxugjmy.supabase.co` (your Supabase project URL)
     - For local development, also add: `http://localhost:8081` (or your local port)
   - **Authorized redirect URIs**:
     - Add: `https://wjmjibznrkzmfxxugjmy.supabase.co/auth/v1/callback`
     - For local development: `http://localhost:8081/auth/v1/callback`
   - Click **"Create"**
   - **Copy the Client ID and Client Secret** (you'll need these next)

### Part B: Configure Google in Supabase

1. **Go to Supabase Authentication Providers**
   - In Supabase dashboard: **Authentication** → **Providers**
   - Find **"Google"** in the list

2. **Enable Google Provider**
   - Toggle **"Google"** to **ON**

3. **Enter Google Credentials**
   - **Client ID (for OAuth)**: Paste your Google Client ID
   - **Client Secret (for OAuth)**: Paste your Google Client Secret
   - Click **"Save"**

4. **Configure Redirect URL**
   - Supabase will automatically use: `https://[your-project].supabase.co/auth/v1/callback`
   - Make sure this matches what you added in Google Cloud Console

## Step 3: Configure Site URL (Important!)

1. **Go to Authentication Settings**
   - **Authentication** → **URL Configuration**

2. **Set Site URL**
   - **Site URL**: 
     - For web: `http://localhost:8081` (or your local dev URL)
     - For production: Your Vercel/deployment URL
   - **Redirect URLs**: Add these:
     - `http://localhost:8081/**` (for local development)
     - `https://your-vercel-url.vercel.app/**` (for production)
     - `exp://localhost:8081` (if using Expo)

## Step 4: Test Authentication

1. **Test Email Sign Up**
   - Run your app: `npm run web` or `npm start`
   - Try creating an account with email/password
   - Check Supabase dashboard → **Authentication** → **Users** to see if user was created

2. **Test Google Login**
   - Click "login with google" button
   - You should be redirected to Google sign-in
   - After signing in, you should be redirected back to your app

## Troubleshooting

### Email Authentication Issues

- **"Email not confirmed" error**
  - Go to **Authentication** → **Providers** → **Email**
  - Toggle OFF **"Enable email confirmations"** for development

- **Can't sign up**
  - Check **Authentication** → **Users** to see if user exists
  - Check browser console for error messages

### Google OAuth Issues

- **"redirect_uri_mismatch" error**
  - Make sure the redirect URI in Google Console matches exactly:
    - `https://[your-project].supabase.co/auth/v1/callback`
  - Check for typos or extra slashes

- **"Invalid client" error**
  - Verify Client ID and Client Secret are correct in Supabase
  - Make sure you copied the full credentials (no extra spaces)

- **Google sign-in not working**
  - Check that Google+ API is enabled in Google Cloud Console
  - Verify the OAuth consent screen is configured
  - Check browser console for detailed error messages

### General Issues

- **"Invalid API key"**
  - Verify your `.env` file has correct credentials
  - Restart your dev server after changing `.env`

- **CORS errors**
  - Make sure your Site URL and Redirect URLs are configured correctly
  - Check that your local URL matches what's in Supabase settings

## Production Deployment

When deploying to Vercel:

1. **Update Site URL in Supabase**
   - Change Site URL to your production URL
   - Add production redirect URLs

2. **Update Google OAuth Settings**
   - Add production redirect URI to Google Cloud Console:
     - `https://your-app.vercel.app/auth/v1/callback`

3. **Set Environment Variables in Vercel**
   - Add `EXPO_PUBLIC_SUPABASE_URL`
   - Add `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## Security Notes

- ✅ The `anon` key is safe to use in client-side code (with RLS enabled)
- ❌ Never expose the `service_role` key in client-side code
- ✅ Google OAuth credentials are safe in Supabase (they're server-side)
- ✅ Always use HTTPS in production





