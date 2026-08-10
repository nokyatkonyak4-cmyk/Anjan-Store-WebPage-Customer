const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

content = content.replace(
    /className="bg-brand-yellow text-dark-bg px-3 py-1\.5 rounded-lg text-xs font-bold shadow-sm"/g,
    'className="bg-brand-yellow text-dark-bg px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm active:scale-95 hover:opacity-90 transition-all"'
);

fs.writeFileSync('src/components/MainAppScreen.tsx', content);
console.log("Button styling improved!");
