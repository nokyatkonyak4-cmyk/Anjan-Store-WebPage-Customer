import re

content = open('src/components/DigitalBillScreen.tsx', 'r').read()

target = """        <div className="bg-white rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.05)] w-full p-4">
          <div className="flex w-full justify-between py-1">
            <span className="text-gray-500 text-[14px]">Item Total</span>
            <span className="text-[#0F172A] text-[14px]">
              ₹{subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex w-full justify-between py-1">
            <span className="text-gray-500 text-[14px]">Taxes</span>
            <span className="text-[#0F172A] text-[14px]">
              ₹{tax.toFixed(2)}
            </span>
          </div>
          <div className="flex w-full justify-between py-1">
            <span className="text-gray-500 text-[14px]">Delivery Fee</span>
            <span className="text-[#0F172A] text-[14px]">
              {order.deliveryFee > 0
                ? `₹${order.deliveryFee.toFixed(2)}`
                : "TBD"}
            </span>
          </div>"""

replacement = """        <div className="bg-white rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.05)] w-full p-4">
          <div className="flex w-full justify-between py-1">
            <span className="text-gray-500 text-[14px]">Item Total</span>
            <span className="text-[#0F172A] text-[14px]">
              ₹{subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex w-full justify-between py-1">
            <span className="text-gray-500 text-[14px]">Handling Fee</span>
            <span className="text-[#0F172A] text-[14px]">
              ₹{(order.handlingFee || 0).toFixed(2)}
            </span>
          </div>
          <div className="flex w-full justify-between py-1">
            <span className="text-gray-500 text-[14px]">Delivery Fee</span>
            <span className="text-[#0F172A] text-[14px]">
              {order.deliveryFee > 0
                ? `₹${order.deliveryFee.toFixed(2)}`
                : "TBD"}
            </span>
          </div>"""

if target in content:
    content = content.replace(target, replacement)
    
    # Also fix grandTotal calculation
    content = content.replace(
        'const grandTotal = subtotal + tax + order.deliveryFee;',
        'const grandTotal = order.totalBill || (subtotal + (order.handlingFee || 0) + (order.deliveryFee || 0));'
    )
    
    open('src/components/DigitalBillScreen.tsx', 'w').write(content)
    print("Replaced successfully")
else:
    print("Target not found")
