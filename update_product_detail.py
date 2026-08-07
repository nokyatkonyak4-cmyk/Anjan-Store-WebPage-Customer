import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

target = """  const images =
    product.images ||
    (product.imageUrl || product.image
      ? [product.imageUrl || product.image]
      : [
          "/AppIcon-512x512.png",
        ]);"""

replacement = """  const images =
    product.imageUrls ||
    product.images ||
    (product.imageUrl || product.image
      ? [product.imageUrl || product.image]
      : [
          "/AppIcon-512x512.png",
        ]);"""

content = content.replace(target, replacement)

target2 = """            <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2 z-10 pointer-events-none">
              {images.map((_: any, idx: number) => (
                <div key={idx} className={`w-2 h-2 rounded-full ${idx === currentImageIndex ? "bg-[#FFC107]" : "bg-dark-bg/20"}`} />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="p-5 bg-white rounded-t-3xl -mt-6 relative z-10 flex-1 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] border-t border-gray-100">"""

replacement2 = """          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="bg-white px-4 py-3 flex overflow-x-auto space-x-3 scrollbar-hide border-b border-gray-100">
          {images.map((img: string, idx: number) => (
            <button
              key={idx}
              onClick={() => {
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollTo({ left: idx * scrollContainerRef.current.clientWidth, behavior: 'smooth' });
                }
              }}
              className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${idx === currentImageIndex ? 'border-brand-yellow shadow-sm scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
      <div className={`p-5 bg-white relative z-10 flex-1 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] border-t border-gray-100 ${images.length <= 1 ? 'rounded-t-3xl -mt-6' : ''}`}>"""

content = content.replace(target2, replacement2)

open('src/components/MainAppScreen.tsx', 'w').write(content)
