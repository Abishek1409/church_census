import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Dimensions } from 'react-native';
import { Button, Card, Title, Paragraph, Snackbar, IconButton, Dialog, Portal } from 'react-native-paper';
import LoadingScreen from '../components/LoadingScreen';
import { getStats } from '../services/memberService';
import { useAuth } from '../contexts/AuthContext';
import { colors, spacing, elevation, borderRadius, animationDuration, isSmallDevice } from '../config/theme';

export default function HomeScreen({ navigation }) {
  const { user, activeRegion, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);

  const fetchStats = async () => {
    try {
      setError('');
      const data = await getStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message);
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStats();
  }, []);

  const handleRetry = () => {
    setSnackbarVisible(false);
    setLoading(true);
    fetchStats();
  };

  const handleLogout = async () => {
    setLogoutDialogVisible(false);
    try {
      await logout();
      // Navigation will automatically redirect to Login screen
    } catch (err) {
      console.error('Logout error:', err);
      setError('Logout failed. Please try again.');
      setSnackbarVisible(true);
    }
  };

  const handleRegionSelector = () => {
    navigation.navigate('RegionSelector');
  };

  if (loading) {
    return <LoadingScreen message="Loading dashboard..." />;
  }

  // Determine if user has multiple regions
  const hasMultipleRegions = user?.regions?.length > 1;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh} 
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
      accessible={true}
      accessibilityLabel="Dashboard scroll view"
    >
      {/* User Info Card */}
      <Card style={styles.userInfoCard}>
        <Card.Content>
          <View style={styles.userInfoHeader}>
            <View style={styles.userInfoText}>
              <Title style={styles.userName}>{user?.fullName || 'User'}</Title>
              <Paragraph style={styles.userRole}>
                {user?.role === 'ADMINISTRATOR' ? '👤 Administrator' : '👤 Field Worker'}
              </Paragraph>
            </View>
            <IconButton
              icon="logout"
              iconColor={colors.error}
              size={24}
              onPress={() => setLogoutDialogVisible(true)}
              accessibilityLabel="Logout"
              accessibilityHint="Tap to logout from the application"
            />
          </View>
          
          {/* Active Region Display */}
          {activeRegion && (
            <View style={styles.regionContainer}>
              <View style={styles.regionInfo}>
                <Paragraph style={styles.regionLabel}>Active Region:</Paragraph>
                <Title style={styles.regionName}>{activeRegion.name}</Title>
                {activeRegion.type && (
                  <Paragraph style={styles.regionType}>
                    {activeRegion.type === 'VILLAGE' ? '🏘️' : activeRegion.type === 'TOWN' ? '🏙️' : '🏛️'} {activeRegion.type}
                  </Paragraph>
                )}
              </View>
              
              {/* Change Region Button (only if multiple regions) */}
              {hasMultipleRegions && (
                <Button
                  mode="outlined"
                  onPress={handleRegionSelector}
                  style={styles.changeRegionButton}
                  icon="map-marker-radius"
                  compact
                  accessibilityLabel="Change Region"
                  accessibilityHint="Tap to select a different region"
                >
                  Change Region
                </Button>
              )}
            </View>
          )}

          {/* Display assigned regions for field workers */}
          {user?.role === 'FIELD_WORKER' && user?.regions?.length > 0 && (
            <View style={styles.assignedRegionsContainer}>
              <Paragraph style={styles.assignedRegionsLabel}>
                Assigned Regions: {user.regions.map(r => r.name).join(', ')}
              </Paragraph>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Welcome Card */}
      <Card style={styles.welcomeCard}>
        <Card.Content>
          <Title style={styles.title}>Church Census Dashboard</Title>
          <Paragraph style={styles.subtitle}>
            {activeRegion 
              ? `Statistics for ${activeRegion.name}`
              : 'Manage church member information efficiently'
            }
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Statistics Cards */}
      {stats && !error && (
        <View style={styles.statsContainer}>
          {/* Total Members Card */}
          <Card style={styles.statCard}>
            <Card.Content>
              <Paragraph style={styles.statLabel}>Total Members</Paragraph>
              <Title style={styles.statValue}>{stats.totalMembers || 0}</Title>
            </Card.Content>
          </Card>

          {/* Housing Type Breakdown Card */}
          <Card style={styles.statCard}>
            <Card.Content>
              <Title style={styles.breakdownTitle}>Housing Type Breakdown</Title>
              
              <View style={styles.breakdownRow}>
                <Paragraph style={styles.breakdownLabel}>🏠 Owned:</Paragraph>
                <Paragraph style={styles.breakdownValue}>
                  {stats.housingTypeBreakdown?.Owned || 0}
                </Paragraph>
              </View>

              <View style={styles.breakdownRow}>
                <Paragraph style={styles.breakdownLabel}>🏘️ Rent:</Paragraph>
                <Paragraph style={styles.breakdownValue}>
                  {stats.housingTypeBreakdown?.Rent || 0}
                </Paragraph>
              </View>

              <View style={styles.breakdownRow}>
                <Paragraph style={styles.breakdownLabel}>🏛️ Government Provided:</Paragraph>
                <Paragraph style={styles.breakdownValue}>
                  {stats.housingTypeBreakdown?.['Government Provided'] || 0}
                </Paragraph>
              </View>
            </Card.Content>
          </Card>
        </View>
      )}

      {/* Error State */}
      {error && (
        <Card style={styles.errorCard}>
          <Card.Content>
            <Title style={styles.errorTitle}>⚠️ Unable to Load Statistics</Title>
            <Paragraph style={styles.errorText}>{error}</Paragraph>
            <Button
              mode="contained"
              onPress={handleRetry}
              style={styles.retryButton}
              icon="refresh"
            >
              Retry
            </Button>
          </Card.Content>
        </Card>
      )}

      {/* Quick Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('AddMember')}
          style={styles.button}
          icon="account-plus"
        >
          Add New Member
        </Button>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('MemberList')}
          style={styles.button}
          icon="account-group"
        >
          View All Members
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.navigate('MemberList', { searchMode: true })}
          style={styles.button}
          icon="magnify"
        >
          Search Members
        </Button>
      </View>

      {/* Error Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={5000}
        action={{
          label: 'Retry',
          onPress: handleRetry,
        }}
        style={styles.errorSnackbar}
      >
        {error}
      </Snackbar>

      {/* Logout Confirmation Dialog */}
      <Portal>
        <Dialog 
          visible={logoutDialogVisible} 
          onDismiss={() => setLogoutDialogVisible(false)}
          accessibilityLabel="Logout Confirmation Dialog"
        >
          <Dialog.Title>Confirm Logout</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Are you sure you want to logout?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={() => setLogoutDialogVisible(false)}
              accessibilityLabel="Cancel logout"
            >
              Cancel
            </Button>
            <Button 
              onPress={handleLogout}
              textColor={colors.error}
              accessibilityLabel="Confirm logout"
            >
              Logout
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceVariant,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  userInfoCard: {
    marginBottom: spacing.md,
    elevation: elevation.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primaryLight,
  },
  userInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  userInfoText: {
    flex: 1,
  },
  userName: {
    fontSize: isSmallDevice() ? 20 : 22,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  userRole: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  regionContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  regionInfo: {
    marginBottom: spacing.sm,
  },
  regionLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  regionName: {
    fontSize: isSmallDevice() ? 18 : 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  regionType: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  changeRegionButton: {
    marginTop: spacing.sm,
    borderColor: colors.primary,
  },
  assignedRegionsContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  assignedRegionsLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  welcomeCard: {
    marginBottom: spacing.md,
    elevation: elevation.md,
    borderRadius: borderRadius.lg,
  },
  title: {
    fontSize: isSmallDevice() ? 22 : 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.primary,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: spacing.sm,
    fontSize: isSmallDevice() ? 14 : 16,
    color: colors.textSecondary,
  },
  statsContainer: {
    marginBottom: spacing.md,
  },
  statCard: {
    marginBottom: spacing.md,
    elevation: elevation.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  statValue: {
    fontSize: isSmallDevice() ? 32 : 36,
    fontWeight: 'bold',
    color: colors.primary,
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    color: colors.text,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    minHeight: 44, // Accessibility: minimum touch target
  },
  breakdownLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    flex: 1,
  },
  breakdownValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    minWidth: 40,
    textAlign: 'right',
  },
  errorCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.errorLight,
    elevation: elevation.sm,
    borderRadius: borderRadius.lg,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.error,
    marginBottom: spacing.sm,
  },
  errorText: {
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  retryButton: {
    marginTop: spacing.sm,
  },
  buttonContainer: {
    gap: spacing.md,
  },
  button: {
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    minHeight: 48, // Accessibility: minimum touch target
  },
  errorSnackbar: {
    backgroundColor: colors.error,
  },
});
