const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');
content = content.replace(/'Don\\'t miss out on these amazing deals'/, `"Don't miss out on these amazing deals"`);
content = content.replace(/'Don't miss out on these amazing deals'/, `"Don't miss out on these amazing deals"`);
fs.writeFileSync('src/components/MainAppScreen.tsx', content);
