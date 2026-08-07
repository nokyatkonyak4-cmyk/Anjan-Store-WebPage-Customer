import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

target = """        <div className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          {images.map((img: string, idx: number) => (
            <div
              key={idx}
              className="w-full h-full shrink-0 snap-center flex items-center justify-center p-2"
            >
              <img
                src={img}
                alt={`${product.name} - image ${idx + 1}`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "/AppIcon-512x512.png";
                }}
              />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2 z-10 pointer-events-none">
            {images.map((_: any, idx: number) => (
              <div key={idx} className="w-2 h-2 rounded-full bg-dark-bg/20" />
            ))}
          </div>
        )}"""

replacement = """        <div 
          ref={scrollContainerRef}
          onScroll={(e) => {
            const scrollLeft = e.currentTarget.scrollLeft;
            const width = e.currentTarget.clientWidth;
            setCurrentImageIndex(Math.round(scrollLeft / width));
          }}
          className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth relative"
        >
          {images.map((img: string, idx: number) => (
            <div
              key={idx}
              className="w-full h-full shrink-0 snap-center flex items-center justify-center p-2"
            >
              <img
                src={img}
                alt={`${product.name} - image ${idx + 1}`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "/AppIcon-512x512.png";
                }}
              />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollBy({ left: -scrollContainerRef.current.clientWidth, behavior: 'smooth' });
                }
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md z-10 hover:bg-white transition"
            >
              <ChevronLeft size={24} className="text-dark-bg" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollBy({ left: scrollContainerRef.current.clientWidth, behavior: 'smooth' });
                }
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md z-10 hover:bg-white transition"
            >
              <ChevronRight size={24} className="text-dark-bg" />
            </button>
            <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2 z-10 pointer-events-none">
              {images.map((_: any, idx: number) => (
                <div key={idx} className={`w-2 h-2 rounded-full ${idx === currentImageIndex ? "bg-[#FFC107]" : "bg-dark-bg/20"}`} />
              ))}
            </div>
          </>
        )}"""

content = content.replace(target, replacement)
open('src/components/MainAppScreen.tsx', 'w').write(content)
