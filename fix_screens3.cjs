const fs = require('fs');

let content = fs.readFileSync('src/components/Screens.tsx', 'utf8');

const startIndexF = content.indexOf('export function FavoritesScreen({');
const endIndexStrF = '    );\n}';
const endIndexF = content.indexOf(endIndexStrF, startIndexF) + endIndexStrF.length;

const newFavoritesScreen = `export function FavoritesScreen({ favorites, products, onNavigate, cartItems, toggleFavorite, incrementCart, decrementCart }: any) {
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
                            onProductClick={() => onNavigate(\`Product_\${prod.id}\`)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}`;

content = content.substring(0, startIndexF) + newFavoritesScreen + content.substring(endIndexF);


const startIndexC = content.indexOf('export function CategoryScreen({');
const endIndexStrC = '    );\n}';
const endIndexC = content.indexOf(endIndexStrC, startIndexC) + endIndexStrC.length;

const newCategoryScreen = `export function CategoryScreen({ categoryId, products, categories, onNavigate, cartItems, favorites, toggleFavorite, incrementCart, decrementCart }: any) {
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
                        onProductClick={() => onNavigate(\`Product_\${prod.id}\`)}
                    />
                ))}
            </div>
        </div>
    );
}`;

content = content.substring(0, startIndexC) + newCategoryScreen + content.substring(endIndexC);

fs.writeFileSync('src/components/Screens.tsx', content);
console.log("Updated both!");
