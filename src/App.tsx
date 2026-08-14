import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import MainAppScreen from "./components/MainAppScreen";
import StaticPageScreen from "./components/StaticPageScreen";
import CustomerSupportScreen from "./components/CustomerSupportScreen";
import OrderTrackingScreen from "./components/OrderTrackingScreen";
import DigitalBillScreen from "./components/DigitalBillScreen";
import AuthScreen from "./components/AuthScreen";
import SplashScreen from "./components/SplashScreen";
import { auth, isFirebaseConfigured, db, messaging } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { onMessage, getToken } from "firebase/messaging";
import { Toaster, toast } from 'react-hot-toast';
import { doc, setDoc, onSnapshot, collection, addDoc } from "firebase/firestore";

function AppRouter() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showSplashOverlay, setShowSplashOverlay] = useState(true);
  const initialLoadRef = useRef(true);

  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(doc(db, "settings", "store"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.forceRefreshEcosystem && !initialLoadRef.current) {
          window.location.reload();
        }
      }
      initialLoadRef.current = false;
    }, (error) => console.warn("Settings snapshot error:", error?.message));

    return () => unsub();
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setAuthLoading(false);
      return;
    }
    
    const requestFCMToken = async () => {
      try {
        if (!messaging || !db || !auth.currentUser) return false;
        
        console.log("Registering service worker...");
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log("Service Worker registered with scope:", registration.scope);

        console.log("Requesting FCM token...");
        const currentToken = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        if (currentToken) {
          console.log("FCM Token:", currentToken);
          await setDoc(doc(db, "customers", auth.currentUser.uid), { fcmToken: currentToken }, { merge: true });
          await setDoc(doc(db, "users", auth.currentUser.uid), { fcmToken: currentToken }, { merge: true });
          await setDoc(doc(db, 'fcmTokens', currentToken), {
            token: currentToken,
            userId: auth.currentUser.uid,
            role: 'customer',
            updatedAt: Date.now()
          });
          return true;
        } else {
          console.log("No registration token available. Request permission to generate one.");
          return false;
        }
      } catch (err) {
        console.error("An error occurred while retrieving token. ", err);
        if ((err as any).message) {
            toast.error("Push Error: " + (err as any).message);
        }
        return false;
      }
    };
    (window as any).requestFCMToken = requestFCMToken;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {

      setUser(currentUser);
      setAuthLoading(false);

      if (currentUser && db) {
        try {
          const syncData = {
            email: currentUser.email || "",
            name: currentUser.displayName || "",
            profileImage: currentUser.photoURL || "",
            lastLoginAt: Date.now()
          };
          await setDoc(doc(db, "users", currentUser.uid), syncData, { merge: true });
          await setDoc(doc(db, "customers", currentUser.uid), syncData, { merge: true });
        } catch (e) {
          console.warn("Failed to sync user data to Firestore:", e);
        }
      }

      if (currentUser && messaging && db) {
        if ("Notification" in window) {
          if (Notification.permission === "default") {
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
              console.log("Notification permission granted.");
            }
          }

          if (Notification.permission === "granted") {
            try {
              const currentToken = await getToken(messaging, {
                vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
              });
              if (currentToken) {
                console.log("FCM Token:", currentToken);
                // 1. Save to the customer's profile document
                await setDoc(
                  doc(db, "customers", currentUser.uid),
                  { fcmToken: currentToken },
                  { merge: true }
                ).catch(err => console.warn('Customer doc update failed:', err));
                
                // 2. Also save to the fcmTokens collection (for global broadcasts)
                await setDoc(
                  doc(db, 'fcmTokens', currentToken),
                  {
                    token: currentToken,
                    userId: currentUser.uid,
                    role: 'customer',
                    updatedAt: Date.now()
                  }
                );
              } else {
                console.log(
                  "No registration token available. Request permission to generate one.",
                );
              }
            } catch (err) {
              console.error("An error occurred while retrieving token. ", err);
            }
          }
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (messaging) {
      // Handle foreground messages
      const unsubscribe = onMessage(messaging, async (payload) => {
        console.log("Message received. ", payload);
        
        // Also save this notification to the built-in bell icon list
        if (auth.currentUser && db) {
            try {
                await addDoc(collection(db, "users", auth.currentUser.uid, "notifications"), {
                    title: payload.notification?.title || "Update from Anjan Store",
                    body: payload.notification?.body || "You have a new message.",
                    data: payload.data || null,
                    isRead: false,
                    timestamp: Date.now()
                });
            } catch (err) {
                console.error("Failed to save push notification to DB:", err);
            }
        }
        const notificationTitle =
          payload.notification?.title || "Update from Anjan Store";
        const notificationOptions = {
          body: payload.notification?.body || "You have a new message.",
          icon: "/app-icon-512X512.png",
          data: payload.data,
        };

        // If the app is in the foreground, we can display a browser notification
        if (Notification.permission === "granted") {
          const notification = new Notification(
            notificationTitle,
            notificationOptions,
          );
          notification.onclick = (event) => {
            event.preventDefault();
            if (
              payload.data?.click_action === "OPEN_ORDER" &&
              payload.data?.orderId
            ) {
              window.location.href = `/track_order/${payload.data.orderId}`;
            }
          };
        }

        let targetUrl = "";
        if (
          payload.data?.click_action === "OPEN_ORDER" &&
          payload.data?.orderId
        ) {
          targetUrl = `/track_order/${payload.data.orderId}`;
        }
        
        toast(
          (t) => (
            <div 
              className="cursor-pointer"
              onClick={() => {
                toast.dismiss(t.id);
                if (targetUrl) {
                  window.location.href = targetUrl;
                }
              }}
            >
              <h4 className="font-bold">{notificationTitle}</h4>
              <p className="text-sm">{notificationOptions.body}</p>
            </div>
          ),
          { duration: 5000 }
        );
      });

      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, []);

  if (!isFirebaseConfigured) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-light-bg p-4 text-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-4">
            Firebase Configuration Missing
          </h2>
          <p className="text-gray-700 mb-4 text-sm">
            Please add your Firebase configuration to the environment variables
            to continue.
          </p>
          <ul className="text-xs text-left text-gray-500 space-y-2 font-mono bg-gray-50 p-4 rounded-md">
            <li>VITE_FIREBASE_API_KEY</li>
            <li>VITE_FIREBASE_AUTH_DOMAIN</li>
            <li>VITE_FIREBASE_PROJECT_ID</li>
            <li>VITE_FIREBASE_STORAGE_BUCKET</li>
            <li>VITE_FIREBASE_MESSAGING_SENDER_ID</li>
            <li>VITE_FIREBASE_APP_ID</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <>
      {!showSplashOverlay && !authLoading ? (
        !user ? (
          <AuthScreen onLoginSuccess={() => {}} />
        ) : (
          <Routes>
            <Route path="/" element={<MainAppScreen />} />
            <Route
              path="/static_page/:pageType"
              element={<StaticPageScreen />}
            />
            <Route
              path="/customer-support"
              element={<CustomerSupportScreen />}
            />
            <Route
              path="/track_order/:orderId"
              element={<OrderTrackingScreen />}
            />
            <Route
              path="/digital_bill/:orderId"
              element={<DigitalBillScreen />}
            />
          </Routes>
        )
      ) : null}

      {(showSplashOverlay || authLoading) && (
        <SplashScreen onSplashFinished={() => setShowSplashOverlay(false)} />
      )}
      <Toaster position="top-right" />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}
