const fs = require('fs');

let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

content = content.replace(
    "<FavoritesScreen favorites={favorites} products={products} onNavigate={handleNavigate} />",
    "<FavoritesScreen favorites={favorites} products={products} onNavigate={handleNavigate} cartItems={cartItems} toggleFavorite={toggleFavorite} incrementCart={incrementCart} decrementCart={decrementCart} />"
);

content = content.replace(
    "<CategoryScreen categoryId={selectedItem.replace('Category_', '')} products={products} categories={categories} onNavigate={handleNavigate} incrementCart={incrementCart} />",
    "<CategoryScreen categoryId={selectedItem.replace('Category_', '')} products={products} categories={categories} onNavigate={handleNavigate} cartItems={cartItems} favorites={favorites} toggleFavorite={toggleFavorite} incrementCart={incrementCart} decrementCart={decrementCart} />"
);

fs.writeFileSync('src/components/MainAppScreen.tsx', content);
console.log("Updated props in MainAppScreen!");
