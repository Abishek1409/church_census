import React from 'react';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TransitionPresets } from '@react-navigation/stack';
import 'react-native-gesture-handler';

// Import theme
import theme, { colors, animationDuration } from './src/config/theme';

// Import components
import ErrorBoundary from './src/components/ErrorBoundary';
import OfflineBanner from './src/components/OfflineBanner';

// Import authentication context
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

// Import screens
import LoadingScreen from './src/screens/LoadingScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import MemberListScreen from './src/screens/MemberListScreen';
import AddMemberScreen from './src/screens/AddMemberScreen';
import MemberDetailScreen from './src/screens/MemberDetailScreen';
import RegionSelectorScreen from './src/screens/RegionSelectorScreen';

const Stack = createStackNavigator();

/**
 * AppNavigator - Handles authenticated navigation
 * Shows different screens based on authentication state
 */
function AppNavigator() {
  const { user, isLoading } = useAuth();

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.onPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerTitleAlign: 'center',
        gestureEnabled: true,
        presentation: 'card',
      }}
    >
      {user ? (
        // User is authenticated - show main app screens
        <>
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ 
              title: 'Church Census',
              headerTitleAccessibilityLabel: 'Church Census Dashboard',
            }}
          />
          <Stack.Screen 
            name="MemberList" 
            component={MemberListScreen}
            options={{ 
              title: 'All Members',
              headerTitleAccessibilityLabel: 'All Members List',
            }}
          />
          <Stack.Screen 
            name="AddMember" 
            component={AddMemberScreen}
            options={({ route }) => ({ 
              title: route.params?.member ? 'Edit Member' : 'Add Member',
              headerTitleAccessibilityLabel: route.params?.member 
                ? 'Edit Member Form' 
                : 'Add New Member Form',
            })}
          />
          <Stack.Screen 
            name="MemberDetail" 
            component={MemberDetailScreen}
            options={{ 
              title: 'Member Details',
              headerTitleAccessibilityLabel: 'Member Details View',
            }}
          />
          <Stack.Screen 
            name="RegionSelector" 
            component={RegionSelectorScreen}
            options={{ 
              title: 'Select Region',
              headerTitleAccessibilityLabel: 'Select Active Region',
            }}
          />
        </>
      ) : (
        // User is not authenticated - show login screen
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ 
            title: 'Login',
            headerTitleAccessibilityLabel: 'Login Screen',
            headerShown: false, // Hide header on login screen
          }}
        />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <OfflineBanner />
            <AppNavigator />
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
          </NavigationContainer>
        </PaperProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
