import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Modal, ScrollView } from 'react-native';
import { Card, Text, Searchbar, IconButton, Button, Snackbar } from 'react-native-paper';
import { FAB } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import LoadingScreen from '../components/LoadingScreen';
import { getAllMembers, searchMembers, filterMembers } from '../services/memberService';
import { colors, spacing, elevation, borderRadius, iconSizes, isSmallDevice } from '../config/theme';

export default function MemberListScreen({ navigation }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [filterCommunity, setFilterCommunity] = useState('');
  const [filterHousingType, setFilterHousingType] = useState('');
  const [activeFilters, setActiveFilters] = useState(false);
  
  // Error handling state
  const [error, setError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    // Debounce search
    const delaySearch = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      } else {
        fetchMembers();
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllMembers();
      setMembers(data);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError(err.message);
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    try {
      setIsSearching(true);
      setError('');
      const data = await searchMembers(query);
      setMembers(data);
    } catch (err) {
      console.error('Error searching members:', err);
      setError(err.message);
      setSnackbarVisible(true);
    } finally {
      setIsSearching(false);
    }
  };

  const onClearSearch = () => {
    setSearchQuery('');
    fetchMembers();
  };

  const handleApplyFilters = async () => {
    try {
      setFilterModalVisible(false);
      setLoading(true);
      setError('');
      
      const filters = {};
      if (filterCommunity) filters.community = filterCommunity;
      if (filterHousingType) filters.housingType = filterHousingType;
      
      const data = await filterMembers(filters);
      setMembers(data);
      setActiveFilters(filterCommunity || filterHousingType);
    } catch (err) {
      console.error('Error filtering members:', err);
      setError(err.message);
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setFilterCommunity('');
    setFilterHousingType('');
    setFilterModalVisible(false);
    setActiveFilters(false);
    fetchMembers();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setError('');
    await fetchMembers();
    setRefreshing(false);
  };

  const handleRetry = () => {
    setSnackbarVisible(false);
    fetchMembers();
  };

  const renderMemberCard = ({ item }) => (
    <Card 
      style={styles.card} 
      onPress={() => navigation.navigate('MemberDetail', { memberId: item.id })}
      accessible={true}
      accessibilityLabel={`Member card for ${item.fullName}`}
      accessibilityHint="Tap to view member details"
      accessibilityRole="button"
    >
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text variant="titleLarge" style={styles.memberName}>{item.fullName}</Text>
        </View>
        <View style={styles.cardDetails}>
          <Text variant="bodyMedium" style={styles.detailText} accessible={true} accessibilityLabel={`Phone number ${item.phoneNumber}`}>
            📞 {item.phoneNumber}
          </Text>
          <Text variant="bodyMedium" style={styles.detailText} accessible={true} accessibilityLabel={`Community ${item.community}`}>
            🏛️ {item.community}
          </Text>
          <Text variant="bodyMedium" style={styles.detailText} accessible={true} accessibilityLabel={`Housing type ${item.housingType}`}>
            🏠 {item.housingType}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text variant="titleLarge" style={styles.emptyText}>
        {error ? '⚠️ Error Loading Members' : 'No members yet'}
      </Text>
      <Text variant="bodyMedium" style={styles.emptySubtext}>
        {error 
          ? 'Unable to load members. Please check your connection and try again.'
          : 'Tap the + button below to add your first member'
        }
      </Text>
      {error && (
        <Button
          mode="contained"
          onPress={handleRetry}
          style={styles.retryButton}
          icon="refresh"
        >
          Retry
        </Button>
      )}
    </View>
  );

  if (loading) {
    return <LoadingScreen message="Loading members..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search by name..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          icon="magnify"
          clearIcon="close"
          onClearIconPress={onClearSearch}
          loading={isSearching}
        />
        <IconButton
          icon={activeFilters ? "filter" : "filter-variant"}
          size={24}
          onPress={() => setFilterModalVisible(true)}
          style={styles.filterButton}
          iconColor={activeFilters ? '#6200ee' : undefined}
        />
      </View>
      <FlatList
        data={members}
        renderItem={renderMemberCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={members.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
        }
      />
      
      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text variant="titleLarge" style={styles.modalTitle}>Filter Members</Text>
              <IconButton
                icon="close"
                size={24}
                onPress={() => setFilterModalVisible(false)}
              />
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.filterSection}>
                <Text variant="titleMedium" style={styles.filterLabel}>Community</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={filterCommunity}
                    onValueChange={(itemValue) => setFilterCommunity(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="All Communities" value="" />
                    <Picker.Item label="Catholic" value="Catholic" />
                    <Picker.Item label="Hindu" value="Hindu" />
                    <Picker.Item label="Muslim" value="Muslim" />
                    <Picker.Item label="Christian" value="Christian" />
                    <Picker.Item label="Other" value="Other" />
                  </Picker>
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text variant="titleMedium" style={styles.filterLabel}>Housing Type</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={filterHousingType}
                    onValueChange={(itemValue) => setFilterHousingType(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="All Types" value="" />
                    <Picker.Item label="Rent" value="Rent" />
                    <Picker.Item label="Owned" value="Owned" />
                    <Picker.Item label="Government Provided" value="Government Provided" />
                  </Picker>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button
                mode="outlined"
                onPress={handleClearFilters}
                style={styles.modalButton}
              >
                Clear Filters
              </Button>
              <Button
                mode="contained"
                onPress={handleApplyFilters}
                style={styles.modalButton}
                buttonColor="#6200ee"
              >
                Apply
              </Button>
            </View>
          </View>
        </View>
      </Modal>

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

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddMember')}
        color="#fff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceVariant,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: colors.surface,
    elevation: elevation.sm,
  },
  searchbar: {
    flex: 1,
    elevation: 0,
    backgroundColor: colors.surfaceVariant,
  },
  filterButton: {
    margin: 0,
    minWidth: 48, // Accessibility: minimum touch target
    minHeight: 48,
  },
  list: {
    padding: spacing.sm,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: spacing.sm,
    elevation: elevation.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    minHeight: 100,
  },
  cardHeader: {
    marginBottom: spacing.sm,
  },
  memberName: {
    fontWeight: 'bold',
    color: colors.text,
    fontSize: isSmallDevice() ? 18 : 20,
  },
  cardDetails: {
    gap: 4,
  },
  detailText: {
    color: colors.textSecondary,
    marginVertical: 2,
    fontSize: isSmallDevice() ? 14 : 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  emptyText: {
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    color: colors.text,
    textAlign: 'center',
  },
  emptySubtext: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  retryButton: {
    marginTop: spacing.sm,
    minHeight: 48, // Accessibility
  },
  fab: {
    position: 'absolute',
    margin: spacing.md,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    minWidth: 56, // Accessibility: FAB size
    minHeight: 56,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.backdrop,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    minHeight: 64,
  },
  modalTitle: {
    fontWeight: 'bold',
    color: colors.text,
  },
  modalBody: {
    padding: spacing.md,
  },
  filterSection: {
    marginBottom: spacing.lg,
  },
  filterLabel: {
    marginBottom: spacing.sm,
    color: colors.text,
    fontWeight: '600',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceVariant,
    minHeight: 50,
  },
  picker: {
    height: 50,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 4,
    minHeight: 48, // Accessibility
  },
  errorSnackbar: {
    backgroundColor: colors.error,
  },
});
