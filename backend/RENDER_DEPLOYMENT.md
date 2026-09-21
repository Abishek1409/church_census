# Render.com Deployment Guide

## Prerequisites
- GitHub account
- Render.com account (free, no credit card required)
- Backend code pushed to GitHub repository

## Step 1: Prepare GitHub Repository

1. **Initialize Git repository in backend folder** (if not already done):
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial commit - Church Census Backend"
   ```

2. **Create GitHub repository**:
   - Go to https://github.com/new
   - Create a new repository (e.g., "church-census-backend")
   - Make it public or private (both work with Render)

3. **Push code to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/church-census-backend.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Create PostgreSQL Database on Render

1. **Sign up/Login to Render.com**:
   - Go to https://render.com
   - Sign up with GitHub (easiest option)

2. **Create PostgreSQL Database**:
   - Click "New +" button in dashboard
   - Select "PostgreSQL"
   - Fill in details:
     - **Name**: `church-census-db` (or your preferred name)
     - **Database**: `census_db`
     - **User**: `census_user`
     - **Region**: Select closest to your location
     - **PostgreSQL Version**: 15 (or latest)
     - **Plan**: Select **Free** (1 GB storage)
   - Click "Create Database"

3. **Save Database Connection String**:
   - Once created, go to database dashboard
   - Copy the **Internal Database URL** (starts with `postgresql://`)
   - It looks like: `postgresql://census_user:abc123xyz@dpg-xxxxx.oregon-postgres.render.com/census_db`
   - **IMPORTANT**: Keep this secure - it contains your password

## Step 3: Create Web Service (API Backend)

1. **Create Web Service**:
   - Click "New +" button in Render dashboard
   - Select "Web Service"
   - Connect your GitHub account (if not already)
   - Select your backend repository

2. **Configure Web Service**:
   - **Name**: `church-census-api` (or your preferred name)
   - **Region**: Same as database for best performance
   - **Branch**: `main`
   - **Root Directory**: Leave empty (or enter `backend` if repo has multiple folders)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Select **Free**

3. **Add Environment Variables**:
   Click "Advanced" and add these environment variables:
   
   - **NODE_ENV**: `production`
   - **DATABASE_URL**: Paste the Internal Database URL from Step 2
   - **PORT**: `3000` (optional, Render auto-assigns)

4. **Create Web Service**:
   - Click "Create Web Service"
   - Render will automatically deploy your app
   - Wait 2-3 minutes for first deployment

## Step 4: Verify Deployment

1. **Check Deployment Logs**:
   - Go to your web service dashboard
   - Click "Logs" tab
   - Look for success messages:
     ```
     ✓ Database connection established successfully
     ✓ Database models synchronized
     ✓ Server is running on port 3000
     ```

2. **Test API Endpoints**:
   Your API will be available at: `https://church-census-api.onrender.com`
   
   Test these endpoints:
   ```bash
   # Health check
   curl https://your-app-name.onrender.com/api/health
   
   # Get all members
   curl https://your-app-name.onrender.com/api/members
   
   # Get stats
   curl https://your-app-name.onrender.com/api/stats
   ```

3. **Note Your Deployed URL**:
   - Copy your deployed URL (e.g., `https://church-census-api.onrender.com`)
   - You'll need this for the mobile app configuration

## Step 5: Set Up Automatic Deploys

**Good news**: Automatic deploys are already enabled by default!

- Every time you push to the `main` branch on GitHub, Render automatically rebuilds and deploys
- You can disable this in Settings > Build & Deploy > Auto-Deploy

To manually deploy:
- Go to your web service dashboard
- Click "Manual Deploy" > "Clear build cache & deploy"

## Step 6: Important - Handle Free Tier Sleep

**Issue**: Free tier services spin down after 15 minutes of inactivity
**Solution**: Set up a free cron job to keep it awake

### Option A: Cron-Job.org (Recommended)

1. Go to https://cron-job.org/en/
2. Sign up for free account
3. Create new cron job:
   - **URL**: `https://your-app-name.onrender.com/api/health`
   - **Schedule**: Every 14 minutes
   - **Enabled**: Yes
4. Save and activate

### Option B: UptimeRobot

1. Go to https://uptimerobot.com/
2. Sign up for free account
3. Add new monitor:
   - **Monitor Type**: HTTP(s)
   - **URL**: `https://your-app-name.onrender.com/api/health`
   - **Monitoring Interval**: 5 minutes
4. Create monitor

## Troubleshooting

### Database Connection Failed
- Check DATABASE_URL is correct in environment variables
- Ensure database and web service are in same region
- Check database status in Render dashboard

### Build Failed
- Check build logs in Render dashboard
- Ensure `package.json` has correct dependencies
- Verify Node version compatibility

### API Returns 503 Service Unavailable
- Service is waking up from sleep (wait 30 seconds)
- Set up cron job to keep service awake

### Cannot Access API
- Check web service status (should be "Live")
- Verify URL is correct
- Check firewall/network settings

## Environment Variables Reference

```
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:port/database
PORT=3000
```

## Next Steps

1. ✅ Backend deployed and running
2. ✅ Database connected
3. ⬜ Set up cron job for keep-alive (Task 5)
4. ⬜ Update mobile app with deployed API URL
5. ⬜ Test all API endpoints from mobile app

## Useful Render.com Features

- **Logs**: Real-time logs for debugging
- **Metrics**: CPU, memory, bandwidth usage
- **Shell**: Access database shell directly
- **Backups**: Automatic daily backups (free tier: 7 days retention)
- **Custom Domain**: Add your own domain (optional)

## Cost Reminder

**Total Cost: ₹0/month**
- PostgreSQL: Free (1 GB)
- Web Service: Free (750 hours/month - sufficient for 24/7)
- Bandwidth: Free (100 GB/month)
- SSL Certificate: Free (automatic)

## Support

- Render Documentation: https://render.com/docs
- Community Forum: https://community.render.com
- Status Page: https://status.render.com

---

**Deployed URL**: _[Write your URL here after deployment]_

**Database Name**: _[Write your database name here]_

**Last Deployed**: _[Write date here]_
