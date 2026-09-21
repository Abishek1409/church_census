# Building APK for Church Census Mobile App

## Prerequisites

1. **Expo Account**
   - Sign up at [expo.dev](https://expo.dev) (free account)
   - No credit card required

2. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

3. **Login to Expo**
   ```bash
   eas login
   ```
   - Enter your Expo username and password

## Initial Setup (One-Time Only)

### Configure EAS Build

```bash
cd mobile
eas build:configure
```

This creates an `eas.json` file with build configurations.

### Update `eas.json` Configuration

Edit the generated `eas.json` file:

```json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

## Building APK

### Option 1: Preview Build (Recommended for Testing)

This builds an APK file that can be installed directly on Android devices.

```bash
eas build --platform android --profile preview
```

**Process:**
1. Command uploads your code to Expo servers
2. Expo builds the APK in the cloud
3. Takes approximately 10-20 minutes
4. You'll receive a link to download the APK

**Output:**
- APK file (~50-80 MB)
- Can be installed on any Android device
- No Google Play Store required

### Option 2: Production Build

For Google Play Store submission:

```bash
eas build --platform android --profile production
```

**Output:**
- AAB (Android App Bundle) file
- Required for Google Play Store
- Cannot be installed directly on devices

### Option 3: Local Build (if preferred)

If you prefer to build locally instead of using Expo cloud:

```bash
# Install dependencies
npm install -g @expo/ngrok

# Build locally
eas build --platform android --profile preview --local
```

**Note:** Local builds require:
- Android Studio installed
- Android SDK configured
- More complex setup

## Monitoring Build Progress

1. After running build command, Expo provides a URL
2. Visit the URL to monitor build progress
3. Build logs show real-time progress
4. Build typically takes 10-20 minutes

Example URL: `https://expo.dev/accounts/yourname/projects/church-census-mobile/builds/xxxxx`

## Downloading and Installing APK

### After Build Completes

1. **Get the APK**
   - Expo provides a download link
   - Or visit: [expo.dev/accounts/[your-account]/builds](https://expo.dev)
   - Find your build and click "Download"

2. **Transfer to Android Device**
   - **Option A:** Download directly on Android device
   - **Option B:** Transfer via USB cable
   - **Option C:** Share via Google Drive, WhatsApp, etc.

3. **Install on Android Device**
   ```
   1. Open the APK file on your Android device
   2. Tap "Install"
   3. If prompted, enable "Install from Unknown Sources" in Settings
   4. Complete installation
   5. Open the app
   ```

### Enable Unknown Sources (if needed)

**Android 8.0+:**
1. Go to Settings → Apps & notifications
2. Tap "Special app access" → "Install unknown apps"
3. Select the browser or file manager you're using
4. Enable "Allow from this source"

**Android 7.0 and earlier:**
1. Go to Settings → Security
2. Enable "Unknown sources"

## Testing the APK

### Before Distribution

1. **Install on Test Device**
   - Install APK on your Android device
   - Test all features thoroughly

2. **Verify Backend Connection**
   - Ensure API_BASE_URL in `src/config/api.js` points to deployed backend
   - Test with actual server (not localhost)

3. **Test Core Functions**
   - [ ] Create member
   - [ ] View member list
   - [ ] Search members
   - [ ] Filter members
   - [ ] Edit member
   - [ ] Delete member
   - [ ] Test validation errors
   - [ ] Test network error handling

### After Successful Testing

1. Share APK with church administrators
2. Provide installation instructions
3. Collect feedback

## Updating the App

### When You Make Changes

1. **Update Version Number**
   Edit `app.json`:
   ```json
   {
     "expo": {
       "version": "1.0.1",
       "android": {
         "versionCode": 2
       }
     }
   }
   ```

2. **Build New APK**
   ```bash
   eas build --platform android --profile preview
   ```

3. **Distribute Updated APK**
   - Users must uninstall old version and install new one
   - Or implement OTA (Over-The-Air) updates with Expo Updates

## Publishing to Google Play Store (Optional)

### Prerequisites

1. **Google Play Developer Account**
   - One-time fee: ₹1,800 ($25 USD)
   - Sign up at [play.google.com/console](https://play.google.com/console)

2. **Build Production AAB**
   ```bash
   eas build --platform android --profile production
   ```

### Steps to Publish

1. **Create App in Play Console**
   - Go to Google Play Console
   - Click "Create app"
   - Fill in app details

2. **Upload AAB**
   - Go to "Production" → "Releases"
   - Click "Create new release"
   - Upload the AAB file from Expo

3. **Complete Store Listing**
   - App icon (512x512 px)
   - Screenshots (min 2)
   - Description
   - Privacy policy URL
   - Contact information

4. **Set Content Rating**
   - Complete questionnaire
   - Get rating (likely "Everyone")

5. **Review and Publish**
   - Submit for review
   - Review takes 1-7 days
   - App goes live after approval

## Troubleshooting

### Build Fails

**Common Issues:**

1. **Invalid app.json**
   - Check JSON syntax
   - Ensure all required fields present

2. **Node modules issues**
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **Expo CLI outdated**
   ```bash
   npm update -g eas-cli
   ```

### APK Won't Install

1. **Check Android version**
   - Minimum supported: Android 5.0 (API 21)
   - Check `app.json` → `android.minSdkVersion`

2. **"App not installed" error**
   - Uninstall any existing version
   - Clear package installer cache
   - Restart device

3. **"Parse error"**
   - APK file corrupted during transfer
   - Re-download APK
   - Transfer again

### App Crashes on Launch

1. **Check API URL**
   - Ensure `API_BASE_URL` is correct in `src/config/api.js`
   - Rebuild APK after changing URL

2. **Check logs**
   ```bash
   # Connect device via USB
   adb logcat | grep -i "church-census"
   ```

3. **Test on multiple devices**
   - Some device-specific issues
   - Test on different Android versions

## File Sizes

**Typical Sizes:**
- Development build: 60-80 MB
- Production build (APK): 30-50 MB
- Production build (AAB): 25-40 MB

**Reducing Size:**
- Already optimized by Expo
- Further optimization requires ejecting (not recommended)

## Distribution Options

### 1. Direct APK Installation (Current Method)
- **Pros:** Free, simple, immediate
- **Cons:** Manual updates, no automatic distribution

### 2. Google Play Store
- **Pros:** Automatic updates, trusted source, wider reach
- **Cons:** ₹1,800 fee, review process, requires Play Store account

### 3. Internal Testing Track (Google Play)
- **Pros:** Free testing with up to 100 testers, automatic updates
- **Cons:** Still requires Play Developer account (₹1,800)

### 4. Firebase App Distribution (Alternative)
- **Pros:** Free, easy distribution to testers, automatic updates
- **Cons:** Requires Firebase setup

## Recommended Workflow

### For Initial Testing
1. Build preview APK
2. Install on 2-3 test devices
3. Test thoroughly
4. Fix any bugs
5. Rebuild if needed

### For Church Staff Distribution
1. Build final preview APK
2. Test on multiple devices
3. Upload to Google Drive or similar
4. Share link with instructions
5. Provide support for installation

### For Long-term (if budget allows)
1. Publish to Google Play Store
2. Benefits:
   - Automatic updates
   - Trusted installation
   - Professional appearance
   - Easier distribution

## Cost Summary

| Option | Cost |
|--------|------|
| APK Distribution (Direct) | ₹0 (Free) |
| Google Play Store | ₹1,800 one-time |
| EAS Build (Expo) | Free for limited builds |
| Hosting APK (Google Drive) | ₹0 (Free) |

## Support and Resources

- **Expo Documentation:** [docs.expo.dev](https://docs.expo.dev)
- **EAS Build Guide:** [docs.expo.dev/build/introduction](https://docs.expo.dev/build/introduction)
- **Android Publishing:** [developer.android.com/distribute](https://developer.android.com/distribute)

## Checklist Before Building

- [ ] All tests passing (`npm test`)
- [ ] API_BASE_URL points to production backend
- [ ] Backend server is deployed and accessible
- [ ] Version number updated in `app.json`
- [ ] App icon and splash screen configured
- [ ] Tested locally on development device
- [ ] All features working as expected
- [ ] Error handling tested
- [ ] Validation tested
- [ ] Network error scenarios tested

## After Building Checklist

- [ ] APK downloaded successfully
- [ ] Installed on test device
- [ ] App launches without crashes
- [ ] Can connect to backend API
- [ ] All CRUD operations work
- [ ] Search and filter work
- [ ] Validation works correctly
- [ ] Error messages display correctly
- [ ] UI renders properly on test device
- [ ] Performance is acceptable
- [ ] Ready for distribution
