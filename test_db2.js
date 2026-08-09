import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';
import fallbackConfig from './firebase-applet-config.json' with { type: 'json' };

const app = initializeApp({
  ...fallbackConfig
});
const db = getFirestore(app, '(default)');

async function run() {
  try {
    const snap = await getDocs(collection(db, "categories"));
    console.log("Categories in default:", snap.size);
    const snap2 = await getDocs(collection(db, "products"));
    console.log("Products in default:", snap2.size);
    
    process.exit(0);
  } catch (e) {
    console.error("Error:", e);
    process.exit(1);
  }
}
run();
