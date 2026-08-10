const fs = require('fs');

let screensContent = fs.readFileSync('src/components/Screens.tsx', 'utf8');
screensContent = screensContent.replace(/navigate\('\/static_page\/about'\)/g, "navigate('/static_page/about-us')");
screensContent = screensContent.replace(/navigate\('\/static_page\/privacy'\)/g, "navigate('/static_page/privacy-policy')");
screensContent = screensContent.replace(/navigate\('\/static_page\/terms'\)/g, "navigate('/static_page/terms-conditions')");
fs.writeFileSync('src/components/Screens.tsx', screensContent);

let mainContent = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');
mainContent = mainContent.replace(/navigate\('\/static_page\/about'\)/g, "navigate('/static_page/about-us')");
mainContent = mainContent.replace(/navigate\('\/static_page\/privacy'\)/g, "navigate('/static_page/privacy-policy')");
mainContent = mainContent.replace(/navigate\('\/static_page\/terms'\)/g, "navigate('/static_page/terms-conditions')");
mainContent = mainContent.replace(/navigate\('\/static_page\/faq'\)/g, "navigate('/static_page/frequently-asked-questions')");
mainContent = mainContent.replace(/navigate\('\/static_page\/shipping'\)/g, "navigate('/static_page/shipping-delivery-policy')");
fs.writeFileSync('src/components/MainAppScreen.tsx', mainContent);

console.log("Updated links to use correct document IDs.");
