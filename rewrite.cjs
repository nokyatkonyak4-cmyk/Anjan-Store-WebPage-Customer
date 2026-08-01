const fs = require('fs');

const bannerContent = `import React, { useState, useEffect } from 'react';

interface Props {
  slides: { id: string; imageUrl: string; link?: string; title?: string }[];
  autoSlideInterval?: number;
}

export default function BannerSlider({ slides, autoSlideInterval = 5000 }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, autoSlideInterval);
    return () => clearInterval(interval);
  }, [slides, autoSlideInterval]);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="w-full h-[180px] md:h-[250px] px-4 py-2">
      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
        <div 
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: \`translateX(-\${currentIndex * 100}%)\` }}
        >
          {slides.map((slide, index) => (
            <div 
              key={\`\${slide.id}-\${index}\`} 
              className="min-w-full h-full relative flex-shrink-0 cursor-pointer"
              onClick={() => slide.link && window.open(slide.link, '_blank')}
            >
              <img 
                src={slide.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"} 
                alt={slide.title || "Banner"} 
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"; }}
              />
            </div>
          ))}
        </div>
        
        {slides.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-1.5 pointer-events-none">
            {slides.map((_, index) => (
              <div
                key={index}
                className={\`h-1.5 rounded-full transition-all duration-300 \${
                  currentIndex === index ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
                }\`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/components/BannerSlider.tsx', bannerContent);
