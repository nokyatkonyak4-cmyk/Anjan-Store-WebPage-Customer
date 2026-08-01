const fs = require('fs');

const newContent = `import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ArrowLeft } from 'lucide-react';

export default function StaticPageScreen() {
  const { pageType = '' } = useParams<{ pageType: string }>();
  const navigate = useNavigate();

  const getDefaultData = (type: string) => {
    switch (type) {
      case 'privacy':
        return {
          title: "Privacy Policy",
          content: "Privacy Policy\\n\\nAt Anjan Store, we are committed to protecting your privacy and ensuring you have a positive experience on our application.\\n\\n1. Data Collection and Usage\\nWe collect personal information such as your name, email address, phone number, and delivery address when you register and place an order. This information is used strictly to process your orders, deliver products, and improve our services.\\n\\n2. Location Information\\nOur app requests access to your location (approximate and precise) to help you accurately pinpoint your delivery address. This location data is only used during the address selection process to ensure accurate and timely delivery of your orders. We do not track your location in the background or share it with third parties for marketing.\\n\\n3. Account & Data Deletion\\nYou have the right to request the deletion of your account and associated personal data at any time. To delete your account, contact our support team at support@anjanstore.com with your registered email. Upon request, we will delete your personal data, subject to any legal obligations to retain certain information.\\n\\n4. Third-Party Services\\nWe use trusted third-party services (such as Google Firebase) for authentication, database storage, and push notifications. We do not sell, rent, or trade your personal information to third parties.\\n\\n5. Children's Privacy\\nOur services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13.\\n\\n6. Security\\nWe implement industry-standard security measures to safeguard your personal data.\\n\\nBy using our app, you consent to this Privacy Policy."
        };
      case 'terms':
        return {
          title: "Terms & Conditions",
          content: "Terms & Conditions\\n\\nWelcome to Anjan Store. By using our app, you agree to comply with the following terms:\\n\\n1. General Use\\nThe content and products provided are for personal use. You must not use our app for any illegal or unauthorized purpose.\\n\\n2. Product Information & Pricing\\nWe strive to ensure all product descriptions and prices are accurate. However, errors may occur, and we reserve the right to correct them or cancel orders based on incorrect information.\\n\\n3. Purchases\\nAll purchases made through the app are subject to availability. We reserve the right to limit quantities or discontinue products at any time.\\n\\n4. Liability\\nAnjan Store shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of our services or products.\\n\\n5. Changes to Terms\\nWe may update these terms periodically. Continued use of the app constitutes acceptance of the new terms."
        };
      case 'refund':
        return {
          title: "Refund & Cancellation Policy",
          content: "Refund & Cancellation Policy\\n\\n1. Order Cancellation\\nYou can cancel your order at any time before it is dispatched for delivery. To cancel an order, navigate to \\"My Orders\\" and select the cancel option, or contact our support team immediately. Once an order is dispatched, it cannot be cancelled.\\n\\n2. Refunds for Cancellations\\nIf you cancel an order before dispatch, any payments made will be fully refunded to your original payment method within 5-7 business days.\\n\\n3. Returns & Refunds\\nIf you receive a defective or incorrect item, please contact us within 24 hours of delivery. We will arrange a replacement or process a refund upon verification. Perishable goods cannot be returned unless they are defective upon delivery.\\n\\n4. Processing Refunds\\nApproved refunds are processed back to the original method of payment. Depending on your bank, it may take several business days for the refund to reflect in your account."
        };
      case 'contact':
        return {
          title: "Contact Us",
          content: "Contact Us\\n\\nWe are here to help! If you have any questions, concerns, or feedback, please reach out to us through the following channels:\\n\\nEmail:\\nsupport@anjanstore.com\\n\\nPhone Number:\\n+91 98765 43210\\n\\nPhysical Store Address:\\nAnjan Store\\n123 Market Street,\\nCity Center,\\nState - 123456\\n\\nOperating Hours:\\nMonday to Saturday: 9:00 AM - 9:00 PM\\nSunday: 10:00 AM - 6:00 PM"
        };
      default:
        return {
          title: "Page Not Found",
          content: "The requested content is not available."
        };
    }
  };

  const defaultData = getDefaultData(pageType);
  const [title, setTitle] = useState(defaultData.title);
  const [content, setContent] = useState(defaultData.content);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchPageData = async () => {
      setIsLoading(true);
      try {
        if (db) {
          const docRef = doc(db, 'static_pages', pageType);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists() && isMounted) {
            const data = docSnap.data();
            if (data.title) setTitle(data.title);
            if (data.content) setContent(data.content);
          }
        }
      } catch (error) {
        console.error("Error fetching static page:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPageData();

    return () => {
      isMounted = false;
    };
  }, [pageType]);

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-light-bg shadow-2xl relative animate-in slide-in-from-right">
      <div className="bg-brand-yellow text-dark-bg px-4 py-4 flex items-center shadow-sm sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="mr-3">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-bold">{title}</h2>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full min-h-[200px]">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-bg"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6 whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
            {content}
          </div>
        )}
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/StaticPageScreen.tsx', newContent);
