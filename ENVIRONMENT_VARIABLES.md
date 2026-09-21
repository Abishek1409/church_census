# Environment Variables Reference

This document lists all environment variables needed for the Church Census System deployment.

---

## Backend Environment Variables

These variables must be configured in your **Render.com Web Service**.

### Required Variables

#### 1. NODE_ENV
- **Description**: Specifies the application environment
- **Required**: Yes
- **Values**: `development` | `production`
- **Production Value**: `production`
- **Example**: 
  ```
  NODE_ENV=production
  ```

#### 2. DATABASE_URL
- **Description**: PostgreSQL database connection string
- **Required**: Yes
- **Format**: `postgresql://username:password@host:port/database`
- **Source**: Copy from Render.com PostgreSQL dashboard → "Internal Database URL"
- **Example**: 
  ```
  DATABASE_URL=postgresql://census_user:abc123xyz@dpg-xxxxx-a.oregon-postgres.render.com/census_db
  ```
- **Important Notes**:
  - Use **Internal Database URL**, not External
  - Keep this secret - never commit to Git
  - Includes username, password, host, and database name

#### 3. PORT
- **Description**: Port number for the Express server
- **Required**: Yes (Render auto-assigns, but good to specify)
- **Default**: `3000`
- **Production Value**: `3000`
- **Example**: 
  ```
  PORT=3000
  ```
- **Note**: Render will override this with their assigned port, but it's good practice to set it

---

## How to Set Environment Variables on Render.com

### During Initial Setup

1. When creating Web Service, scroll to **"Environment Variables"** section
2. Click **"Add Environment Variable"**
3. Enter **Key** and **Value**
4. Repeat for each variable
5. Click **"Create Web Service"**

### After Deployment

1. Go to Render dashboard
2. Select your Web Service (`church-census-api`)
3. Click **"Environment"** tab on the left
4. Click **"Add Environment Variable"**
5. Enter Key and Value
6. Click **"Save Changes"**
7. Service will automatically redeploy with new variables

### Updating Variables

1. Go to Service → Environment tab
2. Find the variable you want to change
3. Click the pencil (edit) icon
4. Update the value
5. Click **"Save Changes"**
6. Service will automatically redeploy

---

## Mobile App Configuration

The mobile app doesn't use traditional environment variables. Instead, it uses a configuration file.

### Configuration File

**File**: `mobile/src/config/api.js`

**Variable**: `API_BASE_URL`

**What to Update**:
```javascript
// BEFORE DEPLOYMENT (placeholder)
const API_BASE_URL = 'http://localhost:3000/api'

// AFTER DEPLOYMENT (your actual Render URL)
const API_BASE_URL = 'https://church-census-api.onrender.com/api'
```

**How to Update**:
1. Open `mobile/src/config/api.js` in code editor
2. Find the line: `const API_BASE_URL = ...`
3. Replace with your Render.com backend URL (from deployment)
4. Make sure to include `/api` at the end
5. Save the file
6. Rebuild the APK with updated URL

**Important**: 
- This must be done BEFORE building the APK
- If you rebuild backend with different URL, you must rebuild APK too
- No trailing slash: use `/api` not `/api/`

---

## Local Development Environment Variables

For running the backend locally during development.

### File: `backend/.env`

Create this file (it's gitignored) with:

```env
# Local Development Configuration
NODE_ENV=development
PORT=3000

# Local PostgreSQL (if using local database)
DATABASE_URL=postgresql://localhost:5432/census_db_local

# OR use Render database for local testing
DATABASE_URL=postgresql://census_user:abc123xyz@dpg-xxxxx-a.oregon-postgres.render.com/census_db
```

### How to Create Local .env File

1. Copy `.env.example` to `.env`:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edit `.env` with your values:
   ```bash
   # Windows
   notepad .env
   
   # Mac/Linux
   nano .env
   ```

3. Save the file

4. **NEVER commit .env to Git** (it's in .gitignore)

---

## Environment Variables Security

### ✅ DO:
- Store DATABASE_URL securely
- Use Render's environment variable management
- Keep .env file local (never commit)
- Use different databases for dev/production
- Rotate passwords periodically
- Use strong passwords for database

### ❌ DON'T:
- Commit .env file to Git
- Share DATABASE_URL publicly
- Hard-code credentials in source code
- Use same credentials for dev and production
- Include passwords in error messages
- Log sensitive environment variables

---

## Verifying Environment Variables

### On Render.com

1. Go to Web Service dashboard
2. Click **"Environment"** tab
3. You should see:
   ```
   NODE_ENV = production
   DATABASE_URL = postgresql://... (hidden)
   PORT = 3000
   ```

4. Values are partially hidden for security

### Testing Backend with Variables

After setting environment variables, test:

```bash
# Check health endpoint
curl https://your-app.onrender.com/api/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

If this works, environment variables are configured correctly!

### Common Issues

**Issue: Database connection failed**
- Check DATABASE_URL is the "Internal" URL, not "External"
- Verify no extra spaces in the URL
- Ensure database is in same region as web service

**Issue: Server won't start**
- Check all required variables are set
- Verify NODE_ENV is set to `production`
- Check Render logs for specific error

**Issue: Port binding error**
- Don't worry, Render manages ports automatically
- Just set PORT=3000 and let Render handle the rest

---

## Environment Variables for Different Stages

### Development (Local)
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://localhost:5432/census_db_local
```

### Staging (Optional)
```env
NODE_ENV=staging
PORT=3000
DATABASE_URL=postgresql://user:pass@staging-host/census_staging
```

### Production (Render.com)
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@render-host/census_db
```

---

## Backup and Recovery

### Backing Up Environment Variables

1. Document your DATABASE_URL in a secure location:
   - Password manager (recommended)
   - Encrypted file
   - Secure notes app

2. If you lose DATABASE_URL:
   - Go to Render PostgreSQL dashboard
   - Copy the "Internal Database URL" again
   - Update Web Service environment variables

### Rotating Database Credentials

If you need to change database password:

1. Create new PostgreSQL database on Render
2. Export data from old database
3. Import data to new database
4. Update DATABASE_URL in Web Service
5. Service will redeploy automatically

---

## Environment Variable Naming Conventions

We follow these conventions:

- **UPPERCASE_WITH_UNDERSCORES**: For environment variables (standard)
- **Descriptive names**: Clear purpose (DATABASE_URL not DB_URL)
- **No spaces**: Use underscores for multi-word names
- **Consistent prefixes**: Related variables grouped (DB_HOST, DB_PORT, DB_NAME)

---

## Troubleshooting Commands

### Check if variables are loaded (locally)

Create `test-env.js`:
```javascript
require('dotenv').config();
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
```

Run:
```bash
node test-env.js
```

### Check on Render (via logs)

Add this to `server.js` temporarily:
```javascript
console.log('Environment check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
```

Check Render logs to see output.

**Remember to remove these logs after testing!**

---

## Quick Reference Table

| Variable | Required | Where Set | Example Value |
|----------|----------|-----------|---------------|
| `NODE_ENV` | Yes | Render | `production` |
| `DATABASE_URL` | Yes | Render | `postgresql://user:pass@host/db` |
| `PORT` | Yes | Render | `3000` |
| `API_BASE_URL` | Yes | Code | `https://your-app.onrender.com/api` |

---

## Additional Resources

- Render Environment Variables Docs: https://render.com/docs/environment-variables
- Node.js Environment Best Practices: https://nodejs.org/en/learn/getting-started/nodejs-the-difference-between-development-and-production
- PostgreSQL Connection Strings: https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING

---

*Last Updated: January 2025*
*For deployment instructions, see DEPLOYMENT_COMPLETE_GUIDE.md*
