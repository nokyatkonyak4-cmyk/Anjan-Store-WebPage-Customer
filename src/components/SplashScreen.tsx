import { useState, useEffect } from 'react';
import { auth } from '../firebase';

export default function SplashScreen({ onSplashFinished }: { onSplashFinished: (isLoggedIn: boolean) => void }) {
  const [step, setStep] = useState(1);

  useEffect(() => {
    let timer2: ReturnType<typeof setTimeout>;
    
    const timer1 = setTimeout(() => {
      setStep(2);
      
      timer2 = setTimeout(() => {
        const isLoggedIn = !!auth?.currentUser;
        onSplashFinished(isLoggedIn);
      }, 1000);
      
    }, 1000);

    return () => {
      clearTimeout(timer1);
      if (timer2) clearTimeout(timer2);
    };
  }, [onSplashFinished]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#FFC107]">
      {step === 1 ? (
        <img 
          src="/app-icon-512X512.png" 
          alt="App Logo 1" 
          className="w-[60%] max-w-[250px] h-[60%] max-h-[250px] object-contain transition-all duration-300" 
        />
      ) : (
        <img 
          src="/splash_icon_2.png.png" 
          alt="App Logo 2" 
          className="w-[60%] max-w-[250px] h-[60%] max-h-[250px] object-contain transform scale-110 transition-all duration-300" 
        />
      )}
    </div>
  );
}
