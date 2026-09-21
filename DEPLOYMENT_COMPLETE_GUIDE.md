# Church Census System - Complete Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Deployment (Render.com)](#backend-deployment-rendercom)
3. [Keep-Alive Setup (Cron-Job.org)](#keep-alive-setup-cron-joborg)
4. [Building Mobile App (APK)](#building-mobile-app-apk)
5. [Testing the Deployment](#testing-the-deployment)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts (All Free)
- [ ] GitHub account (to host your code)
- [ ] Render.com account (for backend hosting)
- [ ] Cron-Job.org account (for keep-alive service)
- [ ] Expo account (for building APK)

### Required Software
- [ ] Node.js (v16 or higher) - [Download](https://nodejs.org/)
- [ ] Git - [Download](https://git-scm.com/)
- [ ] Code editor (VS Code recommended)

### Verify Installations
Open terminal/command prompt and run:
```bash
node --version
# Should show v16.x.x or higher

npm --version
# Should show 8.x.x or higher

git --version
# Should show git version 2.x.x
```

---

## Backend Deployment (Render.com)

### Step 1: Prepare Your Code

1. **Ensure your code is on GitHub**
   ```bash
   # If not already done, initialize git and push to GitHub
   cd backend
   git init
   git add .
   git commit -m "Initial backend commit"
   git remote add origin https://github.com/YOUR_USERNAME/church-census-backend.git
   git push -u origin main
   ```

2. **Verify environment file**
   - Make sure `backend/.env.example` exists (it should already)
   - This file shows what environment variables are needed

### Step 2: Create Render.com Account

1. Go to [https://render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Sign up with GitHub (recommended for easier deployment)
4. Verify your email address

### Step 3: Create PostgreSQL Database

1. From Render dashboard, click **"New +"** button
2. Select **"PostgreSQL"**
3. Fill in the details:
   - **Name**: `church-census-db` (or any name you prefer)
   - **Database**: `census_db`
   - **User**: `census_user` (or leave default)
   - **Region**: Choose closest to your location (e.g., Oregon, Singapore)
   - **PostgreSQL Version**: 15 (or latest)
   - **Instance Type**: **Free** (this is important!)
4. Click **"Create Database"**
5. Wait 2-3 minutes for database to be created

### Step 4: Get Database Connection URL

1. Once database is created, go to database dashboard
2. Scroll down to **"Connections"** section
3. Copy the **"Internal Database URL"** (it looks like this):
   ```
   postgresql://census_user:abc123xyz@dpg-xxxxx-a.oregon-postgres.render.com/census_db
   ```
4. **SAVE THIS URL** - you'll need it in the next step

### Step 5: Create Web Service (Backend API)

1. From Render dashboard, click **"New +"** button
2. Select **"Web Service"**
3. Click **"Build and deploy from a Git repository"**
4. Click **"Connect" next to your GitHub repository**
   - If you don't see your repo, click "Configure account" to grant access
5. Fill in the service details:
   - **Name**: `church-census-api` (this will be your URL)
   - **Region**: Same as your database (e.g., Oregon)
   - **Branch**: `main` (or `master`)
   - **Root Directory**: `backend` (if your backend is in a folder)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: **Free** (important!)

6. Click **"Advanced"** to add environment variables

### Step 6: Configure Environment Variables

In the "Environment Variables" section, add:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Paste the Internal Database URL from Step 4 |
| `PORT` | `3000` |

Click **"Add Environment Variable"** for each one.

### Step 7: Deploy

1. Click **"Create Web Service"**
2. Render will start building and deploying your app
3. Wait 5-10 minutes for first deployment (grab a coffee ☕)
4. Watch the logs - you'll see:
   ```
   ==> Building...
   ==> Installing dependencies...
   ==> Starting server...
   ==> Server is running on port 3000
   ==> Database connected successfully
   ==> Your service is live!
   ```

### Step 8: Get Your API URL

1. Once deployed, you'll see: **"Your service is live at https://church-census-api.onrender.com"**
2. **SAVE THIS URL** - this is your backend API URL
3. Test it by visiting: `https://church-census-api.onrender.com/api/health`
4. You should see: `{"status":"ok","timestamp":"2024-01-15T10:30:00.000Z"}`

### Step 9: Initialize Database Schema

The database tables should be created automatically when the server starts (via Sequelize sync). To verify:

1. Go to Render database dashboard
2. Click **"Connect"** (opens a SQL shell)
3. Run: `\dt` to list tables
4. You should see the `members` table

If tables are not created, you may need to manually run the schema:
1. In Render database shell, paste the SQL from `backend/config/database.js` schema

---

## Keep-Alive Setup (Cron-Job.org)

Render.com free tier sleeps after 15 minutes of inactivity. A cron job keeps it awake.

### Step 1: Create Cron-Job.org Account

1. Go to [https://cron-job.org](https://cron-job.org)
2. Click **"Sign Up"** (top right)
3. Enter your email and create password
4. Verify your email address
5. Log in to your account

### Step 2: Create a New Cron Job

1. From dashboard, click **"Create Cronjob"**
2. Fill in the details:
   - **Title**: `Church Census Keep-Alive`
   - **Address/URL**: `https://church-census-api.onrender.com/api/health`
     (Replace with YOUR actual Render URL from previous step)
   - **Enabled**: ✅ (checked)

### Step 3: Set Schedule

In the "Schedule" section:
- **Every**: `14 minutes`
- **Days**: All days selected
- **Months**: All months selected
- **Start now**: ✅ (checked)

### Step 4: Configure Options

- **Timeout**: 30 seconds (to account for spin-up time)
- **Email notification on failure**: ✅ (optional, but recommended)
- **Save responses**: ✅ (optional, helps with debugging)

### Step 5: Save and Verify

1. Click **"Create Cronjob"**
2. You should see it in your dashboard with status "Enabled"
3. Within 14 minutes, you'll see the first execution
4. Check "Execution history" to verify it's working
5. You should see HTTP 200 responses

**Important**: Your backend will now stay awake 24/7 for free!

---

## Building Mobile App (APK)

### Step 1: Update API URL in Mobile App

1. Open `mobile/src/config/api.js`
2. Find this line:
   ```javascript
   const API_BASE_URL = 'https://church-census.onrender.com/api'
   ```
3. Replace with YOUR actual Render URL:
   ```javascript
   const API_BASE_URL = 'https://church-census-api.onrender.com/api'
   ```
   (Use the URL from Backend Deployment Step 8)
4. Save the file

### Step 2: Install Expo CLI and Login

```bash
# Install Expo CLI globally
npm install -g expo-cli

# Login to Expo (or create account if you don't have one)
npx expo login
```

Follow prompts to login or create an account.

### Step 3: Install Dependencies

```bash
cd mobile
npm install
```

### Step 4: Test the App Locally First

```bash
npx expo start
```

This opens Expo Dev Tools. Test on your phone:
1. Install "Expo Go" app from Play Store
2. Scan QR code from terminal
3. Test that app connects to your Render backend
4. Create a test member to verify everything works

Press `Ctrl+C` to stop the dev server when done.

### Step 5: Build APK for Android

**Option A: EAS Build (Recommended - Cloud Build)**

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build APK
eas build -p android --profile preview
```

This builds in the cloud (takes 10-15 minutes). When done, you'll get a download link.

**Option B: Local Build (Requires Android Studio)**

Only if you have Android Studio installed:
```bash
npx expo prebuild
npx expo run:android --variant release
```

### Step 6: Download and Test APK

1. Once build completes, download the APK file
2. Transfer to your Android phone (via USB, Google Drive, or email)
3. On your phone:
   - Enable "Install from Unknown Sources" in Settings
   - Open the APK file
   - Click "Install"
4. Open the app and test all features

### Step 7: Distribute the APK

**For Internal Use (Free)**
- Share APK via:
  - Google Drive
  - WhatsApp
  - Email
  - USB transfer

**For Play Store (₹1,800 one-time fee)**
- Create Google Play Developer account
- Upload APK to Play Console
- Fill in app listing details
- Submit for review (takes 2-3 days)

---

## Testing the Deployment

### Test Backend API

Use a browser or tool like Postman:

```bash
# Health check
GET https://church-census-api.onrender.com/api/health

# Get all members (should return empty array initially)
GET https://church-census-api.onrender.com/api/members

# Create a test member
POST https://church-census-api.onrender.com/api/members
Body: {
  "fullName": "Test User",
  "aadharNumber": "123456789012",
  "phoneNumber": "9876543210",
  "community": "Catholic",
  "subCaste": "Latin",
  "housingType": "Owned",
  "address": "123 Test Street",
  "hasPatta": true,
  "occupation": "Teacher",
  "income": "50000",
  "educationQualification": "Graduate",
  "rationCardNumber": "RAT123456"
}
```

### Test Mobile App

1. Open the app on your phone
2. Create a new member
3. View member list
4. Search for the member
5. Edit the member
6. View member details
7. Test filters
8. Delete the member

### Test Keep-Alive

1. Wait 20 minutes without accessing your backend
2. Try accessing a member in the app
3. First request might take 10-20 seconds (Render waking up)
4. Subsequent requests should be fast
5. Check cron-job.org dashboard - should show successful pings

---

## Troubleshooting

### Backend Issues

**Problem: Database connection failed**
- Solution: Check DATABASE_URL environment variable is correct
- Go to Render dashboard → Web Service → Environment → Verify DATABASE_URL
- Make sure you copied the "Internal Database URL" not "External"

**Problem: Server won't start**
- Solution: Check logs in Render dashboard → Logs tab
- Look for error messages (missing dependencies, syntax errors)
- Verify `package.json` has correct start script: `"start": "node server.js"`

**Problem: 404 errors on all routes**
- Solution: Make sure Root Directory is set correctly
- If backend is in a folder, set Root Directory to `backend`

### Keep-Alive Issues

**Problem: Cron job shows red (failed)**
- Solution: Check if backend URL is correct
- Verify timeout is set to 30 seconds (spin-up takes time)
- Check Render logs to see if /api/health endpoint exists

**Problem: Backend still sleeping**
- Solution: Verify cron job is enabled (green status)
- Check execution history shows recent runs
- Make sure interval is 14 minutes (not longer than 15)

### Mobile App Issues

**Problem: Network Error / Cannot connect to server**
- Solution: Verify API_BASE_URL in `mobile/src/config/api.js`
- Make sure Render backend is running (check logs)
- Test backend URL directly in browser
- Check phone has internet connection

**Problem: APK build fails**
- Solution: 
  - Make sure all dependencies are installed: `npm install`
  - Check Node.js version: `node --version` (should be 16+)
  - Clear cache: `npx expo start -c`
  - Try rebuilding: `eas build -p android --profile preview --clear-cache`

**Problem: App crashes on open**
- Solution:
  - Check API URL is correct (common issue)
  - Verify backend is accessible
  - Check mobile app logs: `npx expo start` then press `j` to open debugger

### Database Issues

**Problem: Duplicate Aadhar error even with unique number**
- Solution: Database might have test data
- Go to Render database shell
- Run: `SELECT * FROM members;` to see all members
- Delete test data: `DELETE FROM members WHERE aadhar_number = '123456789012';`

**Problem: Tables not created**
- Solution: Enable Sequelize auto-sync
- In `backend/config/database.js`, verify sync is enabled
- Or manually run schema SQL in Render database shell

---

## Environment Variables Reference

### Backend (Render.com)

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Tells app it's in production mode |
| `DATABASE_URL` | `postgresql://user:pass@host/db` | PostgreSQL connection string |
| `PORT` | `3000` | Port number (Render assigns this) |

### Mobile App (in code)

| Variable | Value | Description |
|----------|-------|-------------|
| `API_BASE_URL` | `https://your-app.onrender.com/api` | Backend API URL |

---

## Quick Reference

### Render.com Dashboard URLs
- Web Services: https://dashboard.render.com/
- Database: Select your database from dashboard
- Logs: Web Service → Logs tab

### Cron-Job.org
- Dashboard: https://console.cron-job.org/
- Execution History: Dashboard → Your Job → History

### Useful Commands

```bash
# Test backend locally
cd backend
npm install
npm run dev

# Test mobile locally
cd mobile
npm install
npx expo start

# Build APK
cd mobile
eas build -p android --profile preview

# Check Render logs from CLI (if using Render CLI)
render logs church-census-api
```

---

## Cost Summary

- **Render.com**: ₹0/month (Free tier)
- **Cron-Job.org**: ₹0/month (Free tier)
- **Expo Builds**: ₹0 (Limited free builds per month)
- **APK Distribution**: ₹0 (Direct sharing)
- **Play Store (Optional)**: ₹1,800 one-time

**Total Running Cost: ₹0/month** 🎉

---

## Support

If you encounter issues not covered here:

1. Check Render logs for backend issues
2. Check mobile app console for app issues
3. Verify all URLs and environment variables
4. Test backend endpoints directly (browser/Postman)
5. Reach out to the development team

---

**Congratulations!** Your Church Census System is now deployed and accessible from anywhere! 🎊
