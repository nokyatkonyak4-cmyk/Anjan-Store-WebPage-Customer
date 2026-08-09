import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

target = "const totalBill = productsTotal + finalDeliveryFee + platformFee;"
replacement = """const totalBill = productsTotal + finalDeliveryFee + platformFee;
console.log("Placing order to db:", db.app.options.projectId, db.app.name, db.type);"""

if target in content:
    content = content.replace(target, replacement)
    open('src/components/MainAppScreen.tsx', 'w').write(content)
    print("Added debug log")
