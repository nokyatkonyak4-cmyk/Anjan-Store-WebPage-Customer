const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

const oldBanner = `                  {finalShowBanner && !searchQuery && banners && banners.length > 0 && (
                    <div className="col-span-full my-2 -mx-4 px-4 md:mx-0 md:px-0">
                      <SecondaryBannerSlider
                        slides={banners.map((b: any) => ({
                          id: b.id,
                          title: b.title || 'Special Offer',
                          subtitle: b.subtitle || "Don't miss out on these amazing deals",
                          imageUrl: b.imageUrl || b.image || '',
                          badgeText: b.badgeText || 'HOT',
                          badgeColor: b.badgeColor || '#FF3B30',
                          link: b.link || ''
                        }))}
                        onSlideClick={(link) => link && window.open(link, '_blank')}
                      />
                    </div>
                  )}`;

const newBanner = `                  {finalShowBanner && !searchQuery && products && products.length > 0 && (
                    <div className="col-span-full my-2 -mx-4 px-4 md:mx-0 md:px-0">
                      <SecondaryBannerSlider
                        slides={products.slice(0, 4).map((p: any) => ({
                          id: p.id,
                          title: p.name,
                          subtitle: p.category ? \`Get the best \${p.category} now\` : "Featured Product",
                          imageUrl: p.imageUrl || p.image || '',
                          badgeText: 'FEATURED',
                          badgeColor: '#FFC107',
                          link: ''
                        }))}
                        onSlideClick={() => {}}
                      />
                    </div>
                  )}`;

content = content.replace(oldBanner, newBanner);
fs.writeFileSync('src/components/MainAppScreen.tsx', content);
