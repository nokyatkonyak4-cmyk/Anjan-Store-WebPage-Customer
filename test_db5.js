import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, query, where, onSnapshot } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import fallbackConfig from './firebase-applet-config.json' with { type: 'json' };

const app = initializeApp(fallbackConfig);
const db = getFirestore(app, fallbackConfig.firestoreDatabaseId);
const auth = getAuth(app);

async function run() {
  try {
    let cred;
    try {
      cred = await signInWithEmailAndPassword(auth, "test@example.com", "password123");
    } catch(e) {
      cred = await createUserWithEmailAndPassword(auth, "test@example.com", "password123");
    }
    const user = cred.user;
    console.log("Logged in:", user.uid);

    const q1 = collection(db, "users", user.uid, "notifications");
    const snap1 = await getDocs(q1);
    console.log("Snap 1 success", snap1.size);

    const q2 = query(collection(db, "userNotifications"), where("userId", "==", user.uid));
    const snap2 = await getDocs(q2);
    console.log("Snap 2 success", snap2.size);

    const q3 = query(collection(db, "notifications"), where("customerId", "==", user.uid));
    const snap3 = await getDocs(q3);
    console.log("Snap 3 success", snap3.size);

    process.exit(0);
  } catch(e) {
    console.error("Read error:", e);
    process.exit(1);
  }
}
run();
