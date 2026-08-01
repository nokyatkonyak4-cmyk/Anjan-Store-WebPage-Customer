const fs = require('fs');
let content = fs.readFileSync('src/components/StaticPageScreen.tsx', 'utf8');

// Replace getDefaultData to include about and faq
const oldGetDefaultDataStart = `const getDefaultData = (type: string) => {
    switch (type) {
      case 'privacy':`;

const newGetDefaultDataStart = `const getDefaultData = (type: string) => {
    switch (type) {
      case 'about':
        return {
          title: "About Us & Socials",
          content: "Welcome to Anjan Store!\\n\\nWe are your one-stop shop for all your daily needs, providing fresh groceries, essentials, and much more right to your doorstep.\\n\\nFollow us on social media:\\nInstagram: @anjanstore\\nFacebook: facebook.com/anjanstore\\nTwitter: @anjanstore"
        };
      case 'faq':
        return {
          title: "FAQ",
          content: "Frequently Asked Questions\\n\\nQ: What are your delivery hours?\\nA: We deliver from 9:00 AM to 9:00 PM.\\n\\nQ: Do you offer same-day delivery?\\nA: Yes, orders placed before 6:00 PM are delivered the same day.\\n\\nQ: What payment methods do you accept?\\nA: We accept Cash on Delivery, Credit/Debit Cards, and UPI."
        };
      case 'privacy':`;

content = content.replace(oldGetDefaultDataStart, newGetDefaultDataStart);

// Remove the useEffect that fetches from Firestore
const oldUseEffect = `  useEffect(() => {
    let isMounted = true;
    
    const fetchPageData = async () => {
      // setIsLoading(true);
      try {
        if (db) {
          if (!pageType) return;
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
  }, [pageType]);`;

const newUseEffect = `  useEffect(() => {
    const data = getDefaultData(pageType);
    setTitle(data.title);
    setContent(data.content);
  }, [pageType]);`;

content = content.replace(oldUseEffect, newUseEffect);

fs.writeFileSync('src/components/StaticPageScreen.tsx', content);
console.log("Patched successfully");
