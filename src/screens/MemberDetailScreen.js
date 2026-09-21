import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Animated } from 'react-native';
import { Card, Text, Button, Divider, Portal, Dialog, Snackbar } from 'react-native-paper';
import LoadingScreen from '../components/LoadingScreen';
import { getMemberById, deleteMember } from '../services/memberService';
import { colors, spacing, elevation, borderRadius, animationDuration, isSmallDevice, commonStyles } from '../config/theme';

export default function MemberDetailScreen({ navigation, route }) {
  const { memberId } = route.params;
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [error, setError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  useEffect(() => {
    fetchMemberDetails();
  }, [memberId, route.params?.refresh]);

  useEffect(() => {
    if (!loading && member) {
      // Fade and slide in animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: animationDuration.normal,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: animationDuration.normal,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading, member]);

  const fetchMemberDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const memberData = await getMemberById(memberId);
      setMember(memberData);
    } catch (err) {
      console.error('Error fetching member details:', err);
      setError(err.message);
      
      Alert.alert(
        'Error',
        err.message,
        [
          {
            text: 'Retry',
            onPress: fetchMemberDetails,
          },
          {
            text: 'Go Back',
            onPress: () => navigation.goBack(),
            style: 'cancel',
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirmation = () => {
    setDeleteDialogVisible(true);
  };

  const handleDelete = async () => {
    try {
      setDeleteDialogVisible(false);
      setDeleting(true);
      setError('');
      
      await deleteMember(memberId);
      
      Alert.alert(
        'Success',
        'Member deleted successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('MemberList', { refresh: true }),
          },
        ]
      );
    } catch (err) {
      console.error('Error deleting member:', err);
      setError(err.message);
      setSnackbarVisible(true);
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = () => {
    navigation.navigate('AddMember', { member });
  };

  if (loading) {
    return <LoadingScreen message="Loading member details..." />;
  }

  if (!member) {
    return (
      <View style={styles.errorContainer}>
        <Text variant="headlineSmall" style={styles.errorText}>
          ⚠️ Member not found
        </Text>
        <Text variant="bodyMedium" style={styles.errorSubtext}>
          {error || 'This member may have been deleted.'}
        </Text>
        <Button 
          mode="contained" 
          onPress={() => navigation.goBack()} 
          style={styles.goBackButton}
          accessible={true}
          accessibilityLabel="Go back button"
          accessibilityHint="Returns to previous screen"
        >
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
      >
        {/* Personal Information Section */}
        <Card style={styles.card} accessible={true} accessibilityLabel="Personal information section">
          <Card.Content>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <Divider style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.label}>Full Name:</Text>
              <Text style={styles.value} accessible={true} accessibilityLabel={`Full name: ${member.fullName}`}>
                {member.fullName}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Aadhar Number:</Text>
              <Text style={styles.value} accessible={true} accessibilityLabel={`Aadhar number: ${member.aadharNumber}`}>
                {member.aadharNumber}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Phone Number:</Text>
              <Text style={styles.value} accessible={true} accessibilityLabel={`Phone number: ${member.phoneNumber}`}>
                {member.phoneNumber}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Community:</Text>
              <Text style={styles.value}>{member.community}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Sub-caste:</Text>
              <Text style={styles.value}>{member.subCaste}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Housing Information Section */}
        <Card style={styles.card} accessible={true} accessibilityLabel="Housing information section">
          <Card.Content>
            <Text style={styles.sectionTitle}>Housing Information</Text>
            <Divider style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.label}>Housing Type:</Text>
              <Text style={styles.value}>{member.housingType}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Address:</Text>
              <Text style={styles.value}>{member.address}</Text>
            </View>

            {member.housingType === 'Owned' && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Has Patta:</Text>
                <Text style={styles.value}>
                  {member.hasPatta ? 'Yes' : 'No'}
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Occupation and Financial Section */}
        <Card style={styles.card} accessible={true} accessibilityLabel="Occupation and financial information section">
          <Card.Content>
            <Text style={styles.sectionTitle}>Occupation & Financial</Text>
            <Divider style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.label}>Occupation:</Text>
              <Text style={styles.value}>{member.occupation}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Monthly Income:</Text>
              <Text style={styles.value}>₹{parseFloat(member.income).toFixed(2)}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Education Section */}
        <Card style={styles.card} accessible={true} accessibilityLabel="Education information section">
          <Card.Content>
            <Text style={styles.sectionTitle}>Education</Text>
            <Divider style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.label}>Qualification:</Text>
              <Text style={styles.value}>{member.educationQualification}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Government Documentation Section */}
        <Card style={styles.card} accessible={true} accessibilityLabel="Government documentation section">
          <Card.Content>
            <Text style={styles.sectionTitle}>Government Documentation</Text>
            <Divider style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.label}>Ration Card Number:</Text>
              <Text style={styles.value}>{member.rationCardNumber}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleEdit}
            style={[styles.button, styles.editButton]}
            icon="pencil"
            contentStyle={styles.buttonContent}
            accessible={true}
            accessibilityLabel="Edit member button"
            accessibilityHint="Opens form to edit member information"
          >
            Edit Member
          </Button>

          <Button
            mode="outlined"
            onPress={showDeleteConfirmation}
            style={[styles.button, styles.deleteButton]}
            icon="delete"
            contentStyle={styles.buttonContent}
            textColor={colors.error}
            loading={deleting}
            disabled={deleting}
            accessible={true}
            accessibilityLabel="Delete member button"
            accessibilityHint="Deletes this member permanently"
          >
            Delete Member
          </Button>
        </View>

        <View style={styles.bottomPadding} />
      </Animated.ScrollView>

      {/* Delete Confirmation Dialog */}
      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <Dialog.Title>Confirm Delete</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete {member.fullName}? This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>
              Cancel
            </Button>
            <Button
              onPress={handleDelete}
              textColor={colors.error}
            >
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Error Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={5000}
        action={{
          label: 'Dismiss',
          onPress: () => setSnackbarVisible(false),
        }}
        style={styles.errorSnackbar}
      >
        {error}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
  },
  errorContainer: {
    ...commonStyles.emptyContainer,
    backgroundColor: colors.surfaceVariant,
  },
  errorText: {
    color: colors.error,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  errorSubtext: {
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  goBackButton: {
    marginTop: spacing.sm,
    minHeight: 48, // Accessibility
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  card: {
    ...commonStyles.card,
    marginBottom: spacing.md,
    elevation: elevation.md,
    borderRadius: borderRadius.lg,
  },
  sectionTitle: {
    ...commonStyles.sectionTitle,
    fontSize: isSmallDevice() ? 16 : 18,
  },
  divider: {
    ...commonStyles.divider,
  },
  infoRow: {
    marginBottom: spacing.md,
    minHeight: 44, // Accessibility: minimum touch target for selectable text
  },
  label: {
    ...commonStyles.label,
    fontSize: isSmallDevice() ? 13 : 14,
  },
  value: {
    ...commonStyles.value,
    fontSize: isSmallDevice() ? 15 : 16,
  },
  buttonContainer: {
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  button: {
    borderRadius: borderRadius.md,
    minHeight: 48, // Accessibility
  },
  editButton: {
    backgroundColor: colors.primary,
    elevation: elevation.sm,
  },
  deleteButton: {
    borderColor: colors.error,
    borderWidth: 2,
  },
  buttonContent: {
    paddingVertical: spacing.md,
  },
  bottomPadding: {
    height: spacing.lg,
  },
  errorSnackbar: {
    backgroundColor: colors.error,
  },
});
