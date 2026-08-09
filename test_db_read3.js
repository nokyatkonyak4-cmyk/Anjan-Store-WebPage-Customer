import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, doc, setDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import fallbackConfig from './firebase-applet-config.json' with { type: 'json' };

const app = initializeApp(fallbackConfig);
const db = getFirestore(app, fallbackConfig.firestoreDatabaseId);
const auth = getAuth(app);

async function run() {
  try {
    const cred = await signInAnonymously(auth);
    const user = cred.user;
    console.log("Logged in:", user.uid);

    const snap1 = await getDocs(collection(db, "users", user.uid, "notifications"));
    console.log("Snap 1 success");

    const snap2 = await getDocs(query(collection(db, "userNotifications"), where("userId", "==", user.uid)));
    console.log("Snap 2 success");
    
    process.exit(0);
  } catch(e) {
    console.error("Read error:", e);
    process.exit(1);
  }
}
run();
