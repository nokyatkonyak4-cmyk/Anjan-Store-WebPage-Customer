const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');
content = content.replace(/return Array\.from\(uniqueMap\.values\(\)\)\.filter\(\(n: any\) => n\.timestamp && !isNaN\(new Date\(n\.timestamp\)\.getTime\(\)\) && n\.title !== "j".*\)\.sort\(/g,
'return Array.from(uniqueMap.values()).filter((n: any) => n.timestamp && !isNaN(new Date(n.timestamp).getTime()) && n.title !== "j" && n.title !== "Hello....." && n.message !== "j" && n.message !== "Hello.....").sort(');
fs.writeFileSync('src/components/MainAppScreen.tsx', content);
console.log("Fixed");
