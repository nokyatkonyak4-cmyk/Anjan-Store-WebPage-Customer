const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

// fix bottom nav width
content = content.replace(
  /w-full max-w-md z-20"/g,
  'w-full z-20"'
);

// fix mobile top bar to not have max-w-md explicitly if it's there
content = content.replace(
  /w-full max-w-md mx-auto/g,
  'w-full mx-auto'
);

fs.writeFileSync('src/components/MainAppScreen.tsx', content);
