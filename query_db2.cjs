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
  try {
      const campaignsRef = collection(db, 'campaigns');
      const snap = await getDocs(campaignsRef);
      console.log('campaigns docs:', snap.docs.map(d => ({id: d.id, ...d.data()})));
  } catch(e) {}
  
  try {
      const secondaryBannersRef = collection(db, 'secondaryBanners');
      const snap2 = await getDocs(secondaryBannersRef);
      console.log('secondaryBanners docs:', snap2.docs.map(d => ({id: d.id, ...d.data()})));
  } catch(e) {}
  
  try {
      const collections = await getDocs(collection(db, 'banners'));
      console.log('banners docs count:', collections.docs.length);
  } catch(e) {}
  
  try {
      const s = await getDocs(collection(db, 'settings'));
      console.log('settings docs:', s.docs.map(d => d.id));
  } catch(e) {}

  process.exit(0);
}
check();
