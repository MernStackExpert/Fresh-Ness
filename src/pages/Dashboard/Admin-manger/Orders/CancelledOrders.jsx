import React, { useEffect, useState, useContext } from "react";
import { FaBan, FaSearch, FaEye, FaTrash, FaUndoAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { Link } from "react-router";
import { AuthContext } from "../../../../Provider/AuthContext";
import axiosInstance from "../../../../utils/axiosInstance";


const CancelledOrders = () => {
  const { user: firebaseUser, loading: authLoading } = useContext(AuthContext);
  const [dbUser, setDbUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!authLoading && firebaseUser?.email) {
        try {
          const response = await axiosInstance.get(`/users?email=${firebaseUser.email}`);
          if (response.data.result?.length > 0) {
            setDbUser(response.data.result[0]);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
    };
    fetchUserData();
  }, [firebaseUser, authLoading]);

  const fetchCancelledOrders = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/orders`, {
        params: { email: searchTerm },
      });
      let cancelled = res.data.orders.filter(
        (order) => order.orderStatus === "cancelled"
      );
      setOrders(cancelled);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch cancelled orders", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCancelledOrders();
  }, [searchTerm]);

  const handleRestore = async (id) => {
    const result = await Swal.fire({
      title: "Restore Order?",
      text: "Move this order back to Pending status.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      confirmButtonText: "Yes, Restore",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.patch(`/orders/${id}`, {
          orderStatus: "pending",
        });
        if (res.status === 200) {
          setOrders((prev) => prev.filter((order) => order._id !== id));
          Swal.fire("Restored!", "Order is now in Pending list.", "success");
        }
      } catch (error) {
        Swal.fire("Error", "Restore failed", "error");
      }
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Permanent Delete?",
      text: "This record will be removed forever!",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, Delete",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.delete(`/orders/${id}`);
        if (res.data.result.deletedCount > 0) {
          setOrders((prev) => prev.filter((order) => order._id !== id));
          Swal.fire("Deleted!", "Order record destroyed.", "success");
        }
      } catch (error) {
        Swal.fire("Error", "Delete failed", "error");
      }
    }
  };

  if (authLoading || (loading && orders.length === 0)) {
    return (
      <div className="py-20 text-center font-black animate-pulse text-gray-300 uppercase tracking-widest">
        Verifying Permissions...
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-2 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-red-600 p-6 md:p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase flex items-center gap-3">
                <FaBan /> Cancelled Orders
              </h2>
              <p className="text-red-100 text-xs uppercase font-bold tracking-widest mt-1">
                Role: {dbUser?.role} • {orders.length} Records
              </p>
            </div>
            <div className="relative w-full md:w-80">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-red-200" />
              <input
                type="text"
                placeholder="Search email..."
                className="bg-red-700 text-white placeholder-red-300 pl-10 pr-4 py-2.5 rounded-xl outline-none w-full text-sm shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="p-4 md:p-6">
          {orders.length === 0 ? (
            <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest">
              No Cancelled Records
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest px-4">
                    <th className="px-6 py-2">Account Info</th>
                    <th className="px-6 py-2">Lost Amount</th>
                    <th className="px-6 py-2 text-center">Manage</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {orders.map((order) => (
                      <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }} key={order._id} className="bg-white border border-gray-100 group">
                        <td className="px-6 py-4 rounded-l-2xl border-y border-l border-gray-100">
                          <div className="font-bold text-gray-800 text-sm">{order.email}</div>
                          <div className="text-[9px] text-gray-400 font-mono">ID: {order._id.slice(-8)}</div>
                        </td>
                        <td className="px-6 py-4 border-y border-gray-100 font-black text-red-600">${order.total}</td>
                        <td className="px-6 py-4 rounded-r-2xl border-y border-r border-gray-100">
                          <div className="flex justify-center gap-3">
                            <Link to={`/dashboard/admin/order-details/${order._id}`} className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-800 hover:text-white transition-all">
                              <FaEye size={14} />
                            </Link>

                            {dbUser?.role !== "manager" && (
                              <>
                                <button onClick={() => handleRestore(order._id)} className="w-10 h-10 flex items-center justify-center bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all">
                                  <FaUndoAlt size={14} />
                                </button>
                                <button onClick={() => handleDelete(order._id)} className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                                  <FaTrash size={14} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CancelledOrders;