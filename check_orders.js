import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, orderBy, limit } from "firebase/firestore";
const app = initializeApp({
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
});
const db = getFirestore(app);
async function run() {
  const q = query(collection(db, "orders"), orderBy("createdAtMs", "desc"), limit(5));
  const snap = await getDocs(q);
  snap.forEach(d => {
    const data = d.data();
    console.log(d.id, data.status);
  });
  process.exit(0);
}
run();
