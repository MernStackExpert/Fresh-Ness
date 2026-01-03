import React, { useEffect, useState } from "react";
import {
  FaTrash,
  FaCheckCircle,
  FaTruck,
  FaBan,
  FaSearch,
  FaFilter,
  FaBox,
  FaEye,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import axiosInstance from "../../../utils/axiosInstance";
import { Link } from "react-router";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/orders`, {
        params: {
          page: currentPage,
          limit: 10,
          email: searchTerm,
        },
      });

      let fetchedOrders = res.data.orders;
      if (filterStatus) {
        fetchedOrders = fetchedOrders.filter(
          (order) => order.orderStatus === filterStatus
        );
      }
      setOrders(fetchedOrders);
      setTotalPages(res.data.totalPages);
      setLoading(false);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch orders", "error");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchTerm, filterStatus]);

  const updateStatus = async (id, newStatus) => {
    const result = await Swal.fire({
      title: `Mark as ${newStatus}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      confirmButtonText: "Yes, Update",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.patch(`/orders/${id}`, {
          orderStatus: newStatus,
        });
        if (res.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: `Order ${newStatus}!`,
            timer: 1500,
            showConfirmButton: false,
          });
          fetchOrders();
        }
      } catch (error) {
        Swal.fire("Error", "Update failed", "error");
      }
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Permanent delete!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosInstance.delete(`/orders/${id}`);
          if (res.data.result.deletedCount > 0) {
            Swal.fire("Deleted!", "Order removed.", "success");
            fetchOrders();
          }
        } catch (error) {
          Swal.fire("Error", "Delete failed", "error");
        }
      }
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-600 border-amber-200";
      case "shipped":
        return "bg-blue-100 text-blue-600 border-blue-200";
      case "delivered":
        return "bg-green-100 text-green-600 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-600 border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
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
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase">
                Manage Orders
              </h2>
              <p className="text-gray-400 text-xs uppercase font-bold tracking-widest mt-1">
                Control Center
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Email..."
                  className="bg-gray-800 text-white pl-10 pr-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-green-500 w-full text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative flex-1">
                <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <select
                  className="bg-gray-800 text-white pl-10 pr-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer w-full text-sm"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  {/* <option value="delivered">Delivered</option> */}
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          {loading ? (
            <div className="py-20 text-center font-black animate-pulse text-gray-300 uppercase tracking-widest">
              Loading...
            </div>
          ) : (
            <>
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-3">
                  <thead>
                    <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest px-4">
                      <th className="px-6 py-2">Customer & ID</th>
                      <th className="px-6 py-2">Amount</th>
                      <th className="px-6 py-2 text-center">Payment</th>
                      <th className="px-6 py-2 text-center">Status</th>
                      <th className="px-6 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order._id}
                        className="bg-white group hover:shadow-md transition-all"
                      >
                        <td className="px-6 py-4 rounded-l-2xl border-y border-l border-gray-100">
                          <div className="font-bold text-gray-800 text-sm truncate max-w-[180px]">
                            {order.email}
                          </div>
                          <div className="text-[9px] text-gray-400 font-mono tracking-tighter uppercase">
                            {order._id}
                          </div>
                        </td>
                        <td className="px-6 py-4 border-y border-gray-100">
                          <div className="text-sm font-black text-indigo-600">
                            ${order.total}
                          </div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase">
                            {order.products.length} Items
                          </div>
                        </td>
                        <td className="px-6 py-4 border-y border-gray-100 text-center">
                          <div
                            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full inline-block border ${
                              order.paymentStatus === "paid"
                                ? "bg-green-50 text-green-600 border-green-100"
                                : "bg-amber-50 text-amber-600 border-amber-100"
                            }`}
                          >
                            {order.paymentStatus}
                          </div>
                        </td>
                        <td className="px-6 py-4 border-y border-gray-100 text-center">
                          <span
                            className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border ${getStatusBadge(
                              order.orderStatus
                            )}`}
                          >
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 rounded-r-2xl border-y border-r border-gray-100 text-center">
                          <div className="flex justify-center gap-3">
                            <Link
                              to={`/dashboard/admin/order-details/${order._id}`}
                              className="w-10 h-10 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all cursor-pointer shadow-sm"
                              title="View Order Details"
                            >
                              <FaEye size={14} />
                            </Link>

                            {order.orderStatus === "pending" && (
                              <button
                                onClick={() =>
                                  updateStatus(order._id, "shipped")
                                }
                                className="p-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                              >
                                <FaTruck size={12} />
                              </button>
                            )}
                            {order.orderStatus === "shipped" && (
                              <button
                                onClick={() =>
                                  updateStatus(order._id, "delivered")
                                }
                                className="p-2.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all cursor-pointer"
                              >
                                <FaCheckCircle size={12} />
                              </button>
                            )}
                            {order.orderStatus !== "cancelled" &&
                              order.orderStatus !== "delivered" && (
                                <button
                                  onClick={() =>
                                    updateStatus(order._id, "cancelled")
                                  }
                                  className="p-2.5 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-600 hover:text-white transition-all cursor-pointer"
                                >
                                  <FaBan size={12} />
                                </button>
                              )}
                            <button
                              onClick={() => handleDelete(order._id)}
                              className="p-2.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 lg:hidden">
                {orders.map((order) => (
                  <motion.div
                    key={order._id}
                    className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase border ${getStatusBadge(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus}
                        </span>
                        <span className="text-[10px] font-black text-indigo-600">
                          ${order.total}
                        </span>
                      </div>
                      <h4 className="text-[10px] font-bold text-gray-800 truncate mb-1">
                        {order.email}
                      </h4>
                      <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
                        <FaBox size={8} /> {order.products.length} Items
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-50">
                      {order.orderStatus === "pending" && (
                        <button
                          onClick={() => updateStatus(order._id, "shipped")}
                          className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg flex justify-center"
                        >
                          <FaTruck size={10} />
                        </button>
                      )}
                      {order.orderStatus === "shipped" && (
                        <button
                          onClick={() => updateStatus(order._id, "delivered")}
                          className="flex-1 py-2 bg-green-50 text-green-600 rounded-lg flex justify-center"
                        >
                          <FaCheckCircle size={10} />
                        </button>
                      )}
                      {order.orderStatus !== "cancelled" &&
                        order.orderStatus !== "delivered" && (
                          <button
                            onClick={() => updateStatus(order._id, "cancelled")}
                            className="flex-1 py-2 bg-amber-50 text-amber-600 rounded-lg flex justify-center"
                          >
                            <FaBan size={10} />
                          </button>
                        )}
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="flex-1 py-2 bg-red-50 text-red-500 rounded-lg flex justify-center"
                      >
                        <FaTrash size={10} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-6 flex flex-col md:flex-row items-center justify-between bg-gray-50 border-t gap-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Page {currentPage} / {totalPages}
          </p>
          <div className="flex gap-1.5">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-lg font-black text-[10px] transition-all cursor-pointer ${
                  currentPage === i + 1
                    ? "bg-gray-900 text-white shadow-lg"
                    : "bg-white text-gray-400 hover:bg-gray-100 border border-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ManageOrders;
