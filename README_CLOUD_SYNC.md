# Cloud Sync Setup Guide

## Firebase Configuration

To enable Cloud Sync functionality, you need to set up Firebase:

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable **Authentication** and **Firestore Database**

### 2. Get Firebase Configuration

1. In Firebase Console, go to Project Settings
2. Scroll down to "Your apps" section
3. Click on the web icon (`</>`) to add a web app
4. Copy the Firebase configuration object

### 3. Set Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Configure Firestore Security Rules

In Firebase Console, go to Firestore Database > Rules and add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Enable Authentication Providers

In Firebase Console, go to Authentication > Sign-in method and enable:

- **Email/Password**
- **Google** (optional, for Google Sign-In)

## Features

### Auto-Sync

- Automatically syncs data to cloud when stores change
- Debounced by 2 seconds to prevent excessive syncs
- Only works when authenticated and online

### Manual Sync

- **Upload**: Sync local data to cloud
- **Download**: Sync cloud data to local
- Available in Settings > Cloud Sync

### Conflict Resolution

When conflicts are detected, you can choose:

- **Use newest data**: Automatically use the most recent data
- **Merge**: Combine local and cloud data
- **Use local data**: Keep local data, discard cloud changes
- **Use cloud data**: Replace local data with cloud data

## Usage

1. **Sign In/Sign Up**: Click the auth button in the header (desktop) or go to Settings
2. **Enable Auto-Sync**: Once authenticated, auto-sync is enabled automatically
3. **Manual Sync**: Use Settings > Cloud Sync to manually sync data
4. **Resolve Conflicts**: If conflicts occur, a dialog will appear to choose resolution strategy

## Notes

- Cloud Sync requires an active internet connection
- Data is stored securely in Firebase Firestore
- Each user's data is isolated by their user ID
- Auto-sync only works when authenticated
