import { useState, useEffect } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { auth, isFirebaseConfigured } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';

export default function AuthScreen({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [isSignUp, setIsSignUp] = useState(false);
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
      setError(err.message || 'Authentication failed');
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
      setError(err.message || 'Google Sign-In failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-brand-yellow items-center justify-center p-6">
      <h1 className="text-2xl font-semibold text-dark-bg mb-8">
        {isSignUp ? 'Create Account' : 'Welcome Back'}
      </h1>

      <form onSubmit={handleAuth} className="w-full flex flex-col space-y-4">
        <div>
          <label className="block text-dark-bg text-sm mb-1">Email</label>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white border border-white focus:border-dark-bg text-dark-bg rounded-md px-3 py-2 outline-none"
          />
        </div>

        <div className="relative">
          <label className="block text-dark-bg text-sm mb-1">Password</label>
          <input 
            type={passwordVisible ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white border border-white focus:border-dark-bg text-dark-bg rounded-md px-3 py-2 pr-10 outline-none"
          />
          <button 
            type="button" 
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="absolute right-3 top-8 text-dark-bg"
          >
            {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-dark-bg text-white font-medium py-3 rounded-md mt-4 flex justify-center items-center h-[48px]"
        >
          {loading ? <Loader2 size={24} className="animate-spin" /> : (isSignUp ? 'Sign Up' : 'Login')}
        </button>
      </form>

      <button 
        onClick={() => setIsSignUp(!isSignUp)}
        className="mt-4 text-dark-bg text-sm font-medium"
      >
        {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
      </button>

      <div className="flex items-center w-full my-8">
        <hr className="flex-1 border-dark-bg/20" />
        <span className="px-3 text-dark-bg text-sm">OR</span>
        <hr className="flex-1 border-dark-bg/20" />
      </div>

      <button 
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full bg-transparent border-2 border-dark-bg text-dark-bg font-medium py-3 rounded-md flex justify-center items-center"
      >
        Continue with Google
      </button>
    </div>
  );
}
