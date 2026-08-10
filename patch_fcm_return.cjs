const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  'const requestFCMToken = async () => {',
  'const requestFCMToken = async () => {\n      try { const swReg = await navigator.serviceWorker.register("/firebase-messaging-sw.js"); console.log("SW Reg:", swReg); } catch (e) { console.error("SW error", e); }'
);

content = content.replace(
  'return; // from if (!messaging || !db || !auth.currentUser)',
  'return false;' // Need to be careful here
);

fs.writeFileSync('src/App.tsx', content);
