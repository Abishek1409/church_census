# Migration Deployment Guide for Render.com

This guide explains how to execute the database migration on your Render.com production database.

## Prerequisites

- [ ] Backend deployed on Render.com
- [ ] PostgreSQL database created and connected
- [ ] Environment variables configured (DATABASE_URL, JWT_SECRET, JWT_EXPIRY)
- [ ] All authentication code deployed (models, controllers, middleware)

## Pre-Migration Checklist

### 1. Verify Database Connection

Your `DATABASE_URL` should be in this format:
```
postgresql://username:password@host:port/database_name
```

Check your `.env` file or Render.com environment variables.

### 2. Customize Migration Settings

Before running the migration, edit `backend/migrations/001-initial-auth-setup.js`:

```javascript
// Set your administrator credentials
const ADMIN_CONFIG = {
  username: 'admin',              // Change if desired
  password: 'YourSecurePassword', // MUST CHANGE THIS!
  fullName: 'System Administrator'
};

// Add your actual regions
const INITIAL_REGIONS = [
  { name: 'Krishnagiri', type: 'VILLAGE', description: 'Main village area' },
  { name: 'Kaveripattinam', type: 'TOWN', description: 'Town area' },
  { name: 'Hosur', type: 'TOWN', description: 'Hosur town area' },
  // Add more regions here
];

// Decide if you want to assign existing members
const ASSIGN_EXISTING_MEMBERS = true;  // true or false
const DEFAULT_REGION_NAME = 'Krishnagiri'; // Must match a region above
```

**Commit and push** these changes to your repository.

## Option 1: Run Migration via Render Shell (Recommended)

This is the easiest method.

### Steps:

1. **Go to Render Dashboard**
   - Navigate to https://dashboard.render.com
   - Select your backend web service

2. **Open Shell Tab**
   - Click on the "Shell" tab in the left sidebar
   - Wait for the shell to connect

3. **Run Migration Command**
   ```bash
   node migrations/001-initial-auth-setup.js
   ```

4. **Verify Output**
   You should see:
   ```
   ============================================================
   Starting Initial Authentication Setup Migration
   ============================================================
   
   ✓ Database connection successful
   ✓ Created region: Krishnagiri (VILLAGE)
   ✓ Administrator created successfully
   ✓ Assigned X existing members to region: Krishnagiri
   
   Migration Completed Successfully!
   ```

5. **Run Verification**
   ```bash
   node migrations/verify-migration.js
   ```

6. **Test Administrator Login**
   ```bash
   curl -X POST https://your-app-url.onrender.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"YourSecurePassword"}'
   ```

## Option 2: Run Migration via Render CLI

If you prefer command-line access:

### Install Render CLI
```bash
npm install -g @render-com/cli
```

### Login to Render
```bash
render login
```

### Connect to Service Shell
```bash
render shell <your-service-name>
```

### Run Migration
```bash
node migrations/001-initial-auth-setup.js
```

## Option 3: Temporary Deploy Script (Alternative)

If shell access is not available, use this method:

### 1. Add Migration Script to package.json
Edit `backend/package.json`:
```json
{
  "scripts": {
    "start": "node server.js",
    "migrate": "node migrations/001-initial-auth-setup.js",
    "migrate-and-start": "node migrations/001-initial-auth-setup.js && node server.js"
  }
}
```

### 2. Temporarily Modify Start Command
In Render dashboard:
1. Go to your service settings
2. Change "Start Command" to: `npm run migrate-and-start`
3. Click "Save Changes"

### 3. Trigger Deployment
- Either push a new commit to trigger deploy
- Or manually deploy from Render dashboard

### 4. Watch Logs
- Migration will run on startup
- Check logs for success message

### 5. Revert Start Command
After migration completes successfully:
1. Change "Start Command" back to: `npm start`
2. Click "Save Changes"

**Important:** Remove the migration from the start command to prevent it from running on every deployment!

## Post-Migration Steps

### 1. Verify Migration Success

Run the verification script:
```bash
node migrations/verify-migration.js
```

Expected output:
```
✓ Found 3 regions
✓ Administrator account exists
✓ All members are assigned to regions
✓ Migration Verification Passed!
```

### 2. Test Administrator Login

**Via API:**
```bash
curl -X POST https://your-backend-url.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "YourSecurePassword"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "fullName": "System Administrator",
    "role": "ADMINISTRATOR"
  },
  "regions": []
}
```

### 3. Test Via Mobile App

1. Open the mobile app
2. You should see the LoginScreen
3. Enter administrator credentials
4. Should successfully login and navigate to HomeScreen

### 4. Change Administrator Password

**Important:** Change the default password immediately!

```bash
curl -X PUT https://your-backend-url.onrender.com/api/users/1/password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "newPassword": "NewSecurePassword123!"
  }'
```

### 5. Create Field Worker Accounts

Use the admin panel or API:
```bash
curl -X POST https://your-backend-url.onrender.com/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "username": "worker1",
    "password": "TempPassword123",
    "fullName": "Field Worker Name",
    "role": "FIELD_WORKER"
  }'
```

### 6. Assign Regions to Field Workers

```bash
curl -X PUT https://your-backend-url.onrender.com/api/users/2/regions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "regionIds": [1, 2]
  }'
```

## Troubleshooting

### Error: "Unable to connect to the database"

**Solution:**
1. Check DATABASE_URL is correct in environment variables
2. Verify database is running on Render
3. Use **Internal Database URL** (not External)
   - Format: `dpg-xxxxx-a.oregon-postgres.render.com`

### Error: "Region already exists"

**Solution:**
- This is normal if re-running migration
- Migration is idempotent (safe to run multiple times)
- Existing data is preserved

### Error: "Administrator account already exists"

**Solution:**
- Administrator was already created
- Use existing credentials to login
- If you forgot password, reset via database:
  ```sql
  -- Connect to database via Render SQL console
  SELECT id, username FROM users WHERE role = 'ADMINISTRATOR';
  ```

### Migration appears stuck

**Solution:**
1. Check if database connection is slow
2. Wait a few minutes (database connection can be slow)
3. Check Render logs for errors
4. Try running from shell instead of deploy script

### Cannot access Render Shell

**Solution:**
- Ensure you're on a paid Render plan (Shell requires paid plan)
- Use Option 3 (deploy script) instead
- Or use psql to manually insert data

## Manual Database Verification

If needed, connect to database directly:

### Via Render Dashboard:
1. Go to your PostgreSQL database on Render
2. Click "Connect" → "External Connection"
3. Use the provided PSQL command

### Check Tables:
```sql
-- List all tables
\dt

-- Check users
SELECT id, username, full_name, role FROM users;

-- Check regions
SELECT id, name, type FROM regions;

-- Check member assignments
SELECT r.name, COUNT(m.id) as member_count 
FROM regions r 
LEFT JOIN members m ON r.id = m.region_id 
GROUP BY r.id, r.name;
```

## Security Reminders

- ✅ Change default administrator password immediately
- ✅ Use strong passwords for all accounts
- ✅ Keep JWT_SECRET secure and never commit to git
- ✅ Monitor authentication logs for suspicious activity
- ✅ Regularly review and audit user accounts

## Next Steps

After successful migration:

1. ✅ Administrator can login
2. ✅ Regions are created
3. ✅ Members are assigned to regions
4. → Create field worker accounts
5. → Assign regions to field workers
6. → Test field worker login and data access
7. → Deploy mobile app with authentication enabled
8. → Train field workers on login process

## Need Help?

Common issues and solutions:
- Database connection: Check DATABASE_URL format
- Migration fails: Check database permissions
- Cannot login: Verify JWT_SECRET is set
- Regions not showing: Run verify-migration.js

For persistent issues, check the logs:
```bash
# In Render shell
tail -f logs/error.log
```
