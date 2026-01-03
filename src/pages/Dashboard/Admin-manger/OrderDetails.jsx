import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { FaArrowLeft, FaBox, FaTruck, FaRegAddressCard, FaCreditCard, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import axiosInstance from "../../../utils/axiosInstance";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await axiosInstance.get(`/orders/${id}`);
        setOrder(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "text-amber-600 bg-amber-100 border-amber-200";
      case "shipped": return "text-blue-600 bg-blue-100 border-blue-200";
      case "delivered": return "text-green-600 bg-green-100 border-green-200";
      case "cancelled": return "text-red-600 bg-red-100 border-red-200";
      default: return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  if (loading) return <div className="p-20 text-center font-black animate-pulse text-gray-400 uppercase tracking-widest">Loading Order Details...</div>;
  if (!order) return <div className="p-20 text-center text-red-500 font-bold">Order not found!</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <div>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-bold text-sm mb-2 transition-all cursor-pointer">
              <FaArrowLeft /> Back to Orders
            </button>
            <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Order #{order._id.slice(-8)}</h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Placed on: {new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <span className={`px-6 py-2 rounded-full text-xs font-black uppercase border ${getStatusColor(order.orderStatus)} shadow-sm`}>
            {order.orderStatus}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Product List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                <h3 className="font-black text-gray-800 uppercase text-sm flex items-center gap-2">
                  <FaBox className="text-indigo-500" /> Items in Order ({order.products.length})
                </h3>
              </div>
              <div className="divide-y divide-gray-50">
                {order.products.map((item, index) => (
                  <div key={index} className="p-6 flex items-center gap-4 hover:bg-gray-50 transition-all">
                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-2xl object-cover border border-gray-100 shadow-sm" />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-lg leading-tight">{item.name}</h4>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{item.category} • {item.unit}</p>
                      <div className="mt-1 flex items-center gap-4">
                        <span className="text-indigo-600 font-black">${item.price} <small className="text-gray-400 font-normal">x {item.quantity}</small></span>
                        <span className="text-gray-900 font-black ml-auto">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-8 bg-indigo-50/30 flex justify-between items-center">
                <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Total Amount Paid</span>
                <span className="text-3xl font-black text-indigo-700">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Customer & Shipping Details */}
          <div className="space-y-6">
            
            {/* Customer Info */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="font-black text-gray-800 uppercase text-xs tracking-widest mb-4 flex items-center gap-2 border-b pb-2">
                <FaUser className="text-green-500" /> Customer Account
              </h3>
              <div className="space-y-1">
                <p className="text-sm font-bold text-gray-900">{order.shippingAddress.fullName}</p>
                <p className="text-xs text-gray-500 font-medium">{order.email}</p>
                <p className="text-xs text-gray-400 mt-2">User ID: {order.userId || "Guest User"}</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="font-black text-gray-800 uppercase text-xs tracking-widest mb-4 flex items-center gap-2 border-b pb-2">
                <FaRegAddressCard className="text-blue-500" /> Shipping Destination
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Full Address</label>
                  <p className="text-sm font-bold text-gray-800 leading-snug">{order.shippingAddress.address}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">City</label>
                    <p className="text-sm font-bold text-gray-800">{order.shippingAddress.city}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Phone</label>
                    <p className="text-sm font-bold text-gray-800">{order.shippingAddress.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="font-black text-gray-800 uppercase text-xs tracking-widest mb-4 flex items-center gap-2 border-b pb-2">
                <FaCreditCard className="text-purple-500" /> Payment Intelligence
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400 uppercase">Method</span>
                  <span className="text-sm font-black text-gray-800">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400 uppercase">Status</span>
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border ${order.paymentStatus === 'paid' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                {order.transactionId && (
                  <div className="pt-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Transaction ID</label>
                    <p className="text-[10px] font-mono font-bold text-gray-600 break-all bg-gray-50 p-2 rounded-lg mt-1 border border-gray-100">
                      {order.transactionId}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Logistical Timeline */}
            <div className="bg-gray-900 p-6 rounded-[2rem] shadow-lg text-white">
              <h3 className="font-black text-gray-400 uppercase text-[10px] tracking-widest mb-4 flex items-center gap-2">
                <FaTruck className="text-green-400" /> System Timeline
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-1 bg-green-500 rounded-full" />
                  <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase">Updated At</p>
                    <p className="text-xs font-bold">{new Date(order.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-1 bg-indigo-500 rounded-full" />
                  <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase">Order Created</p>
                    <p className="text-xs font-bold">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderDetails;