const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

// Replace grids
content = content.replace(/className="grid grid-cols-4 gap-2"/g, 'className="grid grid-cols-3 gap-3"');
content = content.replace(/className="grid grid-cols-4 gap-2 pb-6"/g, 'className="grid grid-cols-3 gap-3 pb-6"');

fs.writeFileSync('src/components/MainAppScreen.tsx', content);
