const fs = require('fs');
let content = fs.readFileSync('src/components/Screens.tsx', 'utf8');

const regex = /export function ProductDetailsScreen\(\{[^\}]*\}\: any\) \{[\s\S]*?return \([\s\S]*?\}\);?\n\}/;

const newProductDetails = `import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export function ProductDetailsScreen({ productId, products, onNavigate, incrementCart }: any) {
    const product = products.find((p: any) => p.id === productId);
    const [reviews, setReviews] = React.useState<any[]>([]);

    React.useEffect(() => {
        if (!productId) return;
        const q = query(collection(db, "productReviews"), where("productId", "==", productId));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedReviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            fetchedReviews.sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));
            setReviews(fetchedReviews);
        }, (error) => console.error("Error fetching reviews", error));
        return () => unsubscribe();
    }, [productId]);

    if (!product) return <div>Product not found</div>;

    const avgRating = reviews.length > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) : 0;

    return (
        <div className="bg-white min-h-screen">
            <div className="relative">
                <button onClick={() => onNavigate("Back")} className="absolute top-4 left-4 z-10 bg-white/80 p-2 rounded-full shadow-md transition-all active:scale-95 hover:opacity-90"><ArrowLeft size={20}/></button>
                <img src={product.imageUrls?.[0] || product.imageUrl || "/AppIcon-512x512.png"} className="w-full h-[300px] object-contain bg-gray-50" />
            </div>
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h1 className="text-2xl font-bold">{product.name}</h1>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                    <span className="text-brand-yellow font-bold text-xl">₹{product.price}</span>
                    {reviews.length > 0 && (
                        <div className="flex items-center text-sm font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                            <Star size={14} fill="#FFC107" color="#FFC107" className="mr-1" />
                            {avgRating} ({reviews.length} reviews)
                        </div>
                    )}
                </div>
                
                <p className="text-gray-600 mb-8">{product.description || "No description available."}</p>
                
                <button onClick={() => incrementCart(product)} className="w-full bg-brand-yellow text-dark-bg py-4 rounded-full font-bold text-lg shadow-md flex items-center justify-center transition-all active:scale-95 hover:opacity-90 mb-8">
                    <ShoppingCart size={20} className="mr-2" /> Add to Cart
                </button>

                <div className="border-t border-gray-100 pt-6">
                    <h2 className="text-lg font-bold text-dark-bg mb-4">Customer Reviews</h2>
                    {reviews.length === 0 ? (
                        <p className="text-gray-400 text-sm italic">No reviews yet. Be the first to review this product after purchase!</p>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map(review => (
                                <div key={review.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-bold text-sm text-dark-bg">{review.customerName || "Anonymous"}</div>
                                        <div className="flex items-center">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star key={star} size={12} fill={star <= review.rating ? "#FFC107" : "transparent"} color={star <= review.rating ? "#FFC107" : "#CBD5E1"} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-400 mb-2">
                                        {new Date(review.createdAtMs).toLocaleDateString()}
                                    </div>
                                    {review.feedback && (
                                        <p className="text-sm text-gray-700">{review.feedback}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}`;

content = content.replace(regex, newProductDetails);
fs.writeFileSync('src/components/Screens.tsx', content);
console.log("Updated ProductDetailsScreen");
