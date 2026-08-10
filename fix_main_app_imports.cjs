const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

if (!content.includes('import { HomeScreen, CartScreen')) {
    content = content.replace(
        'import AuthScreen from "./AuthScreen";',
        'import AuthScreen from "./AuthScreen";\nimport { HomeScreen, CartScreen, CategoriesScreen, FavoritesScreen, ProductDetailsScreen, CategoryScreen } from "./Screens";'
    );
}

const renderReplacement = `{selectedItem === 'Home' && <HomeScreen searchQuery={searchQuery} setSearchQuery={setSearchQuery} onNavigate={handleNavigate} products={products} categories={categories} banners={banners} favorites={favorites} cartItems={cartItems} incrementCart={incrementCart} decrementCart={decrementCart} storeSettings={storeSettings} />}
             {selectedItem === 'Cart' && <CartScreen cartItems={cartItems} setCartItems={setCartItems} incrementCart={incrementCart} decrementCart={decrementCart} onNavigate={handleNavigate} storeSettings={storeSettings} />}
             {selectedItem === 'Categories' && <CategoriesScreen categories={categories} onNavigate={handleNavigate} />}
             {selectedItem === 'Favorites' && <FavoritesScreen favorites={favorites} products={products} onNavigate={handleNavigate} />}
             {selectedItem.startsWith('Product_') && <ProductDetailsScreen productId={selectedItem.replace('Product_', '')} products={products} onNavigate={handleNavigate} incrementCart={incrementCart} />}
             {selectedItem.startsWith('Category_') && <CategoryScreen categoryId={selectedItem.replace('Category_', '')} products={products} categories={categories} onNavigate={handleNavigate} incrementCart={incrementCart} />}`;

content = content.replace(
    /\{selectedItem === 'Home'.*?\{selectedItem === 'Favorites' &&.*?<\/div>\}/s,
    renderReplacement
);

fs.writeFileSync('src/components/MainAppScreen.tsx', content);
console.log("Imports and renders fixed!");
