import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
const app = initializeApp({
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
});
const db = getFirestore(app);
async function run() {
  const notifs = await getDocs(collection(db, "notifications"));
  console.log("Global notifs count:", notifs.size);
  notifs.forEach(d => console.log(d.data()));
  process.exit(0);
}
run();
