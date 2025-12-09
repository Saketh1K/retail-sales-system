# Deployment Guide

Since I am an AI assistant, I cannot directly deploy your code to a public cloud provider due to authentication requirements. However, I have prepared the project for deployment.

Follow these steps to generate your **Live Application URL**:

## 1. Backend Deployment (Render or Vercel)
**Option A: Render (Recommended for SQLite)**
1. Push this repository to GitHub.
2. Sign up/Log in to [Render.com](https://render.com).
3. Click "New" -> "Web Service".
4. Connect your GitHub repository.
5. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run seed`
   - **Start Command**: `npm start`
6. Click "Create Web Service".
7. Copy the **Service URL** (e.g., `https://my-api.onrender.com`).

**Option B: Vercel**
1. Install Vercel CLI: `npm i -g vercel`
2. Run `cd backend && vercel`
3. Follow the prompts.

## 2. Frontend Deployment (Vercel)
1. In `frontend/src/services/api.js`, update the `baseURL` to your **Live Backend URL** from Step 1.
   ```javascript
   const api = axios.create({
       baseURL: 'https://your-backend-url.onrender.com/api',
   });
   ```
2. Navigate to frontend: `cd frontend`.
3. Run `npm run build`.
4. Run `npx vercel` (if you have the Vercel CLI) OR:
   - Push to GitHub.
   - Import the repo in Vercel Dashboard.
   - Set "Root Directory" to `frontend`.
   - Click "Deploy".

## 3. Submit
Once deployed, you will have two URLs. The Frontend URL is your **Live Application URL**.
