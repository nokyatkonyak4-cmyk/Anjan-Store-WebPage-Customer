const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

content = content.replace(/alert\("Settings saved successfully!"\);/g, 'toast.success("Settings saved successfully!");');
content = content.replace(/alert\("Error saving settings"\);/g, 'toast.error("Error saving settings");');
content = content.replace(/alert\("Geolocation is not supported by your browser"\);/g, 'toast.error("Geolocation is not supported by your browser");');
content = content.replace(/alert\("Could not fetch address details\."\);/g, 'toast.error("Could not fetch address details.");');
content = content.replace(/alert\("Error fetching address\."\);/g, 'toast.error("Error fetching address.");');
content = content.replace(/alert\("Unable to retrieve your location"\);/g, 'toast.error("Unable to retrieve your location");');
content = content.replace(/alert\("Failed to upload image\. Please try again\."\);/g, 'toast.error("Failed to upload image. Please try again.");');

fs.writeFileSync('src/components/MainAppScreen.tsx', content);
console.log("All alerts replaced with toast!");
