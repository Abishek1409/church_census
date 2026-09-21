# Church Census System - User Guide for Administrators

## Welcome to the Church Census System! 👋

This guide will help church administrators use the mobile app to manage member information effectively.

---

## Table of Contents
1. [Getting Started](#getting-started)
2. [Adding New Members](#adding-new-members)
3. [Viewing Member List](#viewing-member-list)
4. [Searching for Members](#searching-for-members)
5. [Filtering Members](#filtering-members)
6. [Viewing Member Details](#viewing-member-details)
7. [Editing Member Information](#editing-member-information)
8. [Deleting Members](#deleting-members)
9. [Understanding the Dashboard](#understanding-the-dashboard)
10. [Tips and Best Practices](#tips-and-best-practices)
11. [Common Issues](#common-issues)

---

## Getting Started

### Installing the App

1. **Receive the APK file** from your IT administrator (via WhatsApp, email, or USB)
2. On your Android phone, open the APK file
3. If prompted, enable "Install from Unknown Sources" in Settings
4. Tap **Install**
5. Once installed, tap **Open**

### First Time Setup

- No login required! App is ready to use immediately
- Make sure you have internet connection
- On first launch, the app will connect to the church database

---

## Adding New Members

### Step-by-Step Process

1. **Open the app** and tap the **+ (Plus)** button at the bottom-right corner
   - Or tap "Add New Member" from the home screen

2. **Fill in Personal Information**
   - **Full Name**: Enter member's complete name
     - Example: `John Michael Doe`
   - **Aadhar Number**: Enter 12-digit Aadhar number (no spaces)
     - Example: `123456789012`
     - ⚠️ Must be unique (each person can only be registered once)
   - **Phone Number**: Enter 10-digit mobile number (no spaces)
     - Example: `9876543210`

3. **Fill in Community Details**
   - **Community**: Enter religious/social community
     - Example: `Catholic`, `Protestant`, `CSI`
   - **Sub-caste**: Enter specific sub-caste
     - Example: `Latin`, `Nadar`, `Tamil`

4. **Fill in Housing Information**
   - **Housing Type**: Select from dropdown:
     - **Rent**: If living in rented house
     - **Owned**: If owns the house
     - **Government Provided**: If living in government housing
   - **Address**: Enter complete address
     - Example: `123 Church Street, Trichy - 620001`
   - **Has Patta** (Only shown if "Owned" is selected):
     - Check the box if member has Patta document
     - Leave unchecked if no Patta

5. **Fill in Occupation Details**
   - **Occupation**: Enter member's job/work
     - Example: `Teacher`, `Driver`, `Self-Employed`, `Homemaker`
   - **Income**: Enter monthly income in rupees
     - Example: `25000` (just the number, no ₹ symbol)

6. **Fill in Education**
   - **Education Qualification**: Enter highest education level
     - Example: `10th Standard`, `Graduate`, `Post Graduate`, `Illiterate`

7. **Fill in Government Documents**
   - **Ration Card Number**: Enter ration card number
     - Example: `RAT123456789`

8. **Save the Member**
   - Tap **Save** button at the bottom
   - Wait for confirmation message
   - You'll be taken back to the member list

### Validation Rules

The app will show error messages if:
- ❌ Any required field is empty
- ❌ Aadhar number is not 12 digits
- ❌ Phone number is not 10 digits
- ❌ Aadhar number already exists in database

**Fix the errors and tap Save again.**

---

## Viewing Member List

### Accessing the List

- Tap **"View All Members"** from home screen
- Or the app opens to member list by default

### What You'll See

Each member card shows:
- **Name** (in large text)
- **Phone number** and **Community** (smaller text)
- **Housing type** (below)
- **Arrow icon** (→) to view details

### Refreshing the List

- **Pull down** on the list to refresh
- This fetches latest data from the server

### Empty State

If no members are registered yet, you'll see:
- "No members found" message
- Suggestion to add first member

---

## Searching for Members

### How to Search

1. Tap the **search bar** at the top of member list
2. Start typing the member's name
3. Results appear as you type (real-time search)
4. Tap any result to view details

### Search Tips

- Search works on partial names
  - Typing `john` will find `John Doe`, `Johnny`, etc.
- Search is **not case-sensitive**
  - `john` = `John` = `JOHN`
- Clear search by tapping the **X** in search bar

### Example Searches

- Search: `mary` → Finds all members with "Mary" in name
- Search: `raj` → Finds "Raj", "Raja", "Rajesh", "Suraj"

---

## Filtering Members

### Opening Filters

1. Tap the **filter icon** (⋮ or funnel icon) at top-right
2. Filter screen opens

### Available Filters

**Filter by Community:**
- Tap the **Community** dropdown
- Select a community (e.g., Catholic, Protestant)
- Tap **Apply Filters**

**Filter by Housing Type:**
- Tap the **Housing Type** dropdown
- Select type (Rent, Owned, Government Provided)
- Tap **Apply Filters**

**Multiple Filters:**
- You can select BOTH community and housing type
- Example: Show all Catholic members living in owned houses

### Clearing Filters

- Tap **Clear Filters** to reset
- Or select "All" from dropdown (if available)

---

## Viewing Member Details

### Accessing Details

1. From member list, **tap on any member card**
2. Details screen opens showing all information

### Information Displayed

Member details are organized in sections:

**Personal Information**
- Full Name
- Aadhar Number (partially hidden: XXX-XXX-9012)
- Phone Number
- Community
- Sub-caste

**Housing Information**
- Housing Type
- Address
- Patta Status (if applicable)

**Occupation & Income**
- Occupation
- Monthly Income

**Education**
- Qualification

**Government Documents**
- Ration Card Number

### Actions Available

- **Edit Button**: Modify member information
- **Delete Button**: Remove member from database
- **Back Button**: Return to member list

---

## Editing Member Information

### How to Edit

1. Open member details (tap member from list)
2. Tap **Edit** button (pencil icon or "Edit" text)
3. Form opens with existing data pre-filled
4. Change any fields you need to update
5. Tap **Save** button

### Important Notes

- All validation rules still apply
- Aadhar number can be changed, but must still be unique
- If you change Housing Type from "Owned" to "Rent", Patta data is cleared

### What Can Be Updated

✅ All fields can be updated:
- Personal information
- Contact details
- Housing information
- Occupation and income
- Education
- Government documents

---

## Deleting Members

### ⚠️ Warning: This action cannot be undone!

### How to Delete

1. Open member details
2. Tap **Delete** button (red color)
3. Confirmation dialog appears:
   - "Are you sure you want to delete [Name]?"
4. Tap **Confirm** to delete
   - Or tap **Cancel** to abort

### After Deletion

- Member is permanently removed from database
- You're returned to member list
- Deleted member won't appear in searches or list

### When to Delete

- ❌ **Don't delete** if person just moved (mark as inactive instead)
- ✅ **Do delete** for duplicate entries
- ✅ **Do delete** for test data
- ⚠️ **Be careful** - deletion is permanent!

---

## Understanding the Dashboard

### Dashboard Overview

The home screen (dashboard) shows:

**Statistics Cards:**
- **Total Members**: Number of registered members
- **Housing Breakdown**: 
  - Number living in Rent
  - Number with Owned houses
  - Number in Government housing

**Quick Actions:**
- **Add New Member**: Opens add form
- **View All Members**: Opens member list
- **Search Members**: Opens search

### Refreshing Statistics

- Pull down on dashboard to refresh stats
- Stats update automatically after adding/editing members

---

## Tips and Best Practices

### Data Entry Tips

1. **Aadhar Number**
   - Double-check before saving (must be accurate)
   - No spaces or dashes, just 12 digits
   - Keep original Aadhar card handy during entry

2. **Phone Number**
   - Always include 10 digits
   - For landlines, use mobile if available
   - Verify number is correct for future contact

3. **Address**
   - Be detailed (include street, area, city, pincode)
   - Good: `123 Church Street, Gandhi Nagar, Trichy - 620001`
   - Bad: `Trichy`

4. **Income**
   - Enter monthly income (approximate is fine)
   - Just the number, no commas or ₹ symbol
   - Example: `25000` not `₹25,000`

### Regular Maintenance

✅ **Weekly:**
- Verify new additions for accuracy
- Check for duplicate entries

✅ **Monthly:**
- Update members who changed address
- Update members with new phone numbers
- Review and clean test data

✅ **Yearly:**
- Update income information
- Update occupation if changed
- Update education qualifications

### Security Best Practices

- 🔒 Don't share member data publicly
- 🔒 Don't take screenshots of sensitive info (Aadhar, etc.)
- 🔒 Lock your phone with password/pattern
- 🔒 Don't install the app on untrusted devices

---

## Common Issues

### Issue: "Network Error - Cannot Connect"

**Causes:**
- No internet connection
- Server is waking up (Render.com free tier)

**Solutions:**
1. Check your internet connection (WiFi/mobile data)
2. Wait 30 seconds and try again (server may be starting)
3. Close and reopen the app
4. Contact IT administrator if problem persists

### Issue: "Duplicate Aadhar Number"

**Cause:**
- This Aadhar number is already registered

**Solutions:**
1. Check if member already exists (search by name)
2. If duplicate entry, delete the old one first
3. If Aadhar was typed wrong, correct it
4. Verify with physical Aadhar card

### Issue: "Invalid Aadhar Number Format"

**Cause:**
- Aadhar is not 12 digits
- Contains spaces or special characters

**Solutions:**
1. Count the digits (must be exactly 12)
2. Remove any spaces or dashes
3. Enter only numbers (0-9)

### Issue: "Invalid Phone Number"

**Cause:**
- Not 10 digits
- Contains country code (+91)

**Solutions:**
1. Use only 10-digit mobile number
2. Remove +91 or 0 prefix
3. Example: `9876543210` not `+919876543210`

### Issue: Can't See Patta Checkbox

**Cause:**
- Housing Type is not set to "Owned"

**Solution:**
1. Select "Owned" from Housing Type dropdown
2. Patta checkbox will appear automatically

### Issue: App is Slow on First Use

**Cause:**
- Backend server is waking up (Render free tier sleeps after 15 min)

**Solution:**
1. Wait 20-30 seconds for server to start
2. Subsequent requests will be fast
3. This is normal behavior (keep-alive cron job helps)

### Issue: Member Not Appearing in List

**Causes:**
- List not refreshed after adding
- Filters are active

**Solutions:**
1. Pull down on list to refresh
2. Check if filters are applied (clear them)
3. Try searching for the member by name

### Issue: Can't Edit/Delete Member

**Cause:**
- Network issue
- Member was deleted by another admin

**Solutions:**
1. Check internet connection
2. Refresh the member list
3. Verify member still exists in database

---

## Getting Help

### Contact Information

If you encounter issues not covered in this guide:

1. **Technical Issues**: Contact your IT administrator
2. **Data Questions**: Contact church office
3. **App Errors**: Note the error message and report to IT team

### Reporting Bugs

When reporting an issue, provide:
- What you were trying to do
- What happened (error message if any)
- Screenshots (if not sensitive data)
- When it happened (date/time)

---

## Keyboard Shortcuts (Advanced)

For faster data entry on tablets with keyboards:

- `Tab` - Move to next field
- `Shift + Tab` - Move to previous field
- `Enter` - Save form (when on Save button)

---

## Glossary

**Terms Used in the App:**

- **Aadhar**: 12-digit unique ID issued by Government of India
- **Ration Card**: Government document for subsidized food
- **Patta**: Legal land ownership document
- **Community**: Religious/social group (e.g., Catholic, Protestant)
- **Sub-caste**: Specific subdivision within community
- **Housing Type**: Whether residence is rented, owned, or government-provided

---

## FAQs

**Q: Can multiple people use the app at the same time?**
A: Yes! The app supports multiple users. Changes sync automatically.

**Q: What if I make a mistake?**
A: You can edit any member anytime. Just open their details and tap Edit.

**Q: Is the data backed up?**
A: Yes! All data is stored in cloud database with automatic backups.

**Q: Can I use the app offline?**
A: No, internet connection is required. Data is stored in cloud, not on phone.

**Q: How much storage does the app use?**
A: Very little (under 50 MB). It doesn't store member data on your phone.

**Q: Can I export data to Excel?**
A: Not yet. This feature may be added in future updates.

**Q: Is member data secure?**
A: Yes! Data is encrypted during transmission and stored securely.

---

## Updates and New Features

The app may receive updates with new features. Updates will be distributed by your IT administrator.

**Current Version**: 1.0.0

---

**Thank you for using the Church Census System!** 

If you have suggestions for improvements, please share them with the development team. We're here to help make church administration easier! 🙏

---

*For technical documentation and deployment guides, see DEPLOYMENT_COMPLETE_GUIDE.md*
