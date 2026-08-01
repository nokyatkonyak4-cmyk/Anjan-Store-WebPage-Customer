const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

const oldBanner = `                  {finalShowBanner && !searchQuery && products && products.length > 0 && (
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

const newBanner = `                  {finalShowBanner && !searchQuery && products && products.length > 0 && (
                    <div className="col-span-full my-2 -mx-4 px-4 md:mx-0 md:px-0">
                      {(() => {
                        const topDeal = products.find((p:any) => p.price < 50) || products[0];
                        const bestSeller = products.length > 0 ? [...products].sort((a: any, b: any) => (b.reviewCount || 0) - (a.reviewCount || 0))[0] : null;
                        
                        const generatedSlides = [];
                        if (topDeal) {
                          generatedSlides.push({
                            id: 'top-deal-' + topDeal.id,
                            title: topDeal.name,
                            subtitle: \`Only ₹\${topDeal.price}\`,
                            imageUrl: topDeal.imageUrl || topDeal.image || topDeal.photoUrl || '',
                            badgeText: 'HOT DEAL',
                            badgeColor: '#F44336',
                            link: ''
                          });
                        }
                        // Only add bestSeller if it's a different product, or if we want multiple we can just add it
                        if (bestSeller && bestSeller.id !== topDeal?.id) {
                          generatedSlides.push({
                            id: 'best-seller-' + bestSeller.id,
                            title: bestSeller.name,
                            subtitle: "Highly Rated",
                            imageUrl: bestSeller.imageUrl || bestSeller.image || bestSeller.photoUrl || '',
                            badgeText: 'BEST SELLER',
                            badgeColor: '#4CAF50',
                            link: ''
                          });
                        }

                        // Ensure we have at least something if they are the same
                        if (generatedSlides.length === 1 && products.length > 1) {
                           const another = products.find((p:any) => p.id !== generatedSlides[0].id.replace('top-deal-', '').replace('best-seller-', ''));
                           if (another) {
                             generatedSlides.push({
                               id: 'featured-' + another.id,
                               title: another.name,
                               subtitle: another.category ? \`Featured \${another.category}\` : "Featured Product",
                               imageUrl: another.imageUrl || another.image || another.photoUrl || '',
                               badgeText: 'FEATURED',
                               badgeColor: '#FFC107',
                               link: ''
                             });
                           }
                        }

                        return generatedSlides.length > 0 ? (
                          <SecondaryBannerSlider
                            slides={generatedSlides}
                            onSlideClick={() => {}}
                          />
                        ) : null;
                      })()}
                    </div>
                  )}`;

content = content.replace(oldBanner, newBanner);
fs.writeFileSync('src/components/MainAppScreen.tsx', content);
