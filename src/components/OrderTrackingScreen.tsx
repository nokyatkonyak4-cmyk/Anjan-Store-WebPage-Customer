import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  Copy,
  MessageCircle,
  Receipt,
  FileText,
  User,
  Truck,
  CheckCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { db, auth, isFirebaseConfigured } from "../firebase";
import { doc, deleteDoc, onSnapshot, updateDoc } from "firebase/firestore";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  totalPrice: number;
  deliveryFee: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  deliveryOtp: string;
  createdAt: string;
  phone: string;
  address: string;
  deliveryType: string;
}

export default function OrderTrackingScreen() {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const notificationId = searchParams.get("notificationId");

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [enteredPin, setEnteredPin] = useState("");
  const [pinVerified, setPinVerified] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Cash");
  const [isUpdating, setIsUpdating] = useState(false);

  // Hardcoded store location
  const storeLat = 26.9557061;
  const storeLng = 95.0573323;

  useEffect(() => {
    const deleteNotification = async () => {
      if (notificationId && auth?.currentUser && db && isFirebaseConfigured) {
        try {
          await deleteDoc(
            doc(
              db,
              "users",
              auth.currentUser.uid,
              "notifications",
              notificationId,
            ),
          );
        } catch (error) {
          console.error("Error deleting notification:", error);
        }
      }
    };
    deleteNotification();
  }, [notificationId]);

  useEffect(() => {
    if (!orderId || !db) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, "orders", orderId), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const itemsRaw = data.items || [];
        const itemsList = itemsRaw.map((item: any) => ({
          productId: item.productId || "",
          name: item.name || "",
          price: Number(item.price) || 0.0,
          quantity: Number(item.quantity) || 0,
        }));

        let createdAtStr = "";
        if (data.createdAt) {
          if (data.createdAt.toDate) {
            const date = data.createdAt.toDate();
            createdAtStr = date
              .toLocaleString("en-US", {
                hour12: false,
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })
              .replace(",", "");
          } else {
            createdAtStr = data.createdAt;
          }
        }

        setOrder({
          id: snap.id,
          customerId: data.customerId || "",
          items: itemsList,
          totalPrice: data.totalPrice || 0.0,
          deliveryFee: data.deliveryFee || 0.0,
          status: data.status || "Pending Approval",
          paymentMethod: data.paymentMethod || "",
          paymentStatus: data.paymentStatus || "Pending",
          deliveryOtp: data.deliveryOtp || "",
          createdAt: createdAtStr,
          phone: data.phone || "",
          address: data.address || "",
          deliveryType: data.deliveryType || "",
        });
      } else {
        setOrder(null);
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Order snapshot error:", error);
      setOrder(null);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [orderId]);

  const copyToClipboard = () => {
    if (order?.deliveryOtp) {
      navigator.clipboard.writeText(order.deliveryOtp);
      alert("PIN Copied");
    }
  };

  const shareOnWhatsApp = () => {
    if (order?.deliveryOtp) {
      const text = encodeURIComponent(
        `My Anjan Store Delivery PIN is: ${order.deliveryOtp}`,
      );
      window.open(`https://wa.me/?text=${text}`, "_blank");
    }
  };

  const handleVerifyPin = () => {
    if (!enteredPin || enteredPin.trim() === "" || enteredPin.length !== 4) {
      alert("Please enter a valid 4-digit PIN.");
      return;
    }
    if (String(enteredPin) === String(order?.deliveryOtp)) {
      setPinVerified(true);
    } else {
      alert("delivery confirmation PIN is Incorrect.");
    }
  };

  const handleCompleteDelivery = async () => {
    if (!orderId || !db) return;
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: "Delivered",
        paymentMethod: selectedPaymentMethod,
        paymentStatus: "Completed",
      });
      alert("Delivery Completed successfully!");
    } catch (e) {
      console.error(e);
      alert("Error completing delivery.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-[100dvh] max-w-2xl w-full mx-auto bg-[#F8F9FA] justify-center items-center">
        <Loader2 className="animate-spin text-[#FACC15]" size={32} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col min-h-[100dvh] max-w-2xl w-full mx-auto bg-[#F8F9FA] justify-center items-center">
        <span className="text-gray-500">Order not found.</span>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-[#FACC15] rounded-[12px] text-[#0F172A] font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const statuses = [
    { label: "Pending Approval", icon: Receipt },
    { label: "Accepted", icon: FileText },
    { label: "Driver Assigned", icon: User },
    { label: "Out for Delivery", icon: Truck },
    { label: "Delivered", icon: CheckCircle },
  ];

  let currentIndex = 0;
  switch (order.status) {
    case "Pending Approval":
      currentIndex = 0;
      break;
    case "Accepted":
    case "Processing":
    case "Accepted by Store":
      currentIndex = 1;
      break;
    case "Driver Assigned":
    case "Packed":
    case "Ready for Delivery":
    case "Accepted by Delivery Boy":
      currentIndex = 2;
      break;
    case "Out for Delivery":
      currentIndex = 3;
      break;
    case "Delivered":
      currentIndex = 4;
      break;
    default:
      currentIndex = 0;
  }

  return (
    <div className="flex flex-col h-[100dvh] max-w-2xl w-full mx-auto bg-gray-100 relative animate-in slide-in-from-right overflow-hidden shadow-2xl">
      <div className="bg-white text-[#0F172A] px-4 py-4 flex items-center shadow-sm z-20 shrink-0">
        <button onClick={() => navigate(-1)} className="mr-3">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-[20px] font-bold">Track Order</h2>
      </div>

      <div className="flex-1 relative flex flex-col">
        {/* Map Section */}
        <div className="flex-1 relative bg-gray-200">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${storeLng - 0.01}%2C${storeLat - 0.01}%2C${storeLng + 0.01}%2C${storeLat + 0.01}&layer=mapnik&marker=${storeLat}%2C${storeLng}`}
            style={{ border: 0 }}
            title="Order Map"
          />

          {/* OTP Overlay */}
          {order.deliveryOtp &&
            order.status !== "Pending Approval" &&
            order.status !== "Delivered" && (
              <div className="absolute top-4 left-4 right-4 bg-[#FFF9E6] p-4 rounded-xl shadow-lg z-10 flex flex-col items-center border border-yellow-200">
                <span className="text-[18px] font-bold text-[#0F172A] mb-2">
                  🔑 Rider Delivery PIN: {order.deliveryOtp}
                </span>
                <span className="text-[12px] text-gray-700 text-center mb-4 leading-relaxed">
                  Share this 4-digit PIN with our delivery executive upon order
                  arrival to receive your package.
                </span>
                <div className="flex w-full space-x-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={copyToClipboard}
                    className="flex-1 bg-[#0F172A] text-white py-2.5 rounded-lg flex items-center justify-center font-semibold text-sm"
                  >
                    <Copy size={16} className="mr-2" /> Copy PIN
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={shareOnWhatsApp}
                    className="flex-1 bg-[#25D366] text-white py-2.5 rounded-lg flex items-center justify-center font-semibold text-sm"
                  >
                    <MessageCircle size={16} className="mr-2" /> Share
                  </motion.button>
                </div>
              </div>
            )}
        </div>

        {/* Bottom Sheet */}
        <div className="bg-white rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.05)] p-6 z-20 flex flex-col shrink-0 overflow-y-auto max-h-[60vh]">
          <h3 className="text-[20px] font-bold text-[#0F172A]">Order Status</h3>
          <span className="text-[14px] text-gray-500 mb-6 block">
            Order ID: {order.id.slice(0, 8).toUpperCase()}
          </span>

          {/* Timeline */}
          <div className="flex justify-between items-start w-full relative mb-8">
            {/* Connecting Line */}
            <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-gray-100 -z-10"></div>
            <div
              className="absolute top-5 left-[10%] h-0.5 bg-[#FACC15] -z-10 transition-all duration-500"
              style={{
                width: `${(currentIndex / (statuses.length - 1)) * 80}%`,
              }}
            ></div>

            {statuses.map((status, index) => {
              const isActive = index <= currentIndex;
              const isCurrent = index === currentIndex;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center flex-1 z-10"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 shadow-sm transition-colors duration-300 ${isActive ? "bg-[#FACC15]" : "bg-gray-100"} ${isCurrent ? "ring-2 ring-offset-2 ring-[#FACC15]" : ""}`}
                  >
                    <status.icon
                      size={18}
                      className={isActive ? "text-[#0F172A]" : "text-gray-400"}
                    />
                  </div>
                  <span
                    className={`text-[10px] text-center leading-tight ${isActive ? "font-bold text-[#0F172A]" : "text-gray-400"}`}
                  >
                    {status.label}
                  </span>
                </div>
              );
            })}
          </div>

          <span className="text-[14px] font-medium text-[#0F172A] block mb-1">
            Customer Support: +91 80112 76902
          </span>
          {order.status === "Out for Delivery" && (
            <span className="text-[14px] text-gray-600 mt-2">
              Your delivery partner is on the way. Please keep your OTP ready.
            </span>
          )}

          {/* Rider Simulation Section */}
          {order.status === "Out for Delivery" && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="font-bold text-[#0F172A] mb-4 text-center">
                Rider Delivery Confirmation
              </h4>

              {!pinVerified ? (
                <div className="flex flex-col space-y-3">
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="Enter 4-digit PIN"
                    value={enteredPin}
                    onChange={(e) =>
                      setEnteredPin(e.target.value.replace(/\D/g, ""))
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-center tracking-widest font-bold text-lg outline-none focus:border-[#FACC15]"
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleVerifyPin}
                    className="w-full bg-[#0F172A] text-white py-3 rounded-lg font-bold"
                  >
                    Verify PIN
                  </motion.button>
                </div>
              ) : (
                <div className="flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center justify-center text-green-600 mb-2">
                    <CheckCircle size={20} className="mr-2" />
                    <span className="font-bold">PIN Verified</span>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-sm font-bold text-[#0F172A]">
                      Select Payment Method
                    </h5>
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        checked={selectedPaymentMethod === "Cash"}
                        onChange={() => setSelectedPaymentMethod("Cash")}
                        className="w-4 h-4 text-[#FACC15] focus:ring-[#FACC15]"
                      />
                      <span className="ml-3 font-medium text-sm">Cash</span>
                    </label>
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        checked={selectedPaymentMethod === "Pay Online"}
                        onChange={() => setSelectedPaymentMethod("Pay Online")}
                        className="w-4 h-4 text-[#FACC15] focus:ring-[#FACC15]"
                      />
                      <span className="ml-3 font-medium text-sm">
                        Online (UPI/Card)
                      </span>
                    </label>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCompleteDelivery}
                    disabled={isUpdating}
                    className="w-full bg-[#FACC15] text-[#0F172A] py-3 rounded-lg font-bold mt-2 flex justify-center items-center"
                  >
                    {isUpdating ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      "Complete Delivery"
                    )}
                  </motion.button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
