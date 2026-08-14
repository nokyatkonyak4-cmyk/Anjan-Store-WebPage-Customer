import toast from 'react-hot-toast';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { doc, addDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Search, ShoppingCart, Heart, ArrowLeft, Star, Plus, Minus } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import BannerSlider from './BannerSlider';
import SecondaryBannerSlider, { CampaignSlide } from './SecondaryBannerSlider';


export function HomeScreen({ searchQuery, setSearchQuery, onNavigate, products, categories, banners, favorites, cartItems, toggleFavorite, incrementCart, decrementCart, storeSettings }: any) {
    const featuredProducts = products.slice(0, 8);
    const popularProducts = products.slice(8, 16);
    const remainingProducts = products.slice(16);
    
    const campaigns: CampaignSlide[] = [];
    if (products.length > 0) {
        const topSeller = products[0];
        if (topSeller) {
            campaigns.push({
                id: `campaign_${topSeller.id}`,
                title: "Top Seller",
                subtitle: topSeller.name,
                imageUrl: topSeller.imageUrls?.[0] || topSeller.imageUrl || "/app-icon-512X512.png",
                badgeText: "POPULAR",
                badgeColor: "#4CAF50",
                link: `Product_${topSeller.id}`
            });
        }
        
        const trendingIndex = Math.floor(products.length / 2);
        const trending = products[trendingIndex] || products[1];
        if (trending && trending.id !== topSeller?.id) {
            campaigns.push({
                id: `campaign_${trending.id}`,
                title: "Trending Now",
                subtitle: trending.name,
                imageUrl: trending.imageUrls?.[0] || trending.imageUrl || "/app-icon-512X512.png",
                badgeText: "HOT",
                badgeColor: "#FF5722",
                link: `Product_${trending.id}`
            });
        }
        
        const newest = products[products.length - 1] || products[2];
        if (newest && newest.id !== topSeller?.id && newest.id !== trending?.id) {
            campaigns.push({
                id: `campaign_${newest.id}`,
                title: "New Arrivals",
                subtitle: newest.name,
                imageUrl: newest.imageUrls?.[0] || newest.imageUrl || "/app-icon-512X512.png",
                badgeText: "NEW",
                badgeColor: "#2196F3",
                link: `Product_${newest.id}`
            });
        }
    }

    
    
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
                                onProductClick={() => onNavigate(`Product_${prod.id}`)}
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
                                <div key={cat.id} onClick={() => onNavigate(`Category_${cat.id}`)} className="flex flex-col items-center space-y-2 cursor-pointer min-w-[70px]">
                                    <div className="w-14 h-14 bg-white rounded-full p-2 shadow-sm flex items-center justify-center">
                                        <img src={cat.imageUrl || "/app-icon-512X512.png"} alt={cat.name} className="w-full h-full object-contain" />
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
                                    onProductClick={() => onNavigate(`Product_${prod.id}`)}
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
                                        onProductClick={() => onNavigate(`Product_${prod.id}`)}
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
                                        onProductClick={() => onNavigate(`Product_${prod.id}`)}
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

}

export function CartScreen({ cartItems, setCartItems, incrementCart, decrementCart, onNavigate, storeSettings }: any) {
    const total = cartItems.reduce((acc: number, item: any) => acc + (item.product.price * item.quantity), 0);

    const handleCheckout = async () => {
        if (!auth.currentUser) {
            toast.error("Please login to place an order");
            return;
        }
        try {
            const newOrderRef = await addDoc(collection(db, "orders"), {
                customerId: auth.currentUser.uid,
                customerName: auth.currentUser.displayName || auth.currentUser.email || "Customer",
                items: cartItems.map((item: any) => ({
                    productId: item.product.id,
                    name: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity,
                    imageUrl: item.product.imageUrls?.[0] || item.product.imageUrl || item.product.image || "/app-icon-512X512.png"
                })),
                totalPrice: total,
                deliveryFee: storeSettings?.deliveryFee || 0,
                status: "Pending Approval",
                createdAt: new Date(),
                createdAtMs: Date.now()
            });
            setCartItems([]);
            toast.success("Order placed successfully!");
            window.location.href = `/digital_bill/${newOrderRef.id}`;
        } catch (error: any) {
            console.error("Checkout error", error);
            toast.error("Failed to place order: " + error.message);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white p-4 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold mb-4">Your Cart</h2>
            {cartItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                    <ShoppingCart size={48} className="mb-4 text-gray-300" />
                    <p>Your cart is empty</p>
                    <button onClick={() => onNavigate("Home")} className="mt-4 bg-brand-yellow text-dark-bg px-6 py-2 rounded-full font-bold transition-all active:scale-95 hover:opacity-90">Start Shopping</button>
                </div>
            ) : (
                <>
                    <div className="flex-1 overflow-y-auto space-y-4">
                        {cartItems.map((item: any) => (
                            <div key={item.product.id} className="flex items-center space-x-4 border-b border-gray-100 pb-4">
                                <img src={item.product.imageUrls?.[0] || item.product.imageUrl || "/app-icon-512X512.png"} className="w-16 h-16 object-contain bg-gray-50 rounded-lg" />
                                <div className="flex-1">
                                    <h3 className="font-bold text-sm">{item.product.name}</h3>
                                    <span className="text-brand-yellow font-bold">₹{item.product.price}</span>
                                </div>
                                <div className="flex items-center space-x-3 bg-gray-50 rounded-full px-2 py-1">
                                    <button onClick={() => decrementCart(item.product)}><Minus size={16}/></button>
                                    <span className="font-bold text-sm">{item.quantity}</span>
                                    <button onClick={() => incrementCart(item.product)}><Plus size={16}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-gray-100 pt-4 mt-4">
                        <div className="flex justify-between font-bold text-lg mb-4">
                            <span>Total</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                        <button onClick={handleCheckout} className="w-full bg-brand-yellow text-dark-bg py-3 rounded-full font-bold shadow-md transition-all active:scale-95 hover:opacity-90">Checkout</button>
                    </div>
                </>
            )}
        </div>
    );
}

export function CategoriesScreen({ categories, onNavigate }: any) {
    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-6">All Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {categories.map((cat: any) => (
                    <div key={cat.id} onClick={() => onNavigate(`Category_${cat.id}`)} className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center cursor-pointer hover:shadow-md transition">
                        <img src={cat.imageUrl || "/app-icon-512X512.png"} className="w-16 h-16 object-contain mb-3" />
                        <h3 className="font-bold text-center text-sm">{cat.name}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function FavoritesScreen({ favorites, products, onNavigate, cartItems, toggleFavorite, incrementCart, decrementCart }: any) {
    const favProducts = products.filter((p: any) => favorites.includes(p.id));
    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-6">Favorites</h2>
            {favProducts.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">No favorites yet</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {favProducts.map((prod: any) => (
                        <ProductCard
                            key={prod.id}
                            product={prod}
                            cartQuantity={cartItems?.find((i: any) => i.product.id === prod.id)?.quantity || 0}
                            isFavorite={favorites.includes(prod.id)}
                            onToggleFavorite={() => toggleFavorite(prod.id)}
                            onIncrement={incrementCart}
                            onDecrement={decrementCart}
                            onProductClick={() => onNavigate(`Product_${prod.id}`)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export function ProductDetailsScreen({ productId, products, productReviews, onNavigate, incrementCart }: any) {
    const product = products.find((p: any) => p.id === productId);
    const [subcollectionReviews, setSubcollectionReviews] = React.useState<any[]>([]);

    React.useEffect(() => {
        if (!productId) return;
        
        const unsubs: any[] = [];
        
        // Check root "reviews" collection (used by Android app)
        unsubs.push(onSnapshot(query(collection(db, "reviews"), where("productId", "==", productId)), (snapshot) => {
            setSubcollectionReviews(prev => {
                const map = new Map(prev.map(p => [p.id, p]));
                snapshot.docs.forEach(doc => map.set(doc.id, { id: doc.id, ...doc.data() }));
                return Array.from(map.values());
            });
        }, (err) => {
            console.warn("Failed to fetch root reviews collection:", err.message);
        }));

        // Check subcollection "reviews" just in case
        unsubs.push(onSnapshot(collection(db, "products", productId, "reviews"), (snapshot) => {
            setSubcollectionReviews(prev => {
                const map = new Map(prev.map(p => [p.id, p]));
                snapshot.docs.forEach(doc => map.set(doc.id, { id: doc.id, ...doc.data() }));
                return Array.from(map.values());
            });
        }, (err) => {
            console.warn("Failed to fetch product subcollection reviews:", err.message);
        }));
        
        return () => unsubs.forEach(fn => fn());
    }, [productId]);

    if (!product) return <div>Product not found</div>;

    const collectionReviews = productReviews?.filter((r: any) => r.productId === productId) || [];
    const nativeReviews = product.reviews || [];
    
    // Combine and sort all sources
    const allReviewsMap = new Map();
    [...collectionReviews, ...nativeReviews, ...subcollectionReviews].forEach(r => {
        // use id as key to avoid duplicates if they somehow overlap, 
        // fallback to a stringified version of the object if no ID is present (rare)
        const key = r.id || JSON.stringify(r);
        if (!allReviewsMap.has(key)) {
            allReviewsMap.set(key, r);
        }
    });

    const allReviews = Array.from(allReviewsMap.values()).sort((a: any, b: any) => {
        const timeA = a.createdAtMs || a.createdAt?.toMillis?.() || a.timestamp || 0;
        const timeB = b.createdAtMs || b.createdAt?.toMillis?.() || b.timestamp || 0;
        return timeB - timeA;
    });

    return (
        <div className="bg-white min-h-screen pb-20">
            <div className="relative">
                <button onClick={() => onNavigate("Back")} className="absolute top-4 left-4 z-10 bg-white/80 p-2 rounded-full shadow-md transition-all active:scale-95 hover:opacity-90"><ArrowLeft size={20}/></button>
                <img src={product.imageUrls?.[0] || product.imageUrl || "/app-icon-512X512.png"} className="w-full h-[300px] object-contain bg-gray-50" />
            </div>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center space-x-1 mb-2">
                    <Star size={16} className="fill-[#FFC107] text-[#FFC107]" />
                    <span className="text-sm font-bold text-dark-bg">{(product.averageRating || 0).toFixed(1)}</span>
                    <span className="text-sm text-gray-500">({product.reviewCount || 0} reviews)</span>
                </div>
                <p className="text-brand-yellow font-bold text-xl mb-4">₹{product.price}</p>
                <p className="text-gray-600 mb-8">{product.description || "No description available."}</p>
                <button onClick={() => incrementCart(product)} className="w-full bg-brand-yellow text-dark-bg py-4 rounded-full font-bold text-lg shadow-md flex items-center justify-center transition-all active:scale-95 hover:opacity-90 mb-8">
                    <ShoppingCart size={20} className="mr-2" /> Add to Cart
                </button>

                {/* Ratings & Reviews Section */}
                <div className="pt-6 border-t border-gray-100">
                    <h2 className="text-xl font-bold text-dark-bg mb-4">Ratings & Reviews</h2>
                    
                    {allReviews.length === 0 ? (
                        <p className="text-gray-500 text-sm">No reviews yet. Be the first to rate this product after purchasing!</p>
                    ) : (
                        <div className="space-y-4">
                            {allReviews.map((review: any, index: number) => (
                                <div key={review.id || index} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-bold text-sm text-dark-bg">{review.customerName || review.userName || review.authorName || review.customer_name || review.name || "Anonymous User"}</div>
                                        <div className="flex text-xs text-gray-400">
                                            {new Date(review.createdAtMs || review.createdAt?.toMillis?.() || review.timestamp || Date.now()).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1 mb-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} size={14} fill={star <= review.rating ? "#FFC107" : "transparent"} color={star <= review.rating ? "#FFC107" : "#CBD5E1"} />
                                        ))}
                                    </div>
                                    {(review.feedback || review.comment || review.text || review.review || review.message) && (
                                        <p className="text-gray-600 text-sm mt-2">{review.feedback || review.comment || review.text || review.review || review.message}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export function CategoryScreen({ categoryId, products, categories, onNavigate, cartItems, favorites, toggleFavorite, incrementCart, decrementCart }: any) {
    const category = categories.find((c: any) => c.id === categoryId);
    const catProducts = products.filter((p: any) => p.category === category?.name || p.categoryId === categoryId);
    return (
        <div className="p-4">
            <div className="flex items-center mb-6">
                <button onClick={() => onNavigate("Categories")} className="mr-4 transition-all active:scale-90 hover:opacity-80"><ArrowLeft size={24}/></button>
                <h2 className="text-xl font-bold">{category?.name || "Category"}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {catProducts.map((prod: any) => (
                    <ProductCard
                        key={prod.id}
                        product={prod}
                        cartQuantity={cartItems?.find((i: any) => i.product.id === prod.id)?.quantity || 0}
                        isFavorite={favorites?.includes(prod.id) || false}
                        onToggleFavorite={() => toggleFavorite(prod.id)}
                        onIncrement={incrementCart}
                        onDecrement={decrementCart}
                        onProductClick={() => onNavigate(`Product_${prod.id}`)}
                    />
                ))}
            </div>
        </div>
    );
}


export function ProductCard({
  product,
  cartQuantity,
  isFavorite,
  onToggleFavorite,
  onIncrement,
  onDecrement,
  onProductClick,
}: any) {
  const images = product.imageUrls || product.images || (product.imageUrl || product.image ? [product.imageUrl || product.image] : ["/app-icon-512X512.png"]);
  const extraImagesCount = images.length > 1 ? images.length - 1 : 0;
  return (
    <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md overflow-hidden flex flex-col h-[200px] md:h-[250px] border border-gray-100 transition-all hover:-translate-y-1 relative">
      <div
        className="relative h-[100px] md:h-[130px] w-full shrink-0 p-1 flex items-center justify-center border-b border-gray-50 cursor-pointer"
        onClick={() => onProductClick && onProductClick(product)}
      >
        <img
          src={images[0]}
          alt={product.name}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "/app-icon-512X512.png";
          }}
        />
        {extraImagesCount > 0 && (
          <div className="absolute bottom-2 left-2 bg-dark-bg/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center shadow-sm">
            +{extraImagesCount} Photos
          </div>
        )}
      </div>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm z-10 border border-gray-100"
      >
        <Heart
          size={14}
          className={
            isFavorite ? "fill-[#FFC107] text-[#FFC107]" : "text-gray-400"
          }
        />
      </motion.button>
      <div className="p-2 md:p-3 flex flex-col flex-1 justify-between">
        <div
          onClick={() => onProductClick && onProductClick(product)}
          className="cursor-pointer"
        >
          <h3 className="font-bold text-dark-bg text-[11px] md:text-sm line-clamp-1 mb-1">
            {product.name}
          </h3>
          <span className="inline-block text-[9px] md:text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-sm mb-1">
            {product.category}
          </span>
          <div className="flex items-center space-x-1 mb-1">
            <Star size={10} className="fill-[#FFC107] text-[#FFC107]" />
            <span className="text-[9px] font-bold text-dark-bg">{(product.averageRating || 0).toFixed(1)}</span>
            <span className="text-[9px] text-gray-400">({product.reviewCount || 0})</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="font-bold text-xs md:text-sm text-dark-bg">
            ₹{product.price.toFixed(1)}
          </span>
          {cartQuantity > 0 ? (
            <div className="flex items-center bg-brand-yellow/20 rounded-md border border-brand-yellow/30">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDecrement(product);
                }}
                className="w-6 h-6 flex items-center justify-center text-dark-bg font-bold"
              >
                -
              </motion.button>
              <span className="w-5 text-center text-[10px] md:text-xs font-bold text-dark-bg">
                {cartQuantity}
              </span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onIncrement(product);
                }}
                className="w-6 h-6 flex items-center justify-center text-dark-bg font-bold"
              >
                +
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onIncrement(product);
              }}
              className="bg-white border border-brand-yellow text-brand-yellow text-[10px] md:text-[11px] font-bold px-3 py-1 rounded-md shadow-sm"
            >
              ADD
            </motion.button>
          )}
      </div>
      </div>
    </div>
  );
}


export function Footer() {
    const navigate = useNavigate();
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-8 mb-4 flex flex-col items-center justify-center space-y-4">
            <h3 className="font-bold text-lg text-dark-bg">Anjan Store</h3>
            <p className="text-sm text-gray-500 text-center max-w-sm">Making your everyday life easier with the best products and fast delivery.</p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
                <button onClick={() => navigate('/customer-support')} className="text-gray-600 hover:text-brand-yellow transition">Contact Us</button>
                <button onClick={() => navigate('/static_page/about-us')} className="text-gray-600 hover:text-brand-yellow transition">About Us</button>
                <button onClick={() => navigate('/static_page/privacy-policy')} className="text-gray-600 hover:text-brand-yellow transition">Privacy Policy</button>
                <button onClick={() => navigate('/static_page/terms-conditions')} className="text-gray-600 hover:text-brand-yellow transition">Terms & Conditions</button>
            </div>
            
            <div className="pt-4 border-t border-gray-100 w-full text-center">
                <h4 className="font-black text-xl tracking-widest uppercase text-gray-300">Anjan Store</h4>
                <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2">All In One Place</p>
                <p className="text-xs text-gray-400 mb-4">Making your everyday life easier</p>
                <p className="text-[10px] text-gray-300 mt-1 font-mono tracking-widest uppercase">
                    crafted by: Nokyat Konyak (ninibuild)
                </p>
            </div>
        </div>
    );
}
