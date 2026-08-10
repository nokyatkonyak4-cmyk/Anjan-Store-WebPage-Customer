const fs = require('fs');

let content = fs.readFileSync('src/components/Screens.tsx', 'utf8');

// Add import
if (!content.includes('useNavigate')) {
    content = content.replace("import { motion } from 'motion/react';", "import { motion } from 'motion/react';\nimport { useNavigate } from 'react-router-dom';");
}

const footerCode = `
export function Footer() {
    const navigate = useNavigate();
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-8 mb-4 flex flex-col items-center justify-center space-y-4">
            <h3 className="font-bold text-lg text-dark-bg">Anjan Store</h3>
            <p className="text-sm text-gray-500 text-center max-w-sm">Making your everyday life easier with the best products and fast delivery.</p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
                <button onClick={() => navigate('/customer-support')} className="text-gray-600 hover:text-brand-yellow transition">Contact Us</button>
                <button onClick={() => navigate('/static_page/about')} className="text-gray-600 hover:text-brand-yellow transition">About Us</button>
                <button onClick={() => navigate('/static_page/privacy')} className="text-gray-600 hover:text-brand-yellow transition">Privacy Policy</button>
                <button onClick={() => navigate('/static_page/terms')} className="text-gray-600 hover:text-brand-yellow transition">Terms & Conditions</button>
            </div>
            
            <div className="pt-4 border-t border-gray-100 w-full text-center">
                <p className="text-xs text-gray-400">
                    &copy; {new Date().getFullYear()} Anjan Store. All rights reserved.
                </p>
                <p className="text-[10px] text-gray-300 mt-1 font-mono tracking-widest uppercase">
                    Developed by Nokyat Konyak
                </p>
            </div>
        </div>
    );
}
`;

content += "\n" + footerCode;

fs.writeFileSync('src/components/Screens.tsx', content);
console.log("Added Footer component to Screens.tsx");
