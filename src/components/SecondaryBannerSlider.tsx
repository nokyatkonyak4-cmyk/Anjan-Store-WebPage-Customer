import React, { useState, useEffect } from 'react';

export interface CampaignSlide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  badgeText: string;
  badgeColor: string;
  link: string;
}

interface Props {
  slides: CampaignSlide[];
  autoSlideInterval?: number;
  onSlideClick?: (slide: CampaignSlide) => void;
}

export default function SecondaryBannerSlider({ slides, autoSlideInterval = 4000, onSlideClick }: Props) {
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
    <div className="w-full h-[200px] md:h-[280px] lg:h-[350px] px-4 py-2">
      <div className="relative w-full h-full rounded-2xl md:rounded-3xl overflow-hidden bg-gray-300 shadow-sm">
        <div 
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => {
             const defaultColor = "#4CAF50";
             const badgeColor = slide.badgeColor?.startsWith("#") ? slide.badgeColor : defaultColor;

             return (
               <div 
                 key={`${slide.id}-${index}`} 
                 className="min-w-full h-full relative cursor-pointer flex-shrink-0"
                 onClick={() => onSlideClick && onSlideClick(slide)}
               >
                 <img 
                   src={slide.imageUrl || "/app-icon-512X512.png"} 
                   alt={slide.title} 
                   className="w-full h-full object-contain"
                   onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/app-icon-512X512.png"; }}
                 />
                 
                 {/* Gradient overlay */}
                 <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent pointer-events-none"></div>
                 
                 {/* Content */}
                 <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-10 pointer-events-none">
                   {slide.badgeText && (
                     <div className="mb-3 md:mb-4">
                       <span 
                         style={{ backgroundColor: badgeColor }}
                         className="inline-flex items-center justify-center px-3 md:px-4 py-1 md:py-1.5 rounded-full text-white text-[10px] md:text-xs font-bold tracking-widest uppercase shadow-sm"
                       >
                         {slide.badgeText}
                       </span>
                     </div>
                   )}
                   
                   <h3 className="text-white text-2xl md:text-4xl lg:text-5xl font-black mb-2 md:mb-4 line-clamp-2 drop-shadow-md">
                     {slide.title}
                   </h3>
                   
                   <p className="text-white/90 text-sm md:text-base lg:text-lg font-medium line-clamp-2 max-w-[80%] md:max-w-[60%] drop-shadow-sm">
                     {slide.subtitle}
                   </p>
                 </div>
               </div>
             );
          })}
        </div>

        {/* Navigation dots */}
        {slides.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-1.5 pointer-events-none">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === index ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
