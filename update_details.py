import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

target = """  const product = products.find((p: any) => p.id === productId);
  if (!product)
    return (
      <div className="p-8 text-center text-gray-500">Product not found</div>
    );"""

replacement = """  const product = products.find((p: any) => p.id === productId);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  
  if (!product)
    return (
      <div className="p-8 text-center text-gray-500">Product not found</div>
    );"""

content = content.replace(target, replacement)

open('src/components/MainAppScreen.tsx', 'w').write(content)
