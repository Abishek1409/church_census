# Church Census System - Mobile App

React Native mobile application built with Expo for the Church Census System.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the Expo development server:
```bash
npm start
```

3. Run on device:
   - Scan QR code with Expo Go app (Android/iOS)
   - Or press 'a' for Android emulator
   - Or press 'i' for iOS simulator

## Configuration

Update the API URL in `src/config/api.js` with your backend URL after deploying to Render.com.

## Project Structure

```
mobile/
├── src/
│   ├── config/      # API configuration
│   ├── screens/     # Screen components
│   ├── components/  # Reusable components
│   └── services/    # API service layer
├── assets/          # Images, fonts, etc.
├── App.js           # Root component
└── package.json     # Dependencies
```

## Building APK

To build an APK for Android:
```bash
expo build:android
```
