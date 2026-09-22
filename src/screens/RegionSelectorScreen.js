/**
 * RegionSelectorScreen - Region Selection Interface
 * 
 * Allows field workers with multiple region assignments to select which region
 * they are currently working in. The active region determines which members
 * are visible and where new members are assigned.
 * 
 * Features:
 * - Display list of user's assigned regions
 * - Show member count for each region
 * - Highlight currently active region
 * - Switch active region with visual feedback
 * - Navigate back after selection
 * 
 * Requirements: 11.1, 11.2, 11.3, 11.4
 * 
 * @module screens/RegionSelectorScreen
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Title, Paragraph, Snackbar, ActivityIndicator, Divider } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { colors, spacing, elevation, borderRadius } from '../config/theme';
import apiClient from '../config/api';

export default function RegionSelectorScreen({ navigation }) {
  const { user, activeRegion, setActiveRegion } = useAuth();
  const [regionStats, setRegionStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success'); // 'success' or 'error'

  /**
   * Fetch member count for each region
   */
  useEffect(() => {
    const fetchRegionStats = async () => {
      try {
        setLoading(true);
        
        // Fetch stats for each region
        // Note: The backend already filters by user's assigned regions
        const statsResponse = await apiClient.get('/stats');
        
        // For now, we'll fetch all members and count per region
        // A better implementation would have a dedicated endpoint for region stats
        const membersResponse = await apiClient.get('/members', {
          params: { limit: 1000 }, // Get all members
        });
        
        const members = membersResponse.data?.data || [];
        
        // Count members per region
        const counts = {};
        members.forEach(member => {
          const regionId = member.regionId;
          if (regionId) {
            counts[regionId] = (counts[regionId] || 0) + 1;
          }
        });
        
        setRegionStats(counts);
      } catch (error) {
        console.error('Error fetching region stats:', error);
        // Continue even if stats fail - we can still show regions
      } finally {
        setLoading(false);
      }
    };

    fetchRegionStats();
  }, []);

  /**
   * Handle region selection
   * @param {Object} region - The region to set as active
   */
  const handleRegionSelect = async (region) => {
    try {
      // Set active region in AuthContext
      const success = await setActiveRegion(region);
      
      if (success) {
        // Show success feedback
        setSnackbarMessage(`Switched to ${region.name}`);
        setSnackbarType('success');
        setSnackbarVisible(true);
        
        // Navigate back to previous screen after a short delay
        setTimeout(() => {
          navigation.goBack();
        }, 800);
      } else {
        // Show error feedback
        setSnackbarMessage('Failed to switch region. Please try again.');
        setSnackbarType('error');
        setSnackbarVisible(true);
      }
    } catch (error) {
      console.error('Error selecting region:', error);
      setSnackbarMessage('An error occurred while switching region.');
      setSnackbarType('error');
      setSnackbarVisible(true);
    }
  };

  /**
   * Get region type icon
   * @param {string} type - Region type (VILLAGE, TOWN, DISTRICT)
   * @returns {string} Icon name
   */
  const getRegionIcon = (type) => {
    switch (type) {
      case 'VILLAGE':
        return 'home-group';
      case 'TOWN':
        return 'city';
      case 'DISTRICT':
        return 'map';
      default:
        return 'map-marker';
    }
  };

  /**
   * Format region type for display
   * @param {string} type - Region type
   * @returns {string} Formatted type
   */
  const formatRegionType = (type) => {
    if (!type) return '';
    return type.charAt(0) + type.slice(1).toLowerCase();
  };

  // Get user's assigned regions
  const assignedRegions = user?.regions || [];

  // If user has no regions or only one region, show message
  if (assignedRegions.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Title style={styles.emptyTitle}>No Regions Assigned</Title>
        <Paragraph style={styles.emptyText}>
          You don't have any regions assigned yet. Please contact your administrator.
        </Paragraph>
      </View>
    );
  }

  if (assignedRegions.length === 1) {
    return (
      <View style={styles.centerContainer}>
        <Title style={styles.emptyTitle}>Single Region</Title>
        <Paragraph style={styles.emptyText}>
          You are assigned to only one region: {assignedRegions[0].name}
        </Paragraph>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        accessible={true}
        accessibilityLabel="Region selection list"
      >
        {/* Header */}
        <View style={styles.header}>
          <Title style={styles.headerTitle}>Select Active Region</Title>
          <Paragraph style={styles.headerSubtitle}>
            Choose the region you're currently working in
          </Paragraph>
        </View>

        <Divider style={styles.divider} />

        {/* Loading indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Paragraph style={styles.loadingText}>Loading regions...</Paragraph>
          </View>
        )}

        {/* Region list */}
        {!loading && (
          <List.Section>
            {assignedRegions.map((region, index) => {
              const isActive = activeRegion?.id === region.id;
              const memberCount = regionStats[region.id] || 0;
              
              return (
                <React.Fragment key={region.id}>
                  <List.Item
                    title={region.name}
                    description={`${formatRegionType(region.type)} • ${memberCount} member${memberCount !== 1 ? 's' : ''}`}
                    left={(props) => (
                      <List.Icon
                        {...props}
                        icon={getRegionIcon(region.type)}
                        color={isActive ? colors.primary : colors.textSecondary}
                      />
                    )}
                    right={(props) => (
                      isActive ? (
                        <List.Icon
                          {...props}
                          icon="check-circle"
                          color={colors.success}
                        />
                      ) : (
                        <List.Icon
                          {...props}
                          icon="chevron-right"
                          color={colors.textSecondary}
                        />
                      )
                    )}
                    onPress={() => handleRegionSelect(region)}
                    style={[
                      styles.listItem,
                      isActive && styles.activeListItem,
                    ]}
                    titleStyle={[
                      styles.listItemTitle,
                      isActive && styles.activeListItemTitle,
                    ]}
                    descriptionStyle={styles.listItemDescription}
                    accessible={true}
                    accessibilityLabel={`${region.name}, ${formatRegionType(region.type)}, ${memberCount} members${isActive ? ', currently active' : ''}`}
                    accessibilityRole="button"
                    accessibilityHint={`Tap to switch to ${region.name}`}
                  />
                  {index < assignedRegions.length - 1 && (
                    <Divider style={styles.itemDivider} />
                  )}
                </React.Fragment>
              );
            })}
          </List.Section>
        )}

        {/* Info text */}
        {!loading && (
          <View style={styles.infoContainer}>
            <Paragraph style={styles.infoText}>
              💡 Your active region determines which members you see and where new members are assigned.
            </Paragraph>
          </View>
        )}
      </ScrollView>

      {/* Success/Error Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={[
          styles.snackbar,
          snackbarType === 'error' && styles.errorSnackbar,
        ]}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceVariant,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.surfaceVariant,
  },
  header: {
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  divider: {
    marginBottom: spacing.sm,
    backgroundColor: colors.divider,
  },
  loadingContainer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
  listItem: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    minHeight: 72, // Accessibility: adequate touch target
  },
  activeListItem: {
    backgroundColor: colors.successLight,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  listItemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  activeListItemTitle: {
    color: colors.success,
    fontWeight: 'bold',
  },
  listItemDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  itemDivider: {
    backgroundColor: colors.divider,
  },
  infoContainer: {
    margin: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.infoLight,
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  snackbar: {
    backgroundColor: colors.success,
  },
  errorSnackbar: {
    backgroundColor: colors.error,
  },
});
