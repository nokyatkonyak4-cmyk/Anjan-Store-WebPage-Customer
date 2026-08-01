const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

const oldHomeDef = `function HomeScreen({ searchQuery, onNavigate, products, categories, banners, favorites, cartItems, toggleFavorite, incrementCart, decrementCart }: any) {`;

const newHomeDef = `function HomeScreen({ searchQuery, onNavigate, products, categories, banners, favorites, cartItems, toggleFavorite, incrementCart, decrementCart }: any) {
  const navigate = useNavigate();`;

content = content.replace(oldHomeDef, newHomeDef);
fs.writeFileSync('src/components/MainAppScreen.tsx', content);
