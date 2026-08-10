const fs = require('fs');

let content = fs.readFileSync('src/components/Screens.tsx', 'utf8');

// 1. Ensure SecondaryBannerSlider is imported
if (!content.includes('import SecondaryBannerSlider')) {
    content = content.replace(
        "import BannerSlider from './BannerSlider';",
        "import BannerSlider from './BannerSlider';\nimport SecondaryBannerSlider, { CampaignSlide } from './SecondaryBannerSlider';"
    );
}

// 2. Define mock campaigns
const mockCampaigns = `
const MOCK_CAMPAIGNS: CampaignSlide[] = [
    {
        id: "c1",
        title: "Best Seller",
        subtitle: "Birthday Mug",
        imageUrl: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&q=80&w=800",
        badgeText: "POPULAR",
        badgeColor: "#4CAF50",
        link: "Product_1"
    },
    {
        id: "c2",
        title: "Trending Now",
        subtitle: "Sports & Fitness",
        imageUrl: "https://images.unsplash.com/photo-1526502225230-f2203719b6eb?auto=format&fit=crop&q=80&w=800",
        badgeText: "HOT",
        badgeColor: "#FF5722",
        link: "Category_sports"
    },
    {
        id: "c3",
        title: "New Arrivals",
        subtitle: "Fresh Electronics",
        imageUrl: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=800",
        badgeText: "NEW",
        badgeColor: "#2196F3",
        link: "Category_electronics"
    }
];
`;

if (!content.includes('MOCK_CAMPAIGNS')) {
    content = content.replace("export function HomeScreen", mockCampaigns + "\nexport function HomeScreen");
}

// 3. Add the SecondaryBannerSlider to HomeScreen
const hsSliderInsertion = `            <div>
                <SecondaryBannerSlider 
                    slides={MOCK_CAMPAIGNS} 
                    onSlideClick={(slide) => onNavigate(slide.link || 'Home')}
                    autoSlideInterval={3000}
                />
            </div>
            
            <div>
                <h2 className="text-lg font-bold text-dark-bg mb-4">Featured Products</h2>`;

content = content.replace(
    /<div>\s*<h2 className="text-lg font-bold text-dark-bg mb-4">Featured Products<\/h2>/,
    hsSliderInsertion
);

// 4. Also fix ProfileScreen bottom links
let mainContent = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

const profileFooter = `
          <div className="mt-8 pt-6 border-t border-gray-100 w-full flex flex-col items-center space-y-4">
            <h3 className="font-bold text-dark-bg">Anjan Store Information</h3>
            <div className="w-full flex flex-col space-y-2">
                <button onClick={() => navigate('/static_page/about')} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                    <span className="text-sm font-semibold text-gray-700">About Us</span>
                    <ChevronRight size={16} className="text-gray-400" />
                </button>
                <button onClick={() => navigate('/static_page/faq')} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                    <span className="text-sm font-semibold text-gray-700">FAQ</span>
                    <ChevronRight size={16} className="text-gray-400" />
                </button>
                <button onClick={() => navigate('/customer-support')} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                    <span className="text-sm font-semibold text-gray-700">Customer Support</span>
                    <ChevronRight size={16} className="text-gray-400" />
                </button>
                <button onClick={() => navigate('/static_page/shipping')} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                    <span className="text-sm font-semibold text-gray-700">Shipping & Delivery Policy</span>
                    <ChevronRight size={16} className="text-gray-400" />
                </button>
                <button onClick={() => navigate('/static_page/terms')} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                    <span className="text-sm font-semibold text-gray-700">Terms & Conditions</span>
                    <ChevronRight size={16} className="text-gray-400" />
                </button>
                <button onClick={() => navigate('/static_page/privacy')} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                    <span className="text-sm font-semibold text-gray-700">Privacy Policy</span>
                    <ChevronRight size={16} className="text-gray-400" />
                </button>
            </div>
            
            <div className="w-full text-center mt-6 pt-6 opacity-60">
                <h4 className="font-black text-xl tracking-widest uppercase text-gray-300">Anjan Store</h4>
                <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2">All In One Place</p>
                <p className="text-xs text-gray-400 mb-4">Making your everyday life easier</p>
                <p className="text-[9px] text-gray-400">created by: Nokyat Konyak (MiniMulti)</p>
            </div>
          </div>
`;

if (!mainContent.includes("Anjan Store Information")) {
    mainContent = mainContent.replace(
        "Logout\n          </button>\n        </div>",
        "Logout\n          </button>\n" + profileFooter + "\n        </div>"
    );
}

fs.writeFileSync('src/components/Screens.tsx', content);
fs.writeFileSync('src/components/MainAppScreen.tsx', mainContent);

console.log("Updated files!");
