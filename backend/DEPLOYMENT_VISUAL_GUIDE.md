# Render.com Deployment - Visual Step-by-Step Guide

This guide provides a visual walkthrough of deploying your Church Census Backend to Render.com.

---

## 🎯 Overview

You will:
1. Create a PostgreSQL database (2 minutes)
2. Deploy your backend API (3 minutes)
3. Configure environment variables (1 minute)
4. Test your deployment (1 minute)

**Total Time: ~7 minutes**

---

## 📋 Step 1: Sign Up / Login to Render

1. Go to: https://render.com
2. Click **"Get Started for Free"**
3. Choose **"Sign up with GitHub"** (easiest option)
4. Authorize Render to access your GitHub account

✅ **You're now on the Render Dashboard**

---

## 🗄️ Step 2: Create PostgreSQL Database

### 2.1 Start Database Creation

On Render Dashboard:
- Click the **"New +"** button (top right)
- Select **"PostgreSQL"** from dropdown

### 2.2 Configure Database

Fill in the form:

| Field | Value |
|-------|-------|
| **Name** | `church-census-db` |
| **Database** | `census_db` |
| **User** | `census_user` |
| **Region** | Select closest to you (e.g., Oregon, Singapore) |
| **PostgreSQL Version** | 15 (or latest available) |
| **Instance Type** | **Free** ⭐ |

### 2.3 Create Database

- Click **"Create Database"** button at bottom
- Wait 30-60 seconds for provisioning
- Status will change to "Available" (green)

### 2.4 Copy Database URL

Once available:
1. Click on your database name
2. Scroll down to **"Connections"** section
3. Find **"Internal Database URL"**
4. Click the **Copy** icon 📋
5. **SAVE THIS URL** - you'll need it in Step 3!

Example URL format:
```
postgresql://census_user:abc123xyz@dpg-xxxxx.oregon-postgres.render.com/census_db
```

✅ **Database Created!**

---

## 🚀 Step 3: Deploy Backend API

### 3.1 Push Code to GitHub First

If you haven't already:
```bash
cd backend
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/church-census-backend.git
git branch -M main
git push -u origin main
```

### 3.2 Create Web Service

On Render Dashboard:
- Click **"New +"** button again
- Select **"Web Service"**

### 3.3 Connect Repository

- If first time: Click **"Connect GitHub"** and authorize
- Select your repository: `church-census-backend`
- Click **"Connect"**

### 3.4 Configure Web Service

Fill in the form:

| Field | Value |
|-------|-------|
| **Name** | `church-census-api` |
| **Region** | Same as database (important!) |
| **Branch** | `main` |
| **Root Directory** | (leave empty) |
| **Runtime** | Detected: Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | **Free** ⭐ |

### 3.5 Add Environment Variables

Scroll down to **"Environment Variables"** section:

Click **"Add Environment Variable"** twice and add:

**Variable 1:**
- Key: `NODE_ENV`
- Value: `production`

**Variable 2:**
- Key: `DATABASE_URL`
- Value: [Paste the Internal Database URL from Step 2.4]

### 3.6 Deploy!

- Click **"Create Web Service"** at bottom
- Render will start building and deploying
- **Wait 2-3 minutes** for first deploy

You'll see:
1. "Build in progress..." (1-2 minutes)
2. "Build complete, starting service..."
3. "Live" (green dot) ✅

---

## ✅ Step 4: Verify Deployment

### 4.1 Find Your API URL

On your web service dashboard:
- Look at top left for your URL
- Format: `https://church-census-api.onrender.com`
- Click to copy 📋

### 4.2 Test in Browser

Open these URLs in your browser (replace `church-census-api` with your name):

**Test 1: Health Check**
```
https://church-census-api.onrender.com/api/health
```
Should show:
```json
{"status":"ok","timestamp":"2024-01-15T10:30:00.000Z"}
```

**Test 2: Root Endpoint**
```
https://church-census-api.onrender.com/
```
Should show:
```json
{"message":"Church Census API"}
```

**Test 3: Members List**
```
https://church-census-api.onrender.com/api/members
```
Should show:
```json
{"members":[],"total":0,"page":1,"totalPages":0}
```

### 4.3 Test Using Script

From your computer:
```bash
cd backend
node test-deployed-api.js https://church-census-api.onrender.com
```

Should see all green checkmarks ✅

---

## 📊 Step 5: Check Logs

On your web service dashboard:

1. Click **"Logs"** tab
2. You should see:
   ```
   ✓ Database connection established successfully
   ✓ Database models synchronized
   ✓ Server is running on port 3000
   ```

If you see errors:
- Check DATABASE_URL is correct
- Ensure both service and database are in same region
- Check environment variables

---

## 🔄 Step 6: Enable Auto-Deploy

**Good news**: Already enabled by default! ✅

Every time you push to GitHub:
```bash
git add .
git commit -m "Update feature"
git push
```

Render automatically:
1. Detects the push
2. Rebuilds your app
3. Deploys new version
4. Takes 1-2 minutes

You can see deploy status in **"Events"** tab.

---

## ⏰ Step 7: Set Up Keep-Alive (Important!)

Free tier services sleep after 15 minutes of inactivity. Let's prevent that!

### Option A: Cron-Job.org (Recommended)

1. Go to: https://cron-job.org/en/
2. Click **"Sign up"**
3. Verify email
4. Click **"Create cron job"**
5. Fill in:
   - **Title**: "Church Census Keep-Alive"
   - **Address**: `https://church-census-api.onrender.com/api/health`
   - **Schedule**: 
     - Every: `14 minutes`
     - Or custom: `*/14 * * * *`
   - **Enabled**: ✅
6. Click **"Create"**

Done! Your service will now stay awake 24/7.

### Option B: UptimeRobot

1. Go to: https://uptimerobot.com
2. Sign up for free
3. Add New Monitor:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: Church Census API
   - **URL**: `https://church-census-api.onrender.com/api/health`
   - **Monitoring Interval**: 5 minutes
4. Create Monitor

---

## 🎉 Success Checklist

- ✅ PostgreSQL database created and running
- ✅ Web service deployed and "Live"
- ✅ Environment variables configured
- ✅ API responding to requests
- ✅ Database connection working
- ✅ Auto-deploy enabled
- ✅ Keep-alive cron job set up

---

## 📱 Next Steps

1. **Copy your API URL**: `https://church-census-api.onrender.com`

2. **Update Mobile App**: In your React Native app, update the API URL:
   ```javascript
   // mobile/src/config/api.js
   const API_URL = 'https://church-census-api.onrender.com/api';
   ```

3. **Test from Mobile**: Run your mobile app and test:
   - Creating a member
   - Viewing members list
   - Searching and filtering
   - Updating a member

---

## 🔍 Monitoring Your Deployment

### Render Dashboard Features

**Logs Tab**:
- Real-time application logs
- Error messages
- Request logs

**Metrics Tab**:
- CPU usage
- Memory usage
- Bandwidth usage
- Request count

**Events Tab**:
- Deployment history
- Auto-deploy events
- Service restarts

**Shell Tab**:
- Access database directly
- Run SQL queries
- Check data

---

## ❓ Troubleshooting

### Issue: Service shows "Deploy failed"

**Check**:
1. Build logs for error messages
2. package.json has all dependencies
3. Node version compatibility

**Fix**:
```bash
# Ensure all deps are in package.json
npm install --save express pg sequelize dotenv cors
git add package.json package-lock.json
git commit -m "Fix dependencies"
git push
```

### Issue: Database connection error

**Check**:
1. DATABASE_URL environment variable is set
2. DATABASE_URL value is correct (from database dashboard)
3. Service and database are in same region

**Fix**:
1. Go to web service settings
2. Check environment variables
3. Update DATABASE_URL if needed
4. Click "Save Changes"
5. Manually redeploy

### Issue: API returns 503 after idle time

**Normal**: Free tier spins down after 15 minutes

**Fix**: Set up cron job (Step 7 above)

First request after sleep takes 30-60 seconds.

### Issue: CORS errors from mobile app

**Add CORS configuration** in server.js:
```javascript
app.use(cors({
  origin: '*', // For development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
```

---

## 💰 Cost Reminder

**Free Tier Includes**:
- ✅ PostgreSQL 1GB storage (~10,000+ members)
- ✅ 750 hours/month web service (24/7 coverage)
- ✅ 100GB bandwidth/month
- ✅ Automatic SSL/HTTPS
- ✅ Daily backups (7 days retention)

**Total Cost: ₹0/month** 🎉

---

## 📚 Additional Resources

- **Render Docs**: https://render.com/docs
- **Support**: https://community.render.com
- **Status**: https://status.render.com

---

## 📝 Your Deployment Info

Write your details here for reference:

**Deployed API URL**: ________________________________

**Database Name**: ________________________________

**Cron Job Service**: ________________________________

**Deployment Date**: ________________________________

**GitHub Repository**: ________________________________

---

✅ **Deployment Complete!**

Your Church Census Backend is now:
- 🌍 Accessible from anywhere in the world
- 🔒 Secured with HTTPS
- 💾 Connected to PostgreSQL database
- 🔄 Auto-deploying from GitHub
- 🆓 Running completely free!

**Next**: Set up the mobile app and connect it to your API! 📱
