import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { colors, spacing, elevation, borderRadius, isSmallDevice } from '../config/theme';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text variant="headlineMedium" style={styles.title}>
            Oops! Something went wrong
          </Text>
          <Text variant="bodyMedium" style={styles.message}>
            The app encountered an unexpected error. Please try restarting.
          </Text>
          {__DEV__ && this.state.error && (
            <Text variant="bodySmall" style={styles.errorDetails}>
              {this.state.error.toString()}
            </Text>
          )}
          <Button
            mode="contained"
            onPress={this.handleReset}
            style={styles.button}
            accessible={true}
            accessibilityLabel="Try again button"
            accessibilityHint="Resets the app and attempts to recover from the error"
          >
            Try Again
          </Button>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surfaceVariant,
  },
  title: {
    fontWeight: 'bold',
    color: colors.error,
    marginBottom: spacing.md,
    textAlign: 'center',
    fontSize: isSmallDevice() ? 22 : 24,
  },
  message: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    fontSize: isSmallDevice() ? 14 : 16,
  },
  errorDetails: {
    color: colors.textDisabled,
    marginBottom: spacing.md,
    textAlign: 'center',
    fontFamily: 'monospace',
    paddingHorizontal: spacing.md,
    fontSize: 12,
  },
  button: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 48, // Accessibility
    elevation: elevation.sm,
  },
});

export default ErrorBoundary;
