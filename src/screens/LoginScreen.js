/**
 * LoginScreen - User Authentication Screen
 * 
 * Provides login functionality for field workers to authenticate with the system.
 * Features username and password input with validation, password visibility toggle,
 * and integration with AuthContext for session management.
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 * 
 * @module screens/LoginScreen
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Title, Paragraph, Card, HelperText } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { colors, spacing, elevation, borderRadius, isSmallDevice } from '../config/theme';

/**
 * Validation schema for login form
 * Ensures both username and password are provided
 */
const loginValidationSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must not exceed 50 characters'),
  password: Yup.string()
    .required('Password is required')
    .min(3, 'Password must be at least 3 characters'),
});

/**
 * LoginScreen Component
 * Displays login form and handles user authentication
 */
export default function LoginScreen({ navigation }) {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const [loginError, setLoginError] = useState('');

  /**
   * Handle form submission
   * Calls AuthContext login function and navigates to Home on success
   */
  const handleLogin = async (values, { setSubmitting }) => {
    try {
      setLoginError('');
      
      // Call login function from AuthContext
      await login(values.username, values.password);
      
      // Navigate to Home on successful login
      navigation.replace('Home');
    } catch (error) {
      // Display error message from AuthContext
      setLoginError(error.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        accessible={true}
        accessibilityLabel="Login screen"
      >
        {/* Logo/Header Card */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <Title style={styles.appTitle} accessibilityRole="header">
              Church Census System
            </Title>
            <Paragraph style={styles.subtitle}>
              Field Worker Login
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Login Form Card */}
        <Card style={styles.formCard}>
          <Card.Content>
            <Formik
              initialValues={{ username: '', password: '' }}
              validationSchema={loginValidationSchema}
              onSubmit={handleLogin}
              validateOnChange={true}
              validateOnBlur={true}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isSubmitting,
              }) => (
                <View>
                  {/* Username Input */}
                  <TextInput
                    label="Username"
                    mode="outlined"
                    value={values.username}
                    onChangeText={handleChange('username')}
                    onBlur={handleBlur('username')}
                    error={touched.username && errors.username}
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="username"
                    textContentType="username"
                    returnKeyType="next"
                    disabled={isSubmitting || isLoading}
                    accessible={true}
                    accessibilityLabel="Username input"
                    accessibilityHint="Enter your username"
                    left={<TextInput.Icon icon="account" />}
                  />
                  {touched.username && errors.username && (
                    <HelperText type="error" visible={true} style={styles.errorText}>
                      {errors.username}
                    </HelperText>
                  )}

                  {/* Password Input */}
                  <TextInput
                    label="Password"
                    mode="outlined"
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    error={touched.password && errors.password}
                    style={styles.input}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="password"
                    textContentType="password"
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                    disabled={isSubmitting || isLoading}
                    accessible={true}
                    accessibilityLabel="Password input"
                    accessibilityHint="Enter your password"
                    left={<TextInput.Icon icon="lock" />}
                    right={
                      <TextInput.Icon
                        icon={showPassword ? 'eye-off' : 'eye'}
                        onPress={() => setShowPassword(!showPassword)}
                        accessible={true}
                        accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                        accessibilityRole="button"
                      />
                    }
                  />
                  {touched.password && errors.password && (
                    <HelperText type="error" visible={true} style={styles.errorText}>
                      {errors.password}
                    </HelperText>
                  )}

                  {/* Login Error Message */}
                  {loginError && (
                    <HelperText type="error" visible={true} style={styles.loginError}>
                      {loginError}
                    </HelperText>
                  )}

                  {/* Login Button */}
                  <Button
                    mode="contained"
                    onPress={handleSubmit}
                    loading={isSubmitting || isLoading}
                    disabled={isSubmitting || isLoading}
                    style={styles.loginButton}
                    contentStyle={styles.loginButtonContent}
                    icon="login"
                    accessible={true}
                    accessibilityLabel="Login button"
                    accessibilityHint="Press to login with your credentials"
                  >
                    {isSubmitting || isLoading ? 'Logging in...' : 'Login'}
                  </Button>
                </View>
              )}
            </Formik>
          </Card.Content>
        </Card>

        {/* Help Text */}
        <Paragraph style={styles.helpText}>
          Contact your administrator if you need help with your login credentials.
        </Paragraph>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceVariant,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
  },
  headerCard: {
    marginBottom: spacing.lg,
    elevation: elevation.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
  },
  appTitle: {
    fontSize: isSmallDevice() ? 24 : 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: isSmallDevice() ? 14 : 16,
    color: colors.textSecondary,
  },
  formCard: {
    marginBottom: spacing.md,
    elevation: elevation.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
  },
  input: {
    marginBottom: spacing.xs,
    backgroundColor: colors.surface,
  },
  errorText: {
    marginBottom: spacing.sm,
    marginTop: -spacing.xs,
  },
  loginError: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    fontSize: 15,
    textAlign: 'center',
  },
  loginButton: {
    marginTop: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    elevation: elevation.sm,
    minHeight: 48, // Accessibility: minimum touch target
  },
  loginButtonContent: {
    paddingVertical: spacing.sm,
  },
  helpText: {
    textAlign: 'center',
    fontSize: isSmallDevice() ? 12 : 14,
    color: colors.textSecondary,
    marginTop: spacing.md,
    lineHeight: 20,
  },
});
