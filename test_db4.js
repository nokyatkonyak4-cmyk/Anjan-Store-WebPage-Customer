import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';
import fallbackConfig from './firebase-applet-config.json' with { type: 'json' };

const app = initializeApp(fallbackConfig);
const db = getFirestore(app, fallbackConfig.firestoreDatabaseId);

async function run() {
  try {
    const snap = await getDocs(collection(db, "products"));
    console.log("Products in AI Studio db:", snap.size);
    const snap2 = await getDocs(collection(db, "categories"));
    console.log("Categories in AI Studio db:", snap2.size);
    const snap3 = await getDocs(collection(db, "banners"));
    console.log("Banners in AI Studio db:", snap3.size);
    process.exit(0);
  } catch (e) {
    console.error("Error:", e);
    process.exit(1);
  }
}
run();
