# Database Setup Guide

This guide explains how to set up the PostgreSQL database for the Church Census System using Render.com (100% free).

## Option 1: Render.com (Recommended - Free Cloud Hosting)

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up for a free account (no credit card required)
3. Verify your email address

### Step 2: Create PostgreSQL Database
1. From Render Dashboard, click "New +" button
2. Select "PostgreSQL"
3. Configure database:
   - **Name**: `church-census-db` (or any name you prefer)
   - **Database**: `church_census_db`
   - **User**: (auto-generated)
   - **Region**: Choose closest to your location
   - **PostgreSQL Version**: 16 (or latest)
   - **Plan**: Select **Free** tier
4. Click "Create Database"
5. Wait 2-3 minutes for provisioning

### Step 3: Get Database Connection URL
1. Once database is created, click on it
2. Scroll down to "Connections" section
3. Copy the **Internal Database URL** (starts with `postgresql://`)
4. Format: `postgresql://username:password@host:port/database_name`

### Step 4: Configure Backend
1. In your backend project, create/update `.env` file:
   ```env
   PORT=3000
   DATABASE_URL=<paste-your-internal-database-url-here>
   NODE_ENV=production
   ```
2. Make sure `.env` is in `.gitignore` (already configured)

### Step 5: Test Database Connection
Run the test script to verify connection:
```bash
cd backend
npm run test:db
```

You should see:
```
✓ Database connection successful!
✓ Database models synchronized!
✓ Test member created with ID: 1
✓ Test member deleted
✓ All database tests passed!
```

### Step 6: Start Server
```bash
npm start
```

The server will:
- Connect to the database
- Create the `members` table automatically
- Create indexes for faster searches
- Start listening on port 3000

## Option 2: Local PostgreSQL (For Development)

### Install PostgreSQL Locally
1. Download PostgreSQL from https://www.postgresql.org/download/
2. Install and note your password
3. Create database:
   ```sql
   CREATE DATABASE church_census_db;
   ```

### Configure Environment
Create `.env` file:
```env
PORT=3000
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/church_census_db
NODE_ENV=development
```

### Test Connection
```bash
npm run test:db
```

## Database Schema

The following table is created automatically by Sequelize:

### Members Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO INCREMENT |
| full_name | VARCHAR(100) | NOT NULL |
| aadhar_number | CHAR(12) | NOT NULL, UNIQUE |
| phone_number | VARCHAR(10) | NOT NULL |
| community | VARCHAR(50) | NOT NULL |
| sub_caste | VARCHAR(50) | NOT NULL |
| housing_type | ENUM | NOT NULL (Rent/Owned/Government Provided) |
| address | TEXT | NOT NULL |
| has_patta | BOOLEAN | NULL (only for Owned housing) |
| occupation | VARCHAR(100) | NOT NULL |
| income | DECIMAL(10,2) | NOT NULL, >= 0 |
| education_qualification | VARCHAR(100) | NOT NULL |
| ration_card_number | VARCHAR(20) | NOT NULL |
| created_at | TIMESTAMP | AUTO |
| updated_at | TIMESTAMP | AUTO |

### Indexes
- `idx_members_name` on `full_name` (for search)
- `idx_members_community` on `community` (for filtering)
- `idx_members_aadhar` on `aadhar_number` (unique constraint)

## Validation Rules

The Member model enforces the following validations:

- **Aadhar Number**: Exactly 12 digits, numeric only, unique
- **Phone Number**: Exactly 10 digits, numeric only
- **Housing Type**: Must be 'Rent', 'Owned', or 'Government Provided'
- **Income**: Must be positive number with max 2 decimal places
- **All fields required** except `hasPatta` (conditional on housing type)

## Troubleshooting

### Connection Refused
- Check if DATABASE_URL is correct
- Verify database is running (Render dashboard shows status)
- Check firewall/network settings

### Authentication Failed
- Verify username and password in DATABASE_URL
- Check if database user has proper permissions

### Table Not Found
- Run `npm run test:db` to sync models
- Or restart server (sync happens automatically)

### SSL Certificate Error
- For Render.com, ensure `NODE_ENV=production` in `.env`
- SSL is automatically configured for production

## Backup and Restore

### Backup (Render.com)
1. Go to database dashboard
2. Click "Backups" tab
3. Download latest backup

### Restore (Render.com)
1. Use Render's restore feature
2. Or import SQL file through their web shell

## Free Tier Limitations

**Render.com Free PostgreSQL:**
- ✓ 1GB storage (~10,000-20,000 member records)
- ✓ 90-day data retention
- ✓ Automatic backups
- ✓ SSL included
- ✗ No point-in-time recovery
- ✗ Database expires after 90 days of inactivity

**Recommendation**: Export data monthly as backup

## Next Steps

After database is set up:
1. ✓ Database connection working
2. → Implement API endpoints (Task 3)
3. → Deploy backend to Render.com (Task 4)
4. → Build mobile app (Task 6+)

## Need Help?

Check the API logs:
```bash
npm start
```

Look for these success messages:
- `✓ Database connection established successfully`
- `✓ Database models synchronized`
- `✓ Server is running on port 3000`
