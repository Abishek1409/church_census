# Database Migrations

This folder contains database migration scripts for the Church Census System.

## Available Migrations

### 001-initial-auth-setup.js

Initial authentication system setup migration that:
- Creates initial regions (villages/towns)
- Creates administrator account with default credentials
- Optionally assigns existing members to a default region

## How to Run Migrations

### Before Running

1. **Configure the migration** by editing `001-initial-auth-setup.js`:
   
   ```javascript
   // Administrator credentials (CHANGE THESE!)
   const ADMIN_CONFIG = {
     username: 'admin',
     password: 'Admin@123',  // Change this!
     fullName: 'System Administrator'
   };

   // Initial regions to create
   const INITIAL_REGIONS = [
     { name: 'Krishnagiri', type: 'VILLAGE', description: 'Main village area' },
     { name: 'Kaveripattinam', type: 'TOWN', description: 'Town area' },
     // Add your regions here
   ];

   // Assign existing members to default region?
   const ASSIGN_EXISTING_MEMBERS = true;
   const DEFAULT_REGION_NAME = 'Krishnagiri';
   ```

2. **Ensure your database is accessible**:
   - Check that `.env` file has correct `DATABASE_URL`
   - For local database: `DATABASE_URL=postgresql://user:password@localhost:5432/dbname`
   - For Render.com: Use the Internal Database URL from Render dashboard

### Running Locally

From the `backend` directory:

```bash
node migrations/001-initial-auth-setup.js
```

### Running on Render.com

**Option 1: Using Render Shell**
1. Go to Render.com dashboard
2. Open your web service
3. Click "Shell" tab
4. Run: `node migrations/001-initial-auth-setup.js`

**Option 2: SSH via Render CLI**
1. Install Render CLI: `npm install -g @render-com/cli`
2. Login: `render login`
3. Connect: `render shell <service-name>`
4. Run: `cd /opt/render/project/src && node migrations/001-initial-auth-setup.js`

**Option 3: Temporary Deploy Script**
1. Create `package.json` script:
   ```json
   {
     "scripts": {
       "migrate": "node migrations/001-initial-auth-setup.js"
     }
   }
   ```
2. Add to `render.yaml` (temporarily):
   ```yaml
   services:
     - type: web
       buildCommand: npm install
       startCommand: npm run migrate && npm start
   ```
3. Deploy (migration runs once on startup)
4. Remove from `startCommand` after migration completes

## Expected Output

Successful migration output:

```
============================================================
Starting Initial Authentication Setup Migration
============================================================

✓ Database connection successful

Step 1: Creating initial regions...
------------------------------------------------------------
✓ Created region: Krishnagiri (VILLAGE)
✓ Created region: Kaveripattinam (TOWN)
✓ Created region: Hosur (TOWN)

✓ Regions created/verified: 3

Step 2: Creating administrator account...
------------------------------------------------------------
✓ Administrator created successfully
  Username: admin
  Password: Admin@123
  
⚠ IMPORTANT: Change this password after first login!

Step 3: Assigning existing members to default region...
------------------------------------------------------------
✓ Assigned 45 existing members to region: Krishnagiri

============================================================
Migration Completed Successfully!
============================================================

Next Steps:
1. Login with administrator credentials:
   Username: admin
   Password: Admin@123
2. Change the administrator password immediately
3. Create field worker accounts via the admin panel
4. Assign regions to field workers
```

## Troubleshooting

### "Database connection failed"
- Verify `DATABASE_URL` in `.env` file
- Check database is running and accessible
- For Render.com: Use Internal Database URL, not External

### "Region already exists" or "Administrator account already exists"
- Migration is safe to re-run
- Existing data will be preserved
- Only missing items will be created

### "Unable to find default region"
- Check `DEFAULT_REGION_NAME` matches one of the `INITIAL_REGIONS`
- Ensure region name spelling is exact (case-sensitive)

## Verification

After migration, verify the setup:

### 1. Check Database Tables

```sql
-- Check users
SELECT id, username, full_name, role, is_active FROM users;

-- Check regions
SELECT id, name, type, is_active FROM regions;

-- Check member region assignments
SELECT COUNT(*) as total, region_id 
FROM members 
GROUP BY region_id;
```

### 2. Test Administrator Login

Use the API endpoint or mobile app:
```bash
curl -X POST http://your-backend-url/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin@123"
  }'
```

Expected response:
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "username": "admin",
    "fullName": "System Administrator",
    "role": "ADMINISTRATOR"
  },
  "regions": []
}
```

## Post-Migration Steps

1. **Change Administrator Password**
   - Login as administrator
   - Use the password reset endpoint or admin panel
   - Set a strong, secure password

2. **Create Field Worker Accounts**
   - Use admin panel or API endpoint
   - Assign unique usernames and temporary passwords
   - Provide credentials to field workers

3. **Assign Regions to Field Workers**
   - Determine which workers cover which regions
   - Use the region assignment endpoint
   - Test that workers can only see their assigned regions

4. **Verify Member Assignments**
   - Check that all members have a valid `region_id`
   - Reassign members to correct regions if needed
   - Test data filtering with field worker accounts

## Security Notes

- **Never commit** default passwords to version control
- **Always change** the default administrator password immediately
- Store the `JWT_SECRET` securely in environment variables
- Use strong passwords for all accounts
- Regularly audit user accounts and access logs
