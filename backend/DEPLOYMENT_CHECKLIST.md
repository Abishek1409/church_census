# Render.com Deployment Checklist

Use this checklist to ensure successful deployment of your Church Census Backend.

## Pre-Deployment Checklist

- [ ] All code changes committed to Git
- [ ] `.env` file is in `.gitignore` (never commit secrets!)
- [ ] `.env.example` exists with sample values
- [ ] All dependencies listed in `package.json`
- [ ] Health endpoint (`/api/health`) is working locally
- [ ] Local tests pass successfully

## GitHub Setup

- [ ] GitHub account created
- [ ] New repository created on GitHub
- [ ] Repository name: `church-census-backend` (or your choice)
- [ ] Git initialized in backend folder
- [ ] Code pushed to GitHub main branch

```bash
cd backend
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/church-census-backend.git
git branch -M main
git push -u origin main
```

## Render.com Account Setup

- [ ] Render.com account created at https://render.com
- [ ] Signed up using GitHub (recommended)
- [ ] Email verified

## Database Setup on Render

- [ ] PostgreSQL database created
- [ ] Database name: `church-census-db`
- [ ] Plan: Free (1 GB)
- [ ] Region selected (e.g., Oregon, Singapore)
- [ ] Database status: Available
- [ ] Internal Database URL copied and saved securely

**Your Database URL**: _________________________

## Web Service Setup on Render

- [ ] Web Service created
- [ ] Connected to GitHub repository
- [ ] Service name: `church-census-api`
- [ ] Runtime: Node
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Plan: Free
- [ ] Region: Same as database

## Environment Variables Configuration

Add these in Render Web Service settings:

- [ ] `NODE_ENV` = `production`
- [ ] `DATABASE_URL` = `[Your Internal Database URL from database dashboard]`
- [ ] `PORT` = `3000` (optional)

## First Deployment

- [ ] Clicked "Create Web Service"
- [ ] Deployment started automatically
- [ ] Waited 2-3 minutes for build and deploy
- [ ] Deployment status: Live (green)
- [ ] Checked logs for success messages:
  - ✓ Database connection established
  - ✓ Database models synchronized
  - ✓ Server is running on port 3000

## Testing Deployed API

Test these endpoints (replace `your-app-name` with your actual service name):

- [ ] Health check: `https://your-app-name.onrender.com/api/health`
- [ ] Root endpoint: `https://your-app-name.onrender.com/`
- [ ] Get members: `https://your-app-name.onrender.com/api/members`
- [ ] Get stats: `https://your-app-name.onrender.com/api/stats`

**Your Deployed URL**: https://_________________________.onrender.com

## Cron Job Setup (Keep-Alive)

Choose one option:

### Option 1: Cron-Job.org
- [ ] Created account at https://cron-job.org
- [ ] Added new cron job
- [ ] URL: `https://your-app-name.onrender.com/api/health`
- [ ] Interval: Every 14 minutes
- [ ] Status: Enabled

### Option 2: UptimeRobot
- [ ] Created account at https://uptimerobot.com
- [ ] Added new monitor (HTTP/s)
- [ ] URL: `https://your-app-name.onrender.com/api/health`
- [ ] Interval: 5 minutes
- [ ] Status: Active

## Automatic Deploys Configuration

- [ ] Auto-deploy enabled (default)
- [ ] Every push to `main` branch triggers deployment
- [ ] Tested by making a small change and pushing

## Documentation

- [ ] Deployed URL noted in this checklist
- [ ] Database credentials saved securely (password manager)
- [ ] Shared API URL with mobile app team
- [ ] Updated `.env.example` with production format

## Post-Deployment Verification

- [ ] API is accessible from mobile device
- [ ] Database tables created automatically (Sequelize sync)
- [ ] Can create a test member via API
- [ ] Can retrieve members via API
- [ ] Search and filter endpoints work
- [ ] Statistics endpoint returns data

## Next Steps

- [ ] Update mobile app configuration with deployed URL
- [ ] Test mobile app with production API
- [ ] Monitor Render dashboard for errors
- [ ] Set up alerts for downtime (optional)

## Troubleshooting Notes

**If deployment fails:**
1. Check build logs in Render dashboard
2. Verify all dependencies in package.json
3. Ensure Node version is compatible
4. Check environment variables are set correctly

**If API returns errors:**
1. Check service logs in Render dashboard
2. Verify DATABASE_URL is correct
3. Test database connectivity from Shell tab
4. Ensure CORS is configured for mobile app origin

**If service is slow:**
- First request after sleep takes 30-60 seconds (normal on free tier)
- Set up cron job to prevent sleeping
- Consider upgrading to paid tier if needed

## Important URLs

- Render Dashboard: https://dashboard.render.com
- Your Web Service: https://dashboard.render.com/web/[SERVICE_ID]
- Your Database: https://dashboard.render.com/d/[DATABASE_ID]
- GitHub Repository: https://github.com/[USERNAME]/[REPO_NAME]

## Deployment Date

**First Deployed**: _______________
**Last Updated**: _______________

---

## Quick Commands Reference

### Test API from command line:
```bash
# Health check
curl https://your-app-name.onrender.com/api/health

# Get all members
curl https://your-app-name.onrender.com/api/members

# Get statistics
curl https://your-app-name.onrender.com/api/stats

# Create member (POST)
curl -X POST https://your-app-name.onrender.com/api/members \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","aadharNumber":"123456789012",...}'
```

### Git deployment:
```bash
git add .
git commit -m "Update backend"
git push origin main
# Render auto-deploys within 1-2 minutes
```

---

✅ **Deployment Status**: _________________________

🎉 **API Live URL**: _________________________
