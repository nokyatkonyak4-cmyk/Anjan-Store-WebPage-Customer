const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

const oldCode = `          {[
            { text: 'About Us & Socials', path: 'about' },
            { text: 'FAQ', path: 'faq' },
            { text: 'Customer Support', path: 'contact' },
            { text: 'Terms & Conditions', path: 'terms' },
            { text: 'Privacy Policy', path: 'privacy' },
          ].map((item, idx) => (
            <div key={\`\${item.text}-\${idx}\`} onClick={() => onNavigate && onNavigate('Home')} className={\`flex justify-between items-center px-5 py-4 cursor-pointer \${idx !== 4 ? 'border-b border-gray-50' : ''}\`}>`;

const newCode = `          {[
            { text: 'About Us & Socials', path: 'about' },
            { text: 'FAQ', path: 'faq' },
            { text: 'Customer Support', path: 'contact' },
            { text: 'Terms & Conditions', path: 'terms' },
            { text: 'Privacy Policy', path: 'privacy' },
          ].map((item, idx) => (
            <div key={\`\${item.text}-\${idx}\`} onClick={() => navigate(\`/static_page/\${item.path}\`)} className={\`flex justify-between items-center px-5 py-4 cursor-pointer \${idx !== 4 ? 'border-b border-gray-50' : ''}\`}>`;

if (content.includes(oldCode)) {
  content = content.replace(oldCode, newCode);
  fs.writeFileSync('src/components/MainAppScreen.tsx', content);
  console.log("Patched successfully");
} else {
  console.log("Could not find the old code string");
}
