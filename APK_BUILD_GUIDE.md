# APK Build Guide - Church Census System

Complete guide to building the Android APK for the Church Census mobile app.

---

## Prerequisites Checklist

Before building the APK, ensure you have:

- [x] **Backend deployed to Render.com** (Task 4 completed)
- [x] **Backend URL available** (e.g., https://church-census-api.onrender.com)
- [x] **Node.js installed** (v16 or higher)
- [x] **Expo account created** (free at expo.dev)
- [x] **Updated API URL in mobile app** (see Step 1 below)

---

## Build Methods

There are two ways to build the APK:

### Method 1: EAS Build (Recommended) ⭐
- **Pros**: Easiest, no Android Studio needed, builds in cloud
- **Cons**: Limited free builds per month (around 30)
- **Time**: 10-15 minutes
- **Best for**: Most users, first-time builders

### Method 2: Local Build
- **Pros**: Unlimited builds, more control
- **Cons**: Requires Android Studio, more complex setup
- **Time**: 30+ minutes (first time)
- **Best for**: Developers with Android Studio already installed

**We'll focus on Method 1 (EAS Build) as it's recommended for most users.**

---

## Method 1: EAS Build (Cloud Build)

### Step 1: Update API URL

**CRITICAL**: This must be done before building!

1. Open `mobile/src/config/api.js` in your code editor

2. Find this line:
   ```javascript
   const API_BASE_URL = 'https://church-census.onrender.com/api'
   ```

3. Replace with YOUR actual Render.com backend URL:
   ```javascript
   const API_BASE_URL = 'https://church-census-api.onrender.com/api'
   ```
   
   **Replace `church-census-api` with YOUR actual Render service name!**

4. Save the file

5. Verify the URL is correct:
   - Open the URL in a browser (should show API response or 404, not error)
   - Make sure it ends with `/api`
   - No trailing slash after `/api`

### Step 2: Install Dependencies

Open terminal/command prompt:

```bash
# Navigate to mobile folder
cd mobile

# Install dependencies (if not already done)
npm install

# Install EAS CLI globally
npm install -g eas-cli
```

### Step 3: Login to Expo

```bash
# Login to Expo account
eas login
```

You'll be prompted:
- **Email**: Enter your Expo account email
- **Password**: Enter your password

If you don't have an account:
```bash
# Create account first
eas register
```

### Step 4: Configure EAS Build

First time only:

```bash
# Initialize EAS configuration
eas build:configure
```

This creates `eas.json` file with build configurations.

**If `eas.json` already exists, skip this step.**

### Step 5: Build the APK

```bash
# Build APK (Android Package)
eas build -p android --profile preview
```

**What this command does:**
- `-p android`: Build for Android platform
- `--profile preview`: Build APK (not AAB for Play Store)

**You'll be asked:**

1. **"Generate a new Android Keystore?"**
   - Answer: `Yes` (first time)
   - EAS will create and manage the keystore for you

2. **"Select Android SDK version"**
   - Just press Enter (use default)

3. **Build process starts:**
   ```
   ✔ Compiling project
   ✔ Building Android app
   ✔ Packaging APK
   ```

**This takes 10-15 minutes.** Get a coffee! ☕

### Step 6: Download APK

Once build completes:

1. You'll see a message:
   ```
   ✔ Build finished
   
   https://expo.dev/artifacts/eas/abc123xyz.apk
   ```

2. **Click the link** or copy-paste in browser

3. APK file downloads (size: ~50-80 MB)

4. **Save the APK** in a safe location

### Step 7: Check Build Status Anytime

Lost the download link? No problem!

```bash
# View recent builds
eas build:list
```

Or visit: https://expo.dev/accounts/YOUR_USERNAME/projects/church-census-mobile/builds

---

## Method 2: Local Build (Advanced)

⚠️ Only if you have Android Studio installed!

### Prerequisites for Local Build

- Android Studio installed
- Android SDK configured
- Java JDK installed
- Gradle installed

### Steps

1. Update API URL (same as Method 1, Step 1)

2. Install dependencies:
   ```bash
   cd mobile
   npm install
   ```

3. Generate native code:
   ```bash
   npx expo prebuild
   ```

4. Build APK:
   ```bash
   # Debug APK (for testing)
   npx expo run:android
   
   # Release APK (for production)
   npx expo run:android --variant release
   ```

5. Find APK at:
   ```
   mobile/android/app/build/outputs/apk/release/app-release.apk
   ```

---

## After Building: Testing the APK

### Step 1: Transfer APK to Phone

**Option A: USB Cable**
1. Connect phone to computer via USB
2. Enable "File Transfer" mode on phone
3. Copy APK to phone's Downloads folder

**Option B: Google Drive**
1. Upload APK to Google Drive
2. Open Drive on phone
3. Download APK

**Option C: Email**
1. Email APK to yourself
2. Open email on phone
3. Download attachment

**Option D: WhatsApp**
1. Send APK to yourself or someone else
2. Download on phone

### Step 2: Install APK on Phone

1. **Enable Unknown Sources** (if not already done):
   - Go to Settings → Security
   - Enable "Install from Unknown Sources" or "Install Unknown Apps"
   - Select your file manager/browser
   - Allow installation

2. **Install the APK**:
   - Open file manager
   - Navigate to Downloads
   - Tap the APK file
   - Tap "Install"
   - Wait for installation (10-30 seconds)
   - Tap "Open"

### Step 3: Test the App

Run through these tests:

1. **Launch Test**
   - [ ] App opens without crashing
   - [ ] Home screen loads
   - [ ] No error messages

2. **Connection Test**
   - [ ] Dashboard shows "0 members" or existing members
   - [ ] No "Network Error" message
   - [ ] Data loads within 30 seconds

3. **Create Member Test**
   - [ ] Tap + button
   - [ ] Fill in all fields
   - [ ] Tap Save
   - [ ] Member appears in list

4. **View Member Test**
   - [ ] Tap a member from list
   - [ ] Details screen shows all info
   - [ ] No data missing

5. **Search Test**
   - [ ] Search bar works
   - [ ] Results appear
   - [ ] Can tap results

6. **Edit Test**
   - [ ] Open member details
   - [ ] Tap Edit
   - [ ] Change a field
   - [ ] Save changes
   - [ ] Changes reflected

7. **Delete Test**
   - [ ] Open member details
   - [ ] Tap Delete
   - [ ] Confirm deletion
   - [ ] Member removed from list

**If all tests pass, your APK is ready to distribute!** ✅

---

## Distributing the APK

### For Internal Use (Free)

**Option 1: Direct Sharing**
- Share APK via WhatsApp, email, Google Drive
- Best for: Small teams (5-10 people)

**Option 2: Firebase App Distribution (Free)**
1. Create Firebase project
2. Upload APK to Firebase
3. Share download link with users
4. Users get automatic update notifications
- Best for: Medium teams (10-50 people)

**Option 3: Website Download**
- Upload APK to your church website
- Provide download link
- Best for: Public access

### For Public Distribution (Play Store)

**Cost**: ₹1,800 one-time Google Play Developer fee

**Steps:**
1. Create Google Play Developer account
2. Build AAB (not APK) for Play Store:
   ```bash
   eas build -p android --profile production
   ```
3. Create app listing in Play Console
4. Upload AAB file
5. Fill in app details, screenshots, description
6. Submit for review (takes 2-3 days)
7. Once approved, app is public on Play Store

**Benefits of Play Store:**
- Professional distribution
- Automatic updates
- User reviews and ratings
- Better discoverability
- Google Play Protect verification

---

## Updating the APK

When you make changes to the app:

### Step 1: Update Version Number

Edit `mobile/app.json`:

```json
{
  "expo": {
    "version": "1.0.1",  // Increment this (was 1.0.0)
    "android": {
      "versionCode": 2   // Increment this (was 1)
    }
  }
}
```

### Step 2: Rebuild APK

Follow the same build process (EAS or Local)

### Step 3: Distribute New APK

Users must uninstall old version and install new one (for APK distribution).

**Or** use Play Store for automatic updates.

---

## Customizing the App

Before building, you may want to customize:

### App Name

Edit `mobile/app.json`:
```json
{
  "expo": {
    "name": "Church Census",  // Change this
    "slug": "church-census-mobile"
  }
}
```

### App Icon

1. Create 1024x1024 PNG image
2. Save as `mobile/assets/icon.png`
3. Rebuild APK

### Splash Screen

1. Create 1242x2436 PNG image
2. Save as `mobile/assets/splash.png`
3. Rebuild APK

### App Colors

Edit `mobile/src/theme/theme.js` (if exists) or look for theme configuration.

---

## Troubleshooting

### Build Failed: "Network Error"

**Cause**: Internet connection issue during build

**Solution:**
```bash
# Retry the build
eas build -p android --profile preview
```

### Build Failed: "Invalid Credentials"

**Cause**: Not logged in to Expo

**Solution:**
```bash
# Login again
eas login
```

### Build Failed: "Keystore Error"

**Cause**: Issue with Android keystore

**Solution:**
```bash
# Clear credentials and regenerate
eas credentials -p android
# Select "Remove all credentials"
# Rebuild
eas build -p android --profile preview
```

### APK Won't Install on Phone

**Cause 1**: Unknown sources not enabled

**Solution**: Enable "Install from Unknown Sources" in phone Settings → Security

**Cause 2**: Incompatible Android version

**Solution**: App requires Android 6.0+ (most phones support this)

### App Crashes on Open

**Cause**: Wrong API URL

**Solution:**
1. Check `mobile/src/config/api.js` has correct URL
2. Test URL in browser
3. Rebuild APK with correct URL

### "Network Error" in App

**Cause 1**: Backend is asleep (Render free tier)

**Solution**: Wait 30 seconds, try again (server is waking up)

**Cause 2**: Wrong API URL

**Solution**: 
1. Check mobile/src/config/api.js
2. Verify URL in browser: should see API response
3. Rebuild if URL is wrong

**Cause 3**: No internet on phone

**Solution**: Check phone's WiFi/mobile data

---

## Build Configuration Reference

### Understanding `eas.json`

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"  // Creates APK file
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"  // Creates AAB for Play Store
      }
    }
  }
}
```

**Profiles:**
- **preview**: For testing, creates APK
- **production**: For Play Store, creates AAB

### Build Commands

```bash
# APK for testing
eas build -p android --profile preview

# AAB for Play Store
eas build -p android --profile production

# iOS build (requires Mac and Apple Developer account)
eas build -p ios --profile production
```

---

## EAS Build Limits

### Free Tier
- **30 builds per month** (shared across all projects)
- **Cloud build queue** (may wait if queue is busy)
- **No support priority**

### If You Run Out of Builds
- Wait until next month (resets)
- Or upgrade to Expo EAS paid plan
- Or use local build method

---

## Checklist: Before Building APK

Use this checklist every time you build:

- [ ] Backend is deployed and working
- [ ] Backend URL is correct in `mobile/src/config/api.js`
- [ ] Tested backend URL in browser (works)
- [ ] All dependencies installed (`npm install`)
- [ ] Logged in to Expo (`eas login`)
- [ ] Version number updated in `app.json` (if update)
- [ ] App name and icon customized (if needed)
- [ ] Ready to wait 10-15 minutes for build

---

## Quick Command Reference

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS (first time)
eas build:configure

# Build APK
eas build -p android --profile preview

# Check build status
eas build:list

# View build logs
eas build:view BUILD_ID

# Clear credentials (if issues)
eas credentials -p android
```

---

## Cost Summary

- **EAS Build (Free Tier)**: ₹0 (30 builds/month)
- **Expo Account**: ₹0 (free signup)
- **APK Distribution**: ₹0 (direct sharing)
- **Play Store (Optional)**: ₹1,800 one-time

**Total Cost**: ₹0 for APK build and distribution

---

## Additional Resources

- Expo EAS Build Docs: https://docs.expo.dev/build/setup/
- Android APK vs AAB: https://developer.android.com/guide/app-bundle
- Play Store Publishing: https://play.google.com/console/developers

---

**You're ready to build!** Follow the steps carefully, and you'll have your APK in 15 minutes. Good luck! 🚀

---

*Last Updated: January 2025*
*Part of Church Census System documentation*
