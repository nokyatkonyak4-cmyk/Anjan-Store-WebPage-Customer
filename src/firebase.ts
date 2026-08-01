import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import fallbackConfig from '../firebase-applet-config.json';

const envConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Use environment variables if API Key is present, otherwise use fallback config
const useEnv = !!envConfig.apiKey;
const firebaseConfig = useEnv ? envConfig : fallbackConfig;

const isFirebaseConfigured = !!firebaseConfig.apiKey;

const app = isFirebaseConfigured 
  ? (!getApps().length ? initializeApp(firebaseConfig) : getApp())
  : null;

export const db = app ? (useEnv ? getFirestore(app) : getFirestore(app, (fallbackConfig as any).firestoreDatabaseId)) : null as any;
export const auth = app ? getAuth(app) : null as any;

export const messaging = app && typeof window !== 'undefined' ? getMessaging(app) : null as any;

// Make isFirebaseConfigured available for exports
export { isFirebaseConfigured };
