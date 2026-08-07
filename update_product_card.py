import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

target = """function ProductCard({
  product,
  cartQuantity,
  isFavorite,
  onToggleFavorite,
  onIncrement,
  onDecrement,
  onProductClick,
}: any) {
  return (
    <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col h-[200px] md:h-[250px] border border-gray-100 transition-shadow relative">
      <div
        className="relative h-[100px] md:h-[130px] w-full shrink-0 p-1 flex items-center justify-center border-b border-gray-50 cursor-pointer"
        onClick={() => onProductClick && onProductClick(product)}
      >
        <img
          src={
            product.imageUrl ||
            product.image ||
            "/AppIcon-512x512.png"
          }
          alt={product.name}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "/AppIcon-512x512.png";
          }}
        />"""

replacement = """function ProductCard({
  product,
  cartQuantity,
  isFavorite,
  onToggleFavorite,
  onIncrement,
  onDecrement,
  onProductClick,
}: any) {
  const images = product.imageUrls || product.images || (product.imageUrl || product.image ? [product.imageUrl || product.image] : ["/AppIcon-512x512.png"]);
  const extraImagesCount = images.length > 1 ? images.length - 1 : 0;
  return (
    <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col h-[200px] md:h-[250px] border border-gray-100 transition-shadow relative">
      <div
        className="relative h-[100px] md:h-[130px] w-full shrink-0 p-1 flex items-center justify-center border-b border-gray-50 cursor-pointer"
        onClick={() => onProductClick && onProductClick(product)}
      >
        <img
          src={images[0]}
          alt={product.name}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "/AppIcon-512x512.png";
          }}
        />
        {extraImagesCount > 0 && (
          <div className="absolute bottom-2 left-2 bg-dark-bg/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center shadow-sm">
            +{extraImagesCount} Photos
          </div>
        )}"""

content = content.replace(target, replacement)

open('src/components/MainAppScreen.tsx', 'w').write(content)
