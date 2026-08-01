const fs = require('fs');
const filesToPatch = [
  'src/components/MainAppScreen.tsx',
  'src/components/SecondaryBannerSlider.tsx',
  'src/components/DigitalBillScreen.tsx'
];

for (const file of filesToPatch) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Patch key={item.title} to key={`${item.title}-\${index}`} etc.
  // Actually, standard regex replace for key={something.id} -> key={\`\${something.id}-\${index}\`}
  
  // MainAppScreen
  content = content.replace(/key=\{cat\.id\}/g, 'key={`${cat.id}-${index}`}');
  content = content.replace(/\{categories\.map\(\(cat:any\) => \(/g, '{categories.map((cat:any, index:number) => (');
  content = content.replace(/\{filtered\.map\(\(cat:any\) => \(/g, '{filtered.map((cat:any, index:number) => (');

  content = content.replace(/key=\{product\.id\}/g, 'key={`${product.id}-${index}`}');
  content = content.replace(/\{displayedProducts\.map\(\(product:any\) => \(/g, '{displayedProducts.map((product:any, index:number) => (');
  content = content.replace(/\{catProducts\.map\(\(product:any\) => \(/g, '{catProducts.map((product:any, index:number) => (');
  content = content.replace(/\{favoriteProducts\.map\(\(product:any\) => \(/g, '{favoriteProducts.map((product:any, index:number) => (');

  content = content.replace(/key=\{item\.product\.id\}/g, 'key={`${item.product.id}-${index}`}');
  content = content.replace(/\{cartItems\.map\(\(item: any\) => \(/g, '{cartItems.map((item: any, index:number) => (');

  content = content.replace(/key=\{order\.id\}/g, 'key={`${order.id}-${index}`}');
  content = content.replace(/\{orders\.map\(\(order: any\) => \(/g, '{orders.map((order: any, index:number) => (');

  content = content.replace(/key=\{notif\.id\}/g, 'key={`${notif.id}-${index}`}');
  content = content.replace(/\{notifications\.map\(\(notif:any\) => \(/g, '{notifications.map((notif:any, index:number) => (');

  content = content.replace(/key=\{item\.title\}/g, 'key={`${item.title}-${index}`}');
  content = content.replace(/\{bottomNavItems\.map\(\(item\) => \{/g, '{bottomNavItems.map((item, index) => {');

  // SecondaryBannerSlider
  content = content.replace(/key=\{slide\.id\}/g, 'key={`${slide.id}-${index}`}');
  content = content.replace(/\{slides\.map\(\(slide\) => \{/g, '{slides.map((slide, index) => {');

  fs.writeFileSync(file, content);
}
