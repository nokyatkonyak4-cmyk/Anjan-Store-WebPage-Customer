import { initializeApp } from "firebase/app";
import { getFirestore, collectionGroup, getDocs, query, orderBy } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  try {
      const snap1 = await getDocs(collectionGroup(db, "notifications"));
      console.log("notifications total:", snap1.docs.length);
      snap1.docs.forEach(d => console.log(d.id, d.ref.path, d.data().title, d.data().message?.substring(0, 30)));
      
      const snap2 = await getDocs(collectionGroup(db, "userNotifications"));
      console.log("userNotifications total:", snap2.docs.length);
      
      const snap3 = await getDocs(collectionGroup(db, "pushNotifications"));
      console.log("pushNotifications total:", snap3.docs.length);
  } catch(e) {
      console.log("Failed:", e.message);
  }
  process.exit(0);
}
check();
