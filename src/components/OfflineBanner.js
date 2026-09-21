import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Banner } from 'react-native-paper';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { colors, spacing, elevation, animationDuration } from '../config/theme';

/**
 * Banner that shows when device is offline
 */
const OfflineBanner = () => {
  const { isConnected, isInternetReachable } = useNetworkStatus();
  const [visible, setVisible] = React.useState(false);
  const slideAnim = React.useRef(new Animated.Value(-100)).current;

  React.useEffect(() => {
    // Show banner when offline
    const shouldShow = isConnected === false || isInternetReachable === false;
    
    if (shouldShow && !visible) {
      setVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: animationDuration.normal,
        useNativeDriver: true,
      }).start();
    } else if (!shouldShow && visible) {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: animationDuration.normal,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    }
  }, [isConnected, isInternetReachable]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
      <Banner
        visible={visible}
        icon="wifi-off"
        style={styles.banner}
        contentStyle={styles.bannerContent}
        accessible={true}
        accessibilityLabel="No internet connection banner"
        accessibilityRole="alert"
      >
        No internet connection. Some features may not work.
      </Banner>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    elevation: elevation.xl,
  },
  banner: {
    backgroundColor: colors.error,
  },
  bannerContent: {
    paddingVertical: spacing.sm,
  },
});

export default OfflineBanner;
