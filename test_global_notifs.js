import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, orderBy, limit } from "firebase/firestore";
const app = initializeApp({
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
});
const db = getFirestore(app);
async function run() {
  const q = query(collection(db, "notifications"), orderBy("createdAtMs", "desc"), limit(10));
  const snap = await getDocs(q);
  snap.forEach(d => {
      const data = d.data();
      if(data.isGlobal || data.type === 'Push') {
          console.log(d.id, data);
      }
  });
  process.exit(0);
}
run();
