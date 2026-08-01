const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

const oldMapping = `              // The user specifically requested the secondary banner to be below mutton, headphone and between tablet laptop and mutton headphone.
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

const newMapping = `              // Position the secondary banner between "Tablet laptop" and "Mutton Headphone".
              // We will show it right after "Tablet laptop" if it exists, or before "Mutton Headphone".
              let finalShowBanner = false;
              
              const tabletIndex = displayedProducts.findIndex((p:any) => p.name.toLowerCase().includes('tablet'));
              const muttonHeadphoneIndex = displayedProducts.findIndex((p:any) => p.name.toLowerCase().includes('mutton') || p.name.toLowerCase().includes('headphone'));
              
              if (tabletIndex !== -1 && muttonHeadphoneIndex !== -1) {
                // Determine which one comes first, we want to place it between them. 
                // So if Tablet is first, we place after Tablet.
                const firstIndex = Math.min(tabletIndex, muttonHeadphoneIndex);
                finalShowBanner = index === firstIndex;
              } else if (tabletIndex !== -1) {
                finalShowBanner = index === tabletIndex;
              } else if (muttonHeadphoneIndex !== -1) {
                finalShowBanner = index === muttonHeadphoneIndex;
              } else {
                finalShowBanner = index === 2; // Default to after 3rd item if none found
              }`;

content = content.replace(oldMapping, newMapping);
fs.writeFileSync('src/components/MainAppScreen.tsx', content);

