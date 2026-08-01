const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

const regex = /      <\/div>\s*<span className=\{\`text-\[10px\].*?\n\/\/ --- Screens ---/s;
content = content.replace(regex, `      </div>\n    </div>\n  );\n}\n\n// --- Screens ---`);

fs.writeFileSync('src/components/MainAppScreen.tsx', content);
