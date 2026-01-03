import React, { useEffect, useState } from "react";
import {
  FaTrash,
  FaTruck,
  FaBan,
  FaSearch,
  FaEye,
  FaWallet,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import axiosInstance from "../../../../utils/axiosInstance";
import { Link } from "react-router";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/orders`, {
        params: { email: searchTerm },
      });

      let pendingOrders = res.data.orders.filter(
        (order) => order.orderStatus === "pending"
      );

      pendingOrders.sort((a, b) => {
        if (a.paymentStatus === "paid" && b.paymentStatus !== "paid") return -1;
        if (a.paymentStatus !== "paid" && b.paymentStatus === "paid") return 1;
        return 0;
      });

      setOrders(pendingOrders);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch pending orders", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [searchTerm]);

  const updateStatus = async (id, newStatus) => {
    const result = await Swal.fire({
      title: `Move to ${newStatus}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      confirmButtonText: "Confirm",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.patch(`/orders/${id}`, {
          orderStatus: newStatus,
        });
        if (res.status === 200) {
          setOrders((prev) => prev.filter((order) => order._id !== id));
          Swal.fire({
            icon: "success",
            title: "Moved!",
            text: `Order moved to ${newStatus} list.`,
            timer: 1000,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        Swal.fire("Error", "Update failed", "error");
      }
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Order?",
      text: "This action is permanent!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "Delete",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.delete(`/orders/${id}`);
        if (res.data.result.deletedCount > 0) {
          setOrders((prev) => prev.filter((order) => order._id !== id));
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Order removed.",
            timer: 1000,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        Swal.fire("Error", "Delete failed", "error");
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
        <div className="bg-gray-900 p-6 md:p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase flex items-center gap-3">
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
                Pending Orders
              </h2>
              <p className="text-gray-400 text-xs uppercase font-bold tracking-widest mt-1">
                Action Required • {orders.length} orders
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search by Email..."
                className="bg-gray-800 text-white pl-10 pr-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 w-full text-sm transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          {loading ? (
            <div className="py-20 text-center font-black animate-pulse text-gray-300 uppercase tracking-widest">
              Searching Pending Queue...
            </div>
          ) : orders.length === 0 ? (
            <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest">
              No Pending Orders Found
            </div>
          ) : (
            <>
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-3">
                  <thead>
                    <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest px-4">
                      <th className="px-6 py-2">Customer Details</th>
                      <th className="px-6 py-2">Amount</th>
                      <th className="px-6 py-2 text-center">Payment Status</th>
                      <th className="px-6 py-2 text-center">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {orders.map((order) => (
                        <motion.tr
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, x: 50 }}
                          key={order._id}
                          className="bg-white group hover:shadow-md transition-all"
                        >
                          <td className="px-6 py-4 rounded-l-2xl border-y border-l border-gray-100">
                            <div className="font-bold text-gray-800 text-sm">
                              {order.email}
                            </div>
                            <div className="text-[9px] text-gray-400 font-mono uppercase">
                              ID: {order._id.slice(-8)}
                            </div>
                          </td>
                          <td className="px-6 py-4 border-y border-gray-100">
                            <div className="text-sm font-black text-indigo-600">
                              ${order.total}
                            </div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase">
                              {order.paymentMethod}
                            </div>
                          </td>
                          <td className="px-6 py-4 border-y border-gray-100 text-center">
                            <div
                              className={`px-4 py-1 rounded-full text-[9px] font-black uppercase border ${
                                order.paymentStatus === "paid"
                                  ? "bg-green-50 text-green-600 border-green-100"
                                  : "bg-amber-50 text-amber-600 border-amber-100 animate-pulse"
                              }`}
                            >
                              {order.paymentStatus}
                            </div>
                          </td>
                          <td className="px-6 py-4 rounded-r-2xl border-y border-r border-gray-100 text-center">
                            <div className="flex justify-center gap-3">
                              <Link
                                to={`/dashboard/admin/order-details/${order._id}`}
                                className="w-10 h-10 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all cursor-pointer shadow-sm"
                              >
                                <FaEye size={14} />
                              </Link>
                              <button
                                onClick={() =>
                                  updateStatus(order._id, "shipped")
                                }
                                className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                                title="Ship Product"
                              >
                                <FaTruck size={14} />
                              </button>
                              <button
                                onClick={() =>
                                  updateStatus(order._id, "cancelled")
                                }
                                className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                                title="Cancel Order"
                              >
                                <FaBan size={14} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-2 gap-3 lg:hidden">
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
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase border ${
                              order.paymentStatus === "paid"
                                ? "bg-green-50 text-green-600 border-green-100"
                                : "bg-amber-50 text-amber-600 border-amber-100"
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                          <span className="text-[10px] font-black text-indigo-600">
                            ${order.total}
                          </span>
                        </div>
                        <h4 className="text-[10px] font-bold text-gray-800 truncate mb-1">
                          {order.email}
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-50">
                        <Link
                          to={`/dashboard/admin/order-details/${order._id}`}
                          className="flex-1 py-2 bg-indigo-50 text-indigo-600 rounded-lg flex justify-center items-center"
                        >
                          <FaEye size={10} />
                        </Link>
                        <button
                          onClick={() => updateStatus(order._id, "shipped")}
                          className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg flex justify-center"
                        >
                          <FaTruck size={10} />
                        </button>
                        <button
                          onClick={() => updateStatus(order._id, "cancelled")}
                          className="flex-1 py-2 bg-red-50 text-red-500 rounded-lg flex justify-center"
                        >
                          <FaBan size={10} />
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

export default ManageOrders;
