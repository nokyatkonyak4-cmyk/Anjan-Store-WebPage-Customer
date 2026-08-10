import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import fs from "fs";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function deleteOld() {
  console.log("Checking users...");
  const usersSnap = await getDocs(collection(db, "users"));
  for (const userDoc of usersSnap.docs) {
    const notifsSnap = await getDocs(collection(db, "users", userDoc.id, "notifications"));
    for (const docSnap of notifsSnap.docs) {
      const data = docSnap.data();
      if (data.title === "j" || data.message === "j" || data.title === "Hello....." || data.message === "Hello.....") {
        console.log(`Deleting ${docSnap.id} from users/${userDoc.id}/notifications`);
        await deleteDoc(doc(db, "users", userDoc.id, "notifications", docSnap.id));
      }
    }
  }
  console.log("Done");
  process.exit(0);
}
deleteOld();
