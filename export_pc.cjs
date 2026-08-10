const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');
content = content.replace('function ProductCard({', 'export function ProductCard({');
fs.writeFileSync('src/components/MainAppScreen.tsx', content);
