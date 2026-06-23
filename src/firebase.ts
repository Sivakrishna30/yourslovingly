import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/drive.file');
googleProvider.setCustomParameters({ prompt: 'consent' });

export const firebaseReady = Boolean(import.meta.env.VITE_FIREBASE_API_KEY);

export function getAuthErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error;
  const code = typeof error === 'object' && error && 'code' in error ? error.code : undefined;
  if (code === 'auth/popup-closed-by-user') return 'Sign-in cancelled.';
  if (code === 'auth/network-request-failed') return 'Network error. Please check your connection.';
  return 'An error occurred during sign-in. Please try again.';
}

export async function completeRedirectSignIn() {
  // Not strictly needed for popup, but good for redirect flow
  return null;
}

export { auth, db, storage, googleProvider };
