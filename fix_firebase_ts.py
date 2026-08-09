import re

content = open('src/firebase.ts', 'r').read()

replacement = """import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getMessaging } from 'firebase/messaging';
import { getStorage } from 'firebase/storage';
import fallbackConfig from '../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || fallbackConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || fallbackConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || fallbackConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || fallbackConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || fallbackConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || fallbackConfig.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || fallbackConfig.measurementId,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// FORCE USE OF THE CORRECT DATABASE ID
const databaseId = fallbackConfig.firestoreDatabaseId;

export const db = getFirestore(app, databaseId);
export const auth = getAuth(app);
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null as any;
export const storage = getStorage(app);
export const isFirebaseConfigured = true;
"""

open('src/firebase.ts', 'w').write(replacement)
print("Fixed firebase.ts")
