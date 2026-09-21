# Render.com Setup Quickstart

Quick reference guide for deploying Church Census backend to Render.com.

---

## 🎯 Goal

Deploy your backend API and PostgreSQL database to Render.com (100% free hosting).

**Time Required**: 15-20 minutes

---

## 📋 Prerequisites

- [x] Backend code pushed to GitHub
- [x] Render.com account (free signup)
- [x] GitHub account connected to Render

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Create Database (5 min)

1. **Login to Render**: https://dashboard.render.com
2. **Click**: New + → PostgreSQL
3. **Configure**:
   - Name: `church-census-db`
   - Database: `census_db`
   - User: `census_user`
   - Region: Oregon (or closest to you)
   - Instance: **Free** ⚠️ Important!
4. **Click**: Create Database
5. **Wait**: 2-3 minutes for provisioning
6. **Copy**: Internal Database URL (save it!)

**Database URL looks like**:
```
postgresql://census_user:password@dpg-xxxxx.oregon-postgres.render.com/census_db
```

---

### Step 2: Create Web Service (5 min)

1. **Click**: New + → Web Service
2. **Select**: Build and deploy from Git repository
3. **Connect**: Your GitHub repo (church-census-backend)
4. **Configure**:

| Setting | Value |
|---------|-------|
| Name | `church-census-api` |
| Region | Same as database (Oregon) |
| Branch | `main` |
| Root Directory | `backend` (if in subfolder) |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Instance Type | **Free** ⚠️ |

5. **Click**: Advanced → Add Environment Variables

---

### Step 3: Configure Environment Variables (3 min)

Add these 3 variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Paste URL from Step 1 |
| `PORT` | `3000` |

**Click**: Create Web Service

---

## ⏳ Deployment

Render will now:
1. Clone your GitHub repo
2. Install dependencies
3. Start your server
4. Connect to database

**Watch the logs** - deployment takes 5-10 minutes.

**Success looks like**:
```
==> Starting server...
✓ Server is running on port 3000
✓ Database connected successfully
==> Your service is live at https://church-census-api.onrender.com
```

---

## ✅ Verify Deployment

### Test 1: Health Check

Open in browser:
```
https://church-census-api.onrender.com/api/health
```

**Expected response**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Test 2: Members Endpoint

```
https://church-census-api.onrender.com/api/members
```

**Expected response** (empty initially):
```json
{
  "success": true,
  "data": [],
  "total": 0
}
```

### Test 3: Create Member (using Postman or curl)

```bash
curl -X POST https://church-census-api.onrender.com/api/members \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "aadharNumber": "123456789012",
    "phoneNumber": "9876543210",
    "community": "Catholic",
    "subCaste": "Latin",
    "housingType": "Owned",
    "address": "123 Test St",
    "hasPatta": true,
    "occupation": "Teacher",
    "income": "50000",
    "educationQualification": "Graduate",
    "rationCardNumber": "RAT123"
  }'
```

**If all 3 tests pass**: Deployment successful! ✅

---

## 🔧 Common Issues

### Issue 1: Database Connection Failed

**Check**: DATABASE_URL is the "Internal" URL, not "External"
- Go to Database dashboard
- Copy from "Internal Database URL" section
- Update Web Service → Environment variables

### Issue 2: Build Failed

**Check Logs**:
1. Go to Web Service dashboard
2. Click "Logs" tab
3. Look for error messages

**Common causes**:
- Missing `package.json` in root/backend folder
- Wrong Root Directory setting
- Dependencies installation failed

**Fix**:
- Verify `package.json` exists
- Check Root Directory is `backend` (if applicable)
- Ensure `npm install` works locally

### Issue 3: 404 on All Routes

**Check**: Root Directory setting
- If backend code is in `backend/` folder, set Root Directory to `backend`
- If backend code is in repo root, leave Root Directory empty

### Issue 4: Server Starts Then Crashes

**Check Logs** for:
- Database connection errors → Fix DATABASE_URL
- Port binding errors → Normal, Render handles this
- Missing dependencies → Check package.json

---

## 📝 Important URLs to Save

After deployment, save these:

1. **API URL**: `https://church-census-api.onrender.com`
2. **Database URL**: `postgresql://user:pass@host/db`
3. **Render Dashboard**: https://dashboard.render.com

You'll need the API URL for:
- Mobile app configuration
- Cron job setup
- Testing and debugging

---

## 🔄 Automatic Deploys

Render automatically redeploys when you:
- Push to GitHub main branch
- Update environment variables
- Manually trigger redeploy

**To manually redeploy**:
1. Go to Web Service dashboard
2. Click "Manual Deploy" → Deploy latest commit

---

## 🎛️ Render Dashboard Tour

### Web Service Dashboard

**Tabs**:
- **Overview**: Service status, URL, recent deploys
- **Logs**: Real-time server logs (debugging)
- **Environment**: Manage environment variables
- **Settings**: Service configuration
- **Metrics**: Resource usage (CPU, memory)

### Database Dashboard

**Sections**:
- **Info**: Connection details, URLs
- **Connections**: Internal/External URLs
- **Metrics**: Database usage, storage
- **Settings**: Database configuration
- **Backups**: Automatic backups (available on paid plan)

---

## 💰 Free Tier Limits

### PostgreSQL Database
- **Storage**: 1 GB (enough for ~10,000-20,000 members)
- **Bandwidth**: Limited but sufficient for small/medium use
- **Backups**: No automatic backups (manual export recommended)

### Web Service
- **RAM**: 512 MB
- **CPU**: Shared
- **Bandwidth**: 100 GB/month (plenty for API usage)
- **Sleeping**: Spins down after 15 min inactivity
  - **Solution**: Use cron job (see CRON_JOB_SETUP.md)

---

## 🔒 Security Best Practices

### ✅ DO:
- Use Internal Database URL (not External)
- Set NODE_ENV to `production`
- Keep DATABASE_URL secret
- Enable automatic deploys from GitHub
- Monitor logs regularly

### ❌ DON'T:
- Commit DATABASE_URL to Git
- Share database credentials publicly
- Use same database for dev and production
- Disable HTTPS (Render forces HTTPS - good!)

---

## 📦 What Gets Deployed

When you deploy, Render:
1. Clones your GitHub repository
2. Runs `npm install` (installs dependencies)
3. Runs `npm start` (starts server)
4. Exposes service on public URL with HTTPS

**Files needed in your repo**:
- `package.json` (with dependencies and start script)
- `server.js` (or main entry file)
- All source code (models, routes, controllers, config)
- `.env.example` (template, not actual .env)

**Files NOT needed** (gitignored):
- `node_modules/` (installed during build)
- `.env` (use Render environment variables)
- Log files

---

## 🔄 Updating Your Deployment

### Code Changes

1. Make changes to your code locally
2. Test locally: `npm run dev`
3. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update feature"
   git push
   ```
4. Render automatically detects and redeploys

### Environment Variable Changes

1. Go to Render dashboard
2. Web Service → Environment tab
3. Edit or add variables
4. Click "Save Changes"
5. Service automatically redeploys

### Database Schema Changes

If you add new fields to models:

**Option 1: Automatic (Sequelize sync)**
- Sequelize can auto-update schema
- Enabled in `config/database.js`: `sequelize.sync({ alter: true })`

**Option 2: Manual SQL**
1. Go to Database dashboard
2. Click "Connect" → Opens shell
3. Run ALTER TABLE commands

---

## 📊 Monitoring Your Service

### Check Service Health

**Dashboard Indicators**:
- 🟢 Green: Service running
- 🟡 Yellow: Deploying
- 🔴 Red: Service failed

### View Logs

**Real-time logs**:
1. Web Service → Logs tab
2. Shows all console.log() output
3. Shows errors and warnings

**Search logs**:
- Use browser Ctrl+F to search
- Look for "Error", "Failed", "Warning"

### Resource Usage

**Metrics tab shows**:
- CPU usage
- Memory usage
- Request count
- Response times

---

## 🆘 Getting Help

### Render Support

- **Docs**: https://render.com/docs
- **Community**: https://community.render.com
- **Status**: https://status.render.com (check for outages)

### Troubleshooting Checklist

If something's wrong:
1. ✅ Check Render status page (platform issues?)
2. ✅ Check service logs (error messages?)
3. ✅ Verify environment variables (all set?)
4. ✅ Test database connection (can connect?)
5. ✅ Check GitHub repo (code pushed?)
6. ✅ Try manual redeploy (might fix transient issues)

---

## 🎉 Next Steps

After successful deployment:

1. ✅ **Save your API URL**: You'll need it for mobile app
2. ✅ **Set up keep-alive**: See CRON_JOB_SETUP.md
3. ✅ **Update mobile app**: Change API_BASE_URL to your Render URL
4. ✅ **Test all endpoints**: Verify CRUD operations work
5. ✅ **Build mobile APK**: See APK_BUILD_GUIDE.md

---

## 📚 Related Guides

- **Complete Deployment Guide**: DEPLOYMENT_COMPLETE_GUIDE.md
- **Cron Job Setup**: CRON_JOB_SETUP.md
- **Environment Variables**: ENVIRONMENT_VARIABLES.md
- **APK Building**: APK_BUILD_GUIDE.md

---

## ⚡ Quick Commands Reference

```bash
# Test health endpoint
curl https://your-app.onrender.com/api/health

# Test members endpoint
curl https://your-app.onrender.com/api/members

# Create test member
curl -X POST https://your-app.onrender.com/api/members \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","aadharNumber":"123456789012",...}'

# Check service logs (if using Render CLI)
render logs your-service-name
```

---

**Deployment time**: ~20 minutes  
**Result**: Fully functional backend API with database, accessible from anywhere! 🚀

---

*Last Updated: January 2025*
*Part of Church Census System documentation*
