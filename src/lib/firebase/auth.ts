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
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle(): Promise<AuthUser> {
  if (!auth) {
    throw new Error('Firebase auth not initialized');
  }

  const provider = new GoogleAuthProvider();
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

  await sendPasswordResetEmail(auth, email);
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
