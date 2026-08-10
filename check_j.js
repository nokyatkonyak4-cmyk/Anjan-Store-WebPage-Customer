import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
const app = initializeApp({
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
});
const db = getFirestore(app);
async function run() {
  const q = await getDocs(collection(db, "orders"));
  q.forEach(d => {
    if(d.data().status === "j" || d.data().status === "Hello.....") {
      console.log("Found order with status j:", d.id);
    }
  });
  console.log("Done");
  process.exit(0);
}
run();
