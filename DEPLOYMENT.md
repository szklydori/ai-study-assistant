# Deployment Guide - GitHub Pages

This document describes how to deploy the AI Study Assistant frontend to GitHub Pages.

## Prerequisites

1. The Django backend must be hosted separately (e.g., Railway, Render, Heroku, etc.)
2. GitHub repository created and code pushed

## Deployment Steps

### 1. Backend Deployment (if not already done)

Deploy the Django backend to a hosting service:
- **Railway**: https://railway.app
- **Render**: https://render.com
- **Heroku**: https://heroku.com
- **PythonAnywhere**: https://pythonanywhere.com

Note your backend API URL (e.g., `https://your-backend.railway.app/api/`)

### 2. Configure GitHub Secrets

1. Go to your GitHub repository
2. Click on the **Settings** tab
3. In the left menu, select **Secrets and variables** → **Actions**
4. Click the **New repository secret** button
5. Enter:
   - **Name**: `VITE_API_URL`
   - **Value**: Your backend API URL (e.g., `https://your-backend.railway.app/api/`)
6. Click the **Add secret** button

### 3. Configure GitHub Pages

1. Go to your GitHub repository
2. Click on the **Settings** tab
3. In the left menu, select **Pages**
4. Under **Source**, select: **GitHub Actions**
5. Settings will be saved automatically

### 4. Push to main branch

The workflow will run automatically when you push to the `main` branch:

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

### 5. Verify Deployment

1. Go to your GitHub repository
2. Click on the **Actions** tab
3. Wait for the "Deploy React App to GitHub Pages" workflow to complete (green checkmark)
4. If successful, your site will be available at: `https://szklydori.github.io/ai-study-assistant/`

## Troubleshooting

### Site not loading / 404 error

- Check that the base path in `frontend/vite.config.js` is correct:
  ```js
  base: process.env.GITHUB_ACTIONS ? '/ai-study-assistant/' : '/',
  ```
  If your repository name is different, update this part.

### API calls not working

- Verify that the `VITE_API_URL` secret is configured correctly
- Check that the backend API is accessible and CORS is configured
- In the backend `settings.py`, add the GitHub Pages URL to `CORS_ALLOWED_ORIGINS`:
  ```python
  CORS_ALLOWED_ORIGINS = [
      "https://szklydori.github.io",
      # ... other allowed origins
  ]
  ```

### Routing not working

- Check that the `basename` prop is set in `frontend/src/App.jsx`
- GitHub Pages automatically handles routing if the `404.html` file exists (Vite creates this automatically)

## Manual Deployment

If you want to trigger deployment manually without pushing:

1. Go to your GitHub repository
2. Click on the **Actions** tab
3. Select the "Deploy React App to GitHub Pages" workflow
4. Click the **Run workflow** button
5. Select the branch (usually `main`)
6. Click the **Run workflow** button

## Updates

When you make changes and push to the `main` branch, the workflow will automatically redeploy.
