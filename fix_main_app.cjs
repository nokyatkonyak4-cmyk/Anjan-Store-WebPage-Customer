const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

const regex = /\{bottomNavItems\.map\(\(item, index\) => \{[\s\S]*?onClick=\{async \(\) => \{[\s\S]*?Enable Push[\s\S]*?<\/button>\s*<\/div>/;

if (regex.test(content)) {
    console.log("Found broken block!");
} else {
    console.log("Could not find broken block.");
}
