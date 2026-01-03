import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  FaArrowLeft,
  FaBox,
  FaMapMarkerAlt,
  FaCreditCard,
  FaReceipt,
  FaCheckCircle,
  FaTruck,
  FaClock,
} from "react-icons/fa";
import { motion } from "framer-motion";
import axiosInstance from "../../../utils/axiosInstance";

const UserOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axiosInstance.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
    window.scrollTo(0, 0);
  }, [id]);

  const getStatusStep = (currentStatus) => {
    const steps = ["pending", "shipped", "delivered"];
    const currentIndex = steps.indexOf(currentStatus);
    return currentIndex;
  };

  if (loading)
    return (
      <div className="p-20 text-center font-black animate-pulse text-gray-300 uppercase tracking-widest leading-loose">
        Generating Your Invoice...
      </div>
    );
  if (!order)
    return (
      <div className="p-20 text-center text-red-500 font-bold uppercase tracking-widest">
        Order not found in our records!
      </div>
    );

  const currentStep = getStatusStep(order.orderStatus);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-10 bg-gray-50 min-h-screen font-sans"
    >
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-400 hover:text-green-600 font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer mb-4"
            >
              <FaArrowLeft /> Back to Purchases
            </button>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">
              Invoice #{order._id.slice(-10)}
            </h2>
            <p className="text-gray-400 text-xs font-bold mt-1 uppercase tracking-widest">
              Placed on: {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span
              className={`px-8 py-3 rounded-2xl text-xs font-black uppercase border shadow-sm ${
                order.orderStatus === "cancelled"
                  ? "bg-red-50 text-red-600 border-red-100"
                  : "bg-green-50 text-green-600 border-green-100"
              }`}
            >
              Order {order.orderStatus}
            </span>
          </div>
        </header>

        {order.orderStatus !== "cancelled" && (
          <section className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-gray-100">
            <div className="flex justify-between items-center relative">
              <div className="absolute h-1 bg-gray-100 w-full top-1/2 -translate-y-1/2 z-0" />
              <div
                className={`absolute h-1 bg-green-500 transition-all duration-1000 top-1/2 -translate-y-1/2 z-0`}
                style={{ width: `${(currentStep / 2) * 100}%` }}
              />

              {[
                { s: "pending", i: <FaClock /> },
                { s: "shipped", i: <FaTruck /> },
                { s: "delivered", i: <FaCheckCircle /> },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="relative z-10 flex flex-col items-center gap-3"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg transition-all shadow-lg ${
                      idx <= currentStep
                        ? "bg-green-600 text-white border-4 border-green-100"
                        : "bg-white text-gray-300 border border-gray-100"
                    }`}
                  >
                    {step.i}
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest ${
                      idx <= currentStep ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {step.s}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex items-center gap-3">
                <FaReceipt className="text-indigo-600" />
                <h3 className="font-black text-gray-800 uppercase text-xs tracking-widest">
                  Ordered Items
                </h3>
              </div>
              <div className="divide-y divide-gray-50">
                {order.products.map((item, index) => (
                  <div
                    key={index}
                    className="p-8 flex items-center gap-6 group"
                  >
                    <div className="w-24 h-24 rounded-[2rem] overflow-hidden border border-gray-100 shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-gray-900 text-lg leading-tight">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest">
                        {item.category} • {item.unit}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-gray-400 font-bold text-sm">
                          ${item.price}{" "}
                          <small className="text-indigo-600 ml-1">
                            x {item.quantity}
                          </small>
                        </span>
                        <span className="text-gray-900 font-black text-lg">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-10 bg-gray-900 text-white flex justify-between items-center">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
                  Grand Total Paid
                </p>
                <p className="text-4xl font-black tracking-tighter">
                  ${order.total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h3 className="font-black text-gray-800 uppercase text-[10px] tracking-widest mb-6 flex items-center gap-2 border-b border-gray-50 pb-4">
                <FaMapMarkerAlt className="text-green-500" /> Shipping
                Destination
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                    Full Address
                  </label>
                  <p className="text-sm font-bold text-gray-800 leading-snug mt-1">
                    {order.shippingAddress?.address}
                  </p>
                  <p className="text-xs font-bold text-gray-500 mt-1 uppercase">
                    {order.shippingAddress?.city}
                  </p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                    Contact
                  </label>
                  <p className="text-sm font-bold text-gray-800 mt-1">
                    {order.shippingAddress?.phone}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h3 className="font-black text-gray-800 uppercase text-[10px] tracking-widest mb-6 flex items-center gap-2 border-b border-gray-50 pb-4">
                <FaCreditCard className="text-blue-500" /> Payment Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-400 uppercase">
                    Method
                  </span>
                  <span className="text-xs font-black text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-400 uppercase">
                    Status
                  </span>
                  <span
                    className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border ${
                      order.paymentStatus === "paid"
                        ? "bg-green-50 text-green-600 border-green-100"
                        : "bg-amber-50 text-amber-600 border-amber-100"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
                {order.transactionId && (
                  <div className="mt-4 pt-4 border-t border-gray-50">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-2 text-center">
                      Reference Hash
                    </p>
                    <p className="text-[8px] font-mono font-bold text-gray-400 break-all bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                      {order.transactionId}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserOrderDetails;
