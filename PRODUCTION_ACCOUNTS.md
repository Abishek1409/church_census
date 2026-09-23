# Production Login Accounts

## Overview
The Church Census system has been set up with region-based access control. Each region has its own dedicated field worker account.

---

## 🔐 Administrator Account

**Username:** `admin`  
**Password:** `Admin@123`  
**Access Level:** Full access to all regions and all members  
**Capabilities:**
- View and manage all members across all regions
- Create new regions (automatically creates field worker accounts)
- View dashboard statistics for all regions
- Manage users and permissions

---

## 👥 Field Worker Accounts (Region-Based)

Each field worker can ONLY access and manage members in their assigned region.

### 1. Krishnagiri Region
- **Username:** `Krishnagiri`
- **Password:** `Krishnagiri@123`
- **Region Type:** Town
- **Access:** Krishnagiri region members only

### 2. Hosur Region
- **Username:** `Hosur`
- **Password:** `Hosur@123`
- **Region Type:** Town
- **Access:** Hosur region members only

### 3. Dharmapuri Region
- **Username:** `Dharmapuri`
- **Password:** `Dharmapuri@123`
- **Region Type:** Town
- **Access:** Dharmapuri region members only

### 4. Kaveripattinam Region
- **Username:** `Kaveripattinam`
- **Password:** `Kaveripattinam@123`
- **Region Type:** Village
- **Access:** Kaveripattinam region members only

### 5. Denkanikottai Region
- **Username:** `Denkanikottai`
- **Password:** `Denkanikottai@123`
- **Region Type:** Town
- **Access:** Denkanikottai region members only

### 6. Pochampalli Region
- **Username:** `Pochampalli`
- **Password:** `Pochampalli@123`
- **Region Type:** Village
- **Access:** Pochampalli region members only

---

## 🔒 Security Notes

### For Production Deployment:

1. **Change All Passwords Immediately**
   - These are default passwords for initial setup
   - Each user should change their password after first login
   - Use strong passwords with mix of uppercase, lowercase, numbers, and special characters

2. **Password Policy Recommendations:**
   - Minimum 12 characters
   - Include uppercase and lowercase letters
   - Include numbers and special characters
   - Avoid dictionary words
   - Don't reuse passwords from other systems

3. **Access Control:**
   - Field workers can ONLY see members in their assigned region
   - They cannot create or edit members in other regions
   - They cannot access admin functions
   - Administrator has full access to everything

4. **Account Security:**
   - Keep credentials confidential
   - Don't share accounts between multiple people
   - Log out after each session
   - Report any suspicious activity immediately

---

## 📱 How to Login

### Mobile App (Expo Go or Production App)

1. Open the Church Census app
2. Enter your username and password
3. Tap "Login"
4. You'll be automatically directed to your dashboard

### Testing Different Accounts

To test different region access:
1. Logout from current account
2. Login with a different region's credentials
3. Notice you only see members from that region

---

## 🆕 Adding New Regions

When an administrator creates a new region:
1. A field worker account is automatically created
2. Username = Region name (e.g., "NewRegion")
3. Password = RegionName@123 (e.g., "NewRegion@123")
4. The field worker is automatically assigned to that region

### Example:
If admin creates a region called "Salem":
- **Auto-created username:** `Salem`
- **Auto-created password:** `Salem@123`
- **Access:** Salem region only

---

## 🔍 Testing the Accounts

### Test Administrator Access:
```
Username: admin
Password: Admin@123
Expected: Can see all members, all regions
```

### Test Field Worker Access (Example: Krishnagiri):
```
Username: Krishnagiri
Password: Krishnagiri@123
Expected: Can only see Krishnagiri members
```

### Test Field Worker Access (Example: Hosur):
```
Username: Hosur
Password: Hosur@123
Expected: Can only see Hosur members
```

---

## 📊 Dashboard Behavior

### Administrator Dashboard:
- Shows total members across ALL regions
- Housing breakdown for ALL regions
- Can switch between regions if needed

### Field Worker Dashboard:
- Shows total members in THEIR region only
- Housing breakdown for THEIR region only
- Cannot see other regions' data
- No region field when adding members (auto-assigned to their region)

---

## 🚨 Troubleshooting

### "Invalid credentials" error:
- Check username is spelled correctly (case-sensitive)
- Check password is correct (case-sensitive)
- Ensure caps lock is off

### Can't see any members:
- Field workers: Check if any members exist in your assigned region
- Verify you're logged in with correct account
- Try pull-to-refresh on the dashboard

### Can't add members to a different region:
- This is by design for field workers
- Field workers can only add members to their assigned region
- Contact administrator if you need access to another region

---

## 📞 Support

For issues or questions:
1. Verify your credentials with the administrator
2. Check the PRODUCTION_ACCOUNTS.md file for correct usernames/passwords
3. Ensure you're connected to the internet
4. Try logging out and back in

---

## ⚠️ Important Reminders

1. **DO NOT share this document publicly** - it contains sensitive login credentials
2. **Change all passwords** before going into production
3. **Keep credentials secure** and confidential
4. **Regular backups** of member data are recommended
5. **Monitor access logs** for unusual activity

---

Last Updated: September 23, 2026
System Version: 2.0 with Region-Based Access Control
