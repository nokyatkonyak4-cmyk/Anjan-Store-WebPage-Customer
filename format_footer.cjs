const fs = require('fs');
let content = fs.readFileSync('src/components/Screens.tsx', 'utf8');

content = content.replace(
    /<p className="text-xs text-gray-400">[\s\S]*?&copy; \{new Date\(\)\.getFullYear\(\)\} Anjan Store\. All rights reserved\.[\s\S]*?<\/p>/,
    `<h4 className="font-black text-xl tracking-widest uppercase text-gray-300">Anjan Store</h4>
                <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2">All In One Place</p>
                <p className="text-xs text-gray-400 mb-4">Making your everyday life easier</p>`
);

content = content.replace(
    /Developed by Nokyat Konyak/,
    'created by: Nokyat Konyak (MiniMulti)'
);

fs.writeFileSync('src/components/Screens.tsx', content);
console.log("Updated footer watermark formatting");
