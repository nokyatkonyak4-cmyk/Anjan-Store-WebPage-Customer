import { initializeApp } from 'firebase/app';
import { getFirestore, addDoc, collection, updateDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "gen-lang-client-0690213156",
  appId: "1:408212829164:web:7e5677ae980e592d5986c9",
  apiKey: "AIzaSyDKRVKnHVL6V0OdaqHTPqkBHXMfeTrs-qs",
  authDomain: "gen-lang-client-0690213156.firebaseapp.com",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-anjanstorewebpag-05e4b71f-336e-4b18-b2fe-fced7e8f3a19");

async function test() {
  try {
    const docRef = await addDoc(collection(db, "productReviews"), {
      test: true
    });
    console.log("Success addDoc:", docRef.id);
  } catch (e) {
    console.error("addDoc Error:", e.message);
  }
}
test();
