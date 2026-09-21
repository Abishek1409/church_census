# Quick Deploy to Render.com - 5 Minute Guide

## Prerequisites
✅ Backend code working locally  
✅ GitHub account  
✅ 5 minutes of your time  

## Step 1: Push to GitHub (2 minutes)

```bash
cd backend
git init
git add .
git commit -m "Ready for deployment"
# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/church-census-backend.git
git branch -M main
git push -u origin main
```

## Step 2: Create Database on Render (1 minute)

1. Go to https://render.com (sign up with GitHub)
2. Click **New +** → **PostgreSQL**
3. Settings:
   - Name: `church-census-db`
   - Plan: **Free**
4. Click **Create Database**
5. Copy **Internal Database URL** (save it!)

## Step 3: Deploy Backend API (2 minutes)

1. Click **New +** → **Web Service**
2. Connect your GitHub repo
3. Settings:
   - Name: `church-census-api`
   - Build: `npm install`
   - Start: `npm start`
   - Plan: **Free**
4. **Environment Variables** (click Advanced):
   - `NODE_ENV` = `production`
   - `DATABASE_URL` = [paste from step 2]
5. Click **Create Web Service**

## Step 4: Test Your API (30 seconds)

Your API is live at: `https://church-census-api.onrender.com`

Test it:
```bash
curl https://your-app-name.onrender.com/api/health
```

Should return: `{"status":"ok","timestamp":"..."}`

## Step 5: Set Up Keep-Alive (Optional, 2 minutes)

To prevent free tier sleep:

1. Go to https://cron-job.org (free signup)
2. Create job:
   - URL: `https://your-app-name.onrender.com/api/health`
   - Every: **14 minutes**
3. Enable and save

## Done! 🎉

Your backend is now:
- ✅ Deployed and accessible worldwide
- ✅ Connected to PostgreSQL database
- ✅ Auto-deploys on every Git push
- ✅ Running 24/7 (with cron job)
- ✅ Free forever

## Your Deployed URL

Write it here: `https://_______________________.onrender.com`

Use this URL in your mobile app!

## Next Steps

- Update mobile app with this URL
- Monitor at https://dashboard.render.com
- Check logs if issues occur

## Troubleshooting

**First request slow?**  
→ Free tier wakes up in 30 seconds (normal)

**Can't connect?**  
→ Check environment variables in Render dashboard

**Database error?**  
→ Verify DATABASE_URL is correct

## Auto-Deploy

Every time you push to GitHub:
```bash
git add .
git commit -m "Update"
git push
# Render auto-deploys in 1-2 minutes
```

---

For detailed instructions: See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)
