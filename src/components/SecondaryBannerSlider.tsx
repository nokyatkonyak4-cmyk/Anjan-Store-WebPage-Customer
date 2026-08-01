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
    <div className="w-full h-[200px] px-4 py-2">
      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gray-300">
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
                   src={slide.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"} 
                   alt={slide.title} 
                   className="w-full h-full object-cover"
                   onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"; }}
                 />
                 
                 {/* Gradient overlay */}
                 <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent pointer-events-none"></div>
                 
                 {/* Content */}
                 <div className="absolute inset-0 flex flex-col justify-center p-6 pointer-events-none">
                   {slide.badgeText && (
                     <div className="mb-3">
                       <span 
                         style={{ backgroundColor: badgeColor }} 
                         className="inline-flex items-center justify-center px-3 py-1 rounded-full text-white text-[10px] font-bold tracking-widest uppercase"
                       >
                         {slide.badgeText}
                       </span>
                     </div>
                   )}
                   
                   <h3 className="text-white text-2xl font-black mb-2 line-clamp-2">
                     {slide.title}
                   </h3>
                   
                   <p className="text-white/90 text-sm font-medium line-clamp-2 max-w-[70%]">
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
