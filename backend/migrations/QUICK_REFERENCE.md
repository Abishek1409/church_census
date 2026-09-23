# Migration Quick Reference

## Before You Start

1. **Customize the migration** (`001-initial-auth-setup.js`):
   - Set administrator password
   - Add your regions
   - Decide on existing member assignment

2. **Commit and push changes** to GitHub

## Execute Migration

### On Render.com (via Shell):
```bash
node migrations/001-initial-auth-setup.js
```

### Verify Migration:
```bash
node migrations/verify-migration.js
```

## Test Login

```bash
curl -X POST https://your-app.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"YOUR_PASSWORD"}'
```

## Post-Migration Checklist

- [ ] Migration completed successfully
- [ ] Administrator can login
- [ ] Regions created
- [ ] Members assigned to regions
- [ ] Changed default admin password
- [ ] Created first field worker account
- [ ] Assigned regions to field worker
- [ ] Tested field worker login
- [ ] Verified data filtering works

## Common Commands

### Create Field Worker:
```bash
curl -X POST https://your-app.onrender.com/api/users \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "worker1",
    "password": "TempPass123",
    "fullName": "Worker Name"
  }'
```

### Assign Regions:
```bash
curl -X PUT https://your-app.onrender.com/api/users/2/regions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"regionIds": [1, 2]}'
```

### Reset Password:
```bash
curl -X PUT https://your-app.onrender.com/api/users/1/password \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"newPassword": "NewPassword123!"}'
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Database connection fails | Check DATABASE_URL in environment variables |
| Administrator already exists | Use existing credentials |
| Cannot access shell | Use deploy script method (see DEPLOYMENT_GUIDE.md) |
| Migration times out | Database might be slow, wait and retry |
| Login returns 401 | Check JWT_SECRET is set in environment |

## Files Created

- `001-initial-auth-setup.js` - Main migration script
- `verify-migration.js` - Verification script
- `README.md` - Detailed documentation
- `DEPLOYMENT_GUIDE.md` - Step-by-step deployment guide
- `QUICK_REFERENCE.md` - This file

## Important URLs

- Render Dashboard: https://dashboard.render.com
- Your Backend URL: https://YOUR_APP_NAME.onrender.com
- Database Console: https://dashboard.render.com/databases

## Security Notes

⚠️ **CRITICAL:**
- Change default administrator password immediately after first login
- Never commit passwords to Git
- Keep JWT_SECRET secure
- Use strong passwords for all accounts

## Support

For detailed instructions, see:
- `README.md` - How to run migrations
- `DEPLOYMENT_GUIDE.md` - Deployment steps and troubleshooting
