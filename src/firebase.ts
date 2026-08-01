import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import firebaseConfig from '../firebase-applet-config.json';

const isFirebaseConfigured = !!firebaseConfig.apiKey;

const app = isFirebaseConfigured 
  ? (!getApps().length ? initializeApp(firebaseConfig) : getApp())
  : null;

export const db = app ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId) : null as any;
export const auth = app ? getAuth(app) : null as any;

export const messaging = app && typeof window !== 'undefined' ? getMessaging(app) : null as any;

// Make isFirebaseConfigured available for exports
export { isFirebaseConfigured };
