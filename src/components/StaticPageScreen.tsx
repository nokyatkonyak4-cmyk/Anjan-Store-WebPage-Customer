import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ArrowLeft } from 'lucide-react';

export default function StaticPageScreen() {
  const { pageType = '' } = useParams<{ pageType: string }>();
  const navigate = useNavigate();

  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'staticPages', pageType);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setContent(docSnap.data().content || 'Content coming soon...');
          setTitle(docSnap.data().title || formatTitle(pageType));
        } else {
          setContent('Content coming soon...');
          setTitle(formatTitle(pageType));
        }
      } catch (error) {
        console.error("Failed to load page content", error);
        setContent('Failed to load content.');
        setTitle(formatTitle(pageType));
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [pageType]);

  const formatTitle = (path: string) => {
    return path.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="flex flex-col min-h-screen max-w-2xl w-full mx-auto bg-light-bg shadow-2xl relative animate-in slide-in-from-right">
      <div className="bg-brand-yellow text-dark-bg px-4 py-4 flex items-center shadow-sm sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="mr-3">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-bold">{title}</h2>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full min-h-[200px]">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-bg"></div>
          </div>
        ) : (
          <div 
            className="bg-white rounded-xl shadow-sm p-6 whitespace-pre-wrap text-sm text-gray-700 leading-relaxed static-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </div>
  );
}
