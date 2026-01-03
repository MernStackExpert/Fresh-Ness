import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaSearch, FaEye, FaBoxOpen } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { Link } from "react-router";
import axiosInstance from "../../../../utils/axiosInstance";

const ShippedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchShippedOrders = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/orders`, {
        params: { email: searchTerm },
      });

      // Sudhu Shipped status er order gulo filter kora hocce
      let shippedOrders = res.data.orders.filter(
        (order) => order.orderStatus === "shipped"
      );

      setOrders(shippedOrders);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch shipped orders", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShippedOrders();
  }, [searchTerm]);

  const markAsDelivered = async (id) => {
    const result = await Swal.fire({
      title: "Is it delivered?",
      text: "Confirming will move this to Delivered list.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      confirmButtonText: "Yes, Delivered",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.patch(`/orders/${id}`, {
          orderStatus: "delivered",
        });
        if (res.status === 200) {
          // Page reload chada state theke remove kora
          setOrders((prev) => prev.filter((order) => order._id !== id));
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Order marked as Delivered!",
            timer: 1000,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        Swal.fire("Error", "Update failed", "error");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-2 md:p-8 bg-gray-50 min-h-screen"
    >
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-blue-600 p-6 md:p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase flex items-center gap-3">
                <FaBoxOpen className="text-white" />
                Shipped Orders
              </h2>
              <p className="text-blue-100 text-xs uppercase font-bold tracking-widest mt-1">
                In Transit • {orders.length} orders
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="text"
                placeholder="Search by Email..."
                className="bg-blue-700 text-white placeholder-blue-300 pl-10 pr-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-white w-full text-sm transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 md:p-6">
          {loading ? (
            <div className="py-20 text-center font-black animate-pulse text-gray-300 uppercase tracking-widest">
              Tracking Packages...
            </div>
          ) : orders.length === 0 ? (
            <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest">
              No Shipped Orders in Transit
            </div>
          ) : (
            <>
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-3">
                  <thead>
                    <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest px-4">
                      <th className="px-6 py-2">Customer & Tracking ID</th>
                      <th className="px-6 py-2">Total Amount</th>
                      <th className="px-6 py-2 text-center">Payment</th>
                      <th className="px-6 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {orders.map((order) => (
                        <motion.tr
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          key={order._id}
                          className="bg-white group hover:shadow-md transition-all border border-gray-100"
                        >
                          <td className="px-6 py-4 rounded-l-2xl border-y border-l border-gray-100">
                            <div className="font-bold text-gray-800 text-sm">
                              {order.email}
                            </div>
                            <div className="text-[9px] text-gray-400 font-mono">
                              ORDER-ID: {order._id.slice(-10)}
                            </div>
                          </td>
                          <td className="px-6 py-4 border-y border-gray-100">
                            <div className="text-sm font-black text-blue-600">
                              ${order.total}
                            </div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase">
                              Ready to Receive
                            </div>
                          </td>
                          <td className="px-6 py-4 border-y border-gray-100 text-center">
                            <div
                              className={`px-4 py-1 rounded-full text-[9px] font-black uppercase border ${
                                order.paymentStatus === "paid"
                                  ? "bg-green-50 text-green-600 border-green-100"
                                  : "bg-amber-50 text-amber-600 border-amber-100"
                              }`}
                            >
                              {order.paymentStatus}
                            </div>
                          </td>
                          <td className="px-6 py-4 rounded-r-2xl border-y border-r border-gray-100 text-center">
                            <div className="flex justify-center gap-3">
                              <Link
                                to={`/dashboard/admin/order-details/${order._id}`}
                                className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-800 hover:text-white transition-all shadow-sm"
                              >
                                <FaEye size={14} />
                              </Link>
                              <button
                                onClick={() => markAsDelivered(order._id)}
                                className="w-10 h-10 flex items-center justify-center bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all"
                                title="Mark as Delivered"
                              >
                                <FaCheckCircle size={14} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:hidden">
                <AnimatePresence>
                  {orders.map((order) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={order._id}
                      className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col justify-between gap-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-[10px] font-bold text-gray-800 truncate">
                            {order.email}
                          </h4>
                          <p className="text-[9px] text-blue-600 font-black">
                            ${order.total}
                          </p>
                        </div>
                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[8px] font-black uppercase">
                          Shipped
                        </span>
                      </div>
                      <div className="flex gap-2 pt-2 border-t border-gray-50">
                        <Link
                          to={`/dashboard/admin/order-details/${order._id}`}
                          className="flex-1 py-2 bg-gray-50 text-gray-600 rounded-lg flex justify-center items-center"
                        >
                          <FaEye size={12} />
                        </Link>
                        <button
                          onClick={() => markAsDelivered(order._id)}
                          className="flex-2 py-2 bg-green-600 text-white rounded-lg flex justify-center items-center gap-2 text-[10px] font-bold"
                        >
                          <FaCheckCircle size={10} /> Delivered
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ShippedOrders;
