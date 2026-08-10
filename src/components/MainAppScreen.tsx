import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { motion } from "motion/react";
import {
  Home,
  Grid,
  List as ListIcon,
  ShoppingCart,
  Search,
  Heart,
  Moon,
  Sun,
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
  ChevronLeft,
  Phone,
  RefreshCcw,
  Map,
  Bike,
  Store,
  History,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthScreen from "./AuthScreen";
import { HomeScreen, CartScreen, CategoriesScreen, FavoritesScreen, ProductDetailsScreen, CategoryScreen } from "./Screens";
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
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import SecondaryBannerSlider, { CampaignSlide } from "./SecondaryBannerSlider";
import BannerSlider from "./BannerSlider";

export default function MainAppScreen() {
  const navigate = useNavigate();
  const user = auth?.currentUser;
  const [selectedItem, setSelectedItem] = useState("Home");
  const [navHistory, setNavHistory] = useState<string[]>(["Home"]);

  const handleNavigate = (item: string) => {
    if (item.startsWith("optimistic_read_")) {
      const id = item.replace("optimistic_read_", "");
      const updateFn = (prev: any[]) => prev.map(n => n.id === id ? { ...n, isRead: true } : n);
      setNotifications1(updateFn);
      setNotifications2(updateFn);
      setNotifications3(updateFn);
      return;
    }
    if (item.startsWith("optimistic_delete_")) {
      const id = item.replace("optimistic_delete_", "");
      const filterFn = (prev: any[]) => prev.filter(n => n.id !== id);
      setNotifications1(filterFn);
      setNotifications2(filterFn);
      setNotifications3(filterFn);
      return;
    }
    if (item === "Back") {
      handleGoBack();
      return;
    }
    setNavHistory((prev) => {
      if (prev[prev.length - 1] === item) return prev;
      return [...prev, item];
    });
    setSelectedItem(item);
  };

  const handleGoBack = () => {
    setNavHistory((prev) => {
      if (prev.length > 1) {
        const newHistory = [...prev];
        newHistory.pop();
        const prevItem = newHistory[newHistory.length - 1];
        setSelectedItem(prevItem);
        return newHistory;
      }
      return prev;
    });
  };
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
  const [notifications1, setNotifications1] = useState<any[]>([]);
  const [notifications2, setNotifications2] = useState<any[]>([]);
  const [notifications3, setNotifications3] = useState<any[]>([]);

  const notifications = React.useMemo(() => {
    const all = [...notifications1, ...notifications2, ...notifications3];
    const uniqueMap = new window.Map();
    all.forEach(n => {
      if (!uniqueMap.has(n.id)) uniqueMap.set(n.id, n);
    });
    return Array.from(uniqueMap.values()).sort(
      (a: any, b: any) => (b.timestamp || 0) - (a.timestamp || 0)
    );
  }, [notifications1, notifications2, notifications3]);

  const previousOrderStatuses = React.useRef<Record<string, string>>({});


  // User Profile
  const [savedAddress, setSavedAddress] = useState("");
  const [savedPhone, setSavedPhone] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const [storeSettings, setStoreSettings] = useState<{
    supportEmail?: string;
    supportPhone?: string;
    supportWhatsapp?: string;
    deliveryFee?: number;
    handlingFee?: number;
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
        (error) => console.warn("Categories snapshot error:", error?.message)
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
        (error) => console.warn("Products snapshot error:", error?.message)
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
        (error) => console.warn("Banners snapshot error:", error?.message)
      )
    );

    // Listen to Settings
    unsubs.push(
      onSnapshot(doc(db, "settings", "store"), (docSnap) => {
        if (docSnap.exists()) {
          setStoreSettings(docSnap.data() as any);
        }
      }, (error) => console.warn("Settings snapshot error:", error?.message)),
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

          snapshot.docChanges().forEach((change) => {
            const data = change.doc.data();
            const orderId = change.doc.id;
            const newStatus = data.status || "";
            const otp = data.deliveryOtp || "";

            if (change.type === "added") {
              previousOrderStatuses.current[orderId] = newStatus;
            } else if (change.type === "modified") {
              const oldStatus = previousOrderStatuses.current[orderId];
              
              if (oldStatus && newStatus !== oldStatus) {
                previousOrderStatuses.current[orderId] = newStatus;

                let alertMsg = "";
                let alertPin = "";

                if (newStatus === "Out for Delivery") {
                    if (otp) {
                        alertMsg = `Your order #${orderId.substring(0, 6).toUpperCase()} is out for delivery! The delivery partner is on the way.`;
                        alertPin = otp;
                    }
                } else if (newStatus && newStatus !== "Pending Approval") {
                    let formattedStatus = "";
                    switch (newStatus) {
                        case "Accepted by Store":
                        case "Accepted":
                            formattedStatus = "has been accepted by store";
                            break;
                        case "Driver Assigned":
                        case "Accepted by Delivery Boy":
                            formattedStatus = "has been assigned to a delivery partner";
                            break;
                        case "Packed":
                        case "Ready for Delivery":
                            formattedStatus = "is packed and ready for delivery";
                            break;
                        case "Delivered":
                            formattedStatus = "has been delivered. Thank you!";
                            break;
                        case "Pending Payment":
                            formattedStatus = "is pending payment";
                            break;
                        case "Arrived":
                        case "Reached":
                        case "Reached Location":
                            formattedStatus = "driver has reached your location";
                            break;
                        default:
                            formattedStatus = `status is now ${newStatus}`;
                    }
                    alertMsg = `Your order #${orderId.substring(0, 6).toUpperCase()} ${formattedStatus}`;
                }

                if (alertMsg) {
                    const notifText = alertPin ? `${alertMsg} \nPIN: ${alertPin}` : alertMsg;
                    const notifRef = doc(collection(db, "users", user.uid, "notifications"));
                    const notifData = {
                      id: notifRef.id,
                      title: "Order Update",
                      message: notifText,
                      timestamp: Date.now(),
                      createdAt: Date.now(),
                      isRead: false,
                      userId: user.uid,
                      customerId: user.uid
                    };
                    setDoc(notifRef, notifData).catch(console.error);
                }
              }
            }
          });
        }, (error) => console.warn("Orders snapshot error:", error?.message)),
    );

    const mapNotification = (d: any) => {
      const data = d.data();
      
      let ts = data.timestamp || data.createdAt;
      if (ts && typeof ts.toMillis === "function") {
          ts = ts.toMillis();
      } else if (ts && ts.seconds) {
          ts = ts.seconds * 1000;
      }
      
      return {
        id: d.id,
        _path: d.ref.path,
        ...data,
        timestamp: ts,
        title: data.title || data.type || "Notification",
        message: data.message || data.body || data.text || data.content || ""
      };
    };

    // Listen to Notifications (users/{userId}/notifications)
    unsubs.push(
      onSnapshot(collection(db, "users", user.uid, "notifications"), (snapshot) => {
          setNotifications1(snapshot.docs.map(mapNotification));
        }, (error) => { console.warn("Notifications 1 snapshot error:", error?.message); }),
    );

    // Listen to userNotifications (where userId == currentUser.uid)
    unsubs.push(
      onSnapshot(query(collection(db, "userNotifications"), where("userId", "==", user.uid)), (snapshot) => {
          setNotifications2(snapshot.docs.map(mapNotification));
        }, (error) => { console.warn("Notifications 2 snapshot error:", error.message); }),
    );

    // Listen to notifications (where customerId == currentUser.uid)
    unsubs.push(
      onSnapshot(query(collection(db, "notifications"), where("customerId", "==", user.uid)), (snapshot) => {
          setNotifications3(snapshot.docs.map(mapNotification));
        }, (error) => { console.warn("Notifications 3 snapshot error:", error.message); }),
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
      }, (error) => console.warn("User snapshot error:", error?.message)),
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
                onClick={() => handleNavigate(item.title)}
                className={`flex items-center w-full px-4 py-3 rounded-xl transition-all active:scale-95 hover:scale-[1.02] ${
                  isSelected
                    ? "bg-white text-dark-bg font-bold shadow-sm"
                    : "text-dark-bg/80 hover:bg-white/50 hover:text-dark-bg font-medium"
                }`}
              >
                <div className="relative mr-3">
                  <item.icon size={20} className={isSelected ? "text-dark-bg" : "text-dark-bg/80"} />
                  {item.title === "Cart" && cartItems.length > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                      {cartItems.reduce((acc, curr) => acc + curr.quantity, 0)}
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
        <div className="bg-brand-yellow text-dark-bg flex flex-col sticky top-0 z-20 shadow-md md:shadow-sm md:border-b md:border-brand-yellow/20">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3 md:hidden">
              <div className="w-10 h-10 bg-white rounded-lg p-1 flex items-center justify-center overflow-hidden">
                <img src="/AppIcon-512x512.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight">Anjan Store</span>
                <span className="text-[9px] tracking-widest font-semibold uppercase">All in one place</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center">
              <h1 className="text-xl font-bold text-dark-bg">
                {selectedItem.startsWith("Product_") ? "Product Details" : selectedItem.startsWith("Category_") ? "Category" : selectedItem}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleNavigate("Favorites")}
                className="md:hover:bg-white/50 md:p-2 md:rounded-full transition-all active:scale-90 hover:scale-110"
              >
                <Heart size={24} className="text-dark-bg" />
              </button>
              <button
                onClick={() => handleNavigate("Notifications")}
                className="relative md:hover:bg-white/50 md:p-2 md:rounded-full transition-all active:scale-90 hover:scale-110"
              >
                <Bell size={24} className="text-dark-bg" />
              </button>
              <button
                onClick={() => handleNavigate("Profile")}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-dark-bg text-[#FFC107] flex items-center justify-center font-bold text-sm md:text-base cursor-pointer shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-6 scrollbar-hide md:px-4 lg:px-8">
          <div className="w-full max-w-7xl mx-auto">
             {selectedItem === 'Home' && <HomeScreen searchQuery={searchQuery} setSearchQuery={setSearchQuery} onNavigate={handleNavigate} products={products} categories={categories} banners={banners} favorites={favorites} cartItems={cartItems} incrementCart={incrementCart} decrementCart={decrementCart} storeSettings={storeSettings} />}
             {selectedItem === 'Cart' && <CartScreen cartItems={cartItems} setCartItems={setCartItems} incrementCart={incrementCart} decrementCart={decrementCart} onNavigate={handleNavigate} storeSettings={storeSettings} />}
             {selectedItem === 'Categories' && <CategoriesScreen categories={categories} onNavigate={handleNavigate} />}
             {selectedItem === 'Favorites' && <FavoritesScreen favorites={favorites} products={products} onNavigate={handleNavigate} />}
             {selectedItem.startsWith('Product_') && <ProductDetailsScreen productId={selectedItem.replace('Product_', '')} products={products} onNavigate={handleNavigate} incrementCart={incrementCart} />}
             {selectedItem.startsWith('Category_') && <CategoryScreen categoryId={selectedItem.replace('Category_', '')} products={products} categories={categories} onNavigate={handleNavigate} incrementCart={incrementCart} />}
             {selectedItem === 'Profile' && <ProfileScreen savedAddress={savedAddress} savedPhone={savedPhone} profileImage={profileImage} onNavigate={handleNavigate} />}
             {selectedItem === 'Notifications' && <NotificationsScreen notifications={notifications} onNavigate={handleNavigate} />}
          </div>
        </div>

        <div className="md:hidden bg-white border-t border-gray-100 flex items-center justify-around py-3 px-2 z-20 pb-safe">
          {bottomNavItems.map((item, index) => {
            const isSelected = selectedItem === item.title || (item.title === "Categories" && selectedItem.startsWith("Category_"));
            return (
              <button
                key={`mobile-nav-${index}`}
                onClick={() => handleNavigate(item.title)}
                className={`flex flex-col items-center p-2 rounded-xl transition-all active:scale-95 hover:scale-[1.05] ${isSelected ? "text-dark-bg" : "text-gray-400"}`}
              >
                <item.icon size={24} className={isSelected ? "text-dark-bg" : "text-gray-400"} />
                <span className="text-[10px] font-semibold">{item.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function NotificationsScreen({ notifications, onNavigate }: any) {
    const handleNotificationClick = async (notif: any) => {
        if (!notif.isRead) {
            onNavigate("optimistic_read_" + notif.id);
            try {
                await updateDoc(doc(db, "notifications", notif.id), { isRead: true });
            } catch (error) {
                console.error("Error updating notification", error);
            }
        }
    };
    
    const handleDeleteNotification = async (notif: any, e: any) => {
        e.stopPropagation();
        onNavigate("optimistic_delete_" + notif.id);
        try {
            await deleteDoc(doc(db, "notifications", notif.id));
            toast.success("Notification deleted");
        } catch (error) {
            console.error("Error deleting notification", error);
        }
    };
    
    return (
        <div className="flex flex-col h-full bg-white animate-fade-in p-4">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center cursor-pointer" onClick={() => onNavigate("Back")}>
                    <ArrowLeft size={24} className="text-dark-bg mr-3" />
                    <h2 className="text-xl font-bold text-dark-bg">Notifications</h2>
                </div>
                <button 
                  onClick={async () => {
                     try {
                        toast("Requesting notification permission...");
                        if ("Notification" in window) {
                           const perm = await Notification.requestPermission();
                           if (perm === "granted" && (window as any).requestFCMToken) {
                              const success = await (window as any).requestFCMToken();
                              if (success) toast.success("Push Notifications Enabled!");
                              else toast.error("Failed to get push token. Please make sure you are in a new tab.");
                           } else if (perm === "granted") {
                              toast.success("Permission granted. Please refresh to receive notifications.");
                           } else {
                              toast.error(
                                "Push notifications cannot be enabled inside this embedded preview (Permission: " + perm + "). \n\nPlease click the \"Open in new tab\" icon at the top right of the screen to enable push notifications.",
                                { duration: 6000 }
                              );
                           }
                        } else {
                           toast.error("Push notifications are not supported in this browser.");
                        }
                     } catch (e: any) {
                        console.error(e);
                        toast.error("Error: " + (e.message || "Unknown error"));
                     }
                  }}
                  className="bg-brand-yellow text-dark-bg px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm active:scale-95 hover:opacity-90 transition-all"
                >
                   Enable Push
                </button>
            </div>

      
      {notifications?.length > 20 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex flex-col gap-1 animate-pulse">
            <span className="font-bold flex items-center gap-2"><Info size={16} /> Storage limit approaching</span>
            <span>You have more than 20 notifications. Please delete older notifications to save space.</span>
        </div>
      )}

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
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-dark-bg text-sm">
                    {notif.title}
                  </h4>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  )}
                </div>
                <button 
                  onClick={(e) => handleDeleteNotification(notif, e)} 
                  className="text-gray-400 hover:text-red-500 p-1 -mt-1 -mr-1 rounded-md transition-colors"
                  aria-label="Delete notification"
                >
                   <Trash2 size={16} />
                </button>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-2">
                {notif.message}
              </p>
              {notif.timestamp ? (
                <span className="text-[10px] text-gray-400">
                  {new Date(notif.timestamp).toLocaleString()}
                </span>
              ) : null}
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
      toast.success("Settings saved successfully!");
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      toast.error("Error saving settings");
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
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
            toast.error("Could not fetch address details.");
          }
        } catch (e) {
          console.error(e);
          toast.error("Error fetching address.");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error(error);
        toast.error("Unable to retrieve your location");
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
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setImageUploadLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full p-4 items-center animate-in fade-in pb-6 max-w-2xl w-full mx-auto">
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
  const images = product.imageUrls || product.images || (product.imageUrl || product.image ? [product.imageUrl || product.image] : ["/AppIcon-512x512.png"]);
  const extraImagesCount = images.length > 1 ? images.length - 1 : 0;
  return (
    <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md overflow-hidden flex flex-col h-[200px] md:h-[250px] border border-gray-100 transition-all hover:-translate-y-1 relative">
      <div
        className="relative h-[100px] md:h-[130px] w-full shrink-0 p-1 flex items-center justify-center border-b border-gray-50 cursor-pointer"
        onClick={() => onProductClick && onProductClick(product)}
      >
        <img
          src={images[0]}
          alt={product.name}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "/AppIcon-512x512.png";
          }}
        />
        {extraImagesCount > 0 && (
          <div className="absolute bottom-2 left-2 bg-dark-bg/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center shadow-sm">
            +{extraImagesCount} Photos
          </div>
        )}
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
