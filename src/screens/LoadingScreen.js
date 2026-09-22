/**
 * LoadingScreen - Authentication Loading Screen
 * 
 * Displays a loading indicator while verifying stored authentication token.
 * Shown during app startup while checking if user has a valid session.
 * 
 * Features:
 * - Loading spinner with app branding
 * - Smooth transition to Login or Home screen
 * - Handles token validation in AuthContext
 * 
 * Requirements: 10.3
 * 
 * @module screens/LoadingScreen
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Title, Paragraph } from 'react-native-paper';
import { colors, spacing } from '../config/theme';

/**
 * LoadingScreen Component
 * Displays loading state during token verification
 */
export default function LoadingScreen() {
  return (
    <View style={styles.container} accessible={true} accessibilityLabel="Loading screen">
      <View style={styles.content}>
        {/* App Title */}
        <Title style={styles.title} accessibilityRole="header">
          Church Census System
        </Title>

        {/* Loading Spinner */}
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loader}
          accessible={true}
          accessibilityLabel="Loading"
        />

        {/* Loading Text */}
        <Paragraph style={styles.text}>
          Verifying credentials...
        </Paragraph>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xxl,
    textAlign: 'center',
  },
  loader: {
    marginVertical: spacing.lg,
  },
  text: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
