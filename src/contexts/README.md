# Authentication Context

This directory contains the AuthContext implementation for the Church Census mobile app.

## AuthContext

The `AuthContext` provides authentication state and functions throughout the app.

### Setup

Wrap your app with the `AuthProvider`:

```javascript
import { AuthProvider } from './src/contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      {/* Your app components */}
    </AuthProvider>
  );
}
```

### Usage

Use the `useAuth` hook to access authentication state and functions:

```javascript
import { useAuth } from '../contexts/AuthContext';

function LoginScreen() {
  const { login, isLoading, error } = useAuth();
  
  const handleLogin = async () => {
    try {
      await login('username', 'password');
      // Navigate to home screen on success
    } catch (err) {
      // Error is already set in context
      console.log(error);
    }
  };
  
  return (
    // Your login UI
  );
}
```

### Available Properties and Methods

#### State Properties

- `user` (Object|null) - Current authenticated user data with regions
- `token` (string|null) - JWT authentication token
- `activeRegion` (Object|null) - Currently selected region for field workers
- `isLoading` (boolean) - Loading state for async operations
- `error` (string|null) - Error message from last operation

#### Methods

- `login(username, password)` - Authenticate user and establish session
- `logout()` - Terminate session and clear stored data
- `setActiveRegion(region)` - Change the active region for field workers
- `clearError()` - Clear the current error message

### Example: Login Flow

```javascript
const LoginScreen = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    clearError();
    try {
      const result = await login(username, password);
      if (result.success) {
        // Navigate to home screen
        navigation.navigate('Home');
      }
    } catch (err) {
      // Error is displayed via the error state
    }
  };

  return (
    <View>
      <TextInput value={username} onChangeText={setUsername} />
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      {error && <Text style={{color: 'red'}}>{error}</Text>}
      <Button onPress={handleLogin} loading={isLoading}>
        Login
      </Button>
    </View>
  );
};
```

### Example: Protected Screen

```javascript
const HomeScreen = () => {
  const { user, activeRegion, logout } = useAuth();

  return (
    <View>
      <Text>Welcome, {user?.fullName}!</Text>
      <Text>Active Region: {activeRegion?.name}</Text>
      <Button onPress={logout}>Logout</Button>
    </View>
  );
};
```

### Example: Region Switching

```javascript
const RegionSelector = () => {
  const { user, activeRegion, setActiveRegion } = useAuth();

  const handleRegionChange = async (region) => {
    const success = await setActiveRegion(region);
    if (success) {
      // Region changed successfully
      navigation.goBack();
    }
  };

  return (
    <View>
      {user?.regions?.map((region) => (
        <TouchableOpacity
          key={region.id}
          onPress={() => handleRegionChange(region)}
        >
          <Text>{region.name}</Text>
          {activeRegion?.id === region.id && <Text>✓ Active</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
};
```

## Token Storage

The AuthContext automatically handles secure token storage using `@react-native-async-storage/async-storage`.

Tokens are:
- Stored on successful login
- Loaded and validated on app start
- Cleared on logout or token expiration
- Used for API authentication (when configured with axios interceptor)

## Security Notes

- Tokens are validated with the backend on app startup
- Invalid or expired tokens automatically trigger logout
- Network errors during validation result in a clean logout
- All sensitive data is cleared from AsyncStorage on logout
