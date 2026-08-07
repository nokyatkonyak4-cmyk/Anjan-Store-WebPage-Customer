import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

# Fix active orders
content = content.replace(
    "const total = (order.total || 0) + (order.deliveryFee || 0);",
    "const total = (order.totalPrice || 0) + (order.deliveryFee || 0) + (order.handlingFee || 0);"
)

# Fix delivery fee display for active orders
target1 = """                  <div className="flex justify-between text-xs text-gray-400 pt-1">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-dark-bg">
                      ₹{order.deliveryFee || 30.0}
                    </span>
                  </div>"""

replacement1 = """                  <div className="flex justify-between text-xs text-gray-400 pt-1">
                    <span>Handling Fee</span>
                    <span className="font-bold text-dark-bg">
                      ₹{order.handlingFee || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 pt-1">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-dark-bg">
                      ₹{order.deliveryFee || 0}
                    </span>
                  </div>"""

content = content.replace(target1, replacement1)

open('src/components/MainAppScreen.tsx', 'w').write(content)
