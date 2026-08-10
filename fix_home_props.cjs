const fs = require('fs');

let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

content = content.replace(
    "storeSettings={storeSettings} />}",
    "storeSettings={storeSettings} toggleFavorite={toggleFavorite} />}"
);

fs.writeFileSync('src/components/MainAppScreen.tsx', content);
console.log("Updated HomeScreen props");
