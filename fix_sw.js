const fs = require('fs');
let sw = fs.readFileSync('public/firebase-messaging-sw.js', 'utf8');
sw = sw.replace("const title = notification.title || \"Update from Anjan Store\";", 
"const title = notification.title || data.title || \"Update from Anjan Store\";");
sw = sw.replace("const body = notification.body || \"You have a new message.\";", 
"const body = notification.body || data.message || data.body || \"You have a new message.\";");
fs.writeFileSync('public/firebase-messaging-sw.js', sw);
console.log("Patched SW");
