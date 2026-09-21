import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { colors, spacing, isSmallDevice } from '../config/theme';

/**
 * Reusable loading screen component
 */
const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <View 
      style={styles.container}
      accessible={true}
      accessibilityLabel={`Loading screen: ${message}`}
      accessibilityRole="progressbar"
    >
      <ActivityIndicator 
        size="large" 
        color={colors.primary} 
        animating={true}
        accessible={true}
        accessibilityLabel="Loading indicator"
      />
      <Text variant="bodyLarge" style={styles.text}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    padding: spacing.lg,
  },
  text: {
    marginTop: spacing.md,
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: isSmallDevice() ? 14 : 16,
  },
});

export default LoadingScreen;
