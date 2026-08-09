import re

content = open('STORE_MANAGER_PROMPT.md', 'r').read()
content = content.replace('review and manage incoming customer orders from the main app.', 'review and manage incoming customer orders, as well as manage the products and categories available in the customer app.')
content = content.replace('### Required Features:', '''### Required Features:
1. **Catalog Management**: 
   - A section to view, add, edit, and delete "categories". (Fields: `id`, `name`, `icon`, `color`, `isActive`)
   - A section to view, add, edit, and delete "products". (Fields: `id`, `name`, `description`, `price`, `unit`, `originalPrice`, `categoryId`, `stockQuantity`, `isActive`, `image`)
   - A section to view, add, edit, and delete "banners". (Fields: `id`, `title`, `subtitle`, `image`, `isActive`)''')
content = content.replace('1. **Live Order Feed**', '2. **Live Order Feed**')
content = content.replace('2. **Order Details View**', '3. **Order Details View**')
content = content.replace('3. **Delivery Fee Input**', '4. **Delivery Fee Input**')
content = content.replace('4. **Status Updater**', '5. **Status Updater**')
content = content.replace('5. **Delivery Completion**', '6. **Delivery Completion**')
open('STORE_MANAGER_PROMPT.md', 'w').write(content)
print("patched")
