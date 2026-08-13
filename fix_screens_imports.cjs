const fs = require('fs');
let content = fs.readFileSync('src/components/Screens.tsx', 'utf8');

// Remove the inline imports
content = content.replace("import { db } from '../firebase';\\nimport { collection, query, where, onSnapshot } from 'firebase/firestore';", "");
content = content.replace("import { db } from '../firebase';\nimport { collection, query, where, onSnapshot } from 'firebase/firestore';", "");

// Add to the top if not exists
if (!content.includes('import { db }')) {
    content = "import { db } from '../firebase';\nimport { collection, query, where, onSnapshot } from 'firebase/firestore';\n" + content;
}

fs.writeFileSync('src/components/Screens.tsx', content);
console.log("Fixed imports");
