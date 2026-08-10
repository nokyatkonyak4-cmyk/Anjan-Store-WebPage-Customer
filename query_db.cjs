const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, getDoc } = require('firebase/firestore');

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

async function check() {
  const settingsDoc = await getDoc(doc(db, 'settings', 'store'));
  if (settingsDoc.exists()) {
      const data = settingsDoc.data();
      console.log('Keys in settings/store:', Object.keys(data));
      if (data.aboutUs) console.log('Found aboutUs in settings');
  }

  const staticPagesRef = collection(db, 'staticPages');
  const snap = await getDocs(staticPagesRef);
  console.log('staticPages docs:', snap.docs.map(d => d.id));
  
  process.exit(0);
}
check();
