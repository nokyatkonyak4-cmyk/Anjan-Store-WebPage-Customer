const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf-8');
content = content.replace(/doc\.data\(\)/g, '(doc.data() as any)');
fs.writeFileSync('src/components/MainAppScreen.tsx', content);
