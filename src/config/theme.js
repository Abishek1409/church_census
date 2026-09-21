/**
 * Theme configuration for React Native Paper
 * Provides consistent colors, spacing, typography, and accessibility settings
 */
import { MD3LightTheme, configureFonts } from 'react-native-paper';
import { Dimensions, Platform } from 'react-native';

// Get device dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Breakpoints for responsive design
export const breakpoints = {
  small: 360,   // Small phones
  medium: 400,  // Medium phones
  large: 600,   // Large phones / small tablets
  xlarge: 900,  // Tablets
};

// Helper function to determine device size
export const getDeviceSize = () => {
  if (SCREEN_WIDTH < breakpoints.small) return 'xsmall';
  if (SCREEN_WIDTH < breakpoints.medium) return 'small';
  if (SCREEN_WIDTH < breakpoints.large) return 'medium';
  if (SCREEN_WIDTH < breakpoints.xlarge) return 'large';
  return 'xlarge';
};

// Responsive helper function
export const isSmallDevice = () => SCREEN_WIDTH < breakpoints.medium;
export const isMediumDevice = () => SCREEN_WIDTH >= breakpoints.medium && SCREEN_WIDTH < breakpoints.large;
export const isLargeDevice = () => SCREEN_WIDTH >= breakpoints.large;

// Color palette with accessibility considerations (WCAG AA compliant)
export const colors = {
  // Primary colors
  primary: '#6200ee',
  primaryDark: '#3700b3',
  primaryLight: '#9965f4',
  
  // Secondary colors
  secondary: '#03dac6',
  secondaryDark: '#018786',
  secondaryLight: '#66fff9',
  
  // Background colors
  background: '#ffffff',
  surface: '#ffffff',
  surfaceVariant: '#f5f5f5',
  
  // Text colors (WCAG compliant contrast ratios)
  text: '#000000',
  textSecondary: '#666666',
  textDisabled: '#9e9e9e',
  onPrimary: '#ffffff',
  onSecondary: '#000000',
  onBackground: '#000000',
  onSurface: '#000000',
  
  // State colors
  error: '#d32f2f',
  errorLight: '#ffebee',
  success: '#4caf50',
  successLight: '#e8f5e9',
  warning: '#f57c00',
  warningLight: '#fff3e0',
  info: '#1976d2',
  infoLight: '#e3f2fd',
  
  // UI element colors
  border: '#e0e0e0',
  divider: '#e0e0e0',
  disabled: '#e0e0e0',
  backdrop: 'rgba(0, 0, 0, 0.5)',
  
  // Semantic colors
  housingOwned: '#4caf50',
  housingRent: '#ff9800',
  housingGovernment: '#2196f3',
};

// Spacing scale (based on 8px grid system)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

// Responsive spacing
export const getResponsiveSpacing = (size) => {
  const deviceSize = getDeviceSize();
  const scale = {
    xsmall: 0.85,
    small: 0.9,
    medium: 1,
    large: 1.1,
    xlarge: 1.2,
  };
  return spacing[size] * (scale[deviceSize] || 1);
};

// Typography configuration
const fontConfig = {
  fontFamily: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
};

// Border radius values
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

// Elevation/shadow values
export const elevation = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 8,
  xl: 16,
};

// Animation durations (in milliseconds)
export const animationDuration = {
  fast: 150,
  normal: 250,
  slow: 400,
};

// Icon sizes
export const iconSizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
};

// React Native Paper theme
export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    primaryContainer: colors.primaryLight,
    secondary: colors.secondary,
    secondaryContainer: colors.secondaryLight,
    tertiary: colors.info,
    error: colors.error,
    errorContainer: colors.errorLight,
    background: colors.background,
    surface: colors.surface,
    surfaceVariant: colors.surfaceVariant,
    onPrimary: colors.onPrimary,
    onSecondary: colors.onSecondary,
    onBackground: colors.onBackground,
    onSurface: colors.onSurface,
    outline: colors.border,
    outlineVariant: colors.divider,
  },
  roundness: borderRadius.md,
  animation: {
    scale: 1.0,
  },
};

// Common component styles
export const commonStyles = {
  // Container styles
  container: {
    flex: 1,
    backgroundColor: colors.surfaceVariant,
  },
  
  // Card styles
  card: {
    marginBottom: spacing.md,
    elevation: elevation.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
  },
  
  cardLarge: {
    marginBottom: spacing.md,
    elevation: elevation.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
  },
  
  // Section styles
  section: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    elevation: elevation.sm,
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  
  // Text styles
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  
  value: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
  },
  
  // Button styles
  button: {
    paddingVertical: spacing.sm,
  },
  
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  
  // Input styles
  input: {
    marginBottom: 4,
    backgroundColor: colors.surface,
  },
  
  // Error text
  errorText: {
    marginBottom: spacing.sm,
    marginTop: -4,
  },
  
  // Loading/empty states
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  
  // Divider
  divider: {
    marginBottom: spacing.md,
    backgroundColor: colors.divider,
  },
};

// Accessibility settings
export const accessibility = {
  // Minimum touch target size (following WCAG guidelines)
  minTouchTarget: 44,
  
  // Minimum font sizes for readability
  minFontSize: 14,
  
  // Contrast ratios (WCAG AA standard)
  minContrastNormal: 4.5,
  minContrastLarge: 3,
};

export default theme;
