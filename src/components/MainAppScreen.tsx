import React, { useState, useEffect } from 'react';
import { Home, Grid, List as ListIcon, ShoppingCart, Search, Heart, Bell, User, ArrowLeft, Plus, Minus, Star, MapPin, Share2, Camera, Mail, Info, Shield, CheckCircle, ChevronRight, Phone, RefreshCcw, Map, Bike, Store, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthScreen from './AuthScreen';
import { auth, db, isFirebaseConfigured } from '../firebase';
import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { collection, onSnapshot, query, where, addDoc, doc, setDoc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { seedDatabase } from '../seedData';
import SecondaryBannerSlider, { CampaignSlide } from './SecondaryBannerSlider';
import BannerSlider from './BannerSlider';

export default function MainAppScreen() {
  const navigate = useNavigate();
  const user = auth?.currentUser;
  const [selectedItem, setSelectedItem] = useState('Home');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<{product: any, quantity: number}[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Real data state
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  
  // User Profile
  const [savedAddress, setSavedAddress] = useState('');
  const [savedPhone, setSavedPhone] = useState('');

  const bottomNavItems = [
    { title: 'Home', icon: Home },
    { title: 'Categories', icon: Grid },
    { title: 'Orders', icon: ListIcon },
    { title: 'Cart', icon: ShoppingCart },
  ];

  useEffect(() => {
    if (!db || !user) return;
    
    const unsubs: any[] = [];
    
    // Listen to Categories
    unsubs.push(onSnapshot(collection(db, 'categories'), (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) })).filter(c => c.isActive !== false));
    }));

    // Listen to Products
    unsubs.push(onSnapshot(collection(db, 'products'), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) })).filter(p => p.isActive !== false && p.stockQuantity > 0));
    }));

    // Listen to Banners
    unsubs.push(onSnapshot(collection(db, 'banners'), (snapshot) => {
      setBanners(snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) })).filter(b => b.isActive !== false));
    }));

    // Listen to Orders
    unsubs.push(onSnapshot(query(collection(db, 'orders'), where('customerId', '==', user.uid)), (snapshot) => {
      const fetchedOrders = snapshot.docs.map(d => {
         const data = d.data();
         let dateStr = "Recently";
         if (data.createdAt && data.createdAt.toDate) {
           dateStr = data.createdAt.toDate().toLocaleString();
         } else if (data.createdAtMs) {
           dateStr = new Date(data.createdAtMs).toLocaleString();
         }
         return {
           id: d.id,
           date: dateStr,
           status: data.status || 'Pending Approval',
           total: data.totalPrice,
           deliveryFee: data.deliveryFee || 0,
           ...data,
           itemCount: data.items?.length || 0
         };
      }).sort((a:any, b:any) => (b.createdAtMs || 0) - (a.createdAtMs || 0));
      setOrders(fetchedOrders);
    }));
    
    // Listen to Notifications
    unsubs.push(onSnapshot(collection(db, 'users', user.uid, 'notifications'), (snapshot) => {
       setNotifications(snapshot.docs.map(d => ({ id: d.id, ...d.data() })).sort((a:any, b:any) => (b.timestamp || 0) - (a.timestamp || 0)));
    }));
    
    // User profile data (favorites, address, phone)
    unsubs.push(onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFavorites(data.favorites || []);
        setSavedAddress(data.address || '');
        setSavedPhone(data.whatsappNumber || '');
        if (data.cartItems) {
          setCartItems(data.cartItems);
        }
      }
    }));

    return () => unsubs.forEach(u => u());
  }, [user]);

  const toggleFavorite = (productId: string) => {
    if (!user || !db) return;
    const newFavs = favorites.includes(productId) ? favorites.filter(id => id !== productId) : [...favorites, productId];
    setDoc(doc(db, 'users', user.uid), { favorites: newFavs }, { merge: true });
  };

  const incrementCart = (product: any) => {
    const existing = cartItems.find(item => item.product.id === product.id);
    let newCart;
    if (existing) {
      newCart = cartItems.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
    } else {
      newCart = [...cartItems, { product, quantity: 1 }];
    }
    setCartItems(newCart);
    if (user && db) {
      setDoc(doc(db, 'users', user.uid), { cartItems: newCart }, { merge: true });
    }
  };

  const decrementCart = (product: any) => {
    const existing = cartItems.find(item => item.product.id === product.id);
    let newCart;
    if (existing && existing.quantity > 1) {
      newCart = cartItems.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity - 1 } : item);
    } else {
      newCart = cartItems.filter(item => item.product.id !== product.id);
    }
    setCartItems(newCart);
    if (user && db) {
      setDoc(doc(db, 'users', user.uid), { cartItems: newCart }, { merge: true });
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full md:max-w-full lg:max-w-7xl mx-auto bg-light-bg overflow-hidden relative">
      {/* Top App Bar */}
      <div className="bg-brand-yellow text-dark-bg flex flex-col sticky top-0 z-20 shadow-md">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg p-1 flex items-center justify-center overflow-hidden">
              <img src="/AppIcon-512x512.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight">Anjan Store</span>
              <span className="text-[9px] tracking-widest font-semibold uppercase">All in one place</span>
              <span className="text-[10px] text-gray-500 font-medium">Making your everyday life easier</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setSelectedItem('Favorites')}>
              <Heart size={24} className="text-dark-bg" />
            </button>
            <button onClick={() => setSelectedItem('Notifications')} className="relative">
              <Bell size={24} className="text-dark-bg" />
              {notifications.filter(n => !n.isRead).length > 0 && (
                 <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#FFC107] text-[8px] text-white flex items-center justify-center">
                   {notifications.filter(n => !n.isRead).length}
                 </span>
              )}
            </button>
            <button onClick={() => setSelectedItem('Profile')} className="w-8 h-8 rounded-full bg-dark-bg text-[#FFC107] flex items-center justify-center font-bold text-sm">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </button>
          </div>
        </div>
        
        
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
        {selectedItem === 'Home' && <HomeScreen searchQuery={searchQuery} setSearchQuery={setSearchQuery} onNavigate={setSelectedItem} products={products} categories={categories} banners={banners} favorites={favorites} cartItems={cartItems} toggleFavorite={toggleFavorite} incrementCart={incrementCart} decrementCart={decrementCart} />}
        {selectedItem.startsWith('Product_') && <ProductDetailScreen productId={selectedItem.replace('Product_', '')} products={products} onNavigate={setSelectedItem} favorites={favorites} cartItems={cartItems} toggleFavorite={toggleFavorite} incrementCart={incrementCart} decrementCart={decrementCart} />}
        {selectedItem === 'Categories' && <CategoriesScreen categories={categories} onNavigate={setSelectedItem} />}
        {selectedItem.startsWith('Category_') && <CategoryDetailScreen categoryId={selectedItem.replace('Category_', '')} categories={categories} products={products} onNavigate={setSelectedItem} favorites={favorites} cartItems={cartItems} toggleFavorite={toggleFavorite} incrementCart={incrementCart} decrementCart={decrementCart} />}
        {selectedItem === 'Cart' && <CartScreen cartItems={cartItems} setCartItems={setCartItems} savedAddress={savedAddress} savedPhone={savedPhone} incrementCart={incrementCart} decrementCart={decrementCart} onNavigate={setSelectedItem} />}
        {selectedItem === 'Orders' && <OrdersScreen orders={orders} />}
        {selectedItem === 'Favorites' && <FavoritesScreen products={products} onNavigate={setSelectedItem} favorites={favorites} cartItems={cartItems} toggleFavorite={toggleFavorite} incrementCart={incrementCart} decrementCart={decrementCart} />}
        {selectedItem === 'Notifications' && <NotificationsScreen notifications={notifications} onNavigate={setSelectedItem} />}
        {selectedItem === 'Profile' && <ProfileScreen savedAddress={savedAddress} savedPhone={savedPhone} onNavigate={setSelectedItem} />}
        {selectedItem === 'OrderHistory' && <OrderHistoryScreen orders={orders} onNavigate={setSelectedItem} />}
      </div>

      

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-100 flex justify-around items-center h-[60px] absolute bottom-0 w-full z-20 px-4">
        {bottomNavItems.map((item, index) => {
          const isSelected = selectedItem === item.title || (item.title === 'Categories' && selectedItem.startsWith('Category_'));
          return (
            <button
              key={`${item.title}-${index}`}
              onClick={() => setSelectedItem(item.title)}
              className={`flex items-center justify-center transition-all duration-300 h-[40px] ${isSelected ? 'bg-dark-bg text-brand-yellow px-4 rounded-full space-x-2' : 'flex-col space-y-1 w-[60px] text-gray-400'}`}
            >
              <div className="relative flex items-center justify-center">
                <item.icon size={20} className={isSelected ? 'text-brand-yellow fill-brand-yellow' : 'text-gray-400'} />
                {item.title === 'Cart' && cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </div>
              {isSelected ? (
                <span className="text-[12px] font-bold">{item.title}</span>
              ) : (
                <span className="text-[10px] font-medium">{item.title}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// --- Screens ---

function HomeScreen({ searchQuery, setSearchQuery, onNavigate, products, categories, banners, favorites, cartItems, toggleFavorite, incrementCart, decrementCart }: any) {
  const navigate = useNavigate();
  const [selectedOffer, setSelectedOffer] = useState<CampaignSlide | null>(null);

  const offerProducts = React.useMemo(() => {
    if (!selectedOffer) return [];
    
    switch (selectedOffer.id) {
      case 'dyn_rated':
        return [...products].sort((a:any, b:any) => (b.rating || 0) - (a.rating || 0)).slice(0, 10);
      case 'dyn_saled':
        return [...products].sort((a:any, b:any) => (b.reviewCount || 0) - (a.reviewCount || 0)).slice(0, 10);
      case 'dyn_discount':
        return products.filter((p:any) => p.price < 50);
      case 'dyn_trend':
        return [...products].sort(() => 0.5 - Math.random()).slice(0, 10);
      default:
        if (selectedOffer.link) {
          return products.filter((p:any) => 
            p.category?.toLowerCase() === selectedOffer.link?.toLowerCase()
          );
        }
        return [...products].sort(() => 0.5 - Math.random()).slice(0, 10);
    }
  }, [selectedOffer, products]);

  let displayedProducts = searchQuery 
    ? products.filter((p:any) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()))
    : [...products];

  if (!searchQuery) {
    const muttonIndex = displayedProducts.findIndex((p:any) => p.name.toLowerCase().includes('mutton'));
    if (muttonIndex !== -1) {
      displayedProducts.splice(muttonIndex + 1, 0, 
        { id: 'extra1', name: 'Fresh Salmon', category: 'Meat', price: 850, stockQuantity: 10, rating: 4.7, reviewCount: 50, imageUrl: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&q=80&w=300', isActive: true },
        { id: 'extra2', name: 'Organic Chicken', category: 'Meat', price: 450, stockQuantity: 15, rating: 4.5, reviewCount: 85, imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&q=80&w=300', isActive: true }
      );
    }
  }

  if (selectedOffer) {
    return (
      <div className="flex flex-col w-full pb-4 animate-in fade-in pt-4">
        {/* Header & Back Button */}
        <div className="flex items-center px-4 mb-6">
          <button 
            onClick={() => setSelectedOffer(null)}
            className="mr-4 p-2 bg-white shadow-sm rounded-full hover:bg-gray-100 transition"
          >
            <ArrowLeft size={20} className="text-dark-bg" />
          </button>
          <h1 className="text-xl font-bold text-dark-bg">
            {selectedOffer.title || "Special Offers"}
          </h1>
        </div>

        {/* Product Grid */}
        {offerProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20">
            <p className="text-gray-500 text-lg">No products found for this offer.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5 px-4 pb-6">
            {offerProducts.map((product:any, index:number) => (
              <ProductCard onProductClick={(p: any) => onNavigate(`Product_${p.id}`)} 
                key={`${product.id}-${index}`} 
                product={product} 
                cartQuantity={cartItems.find((i:any) => i.product.id === product.id)?.quantity || 0} 
                isFavorite={favorites.includes(product.id)} 
                onToggleFavorite={() => toggleFavorite(product.id)} 
                onIncrement={() => incrementCart(product)} 
                onDecrement={() => decrementCart(product)} 
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-4 animate-in fade-in pt-4">
      <div className="px-4 mb-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search for groceries, items..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white rounded-xl py-3.5 pl-12 pr-4 text-sm shadow-[0_2px_10px_rgba(0,0,0,0.05)] outline-none border border-gray-100"
          />
          <Search size={18} className="absolute left-4 top-4 text-gray-500" />
        </div>
      </div>
      
      {!searchQuery && banners && banners.length > 0 && (
        <div className="mb-4">
          <BannerSlider
            slides={banners.map((b: any) => ({
              id: b.id,
              title: b.title || '',
              imageUrl: b.imageUrl || b.image || '',
              link: b.link || ''
            }))}
          />
        </div>
      )}

      {!searchQuery && categories && categories.length > 0 && (
        <div className="mb-6 bg-white pt-2 pb-1">
          <div className="flex justify-between items-center px-4 mb-5">
            <h2 className="font-bold text-dark-bg text-sm">Shop by Category</h2>
            <button onClick={() => onNavigate('Categories')} className="text-[#FFC107] font-bold text-xs">See All</button>
          </div>
          <div className="flex overflow-x-auto px-4 space-x-5 scrollbar-hide pb-2">
            {categories.map((cat:any, index:number) => (
              <div key={`${cat.id}-${index}`} onClick={() => onNavigate(`Category_${cat.id}`)} className="flex flex-col items-center cursor-pointer shrink-0 w-[64px]">
                <div className="w-full h-[50px] flex items-center justify-center mb-2">
                  <img src={cat.imageUrl || cat.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200"} alt={cat.name} className="max-w-full max-h-full object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200"; }} />
                </div>
                <span className="text-[10px] font-bold text-dark-bg text-center leading-tight">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-4">
        <h2 className="font-bold text-dark-bg text-lg mb-4">{searchQuery ? 'Search Results' : 'Explore All Products'}</h2>
        {displayedProducts.length === 0 ? (
          <div className="flex items-center justify-center p-8 text-gray-500">No products found.</div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5">
            {displayedProducts.map((product:any, index:number) => {
              // The user specifically requested the secondary banner to be below mutton, headphone and between tablet laptop and mutton headphone.
              // This logic triggers when it finds 'tablet laptop', 'mutton' or 'headphone', or defaults to index 5.
              const isTrigger = product.name.toLowerCase().includes('mutton') || product.name.toLowerCase().includes('headphone') || product.name.toLowerCase().includes('tablet');
              const showBannerHere = isTrigger || index === 5;
              
              // Position the secondary banner between "Tablet laptop" and "Mutton Headphone".
              // We will show it right after "Tablet laptop" if it exists, or before "Mutton Headphone".
              let finalShowBanner = false;
              
              const tabletIndex = displayedProducts.findIndex((p:any) => p.name.toLowerCase().includes('tablet'));
              
              let muttonHeadphoneIndex = displayedProducts.findIndex((p:any) => p.name.toLowerCase().includes('mutton'));
              if (muttonHeadphoneIndex !== -1) {
                // We added 2 dummy products after mutton, so we want the banner after them to fill the row
                muttonHeadphoneIndex += 2;
              } else {
                muttonHeadphoneIndex = displayedProducts.findIndex((p:any) => p.name.toLowerCase().includes('headphone'));
              }
              
              if (tabletIndex !== -1 && muttonHeadphoneIndex !== -1) {
                // Determine which one comes first, we want to place it between them. 
                // So if Tablet is first, we place after Tablet.
                const firstIndex = Math.min(tabletIndex, muttonHeadphoneIndex);
                finalShowBanner = index === firstIndex;
              } else if (tabletIndex !== -1) {
                finalShowBanner = index === tabletIndex;
              } else if (muttonHeadphoneIndex !== -1) {
                finalShowBanner = index === muttonHeadphoneIndex;
              } else {
                finalShowBanner = index === 2; // Default to after 3rd item if none found
              }

              return (
                <React.Fragment key={`${product.id}-${index}`}>
                  <ProductCard onProductClick={(p: any) => onNavigate(`Product_${p.id}`)} 
                    product={product} 
                    cartQuantity={cartItems.find((i:any) => i.product.id === product.id)?.quantity || 0} 
                    isFavorite={favorites.includes(product.id)} 
                    onToggleFavorite={() => toggleFavorite(product.id)} 
                    onIncrement={() => incrementCart(product)} 
                    onDecrement={() => decrementCart(product)} 
                  />
                  
                  {finalShowBanner && !searchQuery && products && products.length > 0 && (
                    <div className="col-span-full my-2 -mx-4 px-4 md:mx-0 md:px-0">
                      {(() => {
                        const topDeal = products.find((p:any) => p.price < 50) || products[0];
                        const bestSeller = products.length > 0 ? [...products].sort((a: any, b: any) => (b.reviewCount || 0) - (a.reviewCount || 0))[0] : null;
                        
                        const generatedSlides = [];
                        if (topDeal) {
                          generatedSlides.push({
                            id: 'top-deal-' + topDeal.id,
                            title: topDeal.name,
                            subtitle: `Only ₹${topDeal.price}`,
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
                               subtitle: another.category ? `Featured ${another.category}` : "Featured Product",
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
                            onSlideClick={(slide) => {
                              const pid = slide.id.replace('top-deal-', '').replace('best-seller-', '').replace('featured-', '');
                              if (pid && products.find((p:any) => p.id === pid)) {
                                onNavigate(`Product_${pid}`);
                              } else {
                                setSelectedOffer(slide);
                              }
                            }}
                          />
                        ) : null;
                      })()}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
      {/* Anjan Store Information */}
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
            <div key={`${item.text}-${idx}`} onClick={() => navigate(`/static_page/${item.path}`)} className={`flex justify-between items-center px-5 py-4 cursor-pointer ${idx !== 4 ? 'border-b border-gray-50' : ''}`}>
              <span className="font-bold text-sm text-dark-bg">{item.text}</span>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Watermark */}
      <div className="flex flex-col items-center justify-center pt-8 pb-32 opacity-20">
        <span className="text-2xl font-black tracking-widest uppercase mb-1">Anjan Store</span>
        <span className="text-[10px] font-bold tracking-widest uppercase mb-1">All in one place</span>
        <span className="text-[10px] text-gray-500 font-medium mb-6">Making your everyday life easier</span>
        <span className="text-[9px] text-gray-500">crafted by: Nokyat Konyak (NiniBuild)</span>
      </div>
    </div>
  );
}

function CategoriesScreen({ categories, onNavigate }: any) {
  const [search, setSearch] = useState('');
  const filtered = categories.filter((c:any) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col w-full p-4 animate-in fade-in">
      <div className="relative mb-6">
        <input type="text" placeholder="Search categories..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white rounded-xl py-3 pl-12 pr-4 text-sm shadow-sm outline-none border border-transparent focus:border-[#FFC107]" />
        <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
      </div>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5">
        {filtered.map((cat:any, index:number) => (
          <div key={`${cat.id}-${index}`} onClick={() => onNavigate(`Category_${cat.id}`)} className="bg-white rounded-xl p-3 flex flex-col items-center justify-center shadow-sm cursor-pointer border border-gray-50 aspect-square">
            <div className="w-[60px] h-[60px] bg-gray-50 rounded-full flex items-center justify-center mb-2 p-2">
              <img src={cat.imageUrl || cat.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200"} alt={cat.name} className="w-full h-full object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200"; }} />
            </div>
            <span className="text-[11px] font-medium text-dark-bg text-center line-clamp-2 leading-tight">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductDetailScreen({ productId, products, onNavigate, cartItems, favorites, toggleFavorite, incrementCart, decrementCart }: any) {
  const product = products.find((p:any) => p.id === productId);
  if (!product) return <div className="p-8 text-center text-gray-500">Product not found</div>;
  
  const cartQuantity = cartItems.find((i:any) => i.product.id === product.id)?.quantity || 0;
  const isFavorite = favorites.includes(product.id);
  const images = product.images || (product.imageUrl || product.image ? [product.imageUrl || product.image] : ["https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?auto=format&fit=crop&q=80&w=300"]);

  return (
    <div className="flex flex-col w-full animate-in fade-in pb-20">
      <div className="relative w-full h-[300px] md:h-[400px] bg-white">
        <button onClick={() => onNavigate('Home')} className="absolute top-4 left-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm">
          <ArrowLeft size={20} className="text-dark-bg" />
        </button>
        <button onClick={() => toggleFavorite(product.id)} className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm border border-gray-100">
          <Heart size={20} className={isFavorite ? "fill-[#FFC107] text-[#FFC107]" : "text-gray-400"} />
        </button>
        <div className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          {images.map((img: string, idx: number) => (
            <div key={idx} className="w-full h-full shrink-0 snap-center flex items-center justify-center p-8">
              <img src={img} alt={`${product.name} - image ${idx + 1}`} className="w-full h-full object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?auto=format&fit=crop&q=80&w=300"; }} />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2 z-10 pointer-events-none">
            {images.map((_: any, idx: number) => (
              <div key={idx} className="w-2 h-2 rounded-full bg-dark-bg/20" />
            ))}
          </div>
        )}
      </div>
      <div className="p-5 bg-white rounded-t-3xl -mt-6 relative z-10 flex-1 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] border-t border-gray-100">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl font-bold text-dark-bg">{product.name}</h1>
          <h2 className="text-xl font-bold text-dark-bg">₹{product.price}</h2>
        </div>
        <span className="inline-block text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md mb-4">{product.category}</span>
        
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          {product.description || "High quality product freshly sourced. Guaranteed best quality and satisfaction. Enjoy our quick delivery service."}
        </p>

        <div className="mt-8">
          {cartQuantity === 0 ? (
            <button onClick={() => incrementCart(product)} className="w-full bg-brand-yellow text-dark-bg font-bold py-3.5 rounded-xl shadow-sm flex items-center justify-center transition-transform active:scale-95">
              <ShoppingCart size={18} className="mr-2" />
              Add to Cart
            </button>
          ) : (
            <div className="flex items-center justify-between bg-brand-yellow/10 border border-brand-yellow/30 rounded-xl p-2">
              <button onClick={() => decrementCart(product)} className="w-12 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-dark-bg shadow-sm">-</button>
              <span className="font-bold text-lg text-dark-bg">{cartQuantity}</span>
              <button onClick={() => incrementCart(product)} className="w-12 h-10 bg-brand-yellow rounded-lg flex items-center justify-center font-bold text-dark-bg shadow-sm">+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CategoryDetailScreen({ categoryId, categories, products, onNavigate, favorites, cartItems, toggleFavorite, incrementCart, decrementCart }: any) {
  const cat = categories.find((c:any) => c.id === categoryId);
  const catProducts = products.filter((p:any) => p.category === cat?.name || p.categoryId === categoryId);
  
  return (
    <div className="flex flex-col w-full p-4 animate-in fade-in">
      <div className="flex items-center mb-6 cursor-pointer" onClick={() => onNavigate('Categories')}>
        <ArrowLeft size={24} className="text-dark-bg mr-3" />
        <h2 className="text-xl font-bold text-dark-bg">{cat?.name || 'Category'}</h2>
      </div>
      {catProducts.length === 0 ? (
        <div className="flex items-center justify-center p-8 text-gray-500">No products in this category yet.</div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5 pb-6">
          {catProducts.map((product:any, index:number) => (
            <ProductCard onProductClick={(p: any) => onNavigate(`Product_${p.id}`)} key={`${product.id}-${index}`} product={product} cartQuantity={cartItems.find((i:any) => i.product.id === product.id)?.quantity || 0} isFavorite={favorites.includes(product.id)} onToggleFavorite={() => toggleFavorite(product.id)} onIncrement={() => incrementCart(product)} onDecrement={() => decrementCart(product)} />
          ))}
        </div>
      )}
    </div>
  );
}

function CartScreen({ cartItems, setCartItems, savedAddress, savedPhone, incrementCart, decrementCart, onNavigate }: any) {
  const total = cartItems.reduce((acc: number, item: any) => acc + (item.product.price * item.quantity), 0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deliveryType, setDeliveryType] = useState('Instant delivery');

  const handleCheckout = async () => {
    if (!savedAddress || !savedPhone) {
      alert("Please update your Delivery Address and Phone in the Profile tab first.");
      onNavigate('Profile');
      return;
    }
    
    if (!auth?.currentUser || !db) return;
    
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const orderData = {
      customerId: auth.currentUser.uid,
      customerName: auth.currentUser.displayName || "Customer",
      phone: savedPhone,
      address: savedAddress,
      items: cartItems.map((i:any) => ({ productId: i.product.id, name: i.product.name, price: i.product.price, quantity: i.quantity })),
      totalPrice: total,
      deliveryFee: 0,
      deliveryType,
      status: "Pending Approval",
      deliveryOtp: otp,
      createdAt: serverTimestamp(),
      createdAtMs: Date.now()
    };
    
    try {
      await addDoc(collection(db, 'orders'), orderData);
      setCartItems([]);
      setShowConfirm(false);
      onNavigate('Orders');
    } catch (e) {
      console.error(e);
      alert("Failed to place order");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col w-full h-full items-center justify-center p-4 animate-in fade-in pt-32">
        <ShoppingCart size={64} className="text-gray-300 mb-4" />
        <h2 className="text-xl text-gray-500 font-medium">Your cart is empty</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full p-4 h-full relative animate-in fade-in">
      <div className="bg-[#FFF9E6] rounded-xl p-3 flex mb-4">
        <MapPin size={20} className="text-[#FFC107] shrink-0 mr-2 mt-0.5" />
        <div>
          <span className="font-bold text-sm text-dark-bg block mb-1">Delivering to:</span>
          <span className="text-xs text-gray-600 line-clamp-2">{savedAddress || "No address provided! Please update your Profile settings."}</span>
        </div>
      </div>
      
      <div className="space-y-3 flex-1 overflow-y-auto pb-48">
        {cartItems.map((item: any, index:number) => (
          <div key={`${item.product.id}-${index}`} className="bg-white rounded-xl p-3 flex items-center shadow-sm border border-gray-100">
            <img src={item.product.imageUrl || item.product.image || "https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?auto=format&fit=crop&q=80&w=300"} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover bg-gray-50 mr-3 shrink-0" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?auto=format&fit=crop&q=80&w=300"; }} />
            <div className="flex flex-col flex-1">
              <span className="font-bold text-sm text-dark-bg line-clamp-1 mb-1">{item.product.name}</span>
              <span className="text-xs text-gray-500 font-medium">₹{item.product.price}</span>
            </div>
            <div className="flex items-center bg-gray-50 rounded-lg h-8 px-1 ml-2 border border-gray-100 shrink-0">
              <button onClick={() => decrementCart(item.product)} className="w-7 h-full flex items-center justify-center"><Minus size={14} className="text-dark-bg" /></button>
              <span className="font-bold text-dark-bg text-sm px-1 min-w-[20px] text-center">{item.quantity}</span>
              <button onClick={() => incrementCart(item.product)} className="w-7 h-full flex items-center justify-center"><Plus size={14} className="text-dark-bg" /></button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 absolute bottom-0 left-0 right-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-3xl border-t border-gray-100 z-10 pb-24">
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-lg text-dark-bg">Items Total</span>
          <span className="font-bold text-lg text-dark-bg">₹{total}</span>
        </div>
        <span className="text-xs text-gray-500 block mb-4">+ Delivery charge calculated at next step</span>
        <button onClick={() => setShowConfirm(true)} className="w-full bg-brand-yellow text-dark-bg font-bold py-3.5 rounded-xl shadow-sm text-base">
          Checkout & Request Delivery Quote
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-lg mb-4">Confirm Delivery Request</h3>
            <div className="space-y-3 mb-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="radio" name="delivery" checked={deliveryType === 'Instant delivery'} onChange={() => setDeliveryType('Instant delivery')} className="w-4 h-4 text-brand-yellow focus:ring-brand-yellow" />
                <span className="text-sm font-medium">⚡ Instant delivery</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="radio" name="delivery" checked={deliveryType === '1 day delivery'} onChange={() => setDeliveryType('1 day delivery')} className="w-4 h-4 text-brand-yellow focus:ring-brand-yellow" />
                <span className="text-sm font-medium">📦 1 day delivery</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="radio" name="delivery" checked={deliveryType === '1 week delivery'} onChange={() => setDeliveryType('1 week delivery')} className="w-4 h-4 text-brand-yellow focus:ring-brand-yellow" />
                <span className="text-sm font-medium">🚚 1 week delivery</span>
              </label>
            </div>
            <p className="text-xs text-gray-500 mb-6">Our manager will review your location and calculate the delivery charge. You can complete the payment after the final bill is generated.</p>
            <div className="flex space-x-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium">Cancel</button>
              <button onClick={handleCheckout} className="flex-1 py-2.5 rounded-lg bg-brand-yellow text-dark-bg font-bold">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OrdersScreen({ orders }: any) {
  const activeOrders = orders.filter((order: any) => order.status !== "Delivered" && order.status !== "Cancelled");

  const getTrackingProgress = (status: string) => {
    switch (status) {
        case "Pending Approval": case "Awaiting Payment": case "Bill Sent": return 10;
        case "Confirmed": case "Packed": return 30;
        case "Accepted": case "Processing": case "Ready for Delivery": case "Accepted by Delivery Boy": return 60;
        case "Out for Delivery": return 90;
        case "Delivered": return 100;
        default: return 0;
    }
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto p-4 animate-in fade-in bg-white min-h-full">
      {activeOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-gray-500 mt-20">
          <Store size={48} className="text-gray-300 mb-4" />
          <p className="text-lg font-medium text-dark-bg mb-2">No active orders</p>
          <p className="text-sm text-center">You have no active orders right now. Check your history to see past orders.</p>
        </div>
      ) : (
        <div className="space-y-6 pb-6 mt-2">
          {activeOrders.map((order: any, index:number) => {
            const total = (order.total || 0) + (order.deliveryFee || 0);
            return (
              <div key={`${order.id}-${index}`} className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] p-5 border border-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-bold text-dark-bg text-sm">Order ID: {order.id.slice(0, 8)}...</span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {order.date || '2026-07-29 12:47'}
                  </span>
                </div>
                
                <div className="w-full relative bg-blue-50 rounded-lg h-32 flex items-center justify-center overflow-hidden mb-3">
                    {/* Faded Map Background */}
                    <Map className="absolute w-full h-full p-4 text-gray-300 opacity-50" />
                    
                    <div className="z-10 flex flex-col items-center">
                        {order.status === "Out for Delivery" ? (
                            <>
                                <Bike className="w-12 h-12 text-pink-500" />
                                <span className="font-bold text-pink-500 mt-1">Rider is on the way</span>
                            </>
                        ) : order.status === "Delivered" ? (
                            <>
                                <CheckCircle className="w-12 h-12 text-green-500" />
                                <span className="font-bold text-green-500 mt-1">Delivered</span>
                            </>
                        ) : (
                            <>
                                <Store className="w-12 h-12 text-blue-500" />
                                <span className="font-bold text-blue-500 mt-1">Processing at Store</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${getTrackingProgress(order.status)}%` }}
                    ></div>
                </div>

                <div className="flex items-center mb-4">
                  <div className={`w-1.5 h-1.5 rounded-full mr-2 ${order.status === 'Out for Delivery' ? 'bg-pink-500' : 'bg-blue-500'}`}></div>
                  <span className={`text-xs font-bold ${order.status === 'Out for Delivery' ? 'text-pink-600' : 'text-blue-600'}`}>{order.status || 'Processing'}</span>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items && order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-xs text-gray-600">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="font-bold text-dark-bg">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-xs text-gray-400 pt-1">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-dark-bg">₹{order.deliveryFee || 30.0}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="font-bold text-dark-bg text-sm">Total Bill: ₹{total.toFixed(1)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function OrderHistoryScreen({ orders, onNavigate }: any) {
  const pastOrders = orders.filter((order: any) => order.status === "Delivered" || order.status === "Cancelled");

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto p-4 animate-in fade-in bg-white min-h-full">
      <div className="flex items-center mb-6 cursor-pointer" onClick={() => onNavigate('Profile')}>
        <ArrowLeft size={24} className="text-dark-bg mr-3" />
        <h2 className="text-xl font-bold text-dark-bg">Order History</h2>
      </div>

      {pastOrders.length === 0 ? (
        <div className="flex items-center justify-center p-8 text-gray-500">No past orders.</div>
      ) : (
        <div className="space-y-4 pb-6 mt-2">
          {pastOrders.map((order: any, index:number) => {
            const total = (order.total || 0) + (order.deliveryFee || 0);
            return (
              <div key={`${order.id}-${index}`} className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] p-5 border border-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-bold text-dark-bg text-sm">Order ID: {order.id.slice(0, 8)}...</span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {order.date || '2026-07-29 12:47'}
                  </span>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className={`w-1.5 h-1.5 rounded-full mr-2 ${order.status === 'Cancelled' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                  <span className={`text-xs font-bold ${order.status === 'Cancelled' ? 'text-red-600' : 'text-green-600'}`}>{order.status || 'Delivered'}</span>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items && order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-xs text-gray-600">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="font-bold text-dark-bg">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-xs text-gray-400 pt-1">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-dark-bg">₹{order.deliveryFee || 30.0}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="font-bold text-dark-bg text-sm">Total Bill: ₹{total.toFixed(1)}</span>
                  <button className="text-[#FFC107] font-bold text-xs">
                    Leave Feedback
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FavoritesScreen({ products, onNavigate, favorites, cartItems, toggleFavorite, incrementCart, decrementCart }: any) {
  const favoriteProducts = products.filter((p:any) => favorites.includes(p.id));
  return (
    <div className="flex flex-col w-full p-4 animate-in fade-in">
      <div className="flex items-center mb-6 cursor-pointer" onClick={() => onNavigate('Home')}>
        <ArrowLeft size={24} className="text-dark-bg mr-3" />
        <h2 className="text-xl font-bold text-dark-bg">My Favorites</h2>
      </div>
      {favoriteProducts.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-400 mt-20">You haven't saved any favorites yet.</div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5 pb-6">
          {favoriteProducts.map((product:any, index:number) => (
            <ProductCard onProductClick={(p: any) => onNavigate(`Product_${p.id}`)} key={`${product.id}-${index}`} product={product} cartQuantity={cartItems.find((i:any) => i.product.id === product.id)?.quantity || 0} isFavorite={true} onToggleFavorite={() => toggleFavorite(product.id)} onIncrement={() => incrementCart(product)} onDecrement={() => decrementCart(product)} />
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationsScreen({ notifications, onNavigate }: any) {
  return (
    <div className="flex flex-col w-full p-4 animate-in fade-in">
      <div className="flex items-center mb-6 cursor-pointer" onClick={() => onNavigate('Home')}>
        <ArrowLeft size={24} className="text-dark-bg mr-3" />
        <h2 className="text-xl font-bold text-dark-bg">Notifications</h2>
      </div>
      {(!notifications || notifications.length === 0) ? (
        <div className="flex-1 flex items-center justify-center text-gray-400 mt-20">No new notifications</div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif:any, index:number) => (
            <div key={`${notif.id}-${index}`} className={`p-4 rounded-xl border ${notif.isRead ? 'bg-white border-gray-100' : 'bg-[#FFF9E6] border-yellow-200'}`}>
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-dark-bg text-sm">{notif.title}</h4>
                {!notif.isRead && <span className="w-2 h-2 rounded-full bg-red-500 mt-1"></span>}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-2">{notif.message}</p>
              <span className="text-[10px] text-gray-400">{new Date(notif.timestamp).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileScreen({ savedAddress, savedPhone, onNavigate }: any) {
  const user = auth?.currentUser;
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState(savedPhone);
  const [address, setAddress] = useState(savedAddress);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user || !db) return;
    setLoading(true);
    try {
      if (name !== user.displayName) {
        await updateProfile(user, { displayName: name });
      }
      await setDoc(doc(db, 'users', user.uid), {
        name,
        whatsappNumber: phone,
        address,
        email: user.email
      }, { merge: true });
      alert("Settings saved successfully!");
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      alert("Error saving settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full p-4 items-center animate-in fade-in pb-24 max-w-2xl w-full mx-auto">
      {!isEditing ? (
        <div className="flex flex-col items-center text-center w-full">
          <div className="w-24 h-24 bg-dark-bg text-[#FFC107] rounded-full flex items-center justify-center text-4xl font-bold mb-6 shadow-md">
            {name ? name.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase() || 'U')}
          </div>
          <h2 className="text-2xl font-bold text-dark-bg">{name || "No Name Provided"}</h2>
          <p className="text-gray-500 mt-1">{user?.email || "No Email Provided"}</p>
          <p className="text-gray-600 mt-2 text-sm font-medium">WhatsApp: {phone || "N/A"}</p>
          <p className="text-gray-600 mt-1 text-sm font-medium">Address: {address || "N/A"}</p>
          
          <button 
            onClick={() => setIsEditing(true)}
            className="mt-6 w-full bg-brand-yellow text-dark-bg font-bold py-3 rounded-lg shadow-sm"
          >
            Edit Profile
          </button>

          <button 
            onClick={() => onNavigate('OrderHistory')}
            className="mt-4 w-full bg-white border border-gray-200 text-dark-bg font-bold py-3 rounded-lg flex items-center justify-center shadow-sm"
          >
            <History size={18} className="mr-2" />
            View Order History
          </button>

          <button 
            onClick={() => signOut(auth)}
            className="mt-8 w-full border-2 border-red-500 text-red-500 font-bold py-3 rounded-lg bg-transparent"
          >
            Logout
          </button>

          <button 
            onClick={seedDatabase}
            className="w-full mt-4 border-2 border-gray-300 text-gray-500 font-bold py-3 rounded-lg bg-transparent"
          >
            Seed Database (Dev Only)
          </button>
        </div>
      ) : (
        <form onSubmit={handleSave} className="flex flex-col space-y-4 w-full">
          <div className="w-24 h-24 bg-dark-bg text-[#FFC107] rounded-full flex items-center justify-center text-4xl font-bold mb-6 mx-auto shadow-md">
            {name ? name.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase() || 'U')}
          </div>
          <input className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-dark-bg outline-none" placeholder="Name *" value={name} onChange={e => setName(e.target.value)} required />
          <input className="w-full border border-gray-300 rounded-lg p-3 text-sm bg-gray-50 text-gray-500 outline-none" type="email" placeholder="Email *" value={user?.email || ""} disabled />
          <input className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-dark-bg outline-none" placeholder="WhatsApp Number" value={phone} onChange={e => setPhone(e.target.value)} />
          <textarea className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-dark-bg outline-none resize-none" placeholder="Full Delivery Address *" rows={2} value={address} onChange={e => setAddress(e.target.value)} required></textarea>
          
          <div className="flex space-x-4 mt-4">
            <button type="button" onClick={() => setIsEditing(false)} className="flex-1 border border-gray-300 py-3 rounded-lg font-bold text-gray-600">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-brand-yellow text-dark-bg py-3 rounded-lg font-bold">
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// --- Shared Components ---

function ProductCard({ product, cartQuantity, isFavorite, onToggleFavorite, onIncrement, onDecrement, onProductClick }: any) {
  return (
    <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col h-[200px] md:h-[250px] border border-gray-100 transition-shadow relative">
      <div className="relative h-[100px] md:h-[130px] w-full shrink-0 p-3 flex items-center justify-center border-b border-gray-50 cursor-pointer" onClick={() => onProductClick && onProductClick(product)}>
        <img src={product.imageUrl || product.image || "https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?auto=format&fit=crop&q=80&w=300"} alt={product.name} className="w-full h-full object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?auto=format&fit=crop&q=80&w=300"; }} />
      </div>
      <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }} className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm z-10 border border-gray-100">
        <Heart size={14} className={isFavorite ? "fill-[#FFC107] text-[#FFC107]" : "text-gray-400"} />
      </button>
      <div className="p-2 md:p-3 flex flex-col flex-1 justify-between">
        <div onClick={() => onProductClick && onProductClick(product)} className="cursor-pointer">
          <h3 className="font-bold text-dark-bg text-[11px] md:text-sm line-clamp-1 mb-1">{product.name}</h3>
          <span className="inline-block text-[9px] md:text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-sm mb-1">{product.category}</span>
        </div>
        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="font-bold text-xs md:text-sm text-dark-bg">₹{product.price.toFixed(1)}</span>
          {cartQuantity > 0 ? (
            <div className="flex items-center bg-brand-yellow/20 rounded-md border border-brand-yellow/30">
              <button onClick={(e) => { e.stopPropagation(); onDecrement(product); }} className="w-6 h-6 flex items-center justify-center text-dark-bg font-bold">-</button>
              <span className="w-5 text-center text-[10px] md:text-xs font-bold text-dark-bg">{cartQuantity}</span>
              <button onClick={(e) => { e.stopPropagation(); onIncrement(product); }} className="w-6 h-6 flex items-center justify-center text-dark-bg font-bold">+</button>
            </div>
          ) : (
            <button onClick={(e) => { e.stopPropagation(); onIncrement(product); }} className="bg-white border border-brand-yellow text-brand-yellow text-[10px] md:text-[11px] font-bold px-3 py-1 rounded-md shadow-sm">
              ADD
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
