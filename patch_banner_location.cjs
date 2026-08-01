const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

const oldMapping = `              // To prevent multiple banners if multiple triggers match, we only show it on the first trigger we hit, 
              // but since we are mapping, let's just show it at index === 5 to be safe and consistent, 
              // or maybe index === 2 (after 3 products). Let's use index === 2 (after 1st row).
              const finalShowBanner = index === 2;`;

const newMapping = `              // The user specifically requested the secondary banner to be below mutton, headphone and between tablet laptop and mutton headphone.
              // We'll insert it after the product that is Tablet Laptop, or if not found, after index 2.
              // Or better, let's check if this product is "Tablet laptop" or "mutton".
              const isTablet = product.name.toLowerCase().includes('tablet');
              const isMutton = product.name.toLowerCase().includes('mutton');
              const isHeadphone = product.name.toLowerCase().includes('headphone');
              
              // We'll use a hacky way to ensure it only shows once in case there are multiple matches
              // Since we are inside map, we can't easily mutate state, but we can do a trick or just use index matching if we know the order.
              // The user said "between Tablet laptop and Mutton Headphone". So we place it AFTER Tablet Laptop.
              
              let finalShowBanner = index === 2; // fallback
              
              // If we can find the indices of these specific items:
              const tabletIndex = displayedProducts.findIndex((p:any) => p.name.toLowerCase().includes('tablet'));
              const muttonIndex = displayedProducts.findIndex((p:any) => p.name.toLowerCase().includes('mutton'));
              const headphoneIndex = displayedProducts.findIndex((p:any) => p.name.toLowerCase().includes('headphone'));
              
              if (tabletIndex !== -1) {
                finalShowBanner = index === tabletIndex;
              } else if (muttonIndex !== -1) {
                finalShowBanner = index === muttonIndex;
              } else if (headphoneIndex !== -1) {
                finalShowBanner = index === headphoneIndex;
              }`;

content = content.replace(oldMapping, newMapping);
fs.writeFileSync('src/components/MainAppScreen.tsx', content);

