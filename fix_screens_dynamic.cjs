const fs = require('fs');
let content = fs.readFileSync('src/components/Screens.tsx', 'utf8');

// Remove MOCK_CAMPAIGNS
content = content.replace(/const MOCK_CAMPAIGNS: CampaignSlide\[\] = \[[\s\S]*?\];\s*/g, '');

const newHomeScreenStart = `export function HomeScreen({ searchQuery, setSearchQuery, onNavigate, products, categories, banners, favorites, cartItems, toggleFavorite, incrementCart, decrementCart, storeSettings }: any) {
    const featuredProducts = products.slice(0, 8);
    const popularProducts = products.slice(8, 16);
    const remainingProducts = products.slice(16);
    
    const campaigns: CampaignSlide[] = [];
    if (products.length > 0) {
        const topSeller = products[0];
        if (topSeller) {
            campaigns.push({
                id: \`campaign_\${topSeller.id}\`,
                title: "Top Seller",
                subtitle: topSeller.name,
                imageUrl: topSeller.imageUrls?.[0] || topSeller.imageUrl || "/AppIcon-512x512.png",
                badgeText: "POPULAR",
                badgeColor: "#4CAF50",
                link: \`Product_\${topSeller.id}\`
            });
        }
        
        const trendingIndex = Math.floor(products.length / 2);
        const trending = products[trendingIndex] || products[1];
        if (trending && trending.id !== topSeller?.id) {
            campaigns.push({
                id: \`campaign_\${trending.id}\`,
                title: "Trending Now",
                subtitle: trending.name,
                imageUrl: trending.imageUrls?.[0] || trending.imageUrl || "/AppIcon-512x512.png",
                badgeText: "HOT",
                badgeColor: "#FF5722",
                link: \`Product_\${trending.id}\`
            });
        }
        
        const newest = products[products.length - 1] || products[2];
        if (newest && newest.id !== topSeller?.id && newest.id !== trending?.id) {
            campaigns.push({
                id: \`campaign_\${newest.id}\`,
                title: "New Arrivals",
                subtitle: newest.name,
                imageUrl: newest.imageUrls?.[0] || newest.imageUrl || "/AppIcon-512x512.png",
                badgeText: "NEW",
                badgeColor: "#2196F3",
                link: \`Product_\${newest.id}\`
            });
        }
    }
`;

content = content.replace(
    /export function HomeScreen\(\{[\s\S]*?const remainingProducts = products\.slice\(16\);/,
    newHomeScreenStart
);

content = content.replace(
    /slides=\{MOCK_CAMPAIGNS\}/g,
    'slides={campaigns}'
);

content = content.replace(
    /<div>\s*<SecondaryBannerSlider[\s\S]*?<\/div>/,
    `{campaigns.length > 0 && (
            <div>
                <SecondaryBannerSlider 
                    slides={campaigns} 
                    onSlideClick={(slide) => onNavigate(slide.link || 'Home')}
                    autoSlideInterval={3000}
                />
            </div>
            )}`
);

fs.writeFileSync('src/components/Screens.tsx', content);
console.log("Updated HomeScreen for dynamic campaigns!");
