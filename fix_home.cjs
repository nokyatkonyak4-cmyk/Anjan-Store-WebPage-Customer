const fs = require('fs');

let content = fs.readFileSync('src/components/Screens.tsx', 'utf8');

const regex = /export function HomeScreen\(\{[\s\S]*?\}\s*\)\s*;/;

// Wait, the HomeScreen ends with `    );\n}`. I'll just replace the whole HomeScreen function.
