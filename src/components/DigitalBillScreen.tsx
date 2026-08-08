import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
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
}

export default function DigitalBillScreen() {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const notificationId = searchParams.get("notificationId");

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        });
      } else {
        setOrder(null);
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Bill snapshot error:", error);
      setOrder(null);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [orderId]);

  const handleProceed = async () => {
    if (!orderId || !db) return;
    try {
      await updateDoc(doc(db, "orders", orderId), { status: "Approved" });
      alert("Order Confirmed! The delivery rider will collect the payment.");
    } catch (e) {
      console.error(e);
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
          className="mt-4 px-4 py-2 bg-brand-yellow rounded-md text-dark-bg"
        >
          Go Back
        </button>
      </div>
    );
  }

  const subtotal = order.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.05;
  const grandTotal = subtotal + tax + order.deliveryFee;

  return (
    <div className="flex flex-col min-h-[100dvh] max-w-2xl w-full mx-auto bg-[#F8F9FA] relative animate-in slide-in-from-right">
      <div className="bg-[#FACC15] text-[#0F172A] px-4 py-4 flex items-center shadow-sm sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="mr-3">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-[20px] font-bold">Digital Bill</h2>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-4 pb-24">
        <div>
          <h3 className="text-[20px] font-bold text-[#0F172A]">
            Order Summary
          </h3>
          <p className="text-[12px] text-gray-500">Order ID: {order.id}</p>
        </div>

        <div className="bg-white rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.05)] w-full p-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex w-full justify-between py-2">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-[#E2E8F0] rounded-[4px] flex items-center justify-center">
                  <span className="text-[12px] font-bold text-[#0F172A]">
                    {item.quantity}x
                  </span>
                </div>
                <span className="ml-3 text-[16px] text-[#0F172A]">
                  {item.name}
                </span>
              </div>
              <span className="text-[16px] font-medium text-[#0F172A]">
                ₹{item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.05)] w-full p-4">
          <div className="flex w-full justify-between py-1">
            <span className="text-gray-500 text-[14px]">Item Total</span>
            <span className="text-[#0F172A] text-[14px]">
              ₹{subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex w-full justify-between py-1">
            <span className="text-gray-500 text-[14px]">Taxes</span>
            <span className="text-[#0F172A] text-[14px]">
              ₹{tax.toFixed(2)}
            </span>
          </div>
          <div className="flex w-full justify-between py-1">
            <span className="text-gray-500 text-[14px]">Delivery Fee</span>
            <span className="text-[#0F172A] text-[14px]">
              {order.deliveryFee > 0
                ? `₹${order.deliveryFee.toFixed(2)}`
                : "TBD"}
            </span>
          </div>

          <hr className="my-3 border-[#F1F5F9]" />

          <div className="flex w-full justify-between items-center">
            <span className="font-bold text-[#0F172A] text-[18px]">
              Grand Total
            </span>
            <span className="font-bold text-[#0F172A] text-[18px]">
              ₹{grandTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {order.status === "Pending Approval" && (
        <div className="fixed bottom-0 left-0 right-0 max-w-2xl w-full mx-auto bg-white shadow-[0_-4px_6px_rgba(0,0,0,0.05)] p-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleProceed}
            className="w-full h-[56px] bg-[#FACC15] text-[#0F172A] rounded-[12px] font-bold text-[16px] flex items-center justify-center"
          >
            Confirm Order
          </motion.button>
        </div>
      )}
    </div>
  );
}
