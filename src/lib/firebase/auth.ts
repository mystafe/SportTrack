/**
 * Firebase Authentication Utilities
 */

import { auth } from './config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { cloudSyncService } from '@/lib/cloudSync/syncService';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<AuthUser> {
  if (!auth) {
    throw new Error('Firebase auth not initialized');
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Set user ID for cloud sync
    cloudSyncService.setUserId(user.uid);

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  } catch (error: any) {
    // Handle Firebase auth errors
    const errorCode = error?.code || '';

    switch (errorCode) {
      case 'auth/user-not-found':
        throw new Error('AUTH_USER_NOT_FOUND');
      case 'auth/wrong-password':
        throw new Error('AUTH_WRONG_PASSWORD');
      case 'auth/invalid-email':
        throw new Error('AUTH_INVALID_EMAIL');
      case 'auth/user-disabled':
        throw new Error('AUTH_USER_DISABLED');
      case 'auth/too-many-requests':
        throw new Error('AUTH_TOO_MANY_REQUESTS');
      case 'auth/network-request-failed':
        throw new Error('AUTH_NETWORK_ERROR');
      default:
        throw error;
    }
  }
}

/**
 * Sign up with email and password
 */
export async function signUp(
  email: string,
  password: string,
  displayName?: string
): Promise<AuthUser> {
  if (!auth) {
    throw new Error('Firebase auth not initialized');
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name if provided
    if (displayName && auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName });
    }

    // Set user ID for cloud sync
    cloudSyncService.setUserId(user.uid);

    return {
      uid: user.uid,
      email: user.email,
      displayName: displayName || user.displayName,
      photoURL: user.photoURL,
    };
  } catch (error: any) {
    // Handle Firebase auth errors
    const errorCode = error?.code || '';

    switch (errorCode) {
      case 'auth/email-already-in-use':
        throw new Error('AUTH_EMAIL_ALREADY_IN_USE');
      case 'auth/invalid-email':
        throw new Error('AUTH_INVALID_EMAIL');
      case 'auth/weak-password':
        throw new Error('AUTH_WEAK_PASSWORD');
      case 'auth/operation-not-allowed':
        throw new Error('AUTH_OPERATION_NOT_ALLOWED');
      case 'auth/network-request-failed':
        throw new Error('AUTH_NETWORK_ERROR');
      default:
        throw error;
    }
  }
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle(): Promise<AuthUser> {
  if (!auth) {
    throw new Error('Firebase auth not initialized');
  }

  try {
    const provider = new GoogleAuthProvider();
    // Add additional scopes if needed
    provider.addScope('profile');
    provider.addScope('email');

    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Set user ID for cloud sync
    cloudSyncService.setUserId(user.uid);

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  } catch (error: any) {
    // Handle specific Firebase errors
    if (error?.code === 'auth/popup-closed-by-user') {
      throw new Error('Popup closed by user');
    }
    if (error?.code === 'auth/popup-blocked') {
      throw new Error('Popup blocked by browser');
    }
    // Check for CONFIGURATION_NOT_FOUND in various error formats
    const errorMessage = error?.message || error?.error?.message || '';
    const errorCode = error?.code || error?.error?.code || '';

    if (
      errorMessage.includes('CONFIGURATION_NOT_FOUND') ||
      errorCode === 'CONFIGURATION_NOT_FOUND' ||
      errorMessage.includes('configuration not found') ||
      (error?.error?.errors &&
        error.error.errors.some((e: any) => e.message === 'CONFIGURATION_NOT_FOUND'))
    ) {
      throw new Error(
        'GOOGLE_SIGNIN_NOT_ENABLED: Google Sign-In is not enabled in Firebase Console. Please go to Firebase Console → Authentication → Sign-in method → Google → Enable → Save'
      );
    }
    throw error;
  }
}

/**
 * Sign out
 */
export async function signOutUser(): Promise<void> {
  if (!auth) {
    throw new Error('Firebase auth not initialized');
  }

  await signOut(auth);
  cloudSyncService.setUserId(null);
  cloudSyncService.cleanup();
}

/**
 * Reset password
 */
export async function resetPassword(email: string): Promise<void> {
  if (!auth) {
    throw new Error('Firebase auth not initialized');
  }

  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    // Handle Firebase auth errors
    const errorCode = error?.code || '';

    switch (errorCode) {
      case 'auth/user-not-found':
        throw new Error('AUTH_USER_NOT_FOUND');
      case 'auth/invalid-email':
        throw new Error('AUTH_INVALID_EMAIL');
      case 'auth/too-many-requests':
        throw new Error('AUTH_TOO_MANY_REQUESTS');
      case 'auth/network-request-failed':
        throw new Error('AUTH_NETWORK_ERROR');
      default:
        throw error;
    }
  }
}

/**
 * Get current user
 */
export function getCurrentUser(): User | null {
  return auth?.currentUser || null;
}

/**
 * Convert Firebase User to AuthUser
 */
export function convertUser(user: User | null): AuthUser | null {
  if (!user) return null;

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
  if (!auth) {
    return () => {};
  }

  return onAuthStateChanged(auth, (user) => {
    if (user) {
      cloudSyncService.setUserId(user.uid);
      callback(convertUser(user));
    } else {
      cloudSyncService.setUserId(null);
      callback(null);
    }
  });
}
