const fs = require('fs');
let content = fs.readFileSync('src/components/StaticPageScreen.tsx', 'utf8');

const oldUseEffect = `  useEffect(() => {
    const data = getDefaultData(pageType);
    setTitle(data.title);
    setContent(data.content);
  }, [pageType]);`;

const newUseEffect = `  useEffect(() => {
    let isMounted = true;
    
    // Set default data first so we don't show an empty page
    const data = getDefaultData(pageType);
    setTitle(data.title);
    setContent(data.content);
    
    const fetchPageData = async () => {
      try {
        if (db) {
          if (!pageType) return;
          const docRef = doc(db, 'static_pages', pageType);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists() && isMounted) {
            const remoteData = docSnap.data();
            if (remoteData.title) setTitle(remoteData.title);
            if (remoteData.content) setContent(remoteData.content);
          }
        }
      } catch (error) {
        console.error("Error fetching static page:", error);
      }
    };

    fetchPageData();

    return () => {
      isMounted = false;
    };
  }, [pageType]);`;

if (content.includes(oldUseEffect)) {
  content = content.replace(oldUseEffect, newUseEffect);
  fs.writeFileSync('src/components/StaticPageScreen.tsx', content);
  console.log("Patched successfully");
} else {
  console.log("Could not find old UseEffect");
}
