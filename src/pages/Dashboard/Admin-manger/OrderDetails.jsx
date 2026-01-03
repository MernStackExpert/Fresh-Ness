import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import {
  FaArrowLeft,
  FaBox,
  FaTruck,
  FaRegAddressCard,
  FaCreditCard,
  FaUser,
  FaCheckCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Provider/AuthContext";
import axiosInstance from "../../../utils/axiosInstance";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetails = async () => {
    try {
      const res = await axiosInstance.get(`/orders/${id}`);
      setOrder(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const handleMarkAsPaid = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to mark this order as PAID!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      confirmButtonText: "Yes, Paid",
    });

    if (result.isConfirmed) {
      try {
        const updateData = {
          paymentStatus: "paid",
          paymentUpdatedBy: user?.email,
        };
        const res = await axiosInstance.patch(`/orders/${id}`, updateData);
        if (res.status === 200) {
          Swal.fire("Updated!", "Payment marked as paid.", "success");
          fetchOrderDetails();
        }
      } catch (error) {
        Swal.fire("Error", "Failed to update payment status.", "error");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-amber-600 bg-amber-50 border-amber-100";
      case "shipped":
        return "text-blue-600 bg-blue-50 border-blue-100";
      case "delivered":
        return "text-green-600 bg-green-50 border-green-100";
      case "cancelled":
        return "text-red-600 bg-red-50 border-red-100";
      default:
        return "text-gray-600 bg-gray-50 border-gray-100";
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center font-black animate-pulse text-gray-400 uppercase tracking-widest">
        Loading...
      </div>
    );
  if (!order)
    return (
      <div className="p-20 text-center text-red-500 font-bold">
        Order Not Found!
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 font-bold text-xs mb-3 transition-all cursor-pointer uppercase tracking-widest"
            >
              <FaArrowLeft size={10} /> Back to Management
            </button>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">
              Order #{order._id.slice(-6)}
            </h2>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
              Date: {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="flex gap-3">
            {order.paymentStatus === "pending" && (
              <button
                onClick={handleMarkAsPaid}
                className="px-6 py-3 bg-green-600 text-white rounded-2xl text-xs font-black uppercase shadow-lg hover:bg-green-700 transition-all cursor-pointer flex items-center gap-2"
              >
                <FaCheckCircle /> Mark As Paid
              </button>
            )}
            <div
              className={`px-8 py-3 rounded-2xl text-xs font-black uppercase border shadow-sm ${getStatusColor(
                order.orderStatus
              )}`}
            >
              {order.orderStatus}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                <h3 className="font-black text-gray-800 uppercase text-xs tracking-widest flex items-center gap-2">
                  <FaBox className="text-indigo-500" /> Purchased Items (
                  {order.products?.length})
                </h3>
              </div>
              <div className="divide-y divide-gray-50">
                {order.products?.map((item, index) => (
                  <div
                    key={index}
                    className="p-8 flex items-center gap-6 hover:bg-gray-50 transition-all"
                  >
                    <div className="w-24 h-24 rounded-[2rem] overflow-hidden border border-gray-100 shadow-inner shrink-0">
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
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">
                        {item.category} • {item.unit}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-indigo-600 font-black bg-indigo-50 px-3 py-1 rounded-lg text-sm">
                          ${item.price}{" "}
                          <small className="text-gray-400 font-bold ml-1">
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
              <div className="p-10 bg-indigo-900 text-white flex justify-between items-center rounded-b-[2.5rem]">
                <span className="text-indigo-200 font-black uppercase tracking-[0.2em] text-[10px]">
                  Total Amount Paid
                </span>
                <span className="text-4xl font-black">
                  ${order.total?.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h3 className="font-black text-gray-800 uppercase text-[10px] tracking-widest mb-6 flex items-center gap-2 border-b pb-4">
                <FaUser className="text-green-500" /> Customer Account
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-tighter mb-1">
                    Full Name
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {order.shippingAddress?.fullName}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-tighter mb-1">
                    Email ID
                  </p>
                  <p className="text-sm font-bold text-indigo-600 underline">
                    {order.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h3 className="font-black text-gray-800 uppercase text-[10px] tracking-widest mb-6 flex items-center gap-2 border-b pb-4">
                <FaRegAddressCard className="text-blue-500" /> Shipping
                Information
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-tighter mb-1">
                    Delivery Address
                  </p>
                  <p className="text-sm font-bold text-gray-800 leading-relaxed">
                    {order.shippingAddress?.address}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase">
                      City
                    </p>
                    <p className="text-sm font-bold text-gray-800">
                      {order.shippingAddress?.city}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase">
                      Phone
                    </p>
                    <p className="text-sm font-bold text-gray-800">
                      {order.shippingAddress?.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h3 className="font-black text-gray-800 uppercase text-[10px] tracking-widest mb-6 flex items-center gap-2 border-b pb-4">
                <FaCreditCard className="text-purple-500" /> Payment Summary
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

                {order.paymentUpdatedBy && (
                  <div className="flex justify-between items-center border-t border-gray-50 pt-3 mt-3">
                    <span className="text-[10px] font-black text-gray-400 uppercase">
                      Verified By
                    </span>
                    <span className="text-[10px] font-bold text-gray-600 italic truncate max-w-[120px]">
                      {order.paymentUpdatedBy}
                    </span>
                  </div>
                )}

                {order.transactionId && (
                  <div className="pt-4 mt-4 border-t border-gray-50">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-2">
                      Transaction Hash
                    </p>
                    <p className="text-[9px] font-mono font-bold text-gray-500 break-all bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-inner">
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

export default OrderDetails;
