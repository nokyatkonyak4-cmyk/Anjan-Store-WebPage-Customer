const fs = require('fs');
let sw = fs.readFileSync('public/firebase-messaging-sw.js', 'utf8');

const prefix = `self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

`;

if (!sw.includes('skipWaiting')) {
  fs.writeFileSync('public/firebase-messaging-sw.js', prefix + sw);
  console.log("Added skipWaiting and clients.claim to SW.");
} else {
  console.log("Already present.");
}
