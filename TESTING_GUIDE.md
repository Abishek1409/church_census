# Church Census Mobile App - Testing Guide

## Automated Tests

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Test Coverage

The automated test suite covers:

1. **Validation Rules** (`validation.test.js`)
   - Aadhar number validation (12 digits, numeric only)
   - Phone number validation (10 digits, numeric only)
   - Housing type validation (Rent, Owned, Government Provided)
   - Income validation (positive numbers only)
   - Required fields validation
   - Complete form validation

2. **API Service** (`memberService.test.js`)
   - Create member (CRUD - Create)
   - Get all members (CRUD - Read)
   - Get member by ID (CRUD - Read)
   - Update member (CRUD - Update)
   - Delete member (CRUD - Delete)
   - Search members
   - Filter members
   - Get statistics
   - Health check
   - Error handling (network errors, duplicate Aadhar, not found)

3. **Conditional Patta Field** (`conditionalPatta.test.js`)
   - Patta field visibility based on housing type
   - Patta field clearing when housing type changes
   - Data submission logic for Patta field

## Manual Testing Checklist

### Prerequisites
- Backend server running (local or deployed on Render.com)
- Update API_BASE_URL in `mobile/src/config/api.js`
- Physical Android device or emulator connected

### 1. Member Creation (CRUD - Create)

#### Test Case 1.1: Create Valid Member
- [ ] Open app and navigate to Add Member screen
- [ ] Fill all required fields with valid data:
  - Full Name: "John Doe"
  - Aadhar: "123456789012" (12 digits)
  - Phone: "9876543210" (10 digits)
  - Community: "Catholic"
  - Sub-caste: "Latin"
  - Housing Type: "Owned"
  - Address: "123 Main Street, City"
  - Has Patta: Check the box
  - Occupation: "Teacher"
  - Income: "25000"
  - Education: "Bachelor Degree"
  - Ration Card: "RC123456"
- [ ] Tap "Save Member"
- [ ] ✓ Success message should appear
- [ ] ✓ Redirected to Member List
- [ ] ✓ New member appears in the list

#### Test Case 1.2: Duplicate Aadhar Error
- [ ] Try to create another member with same Aadhar number
- [ ] ✓ Error message: "This Aadhar number is already registered"
- [ ] ✓ Form remains on screen with data intact

#### Test Case 1.3: Network Error Handling
- [ ] Turn off internet connection
- [ ] Try to create a member
- [ ] ✓ Error message: "Cannot reach server. Please check your internet connection"
- [ ] Turn on internet and retry
- [ ] ✓ Should succeed on retry

### 2. Validation Rules Testing

#### Test Case 2.1: Aadhar Number Validation
- [ ] Enter Aadhar with 11 digits: "12345678901"
- [ ] Blur the field
- [ ] ✓ Error: "Aadhar number must be exactly 12 digits"
- [ ] Enter Aadhar with letters: "12345678901A"
- [ ] ✓ Error: "Aadhar number must be exactly 12 digits"
- [ ] Enter valid 12-digit Aadhar
- [ ] ✓ No error message

#### Test Case 2.2: Phone Number Validation
- [ ] Enter phone with 9 digits: "987654321"
- [ ] ✓ Error: "Phone number must be exactly 10 digits"
- [ ] Enter phone with letters: "987654321A"
- [ ] ✓ Error: "Phone number must be exactly 10 digits"
- [ ] Enter valid 10-digit phone
- [ ] ✓ No error message

#### Test Case 2.3: Income Validation
- [ ] Enter negative income: "-5000"
- [ ] ✓ Error: "Income must be a positive number"
- [ ] Enter zero: "0"
- [ ] ✓ Error: "Income must be a positive number"
- [ ] Enter letters: "abc"
- [ ] ✓ Error: "Income must be a valid number"
- [ ] Enter valid positive number: "25000"
- [ ] ✓ No error message

#### Test Case 2.4: Required Fields
- [ ] Leave Full Name empty and try to save
- [ ] ✓ Error: "Full name is required"
- [ ] Test each required field by leaving it empty
- [ ] ✓ Appropriate error message for each field

### 3. Conditional Patta Field Testing

#### Test Case 3.1: Patta Visibility for "Owned"
- [ ] Select Housing Type: "Owned"
- [ ] ✓ Patta checkbox appears below address field
- [ ] ✓ Label: "Has Patta (Land Ownership Document)"
- [ ] Check the Patta box
- [ ] ✓ Checkbox shows checked state

#### Test Case 3.2: Patta Hidden for "Rent"
- [ ] Select Housing Type: "Owned" and check Patta
- [ ] Change Housing Type to "Rent"
- [ ] ✓ Patta checkbox disappears
- [ ] Change back to "Owned"
- [ ] ✓ Patta checkbox reappears unchecked (cleared)

#### Test Case 3.3: Patta Hidden for "Government Provided"
- [ ] Select Housing Type: "Owned" and check Patta
- [ ] Change Housing Type to "Government Provided"
- [ ] ✓ Patta checkbox disappears
- [ ] Submit form
- [ ] ✓ Member created successfully without Patta value

### 4. Member List and Search (CRUD - Read)

#### Test Case 4.1: View All Members
- [ ] Navigate to Member List screen
- [ ] ✓ All created members appear as cards
- [ ] ✓ Each card shows: Name, Phone, Community, Housing Type
- [ ] Pull down to refresh
- [ ] ✓ Loading indicator appears
- [ ] ✓ List refreshes

#### Test Case 4.2: Search by Name
- [ ] Tap search bar at top
- [ ] Type "John"
- [ ] ✓ Results filter in real-time
- [ ] ✓ Only members with "John" in name appear
- [ ] Clear search
- [ ] ✓ All members appear again

#### Test Case 4.3: Search with No Results
- [ ] Search for "NonExistentName"
- [ ] ✓ No results message appears
- [ ] ✓ List is empty

### 5. Filter Functionality

#### Test Case 5.1: Filter by Community
- [ ] Tap filter icon
- [ ] Select Community: "Catholic"
- [ ] Apply filter
- [ ] ✓ Only Catholic members shown
- [ ] Clear filter
- [ ] ✓ All members appear again

#### Test Case 5.2: Filter by Housing Type
- [ ] Tap filter icon
- [ ] Select Housing Type: "Owned"
- [ ] Apply filter
- [ ] ✓ Only members with owned houses shown

#### Test Case 5.3: Multiple Filters
- [ ] Apply both Community and Housing Type filters
- [ ] ✓ Results match both criteria
- [ ] ✓ Count shows correct number

### 6. Member Details and Edit (CRUD - Update)

#### Test Case 6.1: View Member Details
- [ ] Tap on a member card from list
- [ ] ✓ Detail screen opens
- [ ] ✓ All member information displayed in sections
- [ ] ✓ Edit and Delete buttons visible

#### Test Case 6.2: Edit Member
- [ ] Tap "Edit" button on detail screen
- [ ] ✓ Form opens with all fields pre-filled
- [ ] ✓ Screen title shows "Edit Member"
- [ ] Change Full Name to "Jane Doe"
- [ ] Change Income to "30000"
- [ ] Tap "Update Member"
- [ ] ✓ Success message appears
- [ ] ✓ Redirected to detail screen
- [ ] ✓ Updated information displayed

#### Test Case 6.3: Edit with Validation Error
- [ ] Edit a member
- [ ] Change Aadhar to "123" (invalid)
- [ ] Try to save
- [ ] ✓ Validation error appears
- [ ] ✓ Form remains open
- [ ] Correct the error and save
- [ ] ✓ Update succeeds

### 7. Delete Member (CRUD - Delete)

#### Test Case 7.1: Delete with Confirmation
- [ ] Open member detail screen
- [ ] Tap "Delete" button
- [ ] ✓ Confirmation dialog appears
- [ ] Tap "Cancel"
- [ ] ✓ Dialog closes, member not deleted
- [ ] Tap "Delete" again
- [ ] Tap "Confirm"
- [ ] ✓ Member deleted
- [ ] ✓ Redirected to member list
- [ ] ✓ Member no longer in list

#### Test Case 7.2: Delete Non-existent Member
- [ ] Try to delete a member that was already deleted
- [ ] ✓ Error message: "Member not found"

### 8. Statistics Dashboard

#### Test Case 8.1: View Statistics
- [ ] Navigate to Home/Dashboard screen
- [ ] ✓ Total members count displayed
- [ ] ✓ Housing type breakdown shown:
  - Rent: X members
  - Owned: Y members
  - Government Provided: Z members
- [ ] Add a new member
- [ ] Return to dashboard
- [ ] ✓ Statistics updated

### 9. Error Scenarios

#### Test Case 9.1: Server Unreachable
- [ ] Stop backend server or use wrong API URL
- [ ] Try to load member list
- [ ] ✓ Error message appears
- [ ] ✓ Retry button available
- [ ] Fix connection and retry
- [ ] ✓ Data loads successfully

#### Test Case 9.2: Slow Network (Render.com Spin-up)
- [ ] If using Render.com free tier after 15 min inactivity
- [ ] Try to load data
- [ ] ✓ Loading indicator shows for ~30 seconds
- [ ] ✓ Data eventually loads
- [ ] ✓ No errors shown

#### Test Case 9.3: Offline Mode
- [ ] Turn off device internet
- [ ] ✓ Offline banner appears at top
- [ ] Try to create member
- [ ] ✓ Network error message appears
- [ ] Turn on internet
- [ ] ✓ Offline banner disappears
- [ ] ✓ Operations work again

### 10. UI and UX Testing

#### Test Case 10.1: Responsive Design
- [ ] Test on different screen sizes (small and large devices)
- [ ] ✓ All content visible and properly sized
- [ ] ✓ Buttons and touch targets at least 48px
- [ ] ✓ Text readable at default size

#### Test Case 10.2: Scrolling and Navigation
- [ ] Scroll through long member list
- [ ] ✓ Smooth scrolling
- [ ] ✓ No performance issues
- [ ] Navigate between screens
- [ ] ✓ Smooth transitions
- [ ] ✓ Back button works correctly

#### Test Case 10.3: Form Usability
- [ ] Fill out add member form
- [ ] ✓ Keyboard appropriate for each field (numeric for phone, etc.)
- [ ] ✓ Tab order logical
- [ ] ✓ Error messages clear and helpful
- [ ] ✓ Submit button disabled during submission

### 11. Data Integrity Testing

#### Test Case 11.1: Special Characters
- [ ] Create member with name: "O'Brien-Smith"
- [ ] Create member with address containing line breaks
- [ ] ✓ Data saved correctly
- [ ] View member details
- [ ] ✓ Special characters display correctly

#### Test Case 11.2: Long Text
- [ ] Enter very long address (200+ characters)
- [ ] ✓ Text field handles it
- [ ] Save member
- [ ] ✓ Full address saved
- [ ] View details
- [ ] ✓ Full address displayed

#### Test Case 11.3: Decimal Income
- [ ] Enter income with decimals: "25000.50"
- [ ] Save member
- [ ] ✓ Decimal value saved
- [ ] View details
- [ ] ✓ Shows "25000.50" or "25000.5"

## Physical Device Testing

### Android Device Setup
1. Enable Developer Mode on Android device
2. Enable USB Debugging
3. Connect device to computer via USB
4. Run: `npm run android`
5. App installs and runs on physical device

### Test on Real Device
- [ ] Install app on physical Android device
- [ ] Test all CRUD operations
- [ ] Test with real phone keyboard
- [ ] Test with touch gestures
- [ ] Test with actual mobile internet
- [ ] Test app performance (loading speed, responsiveness)
- [ ] Test battery usage (run for extended period)

## Building APK

### Development Build
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Configure build
eas build:configure

# Build APK for Android
eas build --platform android --profile preview
```

### Testing the APK
1. Download built APK from Expo
2. Transfer to Android device
3. Install APK
4. Launch app
5. Test all core functionality
6. Verify app works without development server

## Testing Completion Checklist

### Core Functionality
- [ ] All automated tests passing (npm test)
- [ ] Create member works
- [ ] Read/view members works
- [ ] Update member works
- [ ] Delete member works
- [ ] Search functionality works
- [ ] Filter functionality works

### Validation
- [ ] Aadhar validation works (12 digits)
- [ ] Phone validation works (10 digits)
- [ ] Income validation works (positive numbers)
- [ ] Housing type validation works
- [ ] All required fields validated

### Conditional Logic
- [ ] Patta field shows for "Owned" housing type
- [ ] Patta field hidden for "Rent"
- [ ] Patta field hidden for "Government Provided"
- [ ] Patta field clears when housing type changes

### Error Handling
- [ ] Duplicate Aadhar error handled
- [ ] Network errors handled gracefully
- [ ] 404 errors handled
- [ ] Validation errors shown clearly
- [ ] Server errors handled

### User Experience
- [ ] Loading states shown appropriately
- [ ] Success messages appear
- [ ] Error messages are user-friendly
- [ ] Navigation works smoothly
- [ ] App responsive on different screen sizes
- [ ] Offline mode handled

### Device Testing
- [ ] Tested on physical Android device
- [ ] App performance acceptable
- [ ] No crashes or freezes
- [ ] Battery usage reasonable
- [ ] APK build successful
- [ ] Installable APK works correctly

## Known Issues / Limitations

1. **Render.com Free Tier**: 
   - Server spins down after 15 minutes of inactivity
   - First request after sleep takes ~30 seconds
   - Solution: Use cron-job.org to keep alive

2. **Network Dependency**:
   - App requires internet connection for all operations
   - No offline data storage currently implemented
   - Future: Add local caching and sync

3. **Authentication**:
   - No user authentication implemented
   - Anyone with the app can access all data
   - Future: Add JWT authentication

## Test Results Summary

Date: _____________
Tester: _____________

| Test Category | Status | Notes |
|--------------|--------|-------|
| Automated Tests | ☐ Pass / ☐ Fail | |
| CRUD Operations | ☐ Pass / ☐ Fail | |
| Validation Rules | ☐ Pass / ☐ Fail | |
| Conditional Patta | ☐ Pass / ☐ Fail | |
| Search & Filter | ☐ Pass / ☐ Fail | |
| Error Handling | ☐ Pass / ☐ Fail | |
| UI/UX | ☐ Pass / ☐ Fail | |
| Physical Device | ☐ Pass / ☐ Fail | |
| APK Build | ☐ Pass / ☐ Fail | |

**Overall Result**: ☐ PASS / ☐ FAIL

**Signature**: _____________
