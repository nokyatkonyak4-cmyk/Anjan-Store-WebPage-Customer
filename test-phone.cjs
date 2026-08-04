const admin = require('firebase-admin');
const app = admin.initializeApp({ projectId: 'ai-studio-anjanstorewebpag-05e4b71f-336e-4b18-b2fe-fced7e8f3a19' });
const db = admin.firestore();
async function run() {
  const doc = await db.collection('settings').doc('store').get();
  console.log(doc.data().supportPhone);
  process.exit(0);
}
run();
