const fs = require('fs');

let content = fs.readFileSync('src/components/Screens.tsx', 'utf8');

// I will find the return statement of HomeScreen and modify what's inside.

const newReturnLogic = `
        return (
        <div className="flex flex-col space-y-6">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="w-full bg-white rounded-full py-3 pl-10 pr-4 shadow-sm border border-gray-100 outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            
            {searchQuery ? (
                <div>
                    <h2 className="text-lg font-bold text-dark-bg mb-4">Search Results</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products
                            .filter((prod) => prod.name?.toLowerCase().includes(searchQuery.toLowerCase()) || prod.category?.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((prod) => (
                            <ProductCard
                                key={prod.id}
                                product={prod}
                                cartQuantity={cartItems.find((i) => i.product.id === prod.id)?.quantity || 0}
                                isFavorite={favorites.includes(prod.id)}
                                onToggleFavorite={() => toggleFavorite(prod.id)}
                                onIncrement={incrementCart}
                                onDecrement={decrementCart}
                                onProductClick={() => onNavigate(\`Product_\${prod.id}\`)}
                            />
                        ))}
                        {products.filter((prod) => prod.name?.toLowerCase().includes(searchQuery.toLowerCase()) || prod.category?.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                            <div className="col-span-full py-8 text-center text-gray-500">
                                No products found for "{searchQuery}"
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    {banners && banners.length > 0 && <BannerSlider slides={banners} />}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-dark-bg">Categories</h2>
                            <button onClick={() => onNavigate("Categories")} className="text-brand-yellow font-bold text-sm">See All</button>
                        </div>
                        <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
                            {categories.map((cat: any) => (
                                <div key={cat.id} onClick={() => onNavigate(\`Category_\${cat.id}\`)} className="flex flex-col items-center space-y-2 cursor-pointer min-w-[70px]">
                                    <div className="w-14 h-14 bg-white rounded-full p-2 shadow-sm flex items-center justify-center">
                                        <img src={cat.imageUrl || "/AppIcon-512x512.png"} alt={cat.name} className="w-full h-full object-contain" />
                                    </div>
                                    <span className="text-xs font-medium text-center">{cat.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {campaigns.length > 0 && (
                    <div>
                        <SecondaryBannerSlider 
                            slides={campaigns} 
                            onSlideClick={(slide) => onNavigate(slide.link || 'Home')}
                            autoSlideInterval={3000}
                        />
                    </div>
                    )}
                    
                    <div>
                        <h2 className="text-lg font-bold text-dark-bg mb-4">Featured Products</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {featuredProducts.map((prod: any) => (
                                <ProductCard
                                    key={prod.id}
                                    product={prod}
                                    cartQuantity={cartItems.find((i: any) => i.product.id === prod.id)?.quantity || 0}
                                    isFavorite={favorites.includes(prod.id)}
                                    onToggleFavorite={() => toggleFavorite(prod.id)}
                                    onIncrement={incrementCart}
                                    onDecrement={decrementCart}
                                    onProductClick={() => onNavigate(\`Product_\${prod.id}\`)}
                                />
                            ))}
                        </div>
                    </div>
                    
                    {popularProducts.length > 0 && (
                        <div>
                            <h2 className="text-lg font-bold text-dark-bg mb-4">Popular Products</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {popularProducts.map((prod: any) => (
                                    <ProductCard
                                        key={prod.id}
                                        product={prod}
                                        cartQuantity={cartItems.find((i: any) => i.product.id === prod.id)?.quantity || 0}
                                        isFavorite={favorites.includes(prod.id)}
                                        onToggleFavorite={() => toggleFavorite(prod.id)}
                                        onIncrement={incrementCart}
                                        onDecrement={decrementCart}
                                        onProductClick={() => onNavigate(\`Product_\${prod.id}\`)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {remainingProducts.length > 0 && (
                        <div>
                            <h2 className="text-lg font-bold text-dark-bg mb-4">More to Explore</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {remainingProducts.map((prod: any) => (
                                    <ProductCard
                                        key={prod.id}
                                        product={prod}
                                        cartQuantity={cartItems.find((i: any) => i.product.id === prod.id)?.quantity || 0}
                                        isFavorite={favorites.includes(prod.id)}
                                        onToggleFavorite={() => toggleFavorite(prod.id)}
                                        onIncrement={incrementCart}
                                        onDecrement={decrementCart}
                                        onProductClick={() => onNavigate(\`Product_\${prod.id}\`)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
            
            <Footer />
        </div>
    );
`;

const originalReturnStart = content.indexOf('return (', content.indexOf('export function HomeScreen'));
const originalReturnEnd = content.indexOf('}', content.indexOf('<Footer />')) + 1; // Wait, actually it's easier to use a regex or just replace from 'return (' to end of HomeScreen

const homeScreenRegex = /return \([\s\S]*?<Footer \/>\s*<\/div>\s*\);\s*\}/;
content = content.replace(homeScreenRegex, newReturnLogic + '\n}');

fs.writeFileSync('src/components/Screens.tsx', content);
console.log("Updated HomeScreen to support search!");
