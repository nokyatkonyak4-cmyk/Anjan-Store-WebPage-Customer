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
  const collections = ["notifications", "userNotifications"];
  for (const collName of collections) {
    console.log(`Checking ${collName}...`);
    const coll = collection(db, collName);
    const snap = await getDocs(coll);
    for (const docSnap of snap.docs) {
      const data = docSnap.data();
      if (data.title === "j" || data.message === "j" || data.title === "Hello....." || data.message === "Hello.....") {
        console.log(`Deleting ${docSnap.id} from ${collName}`);
        await deleteDoc(doc(db, collName, docSnap.id));
      }
    }
  }
  console.log("Done");
  process.exit(0);
}
deleteOld();
