import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, Animated } from 'react-native';
import { TextInput, Button, Text, Divider, HelperText, Checkbox, Menu, Snackbar } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { createMember, updateMember } from '../services/memberService';
import { colors, spacing, elevation, borderRadius, animationDuration, isSmallDevice, commonStyles } from '../config/theme';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../config/api';

// Validation schema using Yup
const memberValidationSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Full name is required')
    .max(100, 'Full name must be less than 100 characters'),
  
  aadharNumber: Yup.string()
    .required('Aadhar number is required')
    .matches(/^[0-9]{12}$/, 'Aadhar number must be exactly 12 digits')
    .length(12, 'Aadhar number must be exactly 12 digits'),
  
  phoneNumber: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
    .length(10, 'Phone number must be exactly 10 digits'),
  
  community: Yup.string()
    .required('Community is required')
    .max(50, 'Community must be less than 50 characters'),
  
  subCaste: Yup.string()
    .required('Sub-caste is required')
    .max(50, 'Sub-caste must be less than 50 characters'),
  
  housingType: Yup.string()
    .required('Housing type is required')
    .oneOf(['Rent', 'Owned', 'Government Provided'], 'Invalid housing type'),
  
  address: Yup.string()
    .required('Address is required'),
  
  hasPatta: Yup.boolean(),
  
  occupation: Yup.string()
    .required('Occupation is required')
    .max(100, 'Occupation must be less than 100 characters'),
  
  income: Yup.number()
    .required('Income is required')
    .positive('Income must be a positive number')
    .typeError('Income must be a valid number'),
  
  educationQualification: Yup.string()
    .required('Education qualification is required')
    .max(100, 'Education qualification must be less than 100 characters'),
  
  rationCardNumber: Yup.string()
    .required('Ration card number is required')
    .max(20, 'Ration card number must be less than 20 characters'),
  
  regionId: Yup.number()
    .required('Region is required')
    .positive('Please select a valid region')
    .typeError('Region is required'),
});

export default function AddMemberScreen({ navigation, route }) {
  // Check if we're in edit mode
  const editMode = route?.params?.member ? true : false;
  const memberToEdit = route?.params?.member;

  // Get auth context
  const { user, activeRegion } = useAuth();
  const isAdmin = user?.role === 'ADMINISTRATOR';

  // State for housing type dropdown
  const [housingTypeMenuVisible, setHousingTypeMenuVisible] = useState(false);
  
  // State for region dropdown (administrators only)
  const [regionMenuVisible, setRegionMenuVisible] = useState(false);
  const [availableRegions, setAvailableRegions] = useState([]);
  const [loadingRegions, setLoadingRegions] = useState(false);
  
  // State for loading and error handling
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Animation value for fade-in effect
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Fade in animation on mount
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: animationDuration.normal,
      useNativeDriver: true,
    }).start();
  }, []);

  // Fetch regions for administrators
  React.useEffect(() => {
    if (isAdmin) {
      fetchRegions();
    }
  }, [isAdmin]);

  const fetchRegions = async () => {
    try {
      setLoadingRegions(true);
      const response = await apiClient.get('/regions');
      
      if (response.data.success) {
        setAvailableRegions(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching regions:', error);
      Alert.alert(
        'Error',
        'Failed to load regions. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoadingRegions(false);
    }
  };

  // Initial form values
  const initialValues = {
    fullName: memberToEdit?.fullName || '',
    aadharNumber: memberToEdit?.aadharNumber || '',
    phoneNumber: memberToEdit?.phoneNumber || '',
    community: memberToEdit?.community || '',
    subCaste: memberToEdit?.subCaste || '',
    housingType: memberToEdit?.housingType || '',
    address: memberToEdit?.address || '',
    hasPatta: memberToEdit?.hasPatta || false,
    occupation: memberToEdit?.occupation || '',
    income: memberToEdit?.income?.toString() || '',
    educationQualification: memberToEdit?.educationQualification || '',
    rationCardNumber: memberToEdit?.rationCardNumber || '',
    // Region field - for field workers, auto-assign from activeRegion
    regionId: memberToEdit?.regionId || (isAdmin ? '' : activeRegion?.id || ''),
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    
    try {
      // Prepare data for submission
      const memberData = {
        fullName: values.fullName.trim(),
        aadharNumber: values.aadharNumber.trim(),
        phoneNumber: values.phoneNumber.trim(),
        community: values.community.trim(),
        subCaste: values.subCaste.trim(),
        housingType: values.housingType,
        address: values.address.trim(),
        hasPatta: values.housingType === 'Owned' ? values.hasPatta : null,
        occupation: values.occupation.trim(),
        income: parseFloat(values.income),
        educationQualification: values.educationQualification.trim(),
        rationCardNumber: values.rationCardNumber.trim(),
        regionId: parseInt(values.regionId), // Include regionId
      };

      let response;
      if (editMode) {
        // Update existing member
        response = await updateMember(memberToEdit.id, memberData);
        setSnackbarMessage('Member updated successfully!');
      } else {
        // Create new member
        response = await createMember(memberData);
        setSnackbarMessage('Member added successfully!');
      }

      setSnackbarVisible(true);
      
      // Navigate based on mode
      setTimeout(() => {
        if (editMode) {
          // For edit mode, navigate back to detail screen
          navigation.navigate('MemberDetail', { 
            memberId: memberToEdit.id,
            refresh: true 
          });
        } else {
          // For add mode, navigate to member list
          navigation.navigate('MemberList', { refresh: true });
        }
      }, 1000);

    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Handle specific error cases
      let errorMessage = 'Failed to save member. Please try again.';
      
      if (error.response) {
        // Server responded with error
        if (error.response.status === 409) {
          // Duplicate Aadhar number
          errorMessage = 'This Aadhar number is already registered. Please check and try again.';
        } else if (error.response.status === 400) {
          // Validation error
          errorMessage = error.response.data?.message || 'Invalid data. Please check all fields.';
        } else if (error.response.status === 403) {
          // Region access denied
          if (editMode) {
            errorMessage = 'You do not have permission to edit this member. They may be in a region not assigned to you.';
          } else {
            errorMessage = 'You do not have permission to add members to this region.';
          }
        } else if (error.response.status === 404) {
          // Member not found (for edit mode)
          errorMessage = 'Member not found. Please refresh and try again.';
        } else {
          errorMessage = error.response.data?.message || errorMessage;
        }
      } else if (error.request) {
        // Network error
        errorMessage = 'Cannot reach server. Please check your internet connection.';
      } else if (error.message) {
        // Use error message if available
        errorMessage = error.message;
      }

      // Show error alert
      Alert.alert(
        'Error',
        errorMessage,
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={memberValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => {
          // Effect to clear hasPatta when housing type changes from Owned
          useEffect(() => {
            if (values.housingType !== 'Owned' && values.hasPatta) {
              setFieldValue('hasPatta', false);
            }
          }, [values.housingType]);

          return (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Personal Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              <Divider style={styles.divider} />
              
              <TextInput
                label="Full Name *"
                value={values.fullName}
                onChangeText={handleChange('fullName')}
                onBlur={handleBlur('fullName')}
                mode="outlined"
                style={styles.input}
                error={touched.fullName && errors.fullName}
              />
              {touched.fullName && errors.fullName && (
                <HelperText type="error" visible={true} style={styles.errorText}>
                  {errors.fullName}
                </HelperText>
              )}

              <TextInput
                label="Aadhar Number *"
                value={values.aadharNumber}
                onChangeText={handleChange('aadharNumber')}
                onBlur={handleBlur('aadharNumber')}
                mode="outlined"
                keyboardType="numeric"
                maxLength={12}
                placeholder="12 digits"
                style={styles.input}
                error={touched.aadharNumber && errors.aadharNumber}
              />
              {touched.aadharNumber && errors.aadharNumber && (
                <HelperText type="error" visible={true} style={styles.errorText}>
                  {errors.aadharNumber}
                </HelperText>
              )}

              <TextInput
                label="Phone Number *"
                value={values.phoneNumber}
                onChangeText={handleChange('phoneNumber')}
                onBlur={handleBlur('phoneNumber')}
                mode="outlined"
                keyboardType="phone-pad"
                maxLength={10}
                placeholder="10 digits"
                style={styles.input}
                error={touched.phoneNumber && errors.phoneNumber}
              />
              {touched.phoneNumber && errors.phoneNumber && (
                <HelperText type="error" visible={true} style={styles.errorText}>
                  {errors.phoneNumber}
                </HelperText>
              )}

              <TextInput
                label="Community *"
                value={values.community}
                onChangeText={handleChange('community')}
                onBlur={handleBlur('community')}
                mode="outlined"
                style={styles.input}
                error={touched.community && errors.community}
              />
              {touched.community && errors.community && (
                <HelperText type="error" visible={true} style={styles.errorText}>
                  {errors.community}
                </HelperText>
              )}

              <TextInput
                label="Sub-caste *"
                value={values.subCaste}
                onChangeText={handleChange('subCaste')}
                onBlur={handleBlur('subCaste')}
                mode="outlined"
                style={styles.input}
                error={touched.subCaste && errors.subCaste}
              />
              {touched.subCaste && errors.subCaste && (
                <HelperText type="error" visible={true} style={styles.errorText}>
                  {errors.subCaste}
                </HelperText>
              )}
            </View>

            {/* Region Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Region Assignment</Text>
              <Divider style={styles.divider} />

              {isAdmin ? (
                // Administrators see a region dropdown picker
                <>
                  <View style={styles.dropdownContainer}>
                    <Menu
                      visible={regionMenuVisible}
                      onDismiss={() => setRegionMenuVisible(false)}
                      anchor={
                        <TouchableOpacity
                          onPress={() => setRegionMenuVisible(true)}
                          activeOpacity={0.7}
                        >
                          <TextInput
                            label="Region *"
                            value={
                              values.regionId
                                ? availableRegions.find(r => r.id === values.regionId)?.name || ''
                                : ''
                            }
                            mode="outlined"
                            style={styles.input}
                            editable={false}
                            right={<TextInput.Icon icon="menu-down" />}
                            error={touched.regionId && errors.regionId}
                            pointerEvents="none"
                          />
                        </TouchableOpacity>
                      }
                    >
                      {availableRegions.map((region) => (
                        <Menu.Item
                          key={region.id}
                          onPress={() => {
                            setFieldValue('regionId', region.id);
                            setRegionMenuVisible(false);
                          }}
                          title={`${region.name} (${region.type})`}
                        />
                      ))}
                    </Menu>
                  </View>
                  {touched.regionId && errors.regionId && (
                    <HelperText type="error" visible={true} style={styles.errorText}>
                      {errors.regionId}
                    </HelperText>
                  )}
                  {loadingRegions && (
                    <HelperText type="info" visible={true}>
                      Loading regions...
                    </HelperText>
                  )}
                </>
              ) : (
                // Field workers see their active region (read-only)
                <>
                  <TextInput
                    label="Region *"
                    value={activeRegion?.name || 'No active region'}
                    mode="outlined"
                    style={styles.input}
                    editable={false}
                    disabled
                  />
                  <HelperText type="info" visible={true}>
                    Members will be assigned to your active region: {activeRegion?.name}
                  </HelperText>
                </>
              )}
            </View>

            {/* Housing Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Housing Information</Text>
              <Divider style={styles.divider} />

              {/* Housing Type Picker */}
              <View style={styles.dropdownContainer}>
                <Menu
                  visible={housingTypeMenuVisible}
                  onDismiss={() => setHousingTypeMenuVisible(false)}
                  anchor={
                    <TouchableOpacity
                      onPress={() => setHousingTypeMenuVisible(true)}
                      activeOpacity={0.7}
                    >
                      <TextInput
                        label="Housing Type *"
                        value={values.housingType}
                        mode="outlined"
                        style={styles.input}
                        editable={false}
                        right={<TextInput.Icon icon="menu-down" />}
                        error={touched.housingType && errors.housingType}
                        pointerEvents="none"
                      />
                    </TouchableOpacity>
                  }
                >
                  <Menu.Item
                    onPress={() => {
                      setFieldValue('housingType', 'Rent');
                      setHousingTypeMenuVisible(false);
                    }}
                    title="Rent"
                  />
                  <Menu.Item
                    onPress={() => {
                      setFieldValue('housingType', 'Owned');
                      setHousingTypeMenuVisible(false);
                    }}
                    title="Owned"
                  />
                  <Menu.Item
                    onPress={() => {
                      setFieldValue('housingType', 'Government Provided');
                      setHousingTypeMenuVisible(false);
                    }}
                    title="Government Provided"
                  />
                </Menu>
              </View>
              {touched.housingType && errors.housingType && (
                <HelperText type="error" visible={true} style={styles.errorText}>
                  {errors.housingType}
                </HelperText>
              )}

              <TextInput
                label="Address *"
                value={values.address}
                onChangeText={handleChange('address')}
                onBlur={handleBlur('address')}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.input}
                error={touched.address && errors.address}
              />
              {touched.address && errors.address && (
                <HelperText type="error" visible={true} style={styles.errorText}>
                  {errors.address}
                </HelperText>
              )}

              {/* Patta field - conditional rendering based on housing type */}
              {values.housingType === 'Owned' && (
                <View style={styles.checkboxContainer}>
                  <Checkbox.Item
                    label="Has Patta (Land Ownership Document)"
                    status={values.hasPatta ? 'checked' : 'unchecked'}
                    onPress={() => setFieldValue('hasPatta', !values.hasPatta)}
                    mode="android"
                    position="leading"
                    labelStyle={styles.checkboxLabel}
                  />
                </View>
              )}
            </View>

            {/* Occupation and Financial Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Occupation & Financial</Text>
              <Divider style={styles.divider} />

              <TextInput
                label="Occupation *"
                value={values.occupation}
                onChangeText={handleChange('occupation')}
                onBlur={handleBlur('occupation')}
                mode="outlined"
                style={styles.input}
                error={touched.occupation && errors.occupation}
              />
              {touched.occupation && errors.occupation && (
                <HelperText type="error" visible={true} style={styles.errorText}>
                  {errors.occupation}
                </HelperText>
              )}

              <TextInput
                label="Monthly Income *"
                value={values.income}
                onChangeText={handleChange('income')}
                onBlur={handleBlur('income')}
                mode="outlined"
                keyboardType="decimal-pad"
                placeholder="Amount in Rupees"
                style={styles.input}
                error={touched.income && errors.income}
              />
              {touched.income && errors.income && (
                <HelperText type="error" visible={true} style={styles.errorText}>
                  {errors.income}
                </HelperText>
              )}
            </View>

            {/* Education Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Education</Text>
              <Divider style={styles.divider} />

              <TextInput
                label="Education Qualification *"
                value={values.educationQualification}
                onChangeText={handleChange('educationQualification')}
                onBlur={handleBlur('educationQualification')}
                mode="outlined"
                style={styles.input}
                error={touched.educationQualification && errors.educationQualification}
              />
              {touched.educationQualification && errors.educationQualification && (
                <HelperText type="error" visible={true} style={styles.errorText}>
                  {errors.educationQualification}
                </HelperText>
              )}
            </View>

            {/* Documentation Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Government Documentation</Text>
              <Divider style={styles.divider} />

              <TextInput
                label="Ration Card Number *"
                value={values.rationCardNumber}
                onChangeText={handleChange('rationCardNumber')}
                onBlur={handleBlur('rationCardNumber')}
                mode="outlined"
                style={styles.input}
                error={touched.rationCardNumber && errors.rationCardNumber}
              />
              {touched.rationCardNumber && errors.rationCardNumber && (
                <HelperText type="error" visible={true} style={styles.errorText}>
                  {errors.rationCardNumber}
                </HelperText>
              )}
            </View>

            {/* Submit Button */}
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.submitButton}
              contentStyle={styles.submitButtonContent}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? 'Saving...' 
                : editMode 
                  ? 'Update Member' 
                  : 'Save Member'
              }
            </Button>

            <View style={styles.bottomPadding} />
          </ScrollView>
          );
        }}
      </Formik>

      {/* Success Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceVariant,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  section: {
    ...commonStyles.section,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...commonStyles.sectionTitle,
    fontSize: isSmallDevice() ? 16 : 18,
  },
  divider: {
    ...commonStyles.divider,
  },
  input: {
    ...commonStyles.input,
    marginBottom: spacing.xs,
  },
  dropdownContainer: {
    marginBottom: spacing.xs,
  },
  errorText: {
    ...commonStyles.errorText,
    marginBottom: spacing.sm,
    marginTop: -spacing.xs,
  },
  checkboxContainer: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    minHeight: 48, // Accessibility: minimum touch target
  },
  checkboxLabel: {
    fontSize: isSmallDevice() ? 13 : 14,
    lineHeight: 20,
  },
  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  submitButton: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
    minHeight: 48, // Accessibility: minimum touch target
    elevation: elevation.md,
  },
  submitButtonContent: {
    paddingVertical: spacing.md,
  },
  bottomPadding: {
    height: spacing.lg,
  },
  snackbar: {
    backgroundColor: colors.success,
  },
});
