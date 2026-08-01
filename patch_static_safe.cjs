const fs = require('fs');
let content = fs.readFileSync('src/components/StaticPageScreen.tsx', 'utf8');

content = content.replace(
  "const docRef = doc(db, 'static_pages', pageType);",
  "if (!pageType) return;\n          const docRef = doc(db, 'static_pages', pageType);"
);

fs.writeFileSync('src/components/StaticPageScreen.tsx', content);
