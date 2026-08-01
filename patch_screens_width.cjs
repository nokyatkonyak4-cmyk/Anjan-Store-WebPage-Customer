const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

content = content.replace(
  /<div className="flex flex-col w-full p-4 animate-in fade-in bg-white min-h-full">/g,
  '<div className="flex flex-col w-full max-w-2xl mx-auto p-4 animate-in fade-in bg-white min-h-full">'
);

content = content.replace(
  /<div className="flex flex-col w-full p-4 items-center animate-in fade-in pb-24 bg-white min-h-full">/g,
  '<div className="flex flex-col w-full max-w-xl mx-auto p-4 items-center animate-in fade-in pb-24 bg-white min-h-full">'
);

fs.writeFileSync('src/components/MainAppScreen.tsx', content);
