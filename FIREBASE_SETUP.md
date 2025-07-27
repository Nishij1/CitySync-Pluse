# Firebase Setup Guide for CitySync+ Bengaluru

This guide will help you set up Firebase for the CitySync+ application to enable real-time incident management for Bengaluru.

## Prerequisites

- A Google account
- Node.js and npm installed
- CitySync+ project cloned and running

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `citysync-plus`
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Set up Firestore Database

1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location closest to India (e.g., asia-south1)
5. Click "Done"

## Step 3: Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon (</>) to add a web app
4. Register app with name: `CitySync+ Web`
5. Copy the Firebase configuration object

## Step 4: Update Environment Variables

Update your `.env.local` file with your Firebase configuration:

```env
# ================================
# FIREBASE CONFIGURATION
# ================================
NEXT_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Step 5: Set up Firestore Security Rules

In Firestore Database > Rules, update the rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to incidents collection
    match /incidents/{document} {
      allow read, write: if true; // For development only
    }
  }
}
```

**Note:** For production, implement proper authentication and authorization rules.

## Step 6: Initialize Sample Data

The application will automatically create sample Bengaluru incident data when you first run it. The sample data includes:

- Traffic Jam at Silk Board Junction
- Pothole on Outer Ring Road
- Power Outage in Koramangala
- Waterlogging at Hebbal Flyover
- Road Closure on MG Road
- Fire Emergency in Whitefield

## Step 7: Test the Application

1. Start the development server: `npm run dev`
2. Open http://localhost:3000
3. You should see the loading screen, then the Bengaluru map with incidents
4. Click the green "+" button to add new incidents
5. Use the search and filter features to test functionality

## Features Enabled by Firebase

### Real-time Updates
- Incidents update automatically across all connected clients
- No need to refresh the page to see new incidents

### Incident Management
- Add new incidents with the admin panel
- Edit existing incidents
- Delete incidents
- All changes sync in real-time

### Data Persistence
- All incident data is stored in Firestore
- Data persists across browser sessions
- Automatic backup and recovery

### Bengaluru-Specific Features
- Pre-configured with Bengaluru coordinates (12.9716, 77.5946)
- Sample data for major Bengaluru locations
- Indian timezone support (Asia/Kolkata)
- Local area names and landmarks

## Troubleshooting

### Firebase Connection Issues
- Check your API keys in `.env.local`
- Ensure Firestore rules allow read/write access
- Check browser console for error messages

### No Data Showing
- Verify Firebase configuration is correct
- Check if sample data initialization completed
- Look for errors in browser console

### Real-time Updates Not Working
- Ensure you're using the correct project ID
- Check Firestore security rules
- Verify network connectivity

## Production Deployment

For production deployment:

1. Update Firestore security rules with proper authentication
2. Set up Firebase Authentication if needed
3. Configure environment variables on your hosting platform
4. Enable Firebase App Check for additional security

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure Firebase project is properly configured
4. Check Firestore database has the correct permissions

## Next Steps

- Set up Firebase Authentication for user management
- Implement role-based access control
- Add push notifications for critical incidents
- Set up Firebase Functions for automated incident processing
- Integrate with external APIs for weather and traffic data
