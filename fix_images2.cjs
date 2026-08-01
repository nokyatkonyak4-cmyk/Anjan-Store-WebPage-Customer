const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf-8');

content = content.replace(/onError=\{\(e\) => \{ e\.currentTarget\.src=/g, 'onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src=');

fs.writeFileSync('src/components/MainAppScreen.tsx', content);
