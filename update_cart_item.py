import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

target = """            <img
              src={
                item.product.imageUrl ||
                item.product.image ||
                "/AppIcon-512x512.png"
              }
              alt={item.product.name}"""

replacement = """            <img
              src={
                (item.product.imageUrls && item.product.imageUrls[0]) ||
                (item.product.images && item.product.images[0]) ||
                item.product.imageUrl ||
                item.product.image ||
                "/AppIcon-512x512.png"
              }
              alt={item.product.name}"""

content = content.replace(target, replacement)
open('src/components/MainAppScreen.tsx', 'w').write(content)
