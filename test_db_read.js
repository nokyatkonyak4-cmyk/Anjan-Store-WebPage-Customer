import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';
import fallbackConfig from './firebase-applet-config.json' with { type: 'json' };

const app = initializeApp(fallbackConfig);
const db = getFirestore(app, fallbackConfig.firestoreDatabaseId);

async function run() {
  try {
    const snap = await getDocs(collection(db, "categories"));
    console.log("Categories in db:", snap.size);
    process.exit(0);
  } catch(e) {
    console.error("Read error:", e);
    process.exit(1);
  }
}
run();
