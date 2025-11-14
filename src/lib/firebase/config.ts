/**
 * Firebase Configuration
 * Initialize Firebase app and services
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

// Initialize Firebase only once
if (typeof window !== 'undefined') {
  // Only initialize if config is valid
  const hasValidConfig =
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.apiKey !== '' &&
    firebaseConfig.projectId !== '';

  if (hasValidConfig) {
    if (getApps().length === 0) {
      try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
      } catch (error) {
        console.error('Firebase initialization error:', error);
        // Set to null if initialization fails
        app = null;
        auth = null;
        db = null;
      }
    } else {
      app = getApps()[0];
      auth = getAuth(app);
      db = getFirestore(app);
    }
  }
}

export { app, auth, db };
export const isFirebaseConfigured = () => {
  // Check if we're in browser and if Firebase config is available
  if (typeof window === 'undefined') {
    return false;
  }

  // Check if Firebase config environment variables are set
  const hasConfig =
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== '' &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== '';

  // Also check if Firebase app was initialized successfully
  return hasConfig && !!app && !!auth && !!db;
};
