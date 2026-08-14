import React, { useState } from 'react';
import { ArrowLeft, Clock, CheckCircle, Package, XCircle, Star, MessageSquare, Camera } from 'lucide-react';
import { motion } from 'motion/react';
import { db, auth } from '../firebase';
import { doc, updateDoc, setDoc, addDoc, collection } from 'firebase/firestore';
import toast from 'react-hot-toast';

export function OrderHistoryScreen({ orders, products, onNavigate }: any) {
    const [reviewOrder, setReviewOrder] = useState<any>(null);
    const [deliveryRating, setDeliveryRating] = useState(0);
    const [itemReviews, setItemReviews] = useState<Record<string, { rating: number, feedback: string }>>({});
    const [submittingReview, setSubmittingReview] = useState(false);
    
    // When opening review page for an order
    const openReview = (order: any) => {
        setReviewOrder(order);
        setDeliveryRating(order.deliveryRating || 0);
        setItemReviews({});
    };

    const handleItemRatingChange = (productId: string, rating: number) => {
        setItemReviews(prev => ({
            ...prev,
            [productId]: { rating, feedback: prev[productId]?.feedback || "" }
        }));
    };

    const handleItemFeedbackChange = (productId: string, feedback: string) => {
        setItemReviews(prev => ({
            ...prev,
            [productId]: { rating: prev[productId]?.rating || 0, feedback }
        }));
    };
    
    const handleReviewSubmit = async () => {
        if (!reviewOrder || !auth.currentUser) return;
        setSubmittingReview(true);
        try {
            // Save product reviews
            const reviewPromises = Object.entries(itemReviews).map(async ([productId, review]) => {
                if (review.rating > 0) {
                    try {
                        await addDoc(collection(db, "productReviews"), {
                            orderId: reviewOrder.id || "unknown",
                            productId: productId || "unknown",
                            customerId: auth.currentUser!.uid || "unknown",
                            customerName: auth.currentUser!.displayName || auth.currentUser!.email || "Anonymous",
                            rating: review.rating || 0,
                            feedback: review.feedback || "",
                            createdAtMs: Date.now()
                        });
                        
                        // Also write to Android app's "reviews" collection for cross-compatibility
                        try {
                            await addDoc(collection(db, "reviews"), {
                                orderId: reviewOrder.id || "unknown",
                                productId: productId || "unknown",
                                customerId: auth.currentUser!.uid || "unknown",
                                customerName: auth.currentUser!.displayName || auth.currentUser!.email || "Anonymous",
                                rating: review.rating || 0,
                                comment: review.feedback || "",
                                status: "Published",
                                createdAtMs: Date.now()
                            });
                        } catch (err) {
                            console.warn("Failed to write to root reviews collection (possibly rules)", err);
                        }
                    } catch (e: any) {
                        throw new Error(`Failed to add productReview for ${productId}: ${e.message}`);
                    }
                }
            });
            await Promise.all(reviewPromises);
            
            // Mark order as reviewed and save delivery rating
            try {
                await updateDoc(doc(db, "orders", reviewOrder.id), {
                    rating: true,
                    deliveryRating: deliveryRating || 0
                });
            } catch (e: any) {
                throw new Error(`Failed to update order ${reviewOrder.id}: ${e.message}`);
            }
            
            toast.success("Thank you for your feedback!");
            setReviewOrder(null);
            setDeliveryRating(0);
            setItemReviews({});
        } catch (error: any) {
            console.error(error);
            toast.error(error?.message || "Unknown error");
        } finally {
            setSubmittingReview(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Delivered': return <CheckCircle size={20} className="text-green-500" />;
            case 'Cancelled': return <XCircle size={20} className="text-red-500" />;
            case 'Pending Approval': return <Clock size={20} className="text-orange-500" />;
            case 'Approved':
            case 'Processing':
            case 'Dispatched':
            case 'Out for Delivery':
                return <Package size={20} className="text-blue-500" />;
            default: return <Clock size={20} className="text-gray-500" />;
        }
    };
    
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Delivered': return "text-green-600 bg-green-50 border-green-200";
            case 'Cancelled': return "text-red-600 bg-red-50 border-red-200";
            case 'Pending Approval': return "text-orange-600 bg-orange-50 border-orange-200";
            case 'Approved':
            case 'Processing':
            case 'Dispatched':
            case 'Out for Delivery':
                return "text-blue-600 bg-blue-50 border-blue-200";
            default: return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    if (reviewOrder) {
        return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col h-full bg-gray-50">
                <div className="flex items-center cursor-pointer p-4 bg-white sticky top-0 z-10 shadow-sm" onClick={() => setReviewOrder(null)}>
                    <ArrowLeft size={24} className="text-dark-bg mr-3" />
                    <h2 className="text-lg font-bold text-dark-bg">Rate your experience</h2>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Delivery Experience */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-dark-bg mb-1">How was your delivery experience?</h3>
                            <p className="text-xs text-gray-500 mb-3">Rate the delivery process</p>
                            <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button key={star} onClick={() => setDeliveryRating(star)} className="p-1 transition-transform active:scale-90">
                                        <Star size={24} fill={star <= deliveryRating ? "#FFC107" : "transparent"} color={star <= deliveryRating ? "#FFC107" : "#CBD5E1"} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
                            <Package size={32} className="text-brand-yellow" />
                        </div>
                    </div>

                    <h3 className="font-bold text-gray-600 text-sm mt-6 mb-2">Please tell us about items in your order</h3>

                    {/* Items */}
                    {reviewOrder.items && reviewOrder.items.map((item: any, index: number) => {
                        const product = item.product || item;
                        const reviewData = itemReviews[product.id] || itemReviews[product.productId] || { rating: 0, feedback: "" };
                        const hasRated = reviewData.rating > 0;
                        
                        // Try to find the full product from the database products list to get the image
                        const dbProduct = products?.find((p: any) => p.id === (product.productId || product.id) || p.name === product.name);
                        const productImage = dbProduct?.imageUrls?.[0] || dbProduct?.images?.[0] || dbProduct?.imageUrl || dbProduct?.image || product.imageUrls?.[0] || product.images?.[0] || product.imageUrl || product.image || item.imageUrls?.[0] || item.images?.[0] || item.imageUrl || item.image || "/app-icon-512X512.png";

                        return (
                            <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
                                <div className="flex items-start space-x-4">
                                    <img src={productImage} className="w-16 h-16 object-contain rounded-md border border-gray-100 p-1 bg-gray-50" />
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm text-dark-bg line-clamp-2">{product.name}</h4>
                                        <div className="flex space-x-1 mt-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button key={star} onClick={() => handleItemRatingChange(product.productId || product.id, star)} className="p-1 transition-transform active:scale-90">
                                                    <Star size={24} fill={star <= reviewData.rating ? "#FFC107" : "transparent"} color={star <= reviewData.rating ? "#FFC107" : "#CBD5E1"} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {hasRated && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 pt-4 border-t border-gray-50">
                                        <textarea
                                            value={reviewData.feedback}
                                            onChange={(e) => handleItemFeedbackChange(product.productId || product.id, e.target.value)}
                                            placeholder="Tell us about your experience"
                                            className="w-full h-24 text-sm resize-none outline-none text-dark-bg"
                                        ></textarea>
                                        <div className="flex mt-2">
                                            <button className="flex items-center space-x-2 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200">
                                                <Camera size={14} />
                                                <span>Add photos</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="p-4 bg-white border-t border-gray-100">
                    <button 
                        onClick={handleReviewSubmit}
                        disabled={submittingReview}
                        className="w-full bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-[0.98] transition-transform"
                    >
                        <span>{submittingReview ? "Submitting..." : "Submit"}</span>
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white animate-fade-in p-4">
            <div className="flex items-center cursor-pointer mb-6" onClick={() => onNavigate("Profile")}>
                <ArrowLeft size={24} className="text-dark-bg mr-3" />
                <h2 className="text-xl font-bold text-dark-bg">Order History</h2>
            </div>

            {!orders || orders.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 mt-10">
                    <Package size={64} className="text-gray-200 mb-4" />
                    <p>No orders found</p>
                    <button 
                        onClick={() => onNavigate("Home")}
                        className="mt-6 bg-brand-yellow text-dark-bg px-6 py-2 rounded-full font-bold shadow-sm"
                    >
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order: any) => (
                        <div key={order.id} className="border border-gray-100 rounded-xl p-4 shadow-sm bg-white">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className="text-[10px] text-gray-500 font-mono tracking-wider">{order.id}</span>
                                    <div className="text-xs text-gray-500 mt-1">{order.date}</div>
                                </div>
                                <div className={"flex items-center px-2 py-1 rounded-md border text-[10px] font-bold " + getStatusColor(order.status)}>
                                    {getStatusIcon(order.status)}
                                    <span className="ml-1 uppercase tracking-wider">{order.status}</span>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-end border-t border-gray-50 pt-3">
                                <div>
                                    <div className="text-sm font-bold text-dark-bg">₹{order.total}</div>
                                    <div className="text-xs text-gray-500">{order.itemCount} Items</div>
                                </div>
                                <div className="flex space-x-2">
                                    <button 
                                        onClick={() => window.open("/receipt/" + order.id, "_blank")}
                                        className="text-xs font-bold text-brand-yellow bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100"
                                    >
                                        Receipt
                                    </button>
                                    
                                    {order.status === 'Delivered' && !order.rating && (
                                        <button 
                                            onClick={() => openReview(order)}
                                            className="text-xs font-bold text-white bg-dark-bg px-3 py-1.5 rounded-lg border border-dark-bg"
                                        >
                                            Review & Rate
                                        </button>
                                    )}
                                    {order.rating && (
                                        <div className="flex items-center text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-100">
                                            <Star size={12} fill="#FFC107" color="#FFC107" className="mr-1" />
                                            Rated
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
