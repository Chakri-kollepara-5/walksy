# Frontend Deployment Guide

This guide explains how to deploy only the frontend to Vercel/Netlify after the project reorganization.

## Prerequisites

- Your backend is deployed separately (or running locally)
- You have the backend API URL ready

## Method 1: Deploy via Vercel (Recommended)

### Step 1: Push Updated Code to GitHub

```bash
cd c:\walksy-earn-flow-main_222

# Check git status
git status

# Add all changes
git add .

# Commit with a descriptive message
git commit -m "Reorganized project: separated frontend and backend into distinct folders"

# Push to GitHub
git push origin main
```

### Step 2: Configure Vercel

The `vercel.json` file has been updated to automatically:
- Build from the `frontend/` directory
- Install dependencies in `frontend/`
- Output to `frontend/dist`

**If deploying via Vercel Dashboard:**
1. Go to your Vercel project settings
2. Vercel will automatically detect the `vercel.json` configuration
3. Redeploy the project

**If deploying via Vercel CLI:**
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Deploy from root directory
vercel --prod
```

### Step 3: Set Environment Variables in Vercel

Make sure to set your environment variable in Vercel dashboard:
- `VITE_API_URL` = Your backend API URL (e.g., `https://your-backend.onrender.com/api`)

---

## Method 2: Deploy via Netlify

### Step 1: Push to GitHub (same as above)

### Step 2: Configure Netlify

Create a `netlify.toml` file in the root directory:

```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 3: Set Environment Variables in Netlify

In Netlify dashboard, add:
- `VITE_API_URL` = Your backend API URL

---

## Method 3: Deploy Only Frontend Folder (Git Subtree)

If you want to keep a separate branch with only frontend code:

```bash
# Create and push a frontend-only branch
git subtree split --prefix frontend -b frontend-only
git push origin frontend-only

# Then configure Vercel/Netlify to deploy from the 'frontend-only' branch
```

---

## Quick Deployment Commands

```bash
# 1. Commit and push changes
git add .
git commit -m "Updated frontend code"
git push origin main

# 2. Vercel will auto-deploy, or manually trigger:
vercel --prod
```

---

## Troubleshooting

### Build fails on Vercel
- Check that `vercel.json` is in the root directory
- Verify environment variables are set
- Check build logs for missing dependencies

### API calls fail after deployment
- Verify `VITE_API_URL` environment variable is set correctly
- Make sure backend CORS allows your frontend domain
- Check backend is running and accessible

### Old code still showing
- Clear Vercel build cache: Settings → General → Clear Build Cache
- Force a new deployment
- Check you pushed to the correct branch (usually `main`)
