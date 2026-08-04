import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Info } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function CustomerSupportScreen() {
  const navigate = useNavigate();
  const [supportEmail, setSupportEmail] = useState('');
  const [supportPhone, setSupportPhone] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        if (db) {
          const docRef = doc(db, 'settings', 'store');
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.supportEmail) setSupportEmail(data.supportEmail);
            if (data.supportPhone) setSupportPhone(data.supportPhone);
          }
        }
      } catch (error) {
        console.error("Failed to load store settings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="flex flex-col min-h-screen max-w-2xl w-full mx-auto bg-white shadow-2xl relative animate-in slide-in-from-right">
      <div className="bg-[#FFC107] text-dark-bg px-4 py-4 flex items-center shadow-sm sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="mr-3">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-bold">Customer Support</h2>
      </div>

      <div className="flex-1 p-6 flex flex-col items-center mt-8">
        <div className="w-20 h-20 bg-[#FFC107] rounded-full flex items-center justify-center mb-6">
          <Info size={40} className="text-white" />
        </div>

        <h2 className="text-2xl font-bold text-dark-bg mb-4">We're here to help!</h2>
        
        <p className="text-center text-gray-500 mb-10 max-w-xs leading-relaxed text-sm">
          If you have any issues with your order or need assistance, please contact us.
        </p>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-bg"></div>
          </div>
        ) : (
          <div className="w-full flex flex-col space-y-4 max-w-xs">
            {supportPhone ? (
              <a 
                href={`https://wa.me/${supportPhone.match(/\+?[\d\s-]{8,}/)?.[0]?.replace(/\D/g, '') || supportPhone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-full font-bold text-white transition-opacity text-center bg-[#4ade80] hover:bg-opacity-90 block"
              >
                Chat on WhatsApp
              </a>
            ) : (
              <button disabled className="w-full py-3.5 rounded-full font-bold text-white bg-gray-300 cursor-not-allowed">
                Chat on WhatsApp
              </button>
            )}

            {supportEmail ? (
              <a 
                href={`mailto:${supportEmail.trim()}`}
                className="w-full py-3.5 rounded-full font-bold text-white transition-opacity text-center bg-[#0f172a] hover:bg-opacity-90 block"
              >
                Email Support
              </a>
            ) : (
              <button disabled className="w-full py-3.5 rounded-full font-bold text-white bg-gray-300 cursor-not-allowed">
                Email Support
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
