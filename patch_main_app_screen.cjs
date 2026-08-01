const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

if (!content.includes("SecondaryBannerSlider")) {
    content = content.replace(
        "import { seedDatabase } from '../seedData';",
        "import { seedDatabase } from '../seedData';\nimport SecondaryBannerSlider from './SecondaryBannerSlider';"
    );
}

const oldBannerBlock = `      {!searchQuery && banners && banners.length > 0 && (
        <div className="px-4 mb-6">
          <div className="w-full h-[160px] bg-white rounded-2xl overflow-hidden shadow-sm relative">
             <img src={banners[0].imageUrl || banners[0].image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"} alt={banners[0].title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"; }} />
          </div>
        </div>
      )}`;

const newBannerBlock = `      {!searchQuery && banners && banners.length > 0 && (
        <div className="mb-4">
          <SecondaryBannerSlider
            slides={banners.map((b: any) => ({
              id: b.id,
              title: b.title || '',
              subtitle: b.subtitle || '',
              imageUrl: b.imageUrl || b.image || '',
              badgeText: b.badgeText || '',
              badgeColor: b.badgeColor || '#4CAF50',
              link: b.link || ''
            }))}
            onSlideClick={(link) => link && window.open(link, '_blank')}
          />
        </div>
      )}`;

content = content.replace(oldBannerBlock, newBannerBlock);

fs.writeFileSync('src/components/MainAppScreen.tsx', content);
