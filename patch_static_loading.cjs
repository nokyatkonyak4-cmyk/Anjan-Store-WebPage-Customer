const fs = require('fs');
let content = fs.readFileSync('src/components/StaticPageScreen.tsx', 'utf8');

content = content.replace('const [isLoading, setIsLoading] = useState(true);', 'const [isLoading, setIsLoading] = useState(false);');

// Remove the setIsLoading(true) inside fetchPageData
content = content.replace('setIsLoading(true);', '// setIsLoading(true);');

fs.writeFileSync('src/components/StaticPageScreen.tsx', content);
