const fs = require('fs');
let sw = fs.readFileSync('public/firebase-messaging-sw.js', 'utf8');

// Remove importScripts
sw = sw.replace(/importScripts\('https:\/\/www\.gstatic\.com\/firebasejs\/9\.23\.0\/firebase-app-compat\.js'\);\n?/g, '');
sw = sw.replace(/importScripts\('https:\/\/www\.gstatic\.com\/firebasejs\/9\.23\.0\/firebase-messaging-compat\.js'\);\n?/g, '');

fs.writeFileSync('public/firebase-messaging-sw.js', sw);
console.log("Removed Firebase SDK from Service Worker.");
