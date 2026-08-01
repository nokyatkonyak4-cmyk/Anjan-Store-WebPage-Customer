const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

const oldProfileMenu = `        {[
          { icon: Shield, text: 'Privacy Policy', path: 'privacy' },
          { icon: Info, text: 'Terms & Conditions', path: 'terms' },
          { icon: Search, text: 'Refund & Cancellation Policy', path: 'refund' },
          { icon: Mail, text: 'Contact Us', path: 'contact' }
        ].map((item, idx) => (
          <div key={item.text} onClick={() => navigate(\`/static_page/\${item.path}\`)} className={\`flex items-center px-4 py-4 cursor-pointer \${idx !== 3 ? 'border-b border-gray-100' : ''}\`}>
            <item.icon size={20} className="text-dark-bg mr-4" />
            <span className="text-sm font-semibold text-dark-bg">{item.text}</span>
          </div>
        ))}`;

const newProfileMenu = `        {[
            { text: 'About Us & Socials', path: 'about' },
            { text: 'FAQ', path: 'faq' },
            { text: 'Customer Support', path: 'contact' },
            { text: 'Terms & Conditions', path: 'terms' },
            { text: 'Privacy Policy', path: 'privacy' },
          ].map((item, idx) => (
            <div key={\`\${item.text}-\${idx}\`} onClick={() => navigate(\`/static_page/\${item.path}\`)} className={\`flex justify-between items-center px-5 py-4 cursor-pointer \${idx !== 4 ? 'border-b border-gray-50' : ''}\`}>
              <span className="font-bold text-sm text-dark-bg">{item.text}</span>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
          ))}`;

if (content.includes(oldProfileMenu)) {
  content = content.replace(oldProfileMenu, newProfileMenu);
  fs.writeFileSync('src/components/MainAppScreen.tsx', content);
  console.log("Profile menu patched");
} else {
  console.log("Could not find Profile menu");
}
