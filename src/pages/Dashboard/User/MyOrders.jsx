import React, { useContext, useEffect, useState } from "react";
import {
  FaEye,
  FaShoppingBag,
  FaClock,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaSortAmountDown,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import axiosInstance from "../../../utils/axiosInstance";
import { Link } from "react-router";
import { AuthContext } from "../../../Provider/AuthContext";

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("newest");

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/orders?email=${user?.email}`);
      let allOrders = res.data.orders.filter(
        (order) => order.orderStatus !== "cancelled"
      );

      if (sortOrder === "newest") {
        allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else {
        allOrders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      }

      setOrders(allOrders);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) fetchMyOrders();
  }, [user?.email, sortOrder]);

  const handleCancelOrder = async (id) => {
    const result = await Swal.fire({
      title: "Cancel this order?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Cancel it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.patch(`/orders/${id}`, {
          orderStatus: "cancelled",
        });
        if (res.status === 200) {
          setOrders((prev) => prev.filter((order) => order._id !== id));
          Swal.fire({
            icon: "success",
            title: "Cancelled!",
            text: "Your order has been cancelled.",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        Swal.fire("Error", "Could not cancel order", "error");
      }
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "pending":
        return {
          icon: <FaClock />,
          color: "text-amber-600 bg-amber-50 border-amber-100",
        };
      case "shipped":
        return {
          icon: <FaTruck />,
          color: "text-blue-600 bg-blue-50 border-blue-100",
        };
      case "delivered":
        return {
          icon: <FaCheckCircle />,
          color: "text-green-600 bg-green-50 border-green-100",
        };
      default:
        return {
          icon: <FaClock />,
          color: "text-gray-600 bg-gray-50 border-gray-100",
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-2 md:p-8 bg-gray-50 min-h-screen"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black text-gray-800 tracking-tight uppercase">
              My Purchase History
            </h2>
            <p className="text-gray-500 font-medium">
              Manage and track your active orders
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="relative group">
              <FaSortAmountDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-white pl-10 pr-4 py-3 rounded-2xl border border-gray-100 shadow-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
            <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm font-bold text-gray-700 flex items-center gap-2">
              <FaShoppingBag className="text-green-600" /> Total:{" "}
              {orders.length}
            </div>
          </div>
        </header>

        {loading ? (
          <div className="py-20 text-center font-black animate-pulse text-gray-300 uppercase tracking-widest leading-loose">
            Syncing Orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-16 text-center shadow-sm border border-gray-100">
            <h3 className="text-2xl font-black text-gray-800 tracking-tight">
              No active orders found!
            </h3>
            <Link
              to="/"
              className="mt-8 inline-block bg-gray-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-green-600 transition-all"
            >
              Go Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            <AnimatePresence>
              {orders.map((order) => {
                const status = getStatusInfo(order.orderStatus);
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: -100 }}
                    key={order._id}
                    className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all"
                  >
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                      <div className="flex items-center gap-6">
                        <div
                          className={`w-16 h-16 rounded-3xl flex items-center justify-center text-2xl shadow-inner ${status.color}`}
                        >
                          {status.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h4 className="font-black text-gray-900 text-lg uppercase tracking-tighter">
                              Order #{order._id.slice(-8)}
                            </h4>
                            <span
                              className={`px-4 py-1 rounded-full text-[10px] font-black uppercase border ${status.color}`}
                            >
                              {order.orderStatus}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-gray-400 font-bold text-xs">
                            <span className="flex items-center gap-1">
                              <FaCalendarAlt size={10} />{" "}
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                            <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] uppercase font-black">
                              {order.paymentMethod}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-1 items-center justify-around w-full lg:w-auto py-6 lg:py-0 border-y lg:border-y-0 lg:border-x border-gray-100">
                        <div className="text-center">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                            Status
                          </p>
                          <p
                            className={`text-[10px] font-black uppercase ${
                              order.paymentStatus === "paid"
                                ? "text-green-500"
                                : "text-amber-500"
                            }`}
                          >
                            {order.paymentStatus}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                            Total Paid
                          </p>
                          <p className="text-lg font-black text-indigo-600">
                            ${order.total.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full lg:w-auto">
                        <Link
                          to={`/dashboard/order-detailse/${order._id}`}
                          className="flex-1 lg:w-14 lg:h-14 py-4 lg:py-0 flex items-center justify-center bg-gray-900 text-white rounded-2xl hover:bg-indigo-600 transition-all shadow-lg shadow-gray-200"
                        >
                          <FaEye size={18} />
                        </Link>
                        {order.orderStatus === "pending" && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            className="flex-1 lg:w-14 lg:h-14 py-4 lg:py-0 flex items-center justify-center bg-red-50 text-red-500 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-lg shadow-red-50 cursor-pointer"
                          >
                            <FaTimesCircle size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MyOrders;
