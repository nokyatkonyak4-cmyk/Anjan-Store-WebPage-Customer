import React, { useState } from 'react';
import { Search, ShoppingCart, Heart, ArrowLeft, Star, Plus, Minus } from 'lucide-react';
import { motion } from 'motion/react';
import BannerSlider from './BannerSlider';

export function HomeScreen({ searchQuery, setSearchQuery, onNavigate, products, categories, banners, favorites, cartItems, toggleFavorite, incrementCart, decrementCart, storeSettings }: any) {
    const featuredProducts = products.slice(0, 10);
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
                                <img src={cat.imageUrl || "/AppIcon-512x512.png"} alt={cat.name} className="w-full h-full object-contain" />
                            </div>
                            <span className="text-xs font-medium text-center">{cat.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-lg font-bold text-dark-bg mb-4">Featured Products</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {featuredProducts.map((prod: any) => (
                        <div key={prod.id} className="bg-white rounded-xl shadow-sm p-3 flex flex-col relative cursor-pointer" onClick={() => onNavigate(`Product_${prod.id}`)}>
                            <img src={prod.imageUrls?.[0] || prod.imageUrl || "/AppIcon-512x512.png"} alt={prod.name} className="w-full h-32 object-contain mb-2" />
                            <h3 className="text-sm font-bold truncate">{prod.name}</h3>
                            <span className="text-xs text-gray-500 mb-2 truncate">{prod.category}</span>
                            <div className="flex justify-between items-center mt-auto">
                                <span className="font-bold text-dark-bg">₹{prod.price}</span>
                                <button onClick={(e) => { e.stopPropagation(); incrementCart(prod); }} className="bg-brand-yellow text-dark-bg rounded-full p-1.5 shadow-sm transition-all active:scale-95 hover:opacity-90">
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function CartScreen({ cartItems, setCartItems, incrementCart, decrementCart, onNavigate, storeSettings }: any) {
    const total = cartItems.reduce((acc: number, item: any) => acc + (item.product.price * item.quantity), 0);
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
                                <img src={item.product.imageUrls?.[0] || item.product.imageUrl || "/AppIcon-512x512.png"} className="w-16 h-16 object-contain bg-gray-50 rounded-lg" />
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
                        <button className="w-full bg-brand-yellow text-dark-bg py-3 rounded-full font-bold shadow-md transition-all active:scale-95 hover:opacity-90">Checkout</button>
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
                        <img src={cat.imageUrl || "/AppIcon-512x512.png"} className="w-16 h-16 object-contain mb-3" />
                        <h3 className="font-bold text-center text-sm">{cat.name}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function FavoritesScreen({ favorites, products, onNavigate }: any) {
    const favProducts = products.filter((p: any) => favorites.includes(p.id));
    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-6">Favorites</h2>
            {favProducts.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">No favorites yet</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {favProducts.map((prod: any) => (
                        <div key={prod.id} className="bg-white rounded-xl shadow-sm p-3 flex flex-col cursor-pointer" onClick={() => onNavigate(`Product_${prod.id}`)}>
                            <img src={prod.imageUrls?.[0] || prod.imageUrl || "/AppIcon-512x512.png"} className="w-full h-32 object-contain mb-2" />
                            <h3 className="text-sm font-bold truncate">{prod.name}</h3>
                            <span className="font-bold text-dark-bg mt-auto">₹{prod.price}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export function ProductDetailsScreen({ productId, products, onNavigate, incrementCart }: any) {
    const product = products.find((p: any) => p.id === productId);
    if (!product) return <div>Product not found</div>;
    return (
        <div className="bg-white min-h-screen">
            <div className="relative">
                <button onClick={() => onNavigate("Back")} className="absolute top-4 left-4 z-10 bg-white/80 p-2 rounded-full shadow-md transition-all active:scale-95 hover:opacity-90"><ArrowLeft size={20}/></button>
                <img src={product.imageUrls?.[0] || product.imageUrl || "/AppIcon-512x512.png"} className="w-full h-[300px] object-contain bg-gray-50" />
            </div>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                <p className="text-brand-yellow font-bold text-xl mb-4">₹{product.price}</p>
                <p className="text-gray-600 mb-8">{product.description || "No description available."}</p>
                <button onClick={() => incrementCart(product)} className="w-full bg-brand-yellow text-dark-bg py-4 rounded-full font-bold text-lg shadow-md flex items-center justify-center transition-all active:scale-95 hover:opacity-90">
                    <ShoppingCart size={20} className="mr-2" /> Add to Cart
                </button>
            </div>
        </div>
    );
}

export function CategoryScreen({ categoryId, products, categories, onNavigate, incrementCart }: any) {
    const category = categories.find((c: any) => c.id === categoryId);
    const catProducts = products.filter((p: any) => p.category === category?.name || p.categoryId === categoryId);
    return (
        <div className="p-4">
            <div className="flex items-center mb-6">
                <button onClick={() => onNavigate("Categories")} className="mr-4"><ArrowLeft size={24}/></button>
                <h2 className="text-xl font-bold">{category?.name || "Category"}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {catProducts.map((prod: any) => (
                    <div key={prod.id} className="bg-white rounded-xl shadow-sm p-3 flex flex-col cursor-pointer" onClick={() => onNavigate(`Product_${prod.id}`)}>
                        <img src={prod.imageUrls?.[0] || prod.imageUrl || "/AppIcon-512x512.png"} className="w-full h-32 object-contain mb-2" />
                        <h3 className="text-sm font-bold truncate">{prod.name}</h3>
                        <div className="flex justify-between items-center mt-auto">
                            <span className="font-bold text-dark-bg">₹{prod.price}</span>
                            <button onClick={(e) => { e.stopPropagation(); incrementCart(prod); }} className="bg-brand-yellow p-1.5 rounded-full transition-all active:scale-95 hover:opacity-90"><Plus size={16}/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
