const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');

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
  const pages = [
    'about-us', 'privacy-policy', 'terms-conditions', 'terms---conditions',
    'frequently-asked-questions', 'shipping-delivery-policy'
  ];
  for (const page of pages) {
    const p = await getDoc(doc(db, 'staticPages', page));
    if (p.exists()) {
        console.log(`PAGE ${page}: length=${p.data().content?.length}`);
    } else {
        console.log(`PAGE ${page}: MISSING`);
    }
  }
  process.exit(0);
}
check();
