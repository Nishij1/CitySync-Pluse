// Firebase Configuration for CitySync Plus
// Universal Urban Intelligence Platform

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getFunctions } from 'firebase/functions';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAsuVzIutbbMb9Hkh3FEHs5F1Nw1D27Auo",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "citysync-plus.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "citysync-plus",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "citysync-plus.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "863906276094",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:863906276094:web:9fedf74de34b2abf113baf"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Initialize Analytics only in browser environment and if measurement ID is provided
export const analytics = typeof window !== 'undefined' ?
  (async () => {
    // Only initialize analytics if we have a measurement ID and analytics is supported
    const measurementId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
    if (measurementId && await isSupported()) {
      return getAnalytics(app);
    }
    return null;
  })() : null;

// Firebase app instance
export default app;

// Helper functions for Firebase operations
export const firebaseHelpers = {
  // Check if Firebase is initialized
  isInitialized: () => !!app,

  // Get current user
  getCurrentUser: () => auth.currentUser,

  // Check if user is authenticated
  isAuthenticated: () => !!auth.currentUser,

  // Get app configuration
  getConfig: () => firebaseConfig,

  // Get app instance
  getApp: () => app
};
