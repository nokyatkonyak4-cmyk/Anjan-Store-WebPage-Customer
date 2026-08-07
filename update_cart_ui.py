import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

target = """      <div className="bg-white p-4 absolute bottom-0 left-0 right-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-3xl border-t border-gray-100 z-10 pb-24">
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-lg text-dark-bg">Items Total</span>
          <span className="font-bold text-lg text-dark-bg">₹{total}</span>
        </div>
        <span className="text-xs text-gray-500 block mb-4">
          + Delivery charge calculated at next step
        </span>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowConfirm(true)}
          className="w-full bg-brand-yellow text-dark-bg font-bold py-3.5 rounded-xl shadow-sm text-base"
        >
          Checkout & Request Delivery Quote
        </motion.button>
      </div>"""

replacement = """      <div className="bg-white p-4 absolute bottom-0 left-0 right-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-3xl border-t border-gray-100 z-10 pb-24 space-y-2">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Items Cost</span>
          <span>₹{getOrderItemsTotal(cartItems)}</span>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Handling Fee</span>
          <span>₹{handlingFee}</span>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-500 border-b border-gray-100 pb-2">
          <span>Delivery Fee</span>
          <span>₹{deliveryFee}</span>
        </div>
        <div className="flex justify-between items-center mb-2 pt-1">
          <span className="font-bold text-lg text-dark-bg">Grand Total</span>
          <span className="font-bold text-lg text-dark-bg">₹{getGrandTotal(cartItems)}</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowConfirm(true)}
          className="w-full bg-brand-yellow text-dark-bg font-bold py-3.5 rounded-xl shadow-sm text-base mt-2"
        >
          Checkout Now
        </motion.button>
      </div>"""

content = content.replace(target, replacement)
open('src/components/MainAppScreen.tsx', 'w').write(content)
