const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

const oldWatermark = `      {/* Watermark */}
      <div className="flex flex-col items-center justify-center pt-12 pb-24 opacity-50">
        <img src="/AppIcon-512x512.png" alt="Logo" className="w-8 h-8 object-contain mb-2 grayscale" />
        <span className="text-xs font-bold text-gray-500 tracking-wider uppercase">Anjan Store</span>
        <span className="text-[10px] text-gray-400">All in one place</span>
      </div>
    </div>
  );
}`;

const newWatermark = `      {/* Anjan Store Information */}
      <div className="px-4 mt-12 mb-8">
        <h2 className="font-bold text-dark-bg text-[15px] mb-4">Anjan Store Information</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
          {[
            { text: 'About Us & Socials', path: 'about' },
            { text: 'FAQ', path: 'faq' },
            { text: 'Customer Support', path: 'contact' },
            { text: 'Terms & Conditions', path: 'terms' },
            { text: 'Privacy Policy', path: 'privacy' },
          ].map((item, idx) => (
            <div key={\`\${item.text}-\${idx}\`} onClick={() => onNavigate && onNavigate('Home')} className={\`flex justify-between items-center px-5 py-4 cursor-pointer \${idx !== 4 ? 'border-b border-gray-50' : ''}\`}>
              <span className="font-bold text-sm text-dark-bg">{item.text}</span>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Watermark */}
      <div className="flex flex-col items-center justify-center pt-8 pb-32 opacity-20">
        <span className="text-2xl font-black tracking-widest uppercase mb-1">Anjan Store</span>
        <span className="text-[10px] font-bold tracking-widest uppercase mb-6">All in one place</span>
        <span className="text-[9px] text-gray-500">crafted by: Nokyat Konyak (NiniBuild)</span>
      </div>
    </div>
  );
}`;

content = content.replace(oldWatermark, newWatermark);
fs.writeFileSync('src/components/MainAppScreen.tsx', content);

