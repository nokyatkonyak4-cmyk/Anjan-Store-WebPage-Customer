import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

target = """      {pinAlertModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-200 relative">
            <button onClick={() => setPinAlertModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <Plus size={24} className="rotate-45" />
            </button>
            <div className="w-16 h-16 bg-brand-yellow/20 text-brand-yellow rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={32} />
            </div>
            <h2 className="text-2xl font-bold text-dark-bg mb-2">Delivery PIN</h2>
            <p className="text-gray-600 mb-6">Your requested order delivery PIN is:</p>
            <div className="bg-gray-50 rounded-xl py-4 border border-gray-100 mb-6">
              <span className="text-4xl font-black text-dark-bg tracking-widest">{pinAlertModal}</span>
            </div>
            <button
              onClick={() => setPinAlertModal(null)}
              className="w-full py-3.5 bg-brand-yellow text-dark-bg font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              Got it
            </button>
          </div>
        </div>
      )}"""

if target in content:
    content = content.replace(target, '')
    print("Deleted PIN modal")
else:
    print("Target not found")

open('src/components/MainAppScreen.tsx', 'w').write(content)
