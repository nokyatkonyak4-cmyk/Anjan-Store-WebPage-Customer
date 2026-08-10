const fs = require('fs');

let mainContent = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');
let screensContent = fs.readFileSync('src/components/Screens.tsx', 'utf8');

// Extract ProductCard from MainAppScreen
const productCardRegex = /function ProductCard\(\{[\s\S]*?return \([\s\S]*?\}\s*\)\s*;\s*\}/;
const match = mainContent.match(productCardRegex);

if (match) {
    const productCardCode = match[0];
    
    // Remove from MainAppScreen
    mainContent = mainContent.replace(productCardCode, '');
    fs.writeFileSync('src/components/MainAppScreen.tsx', mainContent);
    
    // Add to Screens.tsx
    // Also export it just in case
    const exportedProductCard = productCardCode.replace('function ProductCard', 'export function ProductCard');
    
    // Append to Screens.tsx
    screensContent += '\n\n' + exportedProductCard;
    fs.writeFileSync('src/components/Screens.tsx', screensContent);
    console.log("Moved ProductCard to Screens.tsx!");
} else {
    console.log("ProductCard not found.");
}
