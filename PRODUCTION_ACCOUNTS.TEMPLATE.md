# Production Login Accounts - TEMPLATE

⚠️ **SECURITY NOTICE:** This is a template file. The actual credentials file (`PRODUCTION_ACCOUNTS.md`) is gitignored and should NEVER be committed to version control.

## Setup Instructions

1. Copy this file to `PRODUCTION_ACCOUNTS.md`
2. Fill in the actual passwords
3. Keep `PRODUCTION_ACCOUNTS.md` secure and private
4. Never commit it to git (it's already in .gitignore)

---

## 🔐 Administrator Account

**Username:** `admin`  
**Password:** `[CONTACT SYSTEM ADMIN FOR ACTUAL PASSWORD]`  
**Access Level:** Full access to all regions and all members

---

## 👥 Field Worker Accounts (Region-Based)

### Password Pattern
Field worker accounts follow this pattern:
- **Username:** Region name (e.g., "Krishnagiri")
- **Password:** `<RegionName>@123` (e.g., "Krishnagiri@123")

### Available Regions

1. **Krishnagiri** - Contact admin for credentials
2. **Hosur** - Contact admin for credentials
3. **Dharmapuri** - Contact admin for credentials
4. **Kaveripattinam** - Contact admin for credentials
5. **Denkanikottai** - Contact admin for credentials
6. **Pochampalli** - Contact admin for credentials

---

## 🔒 Security Guidelines

### For Production:

1. **Change All Default Passwords**
   - Never use the default pattern in production
   - Use strong, unique passwords for each account
   - Minimum 12 characters with mix of upper/lower/numbers/symbols

2. **Password Management**
   - Store actual passwords in a secure password manager
   - Never share passwords via email or chat
   - Use temporary passwords that must be changed on first login

3. **Access Control**
   - Field workers: Region-specific access only
   - Administrator: Full system access
   - Regular security audits recommended

4. **Best Practices**
   - Enable 2FA if available (future enhancement)
   - Monitor access logs
   - Revoke access for inactive users
   - Regular password rotation policy

---

## 📱 Testing Instructions

Test accounts can be created for development/testing purposes with the pattern mentioned above, but ensure production uses strong, unique passwords.

---

## 🆘 Support

For actual login credentials:
- Contact your system administrator
- Access is granted on a need-to-know basis
- Keep credentials confidential

---

**Remember:** Security is everyone's responsibility!
