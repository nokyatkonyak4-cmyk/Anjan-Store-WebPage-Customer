const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf-8');
content = content.replace(/\.sort\(\(a,b\) => \(b\.timestamp/g, '.sort((a:any, b:any) => (b.timestamp');
fs.writeFileSync('src/components/MainAppScreen.tsx', content);
