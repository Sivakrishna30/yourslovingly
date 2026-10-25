import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import appletConfig from '../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || appletConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || appletConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || appletConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || appletConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || appletConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || appletConfig.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || appletConfig.measurementId,
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestoreDbId = (appletConfig as { firestoreDatabaseId?: string }).firestoreDatabaseId;

// Use initializeFirestore with forced long-polling for stability in sandboxed iframe environments
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firestoreDbId || '(default)');

const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export const firebaseReady = Boolean(firebaseConfig.apiKey);

export function getAuthErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error;
  const code = typeof error === 'object' && error && 'code' in error ? error.code : undefined;
  if (code === 'auth/popup-closed-by-user') return 'Sign-in cancelled.';
  if (code === 'auth/network-request-failed') return 'Network error. Please check your connection.';
  return 'An error occurred during sign-in. Please try again.';
}

export async function completeRedirectSignIn() {
  return null;
}

export { auth, db, storage, googleProvider };
