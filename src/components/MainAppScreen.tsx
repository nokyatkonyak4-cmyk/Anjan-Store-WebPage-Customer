import logoImage from "../assets/logo.png";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Home,
  Grid,
  List as ListIcon,
  ShoppingCart,
  Search,
  Heart,
  Bell,
  User,
  ArrowLeft,
  Plus,
  Minus,
  Star,
  MapPin,
  Share2,
  Camera,
  Mail,
  Info,
  Shield,
  CheckCircle,
  ChevronRight,
  Phone,
  RefreshCcw,
  Map,
  Bike,
  Store,
  History,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthScreen from "./AuthScreen";
import { auth, db, storage, isFirebaseConfigured } from "../firebase";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import {
  collection,
  onSnapshot,
  query,
  where,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  getDoc,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import SecondaryBannerSlider, { CampaignSlide } from "./SecondaryBannerSlider";
import BannerSlider from "./BannerSlider";

export default function MainAppScreen() {
  const navigate = useNavigate();
  const user = auth?.currentUser;
  const [selectedItem, setSelectedItem] = useState("Home");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<
    { product: any; quantity: number }[]
  >([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Real data state
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  // User Profile
  const [savedAddress, setSavedAddress] = useState("");
  const [savedPhone, setSavedPhone] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const [storeSettings, setStoreSettings] = useState<{
    supportEmail?: string;
    supportPhone?: string;
    supportWhatsapp?: string;
  } | null>(null);

  // Feedback State
  const [feedbackOrder, setFeedbackOrder] = useState<any>(null);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const submitFeedback = async () => {
    if (!feedbackOrder || !user) return;
    setIsSubmittingFeedback(true);
    try {
      await addDoc(collection(db, "feedbacks"), {
        orderId: feedbackOrder.id,
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        rating: feedbackRating,
        comment: feedbackText,
        createdAt: serverTimestamp(),
      });
      setFeedbackSubmitted(true);
      setTimeout(() => {
        setFeedbackOrder(null);
        setFeedbackSubmitted(false);
      }, 2000);
    } catch (err) {
      console.error("Error submitting feedback:", err);
    }
    setIsSubmittingFeedback(false);
  };

  const bottomNavItems = [
    { title: "Home", icon: Home },
    { title: "Categories", icon: Grid },
    { title: "Orders", icon: ListIcon },
    { title: "Cart", icon: ShoppingCart },
  ];

  useEffect(() => {
    if (!db || !user) return;

    const unsubs: any[] = [];

    // Listen to Categories
    unsubs.push(
      onSnapshot(
        collection(db, "categories"),
        (snapshot) => {
          setCategories(
            snapshot.docs
              .map((doc) => ({ id: doc.id, ...(doc.data() as any) }))
              .filter((c) => c.isActive !== false)
          );
        },
        (error) => console.error("Categories snapshot error:", error)
      )
    );

    // Listen to Products
    unsubs.push(
      onSnapshot(
        collection(db, "products"),
        (snapshot) => {
          setProducts(
            snapshot.docs
              .map((doc) => ({ id: doc.id, ...(doc.data() as any) }))
              .filter((p) => p.isActive !== false && p.stockQuantity > 0)
          );
        },
        (error) => console.error("Products snapshot error:", error)
      )
    );

    // Listen to Banners
    unsubs.push(
      onSnapshot(
        collection(db, "banners"),
        (snapshot) => {
          setBanners(
            snapshot.docs
              .map((doc) => ({ id: doc.id, ...(doc.data() as any) }))
              .filter((b) => b.isActive !== false)
          );
        },
        (error) => console.error("Banners snapshot error:", error)
      )
    );

    // Listen to Settings
    unsubs.push(
      onSnapshot(doc(db, "settings", "store"), (docSnap) => {
        if (docSnap.exists()) {
          setStoreSettings(docSnap.data() as any);
        }
      }, (error) => console.error("Settings snapshot error:", error)),
    );

    // Listen to Orders
    unsubs.push(
      onSnapshot(query(collection(db, "orders"), where("customerId", "==", user.uid)), (snapshot) => {
          const fetchedOrders = snapshot.docs
            .map((d) => {
              const data = d.data();
              let dateStr = "Recently";
              if (data.createdAt && data.createdAt.toDate) {
                dateStr = data.createdAt.toDate().toLocaleString();
              } else if (data.createdAtMs) {
                dateStr = new Date(data.createdAtMs).toLocaleString();
              }
              return {
                id: d.id,
                date: dateStr,
                status: data.status || "Pending Approval",
                total: data.totalPrice,
                deliveryFee: data.deliveryFee || 0,
                ...data,
                itemCount: data.items?.length || 0,
              };
            })
            .sort(
              (a: any, b: any) => (b.createdAtMs || 0) - (a.createdAtMs || 0),
            );
          setOrders(fetchedOrders);
        }, (error) => console.error("Orders snapshot error:", error)),
    );

    // Listen to Notifications
    unsubs.push(
      onSnapshot(collection(db, "users", user.uid, "notifications"), (snapshot) => {
          setNotifications(
            snapshot.docs
              .map((d) => ({ id: d.id, ...d.data() }))
              .sort(
                (a: any, b: any) => (b.timestamp || 0) - (a.timestamp || 0),
              ),
          );
        }, (error) => console.error("Notifications snapshot error:", error)),
    );

    // User profile data (favorites, address, phone)
    unsubs.push(
      onSnapshot(doc(db, "users", user.uid), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFavorites(data.favorites || []);
          setSavedAddress(data.address || "");
          setSavedPhone(data.whatsappNumber || "");
          setProfileImage(data.profileImage || "");
          if (data.cartItems) {
            setCartItems(data.cartItems);
          }
        }
      }, (error) => console.error("User snapshot error:", error)),
    );

    return () => unsubs.forEach((u) => u());
  }, [user]);

  const toggleFavorite = (productId: string) => {
    if (!user || !db) return;
    const newFavs = favorites.includes(productId)
      ? favorites.filter((id) => id !== productId)
      : [...favorites, productId];
    setDoc(doc(db, "users", user.uid), { favorites: newFavs }, { merge: true });
  };

  const incrementCart = (product: any) => {
    const existing = cartItems.find((item) => item.product.id === product.id);
    let newCart;
    if (existing) {
      newCart = cartItems.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
    } else {
      newCart = [...cartItems, { product, quantity: 1 }];
    }
    setCartItems(newCart);
    if (user && db) {
      setDoc(
        doc(db, "users", user.uid),
        { cartItems: newCart },
        { merge: true },
      );
    }
  };

  const decrementCart = (product: any) => {
    const existing = cartItems.find((item) => item.product.id === product.id);
    let newCart;
    if (existing && existing.quantity > 1) {
      newCart = cartItems.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      );
    } else {
      newCart = cartItems.filter((item) => item.product.id !== product.id);
    }
    setCartItems(newCart);
    if (user && db) {
      setDoc(
        doc(db, "users", user.uid),
        { cartItems: newCart },
        { merge: true },
      );
    }
  };

  return (
    <div className="flex h-[100dvh] w-full bg-light-bg overflow-hidden">
      {/* Desktop Sidebar Navigation */}
      <div className="hidden md:flex flex-col w-64 bg-brand-yellow border-r border-brand-yellow/20 z-30 shadow-sm relative">
        <div className="px-6 py-6 border-b border-brand-yellow/20">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-white rounded-lg p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
              <img
                src="/AppIcon-512x512.png"
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight text-dark-bg">
                Anjan Store
              </span>
            </div>
          </div>
          <span className="text-[10px] text-dark-bg/80 font-medium ml-13">
            Making your everyday life easier
          </span>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {bottomNavItems.map((item, index) => {
            const isSelected =
              selectedItem === item.title ||
              (item.title === "Categories" &&
                selectedItem.startsWith("Category_"));
            return (
              <button
                key={`desktop-nav-${index}`}
                onClick={() => setSelectedItem(item.title)}
                className={`flex items-center w-full px-4 py-3 rounded-xl transition-all ${isSelected ? "bg-white text-dark-bg font-bold shadow-sm" : "text-dark-bg/80 hover:bg-white/50 hover:text-dark-bg font-medium"}`}
              >
                <div className="relative mr-3">
                  <item.icon
                    size={20}
                    className={isSelected ? "text-dark-bg" : "text-dark-bg/80"}
                  />
                  {item.title === "Cart" && cartItems.length > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                      {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                    </span>
                  )}
                </div>
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col flex-1 relative min-w-0">
        {/* Top App Bar (Mobile & Desktop) */}
        <div className="bg-brand-yellow text-dark-bg flex flex-col sticky top-0 z-20 shadow-md md:shadow-sm md:border-b md:border-brand-yellow/20">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3 md:hidden">
              <div className="w-10 h-10 bg-white rounded-lg p-1 flex items-center justify-center overflow-hidden">
                <img
                  src="/AppIcon-512x512.png"
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight">
                  Anjan Store
                </span>
                <span className="text-[9px] tracking-widest font-semibold uppercase">
                  All in one place
                </span>
              </div>
            </div>
            {/* Desktop header title */}
            <div className="hidden md:flex items-center">
              <h1 className="text-xl font-bold text-dark-bg">
                {selectedItem.startsWith("Product_")
                  ? "Product Details"
                  : selectedItem.startsWith("Category_")
                    ? "Category"
                    : selectedItem}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSelectedItem("Favorites")}
                className="md:hover:bg-white/50 md:p-2 md:rounded-full transition"
              >
                <Heart size={24} className="text-dark-bg" />
              </button>
              <button
                onClick={() => setSelectedItem("Notifications")}
                className="relative md:hover:bg-white/50 md:p-2 md:rounded-full transition"
              >
                <Bell size={24} className="text-dark-bg" />
                {notifications.filter((n) => !n.isRead).length > 0 && (
                  <span className="absolute md:top-1 md:right-1 -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-brand-yellow text-[8px] text-white flex items-center justify-center">
                    {notifications.filter((n) => !n.isRead).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setSelectedItem("Profile")}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-dark-bg text-[#FFC107] flex items-center justify-center font-bold text-sm md:text-base cursor-pointer shadow-sm hover:opacity-90 transition"
              >
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto pb-20 md:pb-6 scrollbar-hide md:px-4 lg:px-8">
          <div className="w-full max-w-7xl mx-auto">
            {selectedItem === "Home" && (
              <HomeScreen
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onNavigate={setSelectedItem}
                products={products}
                categories={categories}
                banners={banners}
                favorites={favorites}
                cartItems={cartItems}
                toggleFavorite={toggleFavorite}
                incrementCart={incrementCart}
                decrementCart={decrementCart}
                storeSettings={storeSettings}
              />
            )}
            {selectedItem.startsWith("Product_") && (
              <ProductDetailScreen user={user}
                productId={selectedItem.replace("Product_", "")}
                products={products}
                onNavigate={setSelectedItem}
                favorites={favorites}
                cartItems={cartItems}
                toggleFavorite={toggleFavorite}
                incrementCart={incrementCart}
                decrementCart={decrementCart}
              />
            )}
            {selectedItem === "Categories" && (
              <CategoriesScreen
                categories={categories}
                onNavigate={setSelectedItem}
              />
            )}
            {selectedItem.startsWith("Category_") && (
              <CategoryDetailScreen
                categoryId={selectedItem.replace("Category_", "")}
                categories={categories}
                products={products}
                onNavigate={setSelectedItem}
                favorites={favorites}
                cartItems={cartItems}
                toggleFavorite={toggleFavorite}
                incrementCart={incrementCart}
                decrementCart={decrementCart}
              />
            )}
            {selectedItem === "Cart" && (
              <CartScreen
                cartItems={cartItems}
                setCartItems={setCartItems}
                savedAddress={savedAddress}
                savedPhone={savedPhone}
                incrementCart={incrementCart}
                decrementCart={decrementCart}
                onNavigate={setSelectedItem}
              />
            )}
            {selectedItem === "Orders" && <OrdersScreen orders={orders} />}
            {selectedItem === "Favorites" && (
              <FavoritesScreen
                products={products}
                onNavigate={setSelectedItem}
                favorites={favorites}
                cartItems={cartItems}
                toggleFavorite={toggleFavorite}
                incrementCart={incrementCart}
                decrementCart={decrementCart}
              />
            )}
            {selectedItem === "Notifications" && (
              <NotificationsScreen
                notifications={notifications}
                onNavigate={setSelectedItem}
              />
            )}
            {selectedItem === "Profile" && (
              <ProfileScreen
                savedAddress={savedAddress}
                savedPhone={savedPhone}
                profileImage={profileImage}
                onNavigate={setSelectedItem}
              />
            )}
            {selectedItem === "OrderHistory" && (
              <OrderHistoryScreen
                orders={orders}
                onNavigate={setSelectedItem}
                onLeaveFeedback={(order: any) => {
                  setFeedbackOrder(order);
                  setFeedbackRating(5);
                  setFeedbackText("");
                  setFeedbackSubmitted(false);
                }}
              />
            )}
          </div>
        </div>

        {/* Bottom Navigation (Mobile Only) */}
        <div className="md:hidden bg-white border-t border-gray-100 flex justify-around items-center h-[60px] absolute bottom-0 w-full z-20 px-4">
          {bottomNavItems.map((item, index) => {
            const isSelected =
              selectedItem === item.title ||
              (item.title === "Categories" &&
                selectedItem.startsWith("Category_"));
            return (
              <motion.button
                whileTap={{ scale: 0.9 }}
                key={`${item.title}-${index}`}
                onClick={() => setSelectedItem(item.title)}
                className={`flex items-center justify-center transition-all duration-300 h-[40px] ${isSelected ? "bg-dark-bg text-brand-yellow px-4 rounded-full space-x-2" : "flex-col space-y-1 w-[60px] text-gray-400"}`}
              >
                <div className="relative flex items-center justify-center">
                  <item.icon
                    size={20}
                    className={
                      isSelected
                        ? "text-brand-yellow fill-brand-yellow"
                        : "text-gray-400"
                    }
                  />
                  {item.title === "Cart" && cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                      {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                    </span>
                  )}
                </div>
                {isSelected ? (
                  <span className="text-[12px] font-bold">{item.title}</span>
                ) : (
                  <span className="text-[10px] font-medium">{item.title}</span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Feedback Modal */}
      {feedbackOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setFeedbackOrder(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <Plus size={24} className="rotate-45" />
            </button>

            {feedbackSubmitted ? (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-dark-bg mb-2">
                  Thank You!
                </h3>
                <p className="text-gray-500 text-center text-sm">
                  Your feedback has been submitted successfully.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-dark-bg mb-4">
                  Leave Feedback
                </h3>
                <p className="text-xs text-gray-500 mb-6">
                  Rate your experience for Order #{feedbackOrder.id.slice(0, 8)}
                </p>

                <div className="flex justify-center space-x-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setFeedbackRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={
                          star <= feedbackRating
                            ? "text-brand-yellow fill-brand-yellow"
                            : "text-gray-200"
                        }
                      />
                    </button>
                  ))}
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-700 mb-2">
                    Comments (Optional)
                  </label>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Tell us what you liked or how we can improve..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow min-h-[100px] resize-none"
                  ></textarea>
                </div>

                <button
                  onClick={submitFeedback}
                  disabled={isSubmittingFeedback}
                  className="w-full bg-brand-yellow text-dark-bg font-bold py-3 rounded-full shadow-lg text-sm disabled:opacity-50"
                >
                  {isSubmittingFeedback ? "Submitting..." : "Submit Feedback"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Screens ---

function HomeScreen({
  searchQuery,
  setSearchQuery,
  onNavigate,
  products,
  categories,
  banners,
  favorites,
  cartItems,
  toggleFavorite,
  incrementCart,
  decrementCart,
  user,
  storeSettings,
}: any) {
  const navigate = useNavigate();
  const [selectedOffer, setSelectedOffer] = useState<CampaignSlide | null>(
    null,
  );

  const offerProducts = React.useMemo(() => {
    if (!selectedOffer) return [];

    switch (selectedOffer.id) {
      case "dyn_rated":
        return [...products]
          .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 10);
      case "dyn_saled":
        return [...products]
          .sort((a: any, b: any) => (b.reviewCount || 0) - (a.reviewCount || 0))
          .slice(0, 10);
      case "dyn_discount":
        return products.filter((p: any) => p.price < 50);
      case "dyn_trend":
        return [...products].sort(() => 0.5 - Math.random()).slice(0, 10);
      default:
        if (selectedOffer.link) {
          return products.filter(
            (p: any) =>
              p.category?.toLowerCase() === selectedOffer.link?.toLowerCase(),
          );
        }
        return [...products].sort(() => 0.5 - Math.random()).slice(0, 10);
    }
  }, [selectedOffer, products]);

  let displayedProducts = searchQuery
    ? products.filter(
        (p: any) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [...products];

  if (!searchQuery) {
    // Render all displayed products as is
  }

  if (selectedOffer) {
    return (
      <div className="flex flex-col w-full pb-4 animate-in fade-in pt-4">
        {/* Header & Back Button */}
        <div className="flex items-center px-4 mb-6">
          <button
            onClick={() => setSelectedOffer(null)}
            className="mr-4 p-2 bg-white shadow-sm rounded-full hover:bg-gray-100 transition"
          >
            <ArrowLeft size={20} className="text-dark-bg" />
          </button>
          <h1 className="text-xl font-bold text-dark-bg">
            {selectedOffer.title || "Special Offers"}
          </h1>
        </div>

        {/* Product Grid */}
        {offerProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20">
            <p className="text-gray-500 text-lg">
              No products found for this offer.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5 px-4 pb-6">
            {offerProducts.map((product: any, index: number) => (
              <ProductCard
                onProductClick={(p: any) => onNavigate(`Product_${p.id}`)}
                key={`${product.id}-${index}`}
                product={product}
                cartQuantity={
                  cartItems.find((i: any) => i.product.id === product.id)
                    ?.quantity || 0
                }
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={() => toggleFavorite(product.id)}
                onIncrement={() => incrementCart(product)}
                onDecrement={() => decrementCart(product)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-4">
      <div className="sticky top-0 z-20 bg-light-bg pt-4 pb-2 mb-2 px-4 md:px-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for groceries, items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white rounded-xl py-3.5 pl-12 pr-4 text-sm shadow-[0_2px_10px_rgba(0,0,0,0.05)] outline-none border border-gray-100"
          />
          <Search size={18} className="absolute left-4 top-4 text-gray-500" />
        </div>
      </div>

      {!searchQuery && banners && banners.length > 0 && (
        <div className="mb-4">
          <BannerSlider
            slides={banners.map((b: any) => ({
              id: b.id,
              title: b.title || "",
              imageUrl: b.imageUrl || b.image || "",
              link: b.link || "",
            }))}
          />
        </div>
      )}

      {!searchQuery && categories && categories.length > 0 && (
        <div className="mb-8 md:mb-10 bg-transparent pt-2 pb-1">
          <div className="flex justify-between items-center px-4 md:px-2 mb-5">
            <h2 className="font-bold text-dark-bg text-sm md:text-xl">
              Shop by Category
            </h2>
            <button
              onClick={() => onNavigate("Categories")}
              className="text-[#FFC107] font-bold text-xs md:text-sm hover:underline"
            >
              See All
            </button>
          </div>
          <div className="flex overflow-x-auto px-4 md:px-2 space-x-5 md:space-x-8 scrollbar-hide pb-4">
            {categories.map((cat: any, index: number) => (
              <div
                key={`${cat.id}-${index}`}
                onClick={() => onNavigate(`Category_${cat.id}`)}
                className="flex flex-col items-center cursor-pointer shrink-0 w-[64px] md:w-[96px] group"
              >
                <div className="w-full h-[50px] md:h-[80px] flex items-center justify-center mb-2 md:mb-3 bg-white shadow-sm md:shadow-sm rounded-xl p-2 group-hover:shadow-md transition-shadow">
                  <img
                    src={
                      cat.imageUrl ||
                      cat.image ||
                      logoImage
                    }
                    alt={cat.name}
                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        logoImage;
                    }}
                  />
                </div>
                <span className="text-[10px] md:text-sm font-bold text-dark-bg text-center leading-tight">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 md:px-2">
        <h2 className="font-bold text-dark-bg text-lg md:text-xl mb-4 md:mb-6">
          {searchQuery ? "Search Results" : "Explore All Products"}
        </h2>
        {displayedProducts.length === 0 ? (
          <div className="flex items-center justify-center p-8 text-gray-500">
            No products found.
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5">
            {displayedProducts.map((product: any, index: number) => {
              // Show banner after the 6th item, or after the last item if less than 6 items
              const finalShowBanner =
                index === 5 ||
                (displayedProducts.length < 6 &&
                  index === displayedProducts.length - 1);

              return (
                <React.Fragment key={`${product.id}-${index}`}>
                  <ProductCard
                    onProductClick={(p: any) => onNavigate(`Product_${p.id}`)}
                    product={product}
                    cartQuantity={
                      cartItems.find((i: any) => i.product.id === product.id)
                        ?.quantity || 0
                    }
                    isFavorite={favorites.includes(product.id)}
                    onToggleFavorite={() => toggleFavorite(product.id)}
                    onIncrement={() => incrementCart(product)}
                    onDecrement={() => decrementCart(product)}
                  />

                  {finalShowBanner &&
                    !searchQuery &&
                    products &&
                    products.length > 0 && (
                      <div className="col-span-full my-2 -mx-4 px-4 md:mx-0 md:px-0">
                        {(() => {
                          const topDeal =
                            products.find((p: any) => p.price < 50) ||
                            products[0];
                          const bestSeller =
                            products.length > 0
                              ? [...products].sort(
                                  (a: any, b: any) =>
                                    (b.reviewCount || 0) - (a.reviewCount || 0),
                                )[0]
                              : null;

                          const generatedSlides = [];
                          if (topDeal) {
                            generatedSlides.push({
                              id: "top-deal-" + topDeal.id,
                              title: topDeal.name,
                              subtitle: `Only ₹${topDeal.price}`,
                              imageUrl:
                                topDeal.imageUrl ||
                                topDeal.image ||
                                topDeal.photoUrl ||
                                "",
                              badgeText: "HOT DEAL",
                              badgeColor: "#F44336",
                              link: "",
                            });
                          }
                          // Only add bestSeller if it's a different product, or if we want multiple we can just add it
                          if (bestSeller && bestSeller.id !== topDeal?.id) {
                            generatedSlides.push({
                              id: "best-seller-" + bestSeller.id,
                              title: bestSeller.name,
                              subtitle: "Highly Rated",
                              imageUrl:
                                bestSeller.imageUrl ||
                                bestSeller.image ||
                                bestSeller.photoUrl ||
                                "",
                              badgeText: "BEST SELLER",
                              badgeColor: "#4CAF50",
                              link: "",
                            });
                          }

                          // Ensure we have at least something if they are the same
                          if (
                            generatedSlides.length === 1 &&
                            products.length > 1
                          ) {
                            const another = products.find(
                              (p: any) =>
                                p.id !==
                                generatedSlides[0].id
                                  .replace("top-deal-", "")
                                  .replace("best-seller-", ""),
                            );
                            if (another) {
                              generatedSlides.push({
                                id: "featured-" + another.id,
                                title: another.name,
                                subtitle: another.category
                                  ? `Featured ${another.category}`
                                  : "Featured Product",
                                imageUrl:
                                  another.imageUrl ||
                                  another.image ||
                                  another.photoUrl ||
                                  "",
                                badgeText: "FEATURED",
                                badgeColor: "#FFC107",
                                link: "",
                              });
                            }
                          }

                          return generatedSlides.length > 0 ? (
                            <SecondaryBannerSlider
                              slides={generatedSlides}
                              onSlideClick={(slide) => {
                                const pid = slide.id
                                  .replace("top-deal-", "")
                                  .replace("best-seller-", "")
                                  .replace("featured-", "");
                                if (
                                  pid &&
                                  products.find((p: any) => p.id === pid)
                                ) {
                                  onNavigate(`Product_${pid}`);
                                } else {
                                  setSelectedOffer(slide);
                                }
                              }}
                            />
                          ) : null;
                        })()}
                      </div>
                    )}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
      {/* Anjan Store Information */}
      <div className="px-4 mt-12 mb-8">
        <h2 className="font-bold text-dark-bg text-[15px] mb-4">
          Anjan Store Information
        </h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
          {[
            { text: "About Us", path: "about-us" },
            { text: "FAQ", path: "faq" },
            {
              text: "Customer Support",
              path: "/customer-support",
              isAbsolute: true,
            },
            {
              text: "Shipping & Delivery Policy",
              path: "shipping-delivery-policy",
            },
            { text: "Terms & Conditions", path: "terms-conditions" },
            { text: "Privacy Policy", path: "privacy-policy" },
          ].map((item, idx) => (
            <div
              key={`${item.text}-${idx}`}
              onClick={() =>
                navigate(
                  item.isAbsolute ? item.path : `/static_page/${item.path}`,
                )
              }
              className={`flex justify-between items-center px-5 py-4 cursor-pointer ${idx !== 5 ? "border-b border-gray-50" : ""}`}
            >
              <span className="font-bold text-sm text-dark-bg">
                {item.text}
              </span>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Contact Us / Customer Helpdesk */}
      {storeSettings &&
        (storeSettings.supportEmail || storeSettings.supportPhone) && (
          <div className="px-4 mb-10">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-50 p-6 flex flex-col items-center">
              <h2 className="font-bold text-dark-bg text-lg mb-2">
                We're here to help!
              </h2>
              <p className="text-gray-500 text-sm text-center mb-6">
                If you have any issues with your order or need assistance,
                please contact us.
              </p>

              <div className="w-full flex flex-col space-y-3 max-w-sm">
                {(storeSettings.supportWhatsapp ||
                  storeSettings.supportPhone) && (
                  <a
                    href={`https://wa.me/${(storeSettings.supportWhatsapp || storeSettings.supportPhone).match(/\+?[\d\s-]{8,}/)?.[0]?.replace(/\D/g, "") || (storeSettings.supportWhatsapp || storeSettings.supportPhone).replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-[#4ade80] hover:bg-opacity-90 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-opacity"
                  >
                    <Phone size={18} />
                    <span>Chat on WhatsApp</span>
                  </a>
                )}
                {storeSettings.supportPhone && (
                  <a
                    href={`tel:${storeSettings.supportPhone.match(/\+?[\d\s-]{8,}/)?.[0]?.replace(/\D/g, "") || storeSettings.supportPhone.replace(/\D/g, "")}`}
                    className="w-full py-3 bg-blue-600 hover:bg-opacity-90 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-opacity"
                  >
                    <Phone size={18} />
                    <span>Call Us</span>
                  </a>
                )}
                {storeSettings.supportEmail && (
                  <a
                    href={`mailto:${storeSettings.supportEmail.trim()}`}
                    className="w-full py-3 bg-[#0f172a] hover:bg-opacity-90 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-opacity"
                  >
                    <Mail size={18} />
                    <span>Email Support</span>
                  </a>
                )}
              </div>

              <div className="mt-6 flex flex-col space-y-2 text-center items-center justify-center">
                {storeSettings.supportWhatsapp && (
                  <div className="flex items-center justify-center text-sm text-gray-500 font-medium">
                    <Phone size={16} className="mr-2" />
                    <span>WhatsApp:&nbsp;</span>
                    <a
                      href={`https://wa.me/${storeSettings.supportWhatsapp.match(/\+?[\d\s-]{8,}/)?.[0]?.replace(/\D/g, "") || storeSettings.supportWhatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-dark-bg transition-colors font-semibold"
                    >
                      {storeSettings.supportWhatsapp}
                    </a>
                  </div>
                )}
                {storeSettings.supportPhone &&
                  storeSettings.supportPhone !==
                    storeSettings.supportWhatsapp && (
                    <div className="flex items-center justify-center text-sm text-gray-500 font-medium">
                      <Phone size={16} className="mr-2" />
                      <span>Phone:&nbsp;</span>
                      <a
                        href={`tel:${storeSettings.supportPhone.match(/\+?[\d\s-]{8,}/)?.[0]?.replace(/\D/g, "") || storeSettings.supportPhone.replace(/\D/g, "")}`}
                        className="hover:text-dark-bg transition-colors font-semibold"
                      >
                        {storeSettings.supportPhone}
                      </a>
                    </div>
                  )}
                {storeSettings.supportEmail && (
                  <div className="flex items-center justify-center text-sm text-gray-500 font-medium">
                    <Mail size={16} className="mr-2" />
                    <span>Email:&nbsp;</span>
                    <a
                      href={`mailto:${storeSettings.supportEmail.trim()}`}
                      className="hover:text-dark-bg transition-colors font-semibold"
                    >
                      {storeSettings.supportEmail}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      {/* Watermark */}
      <div className="flex flex-col items-center justify-center pt-10 pb-32 select-none">
        <span className="text-3xl font-black tracking-[0.2em] uppercase mb-2 text-gray-300">
          Anjan Store
        </span>
        <span className="text-[10px] font-bold tracking-[0.3em] uppercase mb-4 text-gray-300">
          All in one place
        </span>
        <span className="text-base md:text-lg font-bold text-gray-300 mb-8">
          Making your everyday life easier
        </span>
        <span className="text-[10px] text-gray-400 font-medium">
          crafted by: Nokyat Konyak (NiniBuild)
        </span>
      </div>
    </div>
  );
}

function CategoriesScreen({ categories, onNavigate }: any) {
  const [search, setSearch] = useState("");
  const filtered = categories.filter((c: any) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col w-full pb-4">
      <div className="sticky top-0 z-20 bg-light-bg pt-4 pb-4 px-4 mb-4 md:px-0 -mx-4 md:mx-0">
        <div className="relative px-4 md:px-0">
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white rounded-xl py-3.5 pl-12 pr-4 text-sm shadow-[0_2px_10px_rgba(0,0,0,0.05)] outline-none border border-gray-100 focus:border-[#FFC107]"
          />
          <Search
            size={18}
            className="absolute left-8 md:left-4 top-4 text-gray-400"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5 px-4 md:px-0">
        {filtered.map((cat: any, index: number) => (
          <div
            key={`${cat.id}-${index}`}
            onClick={() => onNavigate(`Category_${cat.id}`)}
            className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-lg transition-shadow cursor-pointer border border-gray-100 aspect-square group"
          >
            <div className="w-full h-full max-h-[70px] md:max-h-[110px] flex items-center justify-center mb-3">
              <img
                src={
                  cat.imageUrl ||
                  cat.image ||
                  logoImage
                }
                alt={cat.name}
                className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    logoImage;
                }}
              />
            </div>
            <span className="text-[11px] md:text-sm font-bold text-dark-bg text-center line-clamp-2 leading-tight">
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductDetailScreen({
  productId,
  products,
  onNavigate,
  cartItems,
  favorites,
  toggleFavorite,
  incrementCart,
  decrementCart,
  user,
}: any) {
  const product = products.find((p: any) => p.id === productId);
  if (!product)
    return (
      <div className="p-8 text-center text-gray-500">Product not found</div>
    );

  
  const [reviews, setReviews] = React.useState([]);
  const [newReviewText, setNewReviewText] = React.useState("");
  const [newReviewRating, setNewReviewRating] = React.useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = React.useState(false);

  React.useEffect(() => {
    if (!product) return;
    const q = query(collection(db, "products", product.id, "reviews"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setReviews(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => console.error("Reviews snapshot error:", error));
    return () => unsub();
  }, [product?.id]);

  const submitReview = async () => {
    if (!user) {
      alert("Please login to submit a review.");
      return;
    }
    if (!newReviewText.trim()) return;
    setIsSubmittingReview(true);
    try {
      await addDoc(collection(db, "products", product.id, "reviews"), {
        userId: user.uid,
        userName: user.displayName || user.email?.split("@")[0] || "User",
        rating: newReviewRating,
        comment: newReviewText,
        createdAt: serverTimestamp()
      });
      setNewReviewText("");
      setNewReviewRating(5);
    } catch (err) {
      console.error("Error adding review:", err);
      alert("Failed to submit review.");
    }
    setIsSubmittingReview(false);
  };

  const cartQuantity =
    cartItems.find((i: any) => i.product.id === product.id)?.quantity || 0;
  const isFavorite = favorites.includes(product.id);
  const images =
    product.images ||
    (product.imageUrl || product.image
      ? [product.imageUrl || product.image]
      : [
          logoImage,
        ]);

  return (
    <div className="flex flex-col w-full animate-in fade-in pb-20">
      <div className="relative w-full h-[300px] md:h-[400px] bg-white">
        <button
          onClick={() => onNavigate("Home")}
          className="absolute top-4 left-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm"
        >
          <ArrowLeft size={20} className="text-dark-bg" />
        </button>
        <button
          onClick={() => toggleFavorite(product.id)}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm border border-gray-100"
        >
          <Heart
            size={20}
            className={
              isFavorite ? "fill-[#FFC107] text-[#FFC107]" : "text-gray-400"
            }
          />
        </button>
        <div className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          {images.map((img: string, idx: number) => (
            <div
              key={idx}
              className="w-full h-full shrink-0 snap-center flex items-center justify-center p-8"
            >
              <img
                src={img}
                alt={`${product.name} - image ${idx + 1}`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    logoImage;
                }}
              />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2 z-10 pointer-events-none">
            {images.map((_: any, idx: number) => (
              <div key={idx} className="w-2 h-2 rounded-full bg-dark-bg/20" />
            ))}
          </div>
        )}
      </div>
      <div className="p-5 bg-white rounded-t-3xl -mt-6 relative z-10 flex-1 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] border-t border-gray-100">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl font-bold text-dark-bg">{product.name}</h1>
          <h2 className="text-xl font-bold text-dark-bg">₹{product.price}</h2>
        </div>
        <span className="inline-block text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md mb-4">
          {product.category}
        </span>

        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          {product.description ||
            "No description provided."}
        </p>

        <div className="mt-8">
          {cartQuantity === 0 ? (
            <button
              onClick={() => incrementCart(product)}
              className="w-full bg-brand-yellow text-dark-bg font-bold py-3.5 rounded-xl shadow-sm flex items-center justify-center transition-transform active:scale-95"
            >
              <ShoppingCart size={18} className="mr-2" />
              Add to Cart
            </button>
          ) : (
            <div className="flex items-center justify-between bg-brand-yellow/10 border border-brand-yellow/30 rounded-xl p-2">
              <button
                onClick={() => decrementCart(product)}
                className="w-12 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-dark-bg shadow-sm"
              >
                -
              </button>
              <span className="font-bold text-lg text-dark-bg">
                {cartQuantity}
              </span>
              <button
                onClick={() => incrementCart(product)}
                className="w-12 h-10 bg-brand-yellow rounded-lg flex items-center justify-center font-bold text-dark-bg shadow-sm"
              >
                +
              </button>
            </div>
          )}
        
        </div>
        <div className="mt-8 border-t border-gray-100 pt-6">
          <h3 className="text-xl font-bold text-dark-bg mb-4">Reviews</h3>
          
          <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h4 className="font-bold text-gray-800 mb-2">Write a Review</h4>
            <div className="flex space-x-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setNewReviewRating(star)}
                  className="focus:outline-none"
                >
                  <Heart
                    size={24}
                    className={
                      star <= newReviewRating
                        ? "fill-[#FFC107] text-[#FFC107]"
                        : "text-gray-300"
                    }
                  />
                </button>
              ))}
            </div>
            <textarea
              className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-yellow mb-3 min-h-[80px]"
              placeholder="What do you think about this product?"
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
            />
            <button
              onClick={submitReview}
              disabled={isSubmittingReview || !newReviewText.trim()}
              className="w-full bg-dark-bg text-white font-bold py-2 rounded-lg shadow-sm disabled:opacity-50"
            >
              {isSubmittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </div>

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review: any) => (
                <div key={review.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-800 text-sm">{review.userName}</span>
                    <div className="flex space-x-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Heart
                          key={star}
                          size={12}
                          className={
                            star <= review.rating
                              ? "fill-[#FFC107] text-[#FFC107]"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function CategoryDetailScreen({
  categoryId,
  categories,
  products,
  onNavigate,
  favorites,
  cartItems,
  toggleFavorite,
  incrementCart,
  decrementCart,
  user,
}: any) {
  const cat = categories.find((c: any) => c.id === categoryId);
  const catProducts = products.filter(
    (p: any) => p.category === cat?.name || p.categoryId === categoryId,
  );

  return (
    <div className="flex flex-col w-full p-4 animate-in fade-in">
      <div
        className="flex items-center mb-6 cursor-pointer"
        onClick={() => onNavigate("Categories")}
      >
        <ArrowLeft size={24} className="text-dark-bg mr-3" />
        <h2 className="text-xl font-bold text-dark-bg">
          {cat?.name || "Category"}
        </h2>
      </div>
      {catProducts.length === 0 ? (
        <div className="flex items-center justify-center p-8 text-gray-500">
          No products in this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5 pb-6">
          {catProducts.map((product: any, index: number) => (
            <ProductCard
              onProductClick={(p: any) => onNavigate(`Product_${p.id}`)}
              key={`${product.id}-${index}`}
              product={product}
              cartQuantity={
                cartItems.find((i: any) => i.product.id === product.id)
                  ?.quantity || 0
              }
              isFavorite={favorites.includes(product.id)}
              onToggleFavorite={() => toggleFavorite(product.id)}
              onIncrement={() => incrementCart(product)}
              onDecrement={() => decrementCart(product)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CartScreen({
  cartItems,
  setCartItems,
  savedAddress,
  savedPhone,
  incrementCart,
  decrementCart,
  user,
  onNavigate,
}: any) {
  const total = cartItems.reduce(
    (acc: number, item: any) => acc + item.product.price * item.quantity,
    0,
  );
  const [showConfirm, setShowConfirm] = useState(false);
  const [deliveryType, setDeliveryType] = useState("Instant delivery");

  const handleCheckout = async () => {
    if (!savedAddress || !savedPhone) {
      alert(
        "Please update your Delivery Address and Phone in the Profile tab first.",
      );
      onNavigate("Profile");
      return;
    }

    if (!auth?.currentUser || !db) return;

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const orderData = {
      customerId: auth.currentUser.uid,
      customerName: auth.currentUser.displayName || "Customer",
      phone: savedPhone,
      address: savedAddress,
      items: cartItems.map((i: any) => ({
        productId: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
      })),
      totalPrice: total,
      deliveryFee: 0,
      deliveryType,
      status: "Pending Approval",
      deliveryOtp: otp,
      createdAt: serverTimestamp(),
      createdAtMs: Date.now(),
    };

    try {
      await addDoc(collection(db, "orders"), orderData);
      setCartItems([]);
      setShowConfirm(false);
      onNavigate("Orders");
    } catch (e) {
      console.error(e);
      alert("Failed to place order");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col w-full h-full items-center justify-center p-4 animate-in fade-in pt-32">
        <ShoppingCart size={64} className="text-gray-300 mb-4" />
        <h2 className="text-xl text-gray-500 font-medium">
          Your cart is empty
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full p-4 h-full relative animate-in fade-in">
      <div className="bg-[#FFF9E6] rounded-xl p-3 flex mb-4">
        <MapPin size={20} className="text-[#FFC107] shrink-0 mr-2 mt-0.5" />
        <div>
          <span className="font-bold text-sm text-dark-bg block mb-1">
            Delivering to:
          </span>
          <span className="text-xs text-gray-600 line-clamp-2">
            {savedAddress ||
              "No address provided! Please update your Profile settings."}
          </span>
        </div>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pb-48">
        {cartItems.map((item: any, index: number) => (
          <div
            key={`${item.product.id}-${index}`}
            className="bg-white rounded-xl p-3 flex items-center shadow-sm border border-gray-100"
          >
            <img
              src={
                item.product.imageUrl ||
                item.product.image ||
                logoImage
              }
              alt={item.product.name}
              className="w-16 h-16 rounded-lg object-cover bg-gray-50 mr-3 shrink-0"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  logoImage;
              }}
            />
            <div className="flex flex-col flex-1">
              <span className="font-bold text-sm text-dark-bg line-clamp-1 mb-1">
                {item.product.name}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                ₹{item.product.price}
              </span>
            </div>
            <div className="flex items-center bg-gray-50 rounded-lg h-8 px-1 ml-2 border border-gray-100 shrink-0">
              <button
                onClick={() => decrementCart(item.product)}
                className="w-7 h-full flex items-center justify-center"
              >
                <Minus size={14} className="text-dark-bg" />
              </button>
              <span className="font-bold text-dark-bg text-sm px-1 min-w-[20px] text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => incrementCart(item.product)}
                className="w-7 h-full flex items-center justify-center"
              >
                <Plus size={14} className="text-dark-bg" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 absolute bottom-0 left-0 right-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-3xl border-t border-gray-100 z-10 pb-24">
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
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-lg mb-4">Confirm Delivery Request</h3>
            <div className="space-y-3 mb-6">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="delivery"
                  checked={deliveryType === "Instant delivery"}
                  onChange={() => setDeliveryType("Instant delivery")}
                  className="w-4 h-4 text-brand-yellow focus:ring-brand-yellow"
                />
                <span className="text-sm font-medium">⚡ Instant delivery</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="delivery"
                  checked={deliveryType === "1 day delivery"}
                  onChange={() => setDeliveryType("1 day delivery")}
                  className="w-4 h-4 text-brand-yellow focus:ring-brand-yellow"
                />
                <span className="text-sm font-medium">📦 1 day delivery</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="delivery"
                  checked={deliveryType === "1 week delivery"}
                  onChange={() => setDeliveryType("1 week delivery")}
                  className="w-4 h-4 text-brand-yellow focus:ring-brand-yellow"
                />
                <span className="text-sm font-medium">🚚 1 week delivery</span>
              </label>
            </div>

            <h4 className="font-bold text-sm mb-2 text-dark-bg">
              Payment Method
            </h4>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-dark-bg">
                Pay on Delivery
              </span>
              <div className="w-4 h-4 rounded-full border-4 border-brand-yellow bg-white"></div>
            </div>

            <p className="text-xs text-gray-500 mb-6">
              Delivery fees are calculated by the store manager. The final
              amount will be collected at the time of delivery. You can pay via
              Cash or Online when you share your 4-digit Delivery PIN with the
              rider.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium"
              >
                Cancel
              </button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCheckout}
                className="flex-1 py-2.5 rounded-lg bg-brand-yellow text-dark-bg font-bold"
              >
                Confirm
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OrdersScreen({ orders }: any) {
  const activeOrders = orders.filter(
    (order: any) =>
      order.status !== "Delivered" && order.status !== "Cancelled",
  );

  const getTrackingProgress = (status: string) => {
    switch (status) {
      case "Pending Approval":
      case "Awaiting Payment":
      case "Bill Sent":
        return 10;
      case "Confirmed":
      case "Packed":
        return 30;
      case "Accepted":
      case "Processing":
      case "Ready for Delivery":
      case "Accepted by Delivery Boy":
        return 60;
      case "Out for Delivery":
        return 90;
      case "Delivered":
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto p-4 animate-in fade-in bg-white min-h-full">
      {activeOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-gray-500 mt-20">
          <Store size={48} className="text-gray-300 mb-4" />
          <p className="text-lg font-medium text-dark-bg mb-2">
            No active orders
          </p>
          <p className="text-sm text-center">
            You have no active orders right now. Check your history to see past
            orders.
          </p>
        </div>
      ) : (
        <div className="space-y-6 pb-6 mt-2">
          {activeOrders.map((order: any, index: number) => {
            const total = (order.total || 0) + (order.deliveryFee || 0);
            return (
              <div
                key={`${order.id}-${index}`}
                className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] p-5 border border-gray-50"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="font-bold text-dark-bg text-sm">
                    Order ID: {order.id.slice(0, 8)}...
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {order.date}
                  </span>
                </div>

                <div className="w-full relative bg-blue-50 rounded-lg h-32 flex items-center justify-center overflow-hidden mb-3">
                  {/* Faded Map Background */}
                  <Map className="absolute w-full h-full p-4 text-gray-300 opacity-50" />

                  <div className="z-10 flex flex-col items-center">
                    {order.status === "Out for Delivery" ? (
                      <>
                        <Bike className="w-12 h-12 text-pink-500" />
                        <span className="font-bold text-pink-500 mt-1">
                          Rider is on the way
                        </span>
                      </>
                    ) : order.status === "Delivered" ? (
                      <>
                        <CheckCircle className="w-12 h-12 text-green-500" />
                        <span className="font-bold text-green-500 mt-1">
                          Delivered
                        </span>
                      </>
                    ) : (
                      <>
                        <Store className="w-12 h-12 text-blue-500" />
                        <span className="font-bold text-blue-500 mt-1">
                          Processing at Store
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getTrackingProgress(order.status)}%` }}
                  ></div>
                </div>

                <div className="flex items-center mb-4">
                  <div
                    className={`w-1.5 h-1.5 rounded-full mr-2 ${order.status === "Out for Delivery" ? "bg-pink-500" : "bg-blue-500"}`}
                  ></div>
                  <span
                    className={`text-xs font-bold ${order.status === "Out for Delivery" ? "text-pink-600" : "text-blue-600"}`}
                  >
                    {order.status || "Processing"}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items &&
                    order.items.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex justify-between text-xs text-gray-600"
                      >
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-bold text-dark-bg">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  <div className="flex justify-between text-xs text-gray-400 pt-1">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-dark-bg">
                      ₹{order.deliveryFee || 30.0}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="font-bold text-dark-bg text-sm">
                    Total Bill: ₹{total.toFixed(1)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function OrderHistoryScreen({ orders, onNavigate, onLeaveFeedback }: any) {
  const pastOrders = orders.filter(
    (order: any) =>
      order.status === "Delivered" || order.status === "Cancelled",
  );

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto p-4 animate-in fade-in bg-white min-h-full">
      <div
        className="flex items-center mb-6 cursor-pointer"
        onClick={() => onNavigate("Profile")}
      >
        <ArrowLeft size={24} className="text-dark-bg mr-3" />
        <h2 className="text-xl font-bold text-dark-bg">Order History</h2>
      </div>

      {pastOrders.length === 0 ? (
        <div className="flex items-center justify-center p-8 text-gray-500">
          No past orders.
        </div>
      ) : (
        <div className="space-y-4 pb-6 mt-2">
          {pastOrders.map((order: any, index: number) => {
            const total = (order.total || 0) + (order.deliveryFee || 0);
            return (
              <div
                key={`${order.id}-${index}`}
                className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] p-5 border border-gray-50"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="font-bold text-dark-bg text-sm">
                    Order ID: {order.id.slice(0, 8)}...
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {order.date}
                  </span>
                </div>

                <div className="flex items-center mb-4">
                  <div
                    className={`w-1.5 h-1.5 rounded-full mr-2 ${order.status === "Cancelled" ? "bg-red-500" : "bg-green-500"}`}
                  ></div>
                  <span
                    className={`text-xs font-bold ${order.status === "Cancelled" ? "text-red-600" : "text-green-600"}`}
                  >
                    {order.status || "Delivered"}
                  </span>
                  {order.status === "Delivered" && (
                    <span className="ml-auto text-[10px] text-gray-500 font-medium">
                      Paid via: {order.paymentMethod || "Cash"}
                    </span>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  {order.items &&
                    order.items.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex justify-between text-xs text-gray-600"
                      >
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-bold text-dark-bg">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  <div className="flex justify-between text-xs text-gray-400 pt-1">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-dark-bg">
                      ₹{order.deliveryFee || 30.0}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="font-bold text-dark-bg text-sm">
                    Total Bill: ₹{total.toFixed(1)}
                  </span>
                  {order.status === "Delivered" && (
                    <button
                      onClick={() => onLeaveFeedback && onLeaveFeedback(order)}
                      className="text-[#FFC107] font-bold text-xs px-3 py-1.5 bg-[#FFC107]/10 rounded-full"
                    >
                      Leave Feedback
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FavoritesScreen({
  products,
  onNavigate,
  favorites,
  cartItems,
  toggleFavorite,
  incrementCart,
  decrementCart,
  user,
}: any) {
  const favoriteProducts = products.filter((p: any) =>
    favorites.includes(p.id),
  );
  return (
    <div className="flex flex-col w-full p-4 animate-in fade-in">
      <div
        className="flex items-center mb-6 cursor-pointer"
        onClick={() => onNavigate("Home")}
      >
        <ArrowLeft size={24} className="text-dark-bg mr-3" />
        <h2 className="text-xl font-bold text-dark-bg">My Favorites</h2>
      </div>
      {favoriteProducts.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-400 mt-20">
          You haven't saved any favorites yet.
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5 pb-6">
          {favoriteProducts.map((product: any, index: number) => (
            <ProductCard
              onProductClick={(p: any) => onNavigate(`Product_${p.id}`)}
              key={`${product.id}-${index}`}
              product={product}
              cartQuantity={
                cartItems.find((i: any) => i.product.id === product.id)
                  ?.quantity || 0
              }
              isFavorite={true}
              onToggleFavorite={() => toggleFavorite(product.id)}
              onIncrement={() => incrementCart(product)}
              onDecrement={() => decrementCart(product)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationsScreen({ notifications, onNavigate }: any) {
  const handleNotificationClick = async (notif: any) => {
    if (!notif.isRead && auth?.currentUser) {
      try {
        await updateDoc(
          doc(db, "users", auth.currentUser.uid, "notifications", notif.id),
          {
            isRead: true,
          },
        );
      } catch (e) {
        console.error("Error marking notification as read:", e);
      }
    }
  };

  return (
    <div className="flex flex-col w-full p-4 animate-in fade-in">
      <div
        className="flex items-center mb-6 cursor-pointer"
        onClick={() => onNavigate("Home")}
      >
        <ArrowLeft size={24} className="text-dark-bg mr-3" />
        <h2 className="text-xl font-bold text-dark-bg">Notifications</h2>
      </div>
      {!notifications || notifications.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-400 mt-20">
          No new notifications
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif: any, index: number) => (
            <div
              key={`${notif.id}-${index}`}
              onClick={() => handleNotificationClick(notif)}
              className={`p-4 rounded-xl border cursor-pointer transition-colors ${notif.isRead ? "bg-white border-gray-100" : "bg-[#FFF9E6] border-yellow-200 hover:bg-yellow-50"}`}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-dark-bg text-sm">
                  {notif.title}
                </h4>
                {!notif.isRead && (
                  <span className="w-2 h-2 rounded-full bg-red-500 mt-1"></span>
                )}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-2">
                {notif.message}
              </p>
              <span className="text-[10px] text-gray-400">
                {new Date(notif.timestamp).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileScreen({
  savedAddress,
  savedPhone,
  profileImage,
  onNavigate,
}: any) {
  const user = auth?.currentUser;
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.displayName || "");
  const [phone, setPhone] = useState(savedPhone);
  const [address, setAddress] = useState(savedAddress);
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user || !db) return;
    setLoading(true);
    try {
      if (name !== user.displayName) {
        await updateProfile(user, { displayName: name });
      }
      await setDoc(
        doc(db, "users", user.uid),
        {
          name,
          whatsappNumber: phone,
          address,
          email: user.email,
        },
        { merge: true },
      );
      alert("Settings saved successfully!");
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      alert("Error saving settings");
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );
          const data = await res.json();
          if (data && data.display_name) {
            setAddress(data.display_name);
          } else {
            alert("Could not fetch address details.");
          }
        } catch (e) {
          console.error(e);
          alert("Error fetching address.");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error(error);
        alert("Unable to retrieve your location");
        setIsLocating(false);
      },
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user || !storage)
      return;
    const file = e.target.files[0];
    setImageUploadLoading(true);
    try {
      const storageRef = ref(
        storage,
        `users/${user.uid}/profile_${Date.now()}`,
      );
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await setDoc(
        doc(db, "users", user.uid),
        { profileImage: url },
        { merge: true },
      );
      await updateProfile(user, { photoURL: url });
    } catch (error) {
      console.error(error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setImageUploadLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full p-4 items-center animate-in fade-in pb-24 max-w-2xl w-full mx-auto">
      {!isEditing ? (
        <div className="flex flex-col items-center text-center w-full">
          <div className="w-24 h-24 bg-dark-bg text-[#FFC107] rounded-full flex items-center justify-center text-4xl font-bold mb-6 shadow-md overflow-hidden">
            {profileImage || user?.photoURL ? (
              <img
                src={profileImage || user?.photoURL || ""}
                className="w-full h-full object-cover"
                alt="Profile"
              />
            ) : name ? (
              name.charAt(0).toUpperCase()
            ) : (
              user?.email?.charAt(0).toUpperCase() || "U"
            )}
          </div>
          <h2 className="text-2xl font-bold text-dark-bg">
            {name || "No Name Provided"}
          </h2>
          <p className="text-gray-500 mt-1">
            {user?.email || "No Email Provided"}
          </p>
          <p className="text-gray-600 mt-2 text-sm font-medium">
            WhatsApp: {phone || "N/A"}
          </p>
          <p className="text-gray-600 mt-1 text-sm font-medium">
            Address: {address || "N/A"}
          </p>

          <button
            onClick={() => setIsEditing(true)}
            className="mt-6 w-full bg-brand-yellow text-dark-bg font-bold py-3 rounded-lg shadow-sm"
          >
            Edit Profile
          </button>

          <button
            onClick={() => onNavigate("OrderHistory")}
            className="mt-4 w-full bg-white border border-gray-200 text-dark-bg font-bold py-3 rounded-lg flex items-center justify-center shadow-sm"
          >
            <History size={18} className="mr-2" />
            View Order History
          </button>

          <button
            onClick={() => signOut(auth)}
            className="mt-8 w-full border-2 border-red-500 text-red-500 font-bold py-3 rounded-lg bg-transparent"
          >
            Logout
          </button>
        </div>
      ) : (
        <form onSubmit={handleSave} className="flex flex-col space-y-4 w-full">
          <div className="w-24 h-24 bg-dark-bg text-[#FFC107] rounded-full flex items-center justify-center text-4xl font-bold mb-6 mx-auto shadow-md relative overflow-hidden group">
            {imageUploadLoading ? (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            ) : (
              <>
                {profileImage || user?.photoURL ? (
                  <img
                    src={profileImage || user?.photoURL || ""}
                    className="w-full h-full object-cover"
                    alt="Profile"
                  />
                ) : name ? (
                  name.charAt(0).toUpperCase()
                ) : (
                  user?.email?.charAt(0).toUpperCase() || "U"
                )}
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={24} className="text-white mb-1" />
                  <span className="text-white text-[10px] font-medium">
                    Upload
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  capture="user"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImageUpload}
                />
              </>
            )}
          </div>
          <input
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-dark-bg outline-none"
            placeholder="Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="w-full border border-gray-300 rounded-lg p-3 text-sm bg-gray-50 text-gray-500 outline-none"
            type="email"
            placeholder="Email *"
            value={user?.email || ""}
            disabled
          />
          <input
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-dark-bg outline-none"
            placeholder="WhatsApp Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-dark-bg outline-none resize-none"
            placeholder="Full Delivery Address *"
            rows={2}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          ></textarea>

          <button
            type="button"
            onClick={handleGetLocation}
            disabled={isLocating}
            className="flex items-center justify-center w-full bg-blue-50 text-blue-600 border border-blue-200 font-medium py-2 rounded-lg text-sm mt-1 transition-colors hover:bg-blue-100"
          >
            {isLocating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>{" "}
                Locating...
              </>
            ) : (
              <>
                <MapPin size={16} className="mr-2" /> Use My Current Location
              </>
            )}
          </button>

          <div className="flex space-x-4 mt-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 border border-gray-300 py-3 rounded-lg font-bold text-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-brand-yellow text-dark-bg py-3 rounded-lg font-bold"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// --- Shared Components ---

function ProductCard({
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
        className="relative h-[100px] md:h-[130px] w-full shrink-0 p-3 flex items-center justify-center border-b border-gray-50 cursor-pointer"
        onClick={() => onProductClick && onProductClick(product)}
      >
        <img
          src={
            product.imageUrl ||
            product.image ||
            logoImage
          }
          alt={product.name}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              logoImage;
          }}
        />
      </div>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm z-10 border border-gray-100"
      >
        <Heart
          size={14}
          className={
            isFavorite ? "fill-[#FFC107] text-[#FFC107]" : "text-gray-400"
          }
        />
      </motion.button>
      <div className="p-2 md:p-3 flex flex-col flex-1 justify-between">
        <div
          onClick={() => onProductClick && onProductClick(product)}
          className="cursor-pointer"
        >
          <h3 className="font-bold text-dark-bg text-[11px] md:text-sm line-clamp-1 mb-1">
            {product.name}
          </h3>
          <span className="inline-block text-[9px] md:text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-sm mb-1">
            {product.category}
          </span>
        </div>
        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="font-bold text-xs md:text-sm text-dark-bg">
            ₹{product.price.toFixed(1)}
          </span>
          {cartQuantity > 0 ? (
            <div className="flex items-center bg-brand-yellow/20 rounded-md border border-brand-yellow/30">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDecrement(product);
                }}
                className="w-6 h-6 flex items-center justify-center text-dark-bg font-bold"
              >
                -
              </motion.button>
              <span className="w-5 text-center text-[10px] md:text-xs font-bold text-dark-bg">
                {cartQuantity}
              </span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onIncrement(product);
                }}
                className="w-6 h-6 flex items-center justify-center text-dark-bg font-bold"
              >
                +
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onIncrement(product);
              }}
              className="bg-white border border-brand-yellow text-brand-yellow text-[10px] md:text-[11px] font-bold px-3 py-1 rounded-md shadow-sm"
            >
              ADD
            </motion.button>
          )}
      </div>
      </div>
    </div>
  );
}
