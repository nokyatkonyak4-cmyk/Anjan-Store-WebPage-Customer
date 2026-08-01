const fs = require('fs');

let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

// 1. ProfileScreen Patch
const oldProfileScreen = `function ProfileScreen({ savedAddress, savedPhone }: any) {
  const user = auth?.currentUser;
  const navigate = useNavigate();
  const [name, setName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState(savedPhone);
  const [address, setAddress] = useState(savedAddress);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user || !db) return;
    setLoading(true);
    try {
      if (name !== user.displayName) {
        await updateProfile(user, { displayName: name });
      }
      await setDoc(doc(db, 'users', user.uid), {
        name,
        whatsappNumber: phone,
        address,
        email: user.email
      }, { merge: true });
      alert("Settings saved successfully!");
    } catch (e) {
      console.error(e);
      alert("Error saving settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full p-4 items-center animate-in fade-in pb-24">
      <div className="w-24 h-24 bg-dark-bg rounded-full flex items-center justify-center mt-4 mb-6 shadow-md shrink-0">
        <span className="text-[#FFC107] font-bold text-4xl">{user?.email?.charAt(0).toUpperCase() || 'U'}</span>
      </div>
      
      <div className="w-full space-y-3 mb-8">
        <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Name *" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-dark-bg outline-none" />
        <input type="email" value={user?.email || ""} placeholder="Email *" className="w-full border border-gray-300 rounded-lg p-3 text-sm bg-gray-50 text-gray-500 outline-none" disabled />
        <input type="text" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="WhatsApp Number" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-dark-bg outline-none" />
        <textarea value={address} onChange={e=>setAddress(e.target.value)} placeholder="Full Delivery Address *" rows={2} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-dark-bg outline-none resize-none"></textarea>
      </div>
      <button onClick={handleSave} disabled={loading} className="w-full bg-brand-yellow text-dark-bg font-bold py-3 rounded-lg mb-8 shadow-sm">
        {loading ? 'Saving...' : 'Save Settings'}
      </button>

      <div className="w-full bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        {[
          { icon: Shield, text: 'Privacy Policy', path: 'privacy' },
          { icon: Info, text: 'Terms & Conditions', path: 'terms' },
          { icon: Search, text: 'Refund & Cancellation Policy', path: 'refund' },
          { icon: Mail, text: 'Contact Us', path: 'contact' }
        ].map((item, idx) => (
          <div key={item.text} onClick={() => navigate(\`/static_page/\${item.path}\`)} className={\`flex items-center px-4 py-4 cursor-pointer \${idx !== 3 ? 'border-b border-gray-100' : ''}\`}>
            <item.icon size={20} className="text-dark-bg mr-4" />
            <span className="font-semibold text-sm text-dark-bg">{item.text}</span>
          </div>
        ))}
      </div>
      
      <button onClick={() => auth.signOut()} className="w-full py-4 rounded-xl border border-red-200 text-red-500 font-bold text-sm flex justify-center shadow-sm bg-white">
        Logout
      </button>
    </div>
  );
}`;

const newProfileScreen = `function ProfileScreen({ savedAddress, savedPhone }: any) {
  const user = auth?.currentUser;
  const navigate = useNavigate();
  const [name, setName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState(savedPhone);
  const [address, setAddress] = useState(savedAddress);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user || !db) return;
    setLoading(true);
    try {
      if (name !== user.displayName) {
        await updateProfile(user, { displayName: name });
      }
      await setDoc(doc(db, 'users', user.uid), {
        name,
        whatsappNumber: phone,
        address,
        email: user.email
      }, { merge: true });
      alert("Settings saved successfully!");
    } catch (e) {
      console.error(e);
      alert("Error saving settings");
    } finally {
      setLoading(false);
    }
  };

  const InputLabel = ({ label }: { label: string }) => (
    <div className="absolute -top-2 left-3 bg-white px-1 text-[10px] text-gray-500 z-10">
      {label}
    </div>
  );

  return (
    <div className="flex flex-col w-full p-4 items-center animate-in fade-in pb-24 bg-white min-h-full">
      <div className="w-24 h-24 bg-dark-bg rounded-full flex items-center justify-center mt-4 mb-8 shadow-md shrink-0">
        <span className="text-[#FFC107] font-bold text-4xl">{name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}</span>
      </div>
      
      <div className="w-full space-y-5 mb-8">
        <div className="relative border border-gray-300 rounded text-sm bg-white">
          <InputLabel label="Name *" />
          <input type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full p-3 rounded bg-transparent focus:outline-none" />
        </div>
        <div className="relative border border-gray-300 rounded text-sm bg-white">
          <InputLabel label="Email *" />
          <input type="email" value={user?.email || ""} className="w-full p-3 rounded bg-transparent focus:outline-none text-gray-800" disabled />
        </div>
        <div className="relative border border-gray-300 rounded text-sm bg-white">
          <InputLabel label="WhatsApp Number" />
          <input type="text" value={phone} onChange={e=>setPhone(e.target.value)} className="w-full p-3 rounded bg-transparent focus:outline-none" />
        </div>
        <div className="relative border border-gray-300 rounded text-sm bg-white">
          <InputLabel label="Full Delivery Address *" />
          <textarea value={address} onChange={e=>setAddress(e.target.value)} rows={2} className="w-full p-3 rounded bg-transparent focus:outline-none resize-none"></textarea>
        </div>
        <div className="relative border border-gray-300 rounded text-sm bg-white">
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="New Password (Leave blank to keep)" className="w-full p-3 rounded bg-transparent focus:outline-none placeholder-gray-500" />
        </div>
      </div>
      
      <button onClick={handleSave} disabled={loading} className="w-full bg-brand-yellow text-dark-bg font-bold py-3 rounded-full mb-8">
        {loading ? 'Saving...' : 'Save Settings'}
      </button>

      <div className="w-full bg-white mb-8 space-y-1">
        {[
          { icon: Shield, text: 'Privacy Policy', path: 'privacy' },
          { icon: Info, text: 'Terms & Conditions', path: 'terms' },
          { icon: RefreshCcw, text: 'Refund & Cancellation Policy', path: 'refund' },
          { icon: Phone, text: 'Contact Us', path: 'contact' }
        ].map((item, idx) => (
          <div key={\`\${item.text}-\${idx}\`} onClick={() => navigate(\`/static_page/\${item.path}\`)} className={\`flex items-center py-4 cursor-pointer \${idx !== 3 ? 'border-b border-gray-50' : ''}\`}>
            <item.icon size={18} className="text-dark-bg mr-4" />
            <span className="font-bold text-sm text-dark-bg">{item.text}</span>
          </div>
        ))}
      </div>
      
      <button onClick={() => auth.signOut()} className="w-full py-3.5 rounded-full border border-red-200 text-red-600 font-bold text-sm flex justify-center bg-white">
        Logout
      </button>
    </div>
  );
}`;

content = content.replace(oldProfileScreen, newProfileScreen);


// 2. OrdersScreen Patch
const oldOrdersScreen = `function OrdersScreen({ orders }: any) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full p-4 animate-in fade-in">
      <h2 className="text-xl font-bold text-dark-bg mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <div className="flex items-center justify-center p-8 text-gray-500">No orders yet.</div>
      ) : (
        <div className="space-y-4 pb-6">
          {orders.map((order: any, index:number) => (
            <div key={\`\${order.id}-\${index}\`} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex justify-between items-center mb-3 border-b border-gray-100 pb-2">
                <span className="font-bold text-dark-bg text-sm">{order.id}</span>
                <span className={\`text-xs font-bold px-2 py-1 rounded-md \${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}\`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <div className="text-xs text-gray-500">
                  <span className="block mb-1">{order.date}</span>
                  <span>{order.itemCount} items • ₹{order.total + (order.deliveryFee || 0)}</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <button onClick={() => navigate(\`/digital_bill/\${order.id}\`)} className="flex-1 border border-gray-200 text-dark-bg text-xs font-bold py-2 rounded-lg text-center">
                  View Bill
                </button>
                {order.status !== 'Delivered' && (
                  <button onClick={() => navigate(\`/track_order/\${order.id}\`)} className="flex-1 bg-brand-yellow text-dark-bg text-xs font-bold py-2 rounded-lg text-center shadow-sm">
                    Track Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}`;

const newOrdersScreen = `function OrdersScreen({ orders }: any) {
  return (
    <div className="flex flex-col w-full p-4 animate-in fade-in bg-white min-h-full">
      {orders.length === 0 ? (
        <div className="flex items-center justify-center p-8 text-gray-500">No orders yet.</div>
      ) : (
        <div className="space-y-4 pb-6 mt-2">
          {orders.map((order: any, index:number) => {
            const total = (order.total || 0) + (order.deliveryFee || 0);
            return (
              <div key={\`\${order.id}-\${index}\`} className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] p-5 border border-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-bold text-dark-bg text-sm">Order ID: {order.id.slice(0, 8)}...</span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {order.date || '2026-07-29 12:47'}
                  </span>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-xs font-bold text-green-600">{order.status || 'Delivered'}</span>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items && order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-xs text-gray-600">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="font-bold text-dark-bg">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-xs text-gray-400 pt-1">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-dark-bg">₹{order.deliveryFee || 30.0}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="font-bold text-dark-bg text-sm">Total Bill: ₹{total.toFixed(1)}</span>
                  <button className="text-[#FFC107] font-bold text-xs">
                    Leave Feedback
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}`;

content = content.replace(oldOrdersScreen, newOrdersScreen);


// 3. ProductCard Patch
const oldProductCard = `function ProductCard({ product, cartQuantity, isFavorite, onToggleFavorite, onIncrement, onDecrement }: any) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col aspect-square border border-gray-100 relative">
      <div className="absolute inset-0 bg-gray-100">
        <img src={product.imageUrl || product.image || "https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?auto=format&fit=crop&q=80&w=300"} alt={product.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?auto=format&fit=crop&q=80&w=300"; }} />
        {/* Dark gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
      </div>
      
      <button onClick={onToggleFavorite} className="absolute top-1 right-1 w-5 h-5 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm z-10">
        <Heart size={10} className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"} />
      </button>

      <div className="relative z-10 flex flex-col justify-end h-full p-1.5 pb-2">
        <h3 className="font-bold text-[9px] leading-[1.1] text-white line-clamp-2 drop-shadow-md mb-0.5">{product.name}</h3>
        
        <div className="flex items-center justify-between mb-1">
          <span className="font-bold text-[10px] text-[#FFC107] drop-shadow-md">₹{product.price}</span>
        </div>
        
        <div className="mt-0.5">
          {cartQuantity > 0 ? (
            <div className="flex items-center justify-between bg-brand-yellow rounded h-5 px-1">
              <button onClick={onDecrement} className="w-4 h-full flex items-center justify-center"><Minus size={10} className="text-dark-bg" /></button>
              <span className="font-bold text-dark-bg text-[9px]">{cartQuantity}</span>
              <button onClick={onIncrement} className="w-4 h-full flex items-center justify-center"><Plus size={10} className="text-dark-bg" /></button>
            </div>
          ) : (
            <button onClick={onIncrement} className="w-full bg-brand-yellow text-dark-bg rounded h-5 font-bold text-[9px] shadow-sm">
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}`;

const newProductCard = `function ProductCard({ product, cartQuantity, isFavorite, onToggleFavorite, onIncrement, onDecrement }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col h-[280px] border border-gray-100/50 hover:shadow-md transition-shadow">
      <div className="relative h-[130px] bg-gray-50 w-full shrink-0 p-3 flex items-center justify-center">
        <img src={product.imageUrl || product.image || "https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?auto=format&fit=crop&q=80&w=300"} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?auto=format&fit=crop&q=80&w=300"; }} />
        <button onClick={onToggleFavorite} className="absolute top-2 right-2 w-7 h-7 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm">
          <Heart size={14} className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>
      </div>
      <div className="p-3.5 flex flex-col flex-1 bg-white">
        <h3 className="font-bold text-[13px] text-dark-bg line-clamp-1 mb-1.5">{product.name}</h3>
        
        <div className="mb-2">
          <span className="px-1.5 py-0.5 bg-[#FFF9E6] rounded text-[9px] font-bold text-dark-bg">{product.category || 'Unknown'}</span>
        </div>
        
        <div className="flex items-center mb-3">
          <Star size={10} className="fill-[#FFC107] text-[#FFC107] mr-1" />
          <span className="text-[10px] text-gray-400 font-medium">{product.rating || 4.5} ({product.reviewCount || Math.floor(Math.random() * 100) + 10})</span>
        </div>
        
        <div className="mt-auto flex flex-col justify-end">
          <span className="font-bold text-sm text-dark-bg mb-2.5 block">₹{product.price.toFixed(1)}</span>
          
          {cartQuantity > 0 ? (
            <div className="flex items-center justify-between bg-brand-yellow rounded-full h-9 px-1">
              <button onClick={onDecrement} className="w-8 h-full flex items-center justify-center"><Minus size={14} className="text-dark-bg font-bold" /></button>
              <span className="font-bold text-dark-bg text-[13px]">{cartQuantity}</span>
              <button onClick={onIncrement} className="w-8 h-full flex items-center justify-center"><Plus size={14} className="text-dark-bg font-bold" /></button>
            </div>
          ) : (
            <button onClick={onIncrement} className="w-full bg-brand-yellow text-dark-bg rounded-full h-9 font-bold text-[12px] flex items-center justify-center">
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}`;

content = content.replace(oldProductCard, newProductCard);

// 4. Change products grid back to 2 columns in Home
content = content.replace(/className="grid grid-cols-3 gap-3"/g, 'className="grid grid-cols-2 gap-4"');
content = content.replace(/className="grid grid-cols-3 gap-3 pb-6"/g, 'className="grid grid-cols-2 gap-4 pb-6"');


// 5. Change CategoriesScreen layout
const oldCategoriesScreen = `function CategoriesScreen({ categories, onNavigate }: any) {
  const [search, setSearch] = useState('');
  const filtered = categories.filter((c:any) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col w-full p-4 animate-in fade-in">
      <div className="relative mb-6">
        <input 
          type="text" 
          placeholder="Search categories..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-[#FFC107]"
        />
        <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((cat:any, index:number) => (
          <div key={\`\${cat.id}-\${index}\`} onClick={() => onNavigate(\`Category_\${cat.id}\`)} className="bg-white rounded-xl p-3 flex flex-col items-center justify-center shadow-sm cursor-pointer border border-gray-50 aspect-square">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3 border border-gray-100 overflow-hidden">
              <img src={cat.imageUrl || cat.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200"} alt={cat.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200"; }} />
            </div>
            <span className="font-bold text-dark-bg text-sm text-center">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}`;

const newCategoriesScreen = `function CategoriesScreen({ categories, onNavigate }: any) {
  const [search, setSearch] = useState('');
  const filtered = categories.filter((c:any) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col w-full p-4 animate-in fade-in bg-white min-h-full">
      <div className="relative mb-6">
        <input 
          type="text" 
          placeholder="Search categories..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-gray-400 transition-colors"
        />
        <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
      </div>
      <div className="grid grid-cols-3 gap-y-8 gap-x-4">
        {filtered.map((cat:any, index:number) => (
          <div key={\`\${cat.id}-\${index}\`} onClick={() => onNavigate(\`Category_\${cat.id}\`)} className="flex flex-col items-center justify-start cursor-pointer">
            <div className="w-[80px] h-[70px] mb-2 overflow-hidden flex items-center justify-center">
              <img src={cat.imageUrl || cat.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200"} alt={cat.name} className="max-w-full max-h-full object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200"; }} />
            </div>
            <span className="font-bold text-dark-bg text-[10px] text-center leading-tight">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}`;

content = content.replace(oldCategoriesScreen, newCategoriesScreen);

// 6. Shop by Category in HomeScreen Patch
const oldShopByCategory = `<div className="mb-6">
          <div className="flex justify-between items-center px-4 mb-4">
            <h2 className="font-bold text-dark-bg text-lg">Shop by Category</h2>
            <button onClick={() => onNavigate('Categories')} className="text-[#FFC107] font-bold text-sm">See All</button>
          </div>
          <div className="flex overflow-x-auto px-4 space-x-4 scrollbar-hide pb-2">
            {categories.map((cat:any, index:number) => (
              <div key={\`\${cat.id}-\${index}\`} onClick={() => onNavigate(\`Category_\${cat.id}\`)} className="flex flex-col items-center space-y-2 cursor-pointer shrink-0 w-[70px]">
                <div className="w-[70px] h-[70px] bg-white rounded-full flex items-center justify-center shadow-sm p-3 border border-gray-100">
                  <img src={cat.imageUrl || cat.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200"} alt={cat.name} className="w-full h-full object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200"; }} />
                </div>
                <span className="text-xs font-medium text-dark-bg text-center line-clamp-2 leading-tight">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>`;

const newShopByCategory = `<div className="mb-6 bg-white pt-2 pb-1">
          <div className="flex justify-between items-center px-4 mb-5">
            <h2 className="font-bold text-dark-bg text-sm">Shop by Category</h2>
            <button onClick={() => onNavigate('Categories')} className="text-[#FFC107] font-bold text-xs">See All</button>
          </div>
          <div className="flex overflow-x-auto px-4 space-x-5 scrollbar-hide pb-2">
            {categories.map((cat:any, index:number) => (
              <div key={\`\${cat.id}-\${index}\`} onClick={() => onNavigate(\`Category_\${cat.id}\`)} className="flex flex-col items-center cursor-pointer shrink-0 w-[64px]">
                <div className="w-full h-[50px] flex items-center justify-center mb-2">
                  <img src={cat.imageUrl || cat.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200"} alt={cat.name} className="max-w-full max-h-full object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200"; }} />
                </div>
                <span className="text-[10px] font-bold text-dark-bg text-center leading-tight">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>`;

content = content.replace(oldShopByCategory, newShopByCategory);


fs.writeFileSync('src/components/MainAppScreen.tsx', content);

