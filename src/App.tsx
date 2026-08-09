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
import { doc, setDoc, onSnapshot } from "firebase/firestore";

function AppRouter() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showSplashOverlay, setShowSplashOverlay] = useState(true);
  const [toastMessage, setToastMessage] = useState<{
    title: string;
    body: string;
    url?: string;
  } | null>(null);
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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);

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
                await setDoc(
                  doc(db, "users", currentUser.uid),
                  { fcmToken: currentToken },
                  { merge: true },
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
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("Message received. ", payload);
        const notificationTitle =
          payload.notification?.title || "Update from Anjan Store";
        const notificationOptions = {
          body: payload.notification?.body || "You have a new message.",
          icon: "/AppIcon-512x512.png",
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
        setToastMessage({
          title: notificationTitle,
          body: notificationOptions.body,
          url: targetUrl,
        });
        setTimeout(() => setToastMessage(null), 5000);
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

      {toastMessage && (
        <div
          className="fixed top-4 right-4 z-50 bg-white border border-brand-yellow rounded-xl shadow-lg p-4 max-w-sm w-[90%] md:w-full animate-in slide-in-from-top-4 flex flex-col cursor-pointer"
          onClick={() => {
            if (toastMessage.url) {
              window.location.href = toastMessage.url;
            }
            setToastMessage(null);
          }}
        >
          <h4 className="font-bold text-dark-bg">{toastMessage.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{toastMessage.body}</p>
        </div>
      )}
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
