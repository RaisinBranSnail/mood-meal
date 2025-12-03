# Deploying MoodMeal to Vercel

This guide will help you deploy your MoodMeal app to Vercel with mobile viewport styling.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. A Supabase project with your credentials
3. Git repository (GitHub, GitLab, or Bitbucket)

## Setup Steps

### 1. Environment Variables

Before deploying, make sure you have your Supabase credentials set up:

- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from the mood-meals directory
cd nutrition-app/mood-meals
vercel

# Follow the prompts and add your environment variables
```

#### Option B: Using Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your Git repository
3. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `nutrition-app/mood-meals`
   - **Build Command**: `npm run web`
   - **Output Directory**: `.expo/web-build`
4. Add environment variables:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
5. Click Deploy

### 3. Build Configuration

The `vercel.json` file is already configured with:
- Build command: `npm run web`
- Output directory: `.expo/web-build`
- SPA routing rewrites

### 4. Mobile Viewport

The app is configured to automatically display in mobile view on web:
- Fixed width of 375px (iPhone standard) on desktop
- Full width on mobile devices
- Centered with shadow effect on larger screens
- Touch-friendly interactions

## Testing Locally

Before deploying, test the web build locally:

```bash
cd nutrition-app/mood-meals
npm run web
```

Then open http://localhost:8081 in your browser to see the mobile viewport.

## Troubleshooting

### Build Fails

- Make sure all dependencies are installed: `npm install`
- Check that environment variables are set correctly
- Verify Supabase credentials are valid

### Mobile View Not Working

- Clear browser cache
- Check browser console for errors
- Verify `MobileViewport` component is wrapping the app in `app/_layout.tsx`

### Routing Issues

- The `vercel.json` includes SPA routing rewrites
- All routes should redirect to `index.html` for client-side routing

## Notes

- The app uses Expo's static web output
- Mobile viewport is only applied on web platform (not native)
- The app will look like a mobile app even on desktop browsers

