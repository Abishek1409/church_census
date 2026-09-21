# Church Census System

A complete church member management system with a React Native mobile app and Express.js backend API.

## Project Structure

```
church-census-system/
├── backend/          # Express.js REST API
│   ├── config/       # Database configuration
│   ├── models/       # Sequelize models
│   ├── controllers/  # Route controllers
│   ├── routes/       # API routes
│   └── server.js     # Entry point
│
└── mobile/           # React Native Expo app
    ├── src/
    │   ├── config/   # API configuration
    │   ├── screens/  # Screen components
    │   ├── components/ # Reusable components
    │   └── services/ # API service layer
    └── App.js        # Root component
```

## Getting Started

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your PostgreSQL database URL

5. Start the server:
```bash
npm run dev
```

### Mobile App Setup

1. Navigate to mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Start Expo:
```bash
npm start
```

4. Scan QR code with Expo Go app or run in emulator

## Deployment

### Backend (Render.com)
- Push backend code to GitHub
- Create new Web Service on Render.com
- Connect GitHub repository
- Add DATABASE_URL environment variable
- Deploy automatically

### Mobile App
- Build APK: `expo build:android`
- Distribute via file sharing or Google Play Store

## Technologies

- **Backend**: Node.js, Express.js, PostgreSQL, Sequelize
- **Mobile**: React Native, Expo, React Native Paper
- **Hosting**: Render.com (free tier)

## Cost

This entire system can be built and deployed for **₹0** using free tiers and open-source technologies.
