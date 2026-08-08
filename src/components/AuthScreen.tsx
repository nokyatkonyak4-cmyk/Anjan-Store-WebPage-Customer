import { useState, useEffect } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { auth, isFirebaseConfigured } from '../firebase';
import { motion } from 'motion/react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';

export default function AuthScreen({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        onLoginSuccess();
      }
    });
    return () => unsubscribe();
  }, [onLoginSuccess]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirebaseConfigured || !auth) {
      setError('Firebase is not configured.');
      return;
    }
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onLoginSuccess();
    } catch (err: any) {
      const isDefaultProject = auth.app.options.projectId === 'gen-lang-client-0690213156';
      
      if (err.code === 'auth/operation-not-allowed') {
        if (isDefaultProject) {
           setError('Error: The app is currently connected to the AI Studio default project instead of your own Firebase project. Please add your VITE_FIREBASE_* environment variables to connect to your Firebase project.');
        } else {
           setError('Email/Password sign-in is not enabled. Please enable it in the Firebase Console -> Authentication -> Sign-in method.');
        }
      } else {
        setError(err.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isFirebaseConfigured || !auth) {
      setError('Firebase is not configured.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onLoginSuccess();
    } catch (err: any) {
      const isDefaultProject = auth.app.options.projectId === 'gen-lang-client-0690213156';

      if (err.code === 'auth/unauthorized-domain') {
        if (isDefaultProject) {
           setError(`Error: The app is still connected to the default project. Please add your VITE_FIREBASE_* environment variables to connect to your own Firebase project.`);
        } else {
           setError(`Domain not authorized. Please add "${window.location.hostname}" to your Firebase Console -> Authentication -> Settings -> Authorized domains.`);
        }
      } else {
        setError(err.message || 'Google Sign-In failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirebaseConfigured || !auth) {
      setError('Firebase is not configured.');
      return;
    }
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (isResetPassword) {
    return (
      <div className="flex flex-col min-h-[100dvh] w-full bg-brand-yellow items-center justify-center p-6">
        <div className="w-full max-w-md bg-white/20 md:bg-white md:shadow-xl md:rounded-2xl p-0 md:p-8 rounded-none border-none">
          <div className="flex justify-center mb-6 flex">
            <img src="/AppIcon-512x512.png" alt="Logo" className="w-16 h-16 object-contain bg-white rounded-xl p-1" />
          </div>
          <h1 className="text-2xl font-semibold text-dark-bg mb-4 md:text-center">
            Reset Password
          </h1>
          
          {resetSent ? (
            <div className="text-center">
              <p className="text-dark-bg mb-6">
                If an account exists for {email}, we have sent a password reset link to it.
              </p>
              <button 
                onClick={() => {
                  setIsResetPassword(false);
                  setResetSent(false);
                }}
                className="w-full bg-dark-bg hover:bg-black text-white font-bold py-3.5 rounded-xl flex justify-center items-center transition-transform active:scale-[0.98] shadow-md"
              >
                Return to Login
              </button>
            </div>
          ) : (
            <>
              <p className="text-dark-bg/80 text-sm mb-8 md:text-center">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <form onSubmit={handleResetPassword} className="w-full flex flex-col space-y-4">
                <div>
                  <label className="block text-dark-bg text-sm mb-1 font-medium">Email</label>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-transparent focus:border-dark-bg text-dark-bg rounded-xl px-4 py-3 outline-none shadow-sm transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-dark-bg hover:bg-black text-white font-bold py-3.5 rounded-xl mt-6 flex justify-center items-center transition-transform active:scale-[0.98] shadow-md"
                >
                  {loading ? <Loader2 size={24} className="animate-spin" /> : 'Send Reset Link'}
                </button>
              </form>
              
              <button 
                onClick={() => setIsResetPassword(false)}
                className="w-full mt-5 text-dark-bg text-sm font-semibold hover:underline"
              >
                Back to Login
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh] w-full bg-brand-yellow items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/20 md:bg-white md:shadow-xl md:rounded-2xl p-0 md:p-8 rounded-none border-none">
        <div className="flex justify-center mb-6 flex">
          <img src="/AppIcon-512x512.png" alt="Logo" className="w-16 h-16 object-contain bg-white rounded-xl p-1" />
        </div>
        <h1 className="text-2xl font-semibold text-dark-bg mb-8 md:text-center">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h1>

        <form onSubmit={handleAuth} className="w-full flex flex-col space-y-4">
          <div>
            <label className="block text-dark-bg text-sm mb-1 font-medium">Email</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-transparent focus:border-dark-bg text-dark-bg rounded-xl px-4 py-3 outline-none shadow-sm transition-colors"
              placeholder="your@email.com"
            />
          </div>

          <div className="relative">
            <div className="flex justify-between items-end mb-1">
              <label className="block text-dark-bg text-sm font-medium">Password</label>
            </div>
            <input 
              type={passwordVisible ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-transparent focus:border-dark-bg text-dark-bg rounded-xl px-4 py-3 pr-12 outline-none shadow-sm transition-colors"
              placeholder="••••••••"
            />
            <button 
              type="button" 
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-4 top-[34px] text-gray-500 hover:text-dark-bg transition-colors"
            >
              {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>

            {!isSignUp && (
              <div className="flex justify-end mt-2">
                <button 
                  type="button"
                  onClick={() => setIsResetPassword(true)}
                  className="text-dark-bg text-xs font-semibold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}
          </div>

          {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}

          <motion.button 
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full bg-dark-bg hover:bg-black text-white font-bold py-3.5 rounded-xl mt-6 flex justify-center items-center shadow-md"
          >
            {loading ? <Loader2 size={24} className="animate-spin" /> : (isSignUp ? 'Sign Up' : 'Login')}
          </motion.button>
        </form>

        <button 
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full mt-5 text-dark-bg text-sm font-semibold hover:underline"
        >
          {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </button>

        <div className="flex items-center w-full my-8">
          <hr className="flex-1 border-dark-bg/10" />
          <span className="px-4 text-dark-bg/60 text-sm font-medium">OR</span>
          <hr className="flex-1 border-dark-bg/10" />
        </div>

        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white hover:bg-gray-50 border-2 border-gray-100 text-dark-bg font-bold py-3.5 rounded-xl flex justify-center items-center shadow-sm"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-3" />
          Continue with Google
        </motion.button>
      </div>
    </div>
  );
}
