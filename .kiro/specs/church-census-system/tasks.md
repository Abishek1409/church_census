# Implementation Plan

- [x] 1. Set up project structure and initialize repositories









  - Create backend Express.js project with folder structure (models, routes, controllers, config)
  - Create React Native Expo project
  - Initialize Git repositories for both projects
  - Create .gitignore files (exclude node_modules, .env, etc.)
  - _Requirements: Foundation for all development_

- [x] 2. Set up PostgreSQL database and backend connection




  - Create Render.com account and provision PostgreSQL database
  - Create database schema with members table and indexes
  - Set up Sequelize ORM in backend project
  - Create Member model with all fields (fullName, aadharNumber, phoneNumber, etc.)
  - Configure database connection using environment variables
  - Test database connection
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 3.1, 3.2, 4.1, 5.1_

- [x] 3. Implement backend API endpoints






-

  - [x] 3.1 Create health check endpoint for keep-alive










    - Implement GET /api/health endpoint
    - Return simple status response
    - _Requirements: Infrastructure for Render.com keep-alive_

  - [x] 3.2 Implement member creation endpoint


    - Create POST /api/members route
    - Implement validation for all required fields
    - Validate Aadhar number format (12 digits, unique)
    - Validate phone number format (10 digits)
    - Implement conditional Patta field logic
    - Handle duplicate Aadhar number error
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 3.1, 3.2, 4.1, 5.1_

  - [x] 3.3 Implement member retrieval endpoints


    - Create GET /api/members endpoint (with pagination)
    - Create GET /api/members/:id endpoint
    - Implement error handling for not found
    - _Requirements: 6.1, 6.2_

  - [x] 3.4 Implement member update endpoint


    - Create PUT /api/members/:id route
    - Reuse validation logic from creation
    - Handle Aadhar uniqueness on update
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 3.5 Implement member deletion endpoint


    - Create DELETE /api/members/:id route
    - Add confirmation requirement
    - Handle not found errors
    - _Requirements: Supporting delete functionality_

  - [x] 3.6 Implement search and filter endpoints


    - Create GET /api/members/search endpoint (search by name)
    - Create GET /api/members/filter endpoint (filter by community and housing type)
    - Implement case-insensitive search
    - _Requirements: 8.1, 8.2, 8.3_

  - [x] 3.7 Implement statistics endpoint


    - Create GET /api/stats endpoint
    - Return total members count
    - Return housing type breakdown
    - _Requirements: Supporting dashboard statistics_
- [-] 4. Deploy backend to Render.com







- [ ] 4. Deploy backend to Render.com

  - Create Render.com web service
  - Connect GitHub repository
  - Configure environment variables (DATABASE_URL)
  - Set up automatic deploys
  - Test deployed API endpoints
  - Note the deployed URL (e.g., https://your-app.onrender.com)
  - _Requirements: Infrastructure for all features_

- [ ] 5. Set up keep-alive cron job
  - Create cron-job.org account
  - Configure cron job to ping /api/health every 14 minutes
  - Verify server stays awake
  - _Requirements: Infrastructure reliability_

- [ ] 6. Initialize React Native mobile app
  - Create Expo project with React Navigation
  - Install dependencies (react-native-paper, formik, yup, axios)
  - Set up navigation structure (Stack Navigator)
  - Create API configuration file with Render.com URL
  - _Requirements: Foundation for mobile app_

- [ ] 7. Implement member form screen (Add/Edit)
  - [ ] 7.1 Create AddMemberScreen component with scrollable form
    - Create form layout with sections (Personal Info, Housing, Occupation, Documentation)
    - Add input fields for all member data
    - Implement React Native Paper TextInput components
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 3.1, 3.2, 4.1, 5.1_

  - [ ] 7.2 Implement form validation with Formik and Yup
    - Set up Formik form with initial values
    - Create Yup validation schema
    - Validate Aadhar number (12 digits, numeric)
    - Validate phone number (10 digits, numeric)
    - Validate all required fields
    - Display inline error messages
    - _Requirements: Validation rules from design_

  - [ ] 7.3 Implement conditional Patta field
    - Show Patta checkbox only when housing type is "Owned"
    - Hide Patta field for "Rent" and "Government Provided"
    - Clear Patta value when housing type changes from Owned
    - _Requirements: 2.3_

  - [ ] 7.4 Implement housing type picker
    - Create native Picker/Dropdown for housing type
    - Options: "Rent", "Owned", "Government Provided"
    - Style with React Native Paper
    - _Requirements: 2.1_

  - [ ] 7.5 Implement form submission
    - Connect to POST /api/members endpoint
    - Show loading indicator during submission
    - Handle success response (navigate to member list)
    - Handle error responses (display user-friendly messages)
    - Handle duplicate Aadhar error specifically
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 3.1, 3.2, 4.1, 5.1_

- [ ] 8. Implement member list screen
  - [ ] 8.1 Create MemberListScreen with FlatList
    - Fetch members from GET /api/members endpoint
    - Display member cards with name, phone, community, housing type
    - Implement pull-to-refresh
    - Show loading indicator
    - Handle empty state (no members yet)
    - _Requirements: 6.1, 6.2_

  - [ ] 8.2 Add search functionality
    - Create search bar at top of screen
    - Implement search API call to /api/members/search
    - Show search results in real-time
    - Clear search functionality
    - _Requirements: 8.1, 8.2_

  - [ ] 8.3 Add filter functionality
    - Create filter icon/button
    - Open filter modal/screen
    - Add community filter dropdown
    - Add housing type filter dropdown
    - Call /api/members/filter endpoint
    - Apply and clear filters
    - _Requirements: 8.3_

  - [ ] 8.4 Implement navigation to member details
    - Make member cards tappable
    - Navigate to MemberDetailScreen on tap
    - Pass member ID to detail screen
    - _Requirements: 6.2_

  - [ ] 8.5 Add floating action button (FAB)
    - Add FAB at bottom-right corner
    - Navigate to AddMemberScreen on press
    - Style with React Native Paper
    - _Requirements: Supporting quick add functionality_

- [ ] 9. Implement member detail screen
  - Create MemberDetailScreen component
  - Fetch single member from GET /api/members/:id
  - Display all member information in organized sections
  - Add Edit button (navigate to edit mode of form)
  - Add Delete button with confirmation dialog
  - Implement delete API call to DELETE /api/members/:id
  - Handle delete success (navigate back to list)
  - _Requirements: 6.2, 6.3, 7.1_

- [ ] 10. Implement member edit functionality
  - Reuse AddMemberScreen component for edit mode
  - Pre-fill form with existing member data
  - Change screen title to "Edit Member"
  - Call PUT /api/members/:id on save
  - Handle update success (navigate back to detail screen)
  - _Requirements: 7.1, 7.2, 7.3_

- [ ] 11. Implement home/dashboard screen (optional)
  - Create HomeScreen component
  - Fetch statistics from GET /api/stats
  - Display total members count card
  - Display housing type breakdown
  - Add quick action buttons (Add Member, View All, Search)
  - Style with React Native Paper cards
  - _Requirements: Supporting dashboard view_

- [ ] 12. Implement error handling and loading states
  - Add error boundary component
  - Implement retry logic for failed API calls
  - Show toast/snackbar for network errors
  - Display user-friendly error messages
  - Add loading spinners for all API calls
  - Handle offline state gracefully
  - _Requirements: Error handling from design_

- [ ] 13. Styling and UI polish
  - Apply consistent theme using React Native Paper
  - Ensure responsive design for different screen sizes
  - Add proper spacing and padding
  - Implement smooth transitions and animations
  - Test on both Android and iOS
  - Ensure accessibility (labels, contrast)
  - _Requirements: User interface requirements_

- [ ] 14. Build and test mobile app
  - Test all CRUD operations
  - Test validation rules
  - Test search and filter
  - Test conditional Patta field
  - Test error scenarios (network error, duplicate Aadhar, etc.)
  - Test on physical Android device
  - Build APK using Expo
  - _Requirements: All requirements validation_

- [ ] 15. Create deployment documentation
  - Document Render.com setup steps
  - Document cron-job.org configuration
  - Document environment variables needed
  - Document how to build APK
  - Create user guide for church administrators
  - _Requirements: Supporting deployment and usage_
