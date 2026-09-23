# Testing in Expo Go - Church Census App

## 🚀 Expo Server is Running!

The development server is now running at:
- **Metro Bundler:** http://192.168.1.7:8081
- **Expo URL:** exp://192.168.1.7:8081

---

## 📱 How to Test on Your Phone

### Step 1: Install Expo Go
- **Android:** https://play.google.com/store/apps/details?id=host.exp.exponent
- **iOS:** https://apps.apple.com/app/expo-go/id982107779

### Step 2: Connect to the App
1. Open the Expo Go app on your phone
2. Make sure your phone is on the same WiFi network as your computer
3. Scan the QR code shown in the terminal, or
4. Enter the URL manually: `exp://192.168.1.7:8081`

### Step 3: The app will load and you can test immediately!

---

## ✅ What's Been Updated (All JS Changes - No Build Needed!)

All these changes are live and testable right now in Expo Go:

### TASK 3: Housing Breakdown Fixed
- Dashboard now shows correct housing type counts
- No more "0" values or missing data

**How to test:**
1. Login with any account
2. Check the dashboard
3. You should see actual numbers for Owned/Rent/Government Provided

### TASK 4: Dashboard Count Updates
- Dashboard automatically refetches when you return from adding a member
- Total count updates without manual refresh

**How to test:**
1. Note the current total member count on dashboard
2. Tap "Add New Member"
3. Fill out and save a member
4. Navigate back to dashboard
5. Count should increase by 1 automatically

### TASK 6: Region Field Removed (Field Workers)
- Field workers no longer see region selection in Add Member form
- Region is auto-assigned from their account
- Administrators still see and can select regions

**How to test:**
1. Login as a field worker (username: region name, password: RegionName@123)
2. Tap "Add New Member"
3. You should NOT see any region field
4. The member will be created in your assigned region automatically

**As admin:**
1. Login as admin
2. Tap "Add New Member"
3. You SHOULD see the region dropdown

### TASK 7: Member Profile Shows Data
- Member profiles now display all saved information
- No more blank forms when viewing member details

**How to test:**
1. From dashboard, tap "View All Members"
2. Tap on any member
3. All their information should display correctly (not blank)
4. Tap "Edit Member"
5. Form should be pre-filled with existing data (not empty)

---

## 🔐 Test Credentials

### Administrator Account
- **Username:** admin
- **Password:** Admin@123

### Field Worker Accounts
After backend deployment completes, any region you create will have:
- **Username:** (Region Name) - e.g., "Krishnagiri"
- **Password:** (Region Name)@123 - e.g., "Krishnagiri@123"

---

## ⚙️ Backend Deployment Status

**Backend changes have been pushed to GitHub:**
- ✅ Task 1: Auto-create field worker accounts
- ✅ Task 6: Auto-assign regions from token

**Render Deployment:**
Render should automatically detect the push and deploy. You can check:
1. Go to https://dashboard.render.com
2. Find your service: "church-census"
3. Check the "Events" tab for deployment progress
4. Usually takes 2-5 minutes

**Once deployed, you can test:**
1. Login as admin
2. Create a new region (e.g., "Vellore")
3. A field worker account will be auto-created
4. Login with username "Vellore" and password "Vellore@123"
5. Add members - region will be auto-assigned

---

## 🧪 Complete Testing Checklist

### Test as Field Worker
- [ ] Login with field worker credentials
- [ ] Dashboard shows only members from your region
- [ ] Housing breakdown shows actual numbers
- [ ] Total member count is accurate
- [ ] "Add New Member" form does NOT show region field
- [ ] Add a member successfully
- [ ] Return to dashboard - count increased by 1
- [ ] View member list - new member appears
- [ ] Tap on member - profile shows all data
- [ ] Edit member - form is pre-filled with data
- [ ] Has Patta checkbox appears when Housing Type = "Owned"

### Test as Administrator
- [ ] Login as admin
- [ ] Dashboard shows all members (all regions)
- [ ] Housing breakdown shows actual numbers
- [ ] "Add New Member" form DOES show region dropdown
- [ ] Can select different regions
- [ ] Add member to specific region
- [ ] View all members from all regions
- [ ] Create a new region
- [ ] Verify field worker account was created (check response)
- [ ] Login with new field worker credentials

---

## 🐛 Known Issues / What to Watch For

### If housing breakdown still shows zeros:
- Check that you have actual members in the database
- Verify the API is returning data (check Network tab)

### If dashboard count doesn't update:
- Make sure you're returning to the Home screen (not just going back)
- Pull down to refresh manually

### If member profile is blank:
- Check your internet connection
- Try closing and reopening the app
- Check if the API endpoint is working

---

## 📊 API Endpoints (For Reference)

All pointing to: `https://church-census.onrender.com/api`

- `POST /auth/login` - Login
- `GET /stats` - Dashboard statistics
- `GET /members` - List members
- `GET /members/:id` - Get member detail
- `POST /members` - Create member
- `PUT /members/:id` - Update member
- `POST /regions` - Create region (admin only)
- `GET /regions` - List regions

---

## 💡 Tips

1. **Keep Expo Go open:** The app will reload automatically when you make changes
2. **Shake your phone:** Opens Expo developer menu
3. **Check console logs:** Look at the terminal where Expo is running for errors
4. **Network issues?** Make sure your phone and computer are on the same WiFi
5. **App not loading?** Try closing Expo Go completely and scanning the QR code again

---

## 🔄 Making Additional Changes

If you need to make more changes:
1. Edit the files in `mobile/src/`
2. Save the file
3. Expo will automatically reload on your phone
4. No need to rebuild or restart anything!

---

## 🛑 Stopping the Server

When you're done testing:
1. Go back to the terminal where Expo is running
2. Press `Ctrl+C` to stop the server

Or programmatically: The process ID is 19

---

## 📝 Summary

✅ Backend changes pushed and deploying  
✅ Frontend changes pushed  
✅ Expo development server running  
✅ Ready to test in Expo Go  

**All 7 tasks implemented and ready for testing!**

No APK build needed - everything is testable right now in Expo Go.
