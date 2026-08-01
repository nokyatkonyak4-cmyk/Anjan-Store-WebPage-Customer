const fs = require('fs');
let content = fs.readFileSync('src/firebase.ts', 'utf8');

if (!content.includes('getMessaging')) {
    content = content.replace(
        "import { getAuth } from 'firebase/auth';",
        "import { getAuth } from 'firebase/auth';\nimport { getMessaging, getToken, onMessage } from 'firebase/messaging';"
    );
    content += `\nexport const messaging = app ? getMessaging(app) : null as any;\n`;
    fs.writeFileSync('src/firebase.ts', content);
}
