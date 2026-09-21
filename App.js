import React from 'react';
import { StatusBar, Platform } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets } from '@react-navigation/stack';
import 'react-native-gesture-handler';

// Import theme
import theme, { colors, animationDuration } from './src/config/theme';

// Import components
import ErrorBoundary from './src/components/ErrorBoundary';
import OfflineBanner from './src/components/OfflineBanner';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import MemberListScreen from './src/screens/MemberListScreen';
import AddMemberScreen from './src/screens/AddMemberScreen';
import MemberDetailScreen from './src/screens/MemberDetailScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <ErrorBoundary>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <OfflineBanner />
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: colors.primary,
                elevation: 4, // Android shadow
                shadowOpacity: 0.3, // iOS shadow
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
              },
              headerTintColor: colors.onPrimary,
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 18,
              },
              headerTitleAlign: 'center',
              // Smooth transitions based on platform
              ...Platform.select({
                ios: TransitionPresets.SlideFromRightIOS,
                android: TransitionPresets.FadeFromBottomAndroid,
                default: TransitionPresets.SlideFromRightIOS,
              }),
              gestureEnabled: true,
              gestureDirection: 'horizontal',
              transitionSpec: {
                open: {
                  animation: 'timing',
                  config: {
                    duration: animationDuration.normal,
                  },
                },
                close: {
                  animation: 'timing',
                  config: {
                    duration: animationDuration.normal,
                  },
                },
              },
            }}
          >
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
          </Stack.Navigator>
          <StatusBar style="light" />
        </NavigationContainer>
      </PaperProvider>
    </ErrorBoundary>
  );
}
