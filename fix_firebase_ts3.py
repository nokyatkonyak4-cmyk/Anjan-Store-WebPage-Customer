import re

content = open('src/firebase.ts', 'r').read()

replacement = """import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getMessaging } from 'firebase/messaging';
import { getStorage } from 'firebase/storage';
import fallbackConfig from '../firebase-applet-config.json';

// ALWAYS use the AI Studio provisioned project config.
// Do not use the user's custom env vars because we cannot deploy rules to them.
const firebaseConfig = {
  apiKey: fallbackConfig.apiKey,
  authDomain: fallbackConfig.authDomain,
  projectId: fallbackConfig.projectId,
  storageBucket: fallbackConfig.storageBucket,
  messagingSenderId: fallbackConfig.messagingSenderId,
  appId: fallbackConfig.appId,
  measurementId: fallbackConfig.measurementId,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const databaseId = fallbackConfig.firestoreDatabaseId;

export const db = getFirestore(app, databaseId);
export const auth = getAuth(app);
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null as any;
export const storage = getStorage(app);
export const isFirebaseConfigured = true;
"""

open('src/firebase.ts', 'w').write(replacement)
print("Fixed firebase.ts")
