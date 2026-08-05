import fs from 'fs';

const files = [
  'src/components/MainAppScreen.tsx',
  'src/components/OrderTrackingScreen.tsx',
  'src/components/DigitalBillScreen.tsx',
  'src/App.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(/onSnapshot\(\s*doc\(db, "orders", orderId\),\s*\(snap\) => \{([\s\S]*?)setLoading\(false\);\n\s*\}\s*\)/g, 
    'onSnapshot(doc(db, "orders", orderId), (snap) => {$1setLoading(false);\n      }, (error) => {\n        console.error("Order snapshot error:", error);\n        setError("Error loading order or permission denied");\n        setLoading(false);\n      })');

  content = content.replace(/onSnapshot\(\s*collection\(db, "categories"\),\s*\(snapshot\) => \{([\s\S]*?)\}\s*\)/g, 
    'onSnapshot(collection(db, "categories"), (snapshot) => {$1}, (error) => console.error("Categories snapshot error:", error))');

  content = content.replace(/onSnapshot\(\s*collection\(db, "products"\),\s*\(snapshot\) => \{([\s\S]*?)\}\s*\)/g, 
    'onSnapshot(collection(db, "products"), (snapshot) => {$1}, (error) => console.error("Products snapshot error:", error))');

  content = content.replace(/onSnapshot\(\s*collection\(db, "banners"\),\s*\(snapshot\) => \{([\s\S]*?)\}\s*\)/g, 
    'onSnapshot(collection(db, "banners"), (snapshot) => {$1}, (error) => console.error("Banners snapshot error:", error))');

  content = content.replace(/onSnapshot\(\s*doc\(db, "settings", "store"\),\s*\(docSnap\) => \{([\s\S]*?)\}\s*\)/g, 
    'onSnapshot(doc(db, "settings", "store"), (docSnap) => {$1}, (error) => console.error("Settings snapshot error:", error))');

  content = content.replace(/onSnapshot\(\s*query\(collection\(db, "orders"\), where\("customerId", "==", user.uid\)\),\s*\(snapshot\) => \{([\s\S]*?)\}\s*,\s*\)/g, 
    'onSnapshot(query(collection(db, "orders"), where("customerId", "==", user.uid)), (snapshot) => {$1}, (error) => console.error("Orders snapshot error:", error))');

  content = content.replace(/onSnapshot\(\s*collection\(db, "users", user.uid, "notifications"\),\s*\(snapshot\) => \{([\s\S]*?)\}\s*,\s*\)/g, 
    'onSnapshot(collection(db, "users", user.uid, "notifications"), (snapshot) => {$1}, (error) => console.error("Notifications snapshot error:", error))');

  content = content.replace(/onSnapshot\(\s*doc\(db, "users", user.uid\),\s*\(docSnap\) => \{([\s\S]*?)\}\s*\)/g, 
    'onSnapshot(doc(db, "users", user.uid), (docSnap) => {$1}, (error) => console.error("User snapshot error:", error))');

  fs.writeFileSync(file, content);
}
