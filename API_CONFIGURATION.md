# Mobile App API Configuration

## Current Status

✅ **Backend URL Configured**: `https://church-census.onrender.com/api`  
✅ **Request Interceptor**: Adds JWT token to all requests  
✅ **Response Interceptor**: Handles 401/403 errors  
⏳ **Authentication Endpoints**: Ready in code, pending deployment to Render.com

### Next Deployment Steps

Before the authentication system is fully functional:

1. Complete all authentication implementation tasks (Task 18 in progress)
2. Deploy updated code to Render.com (with auth routes)
3. Add JWT_SECRET environment variable on Render.com
4. Run database migrations to create auth tables
5. Test authentication endpoints

## Current Configuration

The mobile app is configured to connect to the backend API at:

```
https://church-census.onrender.com/api
```

This configuration is set in `mobile/src/config/api.js`.

## Verifying Backend Connection

### Option 1: Automated Test Script

Run the test script to verify all authentication endpoints are reachable:

```bash
cd mobile
node test-auth-endpoints.js
```

This will test:
- ✅ POST /api/auth/login
- ✅ POST /api/auth/logout
- ✅ GET /api/auth/me
- ✅ POST /api/auth/refresh

### Option 2: Manual Testing with cURL

Test the login endpoint manually:

```bash
curl -X POST https://church-census.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-password"}'
```

Expected responses:
- **200 OK**: Login successful (with token and user data)
- **401 Unauthorized**: Invalid credentials
- **400 Bad Request**: Missing username or password

## Changing the Backend URL

If you need to change the backend URL (e.g., for local development or different deployment):

### 1. Edit the Configuration File

Open `mobile/src/config/api.js` and update the `API_BASE_URL`:

```javascript
// For production (Render.com)
const API_BASE_URL = 'https://church-census.onrender.com/api'

// For local development
// const API_BASE_URL = 'http://localhost:3000/api'

// For different Render.com deployment
// const API_BASE_URL = 'https://your-app-name.onrender.com/api'
```

### 2. Rebuild the Mobile App

After changing the URL, rebuild the app:

```bash
# For development
npm start

# For Android APK
npm run android

# For production build
eas build --platform android
```

## Authentication Configuration

The mobile app is configured with:

### Request Interceptor
- Automatically adds `Authorization: Bearer <token>` header to all requests
- Retrieves token from AsyncStorage
- Applied to all API calls

### Response Interceptor
- Handles 401 Unauthorized (token expired/invalid)
- Automatically clears stored credentials on auth errors
- Handles 403 Forbidden (insufficient permissions)
- Provides user-friendly error messages

### Token Storage
- Tokens stored securely in AsyncStorage
- Keys used:
  - `authToken` - JWT token
  - `user` - User profile data
  - `activeRegion` - Currently selected region

## Troubleshooting

### Connection Issues

**Problem**: Cannot connect to backend
- ✅ Verify backend URL is correct in `api.js`
- ✅ Check backend service is running on Render.com
- ✅ Ensure device/emulator has internet connection
- ✅ Wait 30-50 seconds for Render.com free tier to wake up

**Problem**: 401 Unauthorized errors
- ✅ Verify JWT_SECRET is set on Render.com
- ✅ Check token is being stored correctly
- ✅ Verify backend authentication middleware is working
- ✅ Try logging in again to get fresh token

**Problem**: 403 Forbidden errors
- ✅ Verify user has correct role (ADMINISTRATOR or FIELD_WORKER)
- ✅ Check region assignments for field workers
- ✅ Ensure trying to access data within assigned regions

**Problem**: Network timeout errors
- ✅ Increase timeout in `api.js` (currently 30 seconds)
- ✅ Check backend logs for slow queries
- ✅ Verify database connection on Render.com

### Testing Checklist

Before deploying the mobile app:

- [ ] Backend API is accessible at the configured URL
- [ ] JWT_SECRET environment variable is set on backend
- [ ] Login endpoint returns valid JWT token
- [ ] Protected endpoints return 401 without token
- [ ] Token is stored in AsyncStorage after login
- [ ] Token is sent in Authorization header
- [ ] 401 errors clear stored credentials
- [ ] App redirects to login after token expiration

## Security Notes

⚠️ **Important**:
- Always use HTTPS in production (Render.com provides this automatically)
- Tokens are stored in AsyncStorage (encrypted on secure devices)
- Tokens expire after 7 days (configurable in backend)
- Logout clears all stored credentials
- Never log tokens in production builds

## API Endpoints Reference

### Authentication Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | /api/auth/login | No | User login |
| POST | /api/auth/logout | Yes | User logout |
| GET | /api/auth/me | Yes | Get current user |
| POST | /api/auth/refresh | Yes | Refresh token |

### Member Endpoints (All require authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/members | List members (filtered by region) |
| GET | /api/members/:id | Get single member |
| POST | /api/members | Create member |
| PUT | /api/members/:id | Update member |
| DELETE | /api/members/:id | Delete member |
| GET | /api/members/search | Search members |
| GET | /api/stats | Get statistics |

### User Management (Admin only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users | List field workers |
| POST | /api/users | Create field worker |
| PUT | /api/users/:id | Update field worker |
| DELETE | /api/users/:id | Deactivate field worker |

### Region Management (Admin only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/regions | List regions |
| POST | /api/regions | Create region |
| PUT | /api/regions/:id | Update region |
| DELETE | /api/regions/:id | Delete region |

## Next Steps

1. ✅ Verify backend URL is correct
2. ✅ Run test script to verify endpoints
3. ✅ Test login from mobile app
4. ✅ Verify token storage and retrieval
5. ✅ Test protected endpoints with authentication
6. ✅ Test region-based data filtering
