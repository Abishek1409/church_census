# Church Census Mobile App

React Native mobile application for managing church census data.

## Tech Stack

- **React Native** (Expo ~50.0.0)
- **React Native Paper** - UI components
- **React Navigation** - Navigation
- **Formik & Yup** - Form handling and validation
- **Axios** - API calls

## Prerequisites

- Node.js installed
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your phone (for testing)

## Installation

```bash
npm install
```

## Configuration

### Backend API URL

Update the backend URL in `src/config/api.js`:

```javascript
const API_BASE_URL = 'https://your-app-name.onrender.com/api';
```

Replace `your-app-name` with your actual Render.com backend URL (from Task 4).

## Running the App

### Development Mode

```bash
npm start
```

This will open Expo DevTools in your browser. You can then:
- Scan the QR code with Expo Go app (Android/iOS)
- Press `a` for Android emulator
- Press `i` for iOS simulator (Mac only)

### Specific Platforms

```bash
npm run android  # Run on Android
npm run ios      # Run on iOS (Mac only)
npm run web      # Run in web browser
```

## Project Structure

```
mobile/
├── src/
│   ├── screens/         # App screens
│   │   ├── HomeScreen.js
│   │   ├── MemberListScreen.js
│   │   ├── AddMemberScreen.js
│   │   └── MemberDetailScreen.js
│   ├── services/        # API service layer
│   │   └── memberService.js
│   ├── config/          # Configuration files
│   │   └── api.js
│   └── components/      # Reusable components
├── App.js              # Root component with navigation
├── package.json
└── app.json
```

## Features

- ✅ Navigation setup (Stack Navigator)
- ✅ API configuration
- ✅ Service layer for API calls
- 🚧 Member registration form (Task 7)
- 🚧 Member list with search/filter (Task 8)
- 🚧 Member details view (Task 9)
- 🚧 Edit member functionality (Task 10)

## API Endpoints

The app connects to these backend endpoints:

- `POST /api/members` - Create member
- `GET /api/members` - Get all members
- `GET /api/members/:id` - Get single member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member
- `GET /api/members/search` - Search members
- `GET /api/members/filter` - Filter members
- `GET /api/stats` - Get statistics
- `GET /api/health` - Health check

## Development Notes

- The app uses React Native Paper for consistent UI design
- Navigation is handled by React Navigation v6
- API calls are centralized in `src/services/memberService.js`
- Form validation uses Formik + Yup

## Next Steps

1. ✅ Task 6: Initialize React Native app (COMPLETE)
2. Task 7: Implement member form screen
3. Task 8: Implement member list screen
4. Task 9: Implement member detail screen
5. Task 10: Implement edit functionality

## Building APK

To build an APK for Android:
```bash
expo build:android
```

## Troubleshooting

### Dependencies Issues
If you encounter dependency warnings, they are normal for Expo projects and won't affect functionality.

### Backend Connection
Make sure your backend is deployed and the URL in `src/config/api.js` is correct.

### Expo Go
Download Expo Go from:
- Android: Google Play Store
- iOS: Apple App Store

