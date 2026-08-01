import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MainAppScreen from './components/MainAppScreen';
import StaticPageScreen from './components/StaticPageScreen';
import OrderTrackingScreen from './components/OrderTrackingScreen';
import DigitalBillScreen from './components/DigitalBillScreen';
import AuthScreen from './components/AuthScreen';
import SplashScreen from './components/SplashScreen';
import { auth, isFirebaseConfigured } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { messaging } from './firebase';
import { onMessage, getToken } from 'firebase/messaging';

function AppRouter() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showSplashOverlay, setShowSplashOverlay] = useState(true);
  
  
    useEffect(() => {
        // Request notification permission on app load
        if ('Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        console.log('Notification permission granted.');
                    } else {
                        console.log('Notification permission denied.');
                    }
                });
            }
        }
        
        if (messaging) {
            // Get token and subscribe to topics (mocked on client, typically requires backend)
            getToken(messaging, { vapidKey: 'YOUR_PUBLIC_VAPID_KEY_HERE' })
              .then((currentToken) => {
                if (currentToken) {
                  console.log('FCM Token:', currentToken);
                  // We would send this token to the server to subscribe to 'all' and 'all_users'
                  console.log('Subscribed to all (simulated on client side token generation)');
                  console.log('Subscribed to all_users (simulated on client side token generation)');
                } else {
                  console.log('No registration token available. Request permission to generate one.');
                }
              }).catch((err) => {
                console.log('An error occurred while retrieving token. ', err);
              });

            // Handle foreground messages
            const unsubscribe = onMessage(messaging, (payload) => {
                console.log('Message received. ', payload);
                const notificationTitle = payload.notification?.title || 'Update from Anjan Store';
                const notificationOptions = {
                    body: payload.notification?.body || 'You have a new message.',
                    icon: '/AppIcon-512x512.png',
                };
                
                // If the app is in the foreground, we can display a browser notification
                if (Notification.permission === 'granted') {
                    new Notification(notificationTitle, notificationOptions);
                }
            });
            
            return () => {
                if (unsubscribe) unsubscribe();
            };
        }
    }, []);

    useEffect(() => {

    if (!isFirebaseConfigured || !auth) {
      setAuthLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (!isFirebaseConfigured) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-light-bg p-4 text-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-4">Firebase Configuration Missing</h2>
          <p className="text-gray-700 mb-4 text-sm">
            Please add your Firebase configuration to the environment variables via the AI Studio Settings menu to continue.
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

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-brand-yellow"><div className="animate-pulse font-bold text-2xl text-dark-bg">Loading...</div></div>;
  }

  if (!user) {
    return <AuthScreen onLoginSuccess={() => {}} />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<MainAppScreen />} />
        <Route path="/static_page/:pageType" element={<StaticPageScreen />} />
        <Route path="/track_order/:orderId" element={<OrderTrackingScreen />} />
        <Route path="/digital_bill/:orderId" element={<DigitalBillScreen />} />
      </Routes>
      {showSplashOverlay && (
        <SplashScreen onSplashFinished={() => setShowSplashOverlay(false)} />
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
