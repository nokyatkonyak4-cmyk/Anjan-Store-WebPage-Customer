import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);
const auth = getAuth(app);

async function testPermissions() {
  const cred = await signInAnonymously(auth);
  const uid = cred.user.uid;
  console.log('Logged in as:', uid);

  const tests = [
    { name: 'categories', fn: () => getDocs(collection(db, 'categories')) },
    { name: 'products', fn: () => getDocs(collection(db, 'products')) },
    { name: 'banners', fn: () => getDocs(collection(db, 'banners')) },
    { name: 'settings', fn: () => getDoc(doc(db, 'settings', 'store')) },
    { name: 'orders', fn: () => getDocs(query(collection(db, 'orders'), where('customerId', '==', uid))) },
    { name: 'users', fn: () => getDoc(doc(db, 'users', uid)) },
    { name: 'notifications', fn: () => getDocs(collection(db, 'users', uid, 'notifications')) },
  ];

  for (const t of tests) {
    try {
      await t.fn();
      console.log(`[OK] ${t.name}`);
    } catch (e) {
      console.error(`[FAIL] ${t.name}:`, e.message);
    }
  }
  process.exit(0);
}
testPermissions();
