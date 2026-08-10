const fs = require('fs');

let mainContent = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

const pcRegex = /export function ProductCard\(\{\s*product,\s*cartQuantity,\s*isFavorite,\s*onToggleFavorite,\s*onIncrement,\s*onDecrement,\s*onProductClick,\s*\}: any\) \{[\s\S]*?\}\s*<\/\div>\s*\)\s*;\s*\}/;

const match = mainContent.match(pcRegex);

if (match) {
    let pcCode = match[0];
    mainContent = mainContent.replace(pcCode, '');
    fs.writeFileSync('src/components/MainAppScreen.tsx', mainContent);
    
    let screensContent = fs.readFileSync('src/components/Screens.tsx', 'utf8');
    screensContent += '\n\n' + pcCode;
    fs.writeFileSync('src/components/Screens.tsx', screensContent);
    console.log("Moved ProductCard to Screens.tsx");
} else {
    console.log("Not found regex");
}
