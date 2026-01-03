import React, { useEffect, useState } from "react";
import { FaBan, FaSearch, FaEye, FaTrash, FaUndoAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { Link } from "react-router";
import axiosInstance from "../../../../utils/axiosInstance";

const CancelledOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCancelledOrders = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/orders`, {
        params: { email: searchTerm },
      });
      let cancelled = res.data.orders.filter((order) => order.orderStatus === "cancelled");
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
        const res = await axiosInstance.patch(`/orders/${id}`, { orderStatus: "pending" });
        if (res.status === 200) {
          setOrders((prev) => prev.filter((order) => order._id !== id));
          Swal.fire({ icon: "success", title: "Restored!", text: "Order is now in Pending list.", timer: 1000, showConfirmButton: false });
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
          Swal.fire({ icon: "success", title: "Deleted!", text: "Order record destroyed.", timer: 1000, showConfirmButton: false });
        }
      } catch (error) {
        Swal.fire("Error", "Delete failed", "error");
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-2 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        
        <div className="bg-red-600 p-6 md:p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase flex items-center gap-3">
                <FaBan className="text-white" />
                Cancelled Orders
              </h2>
              <p className="text-red-100 text-xs uppercase font-bold tracking-widest mt-1">Order Rejections • {orders.length} orders</p>
            </div>

            <div className="relative w-full md:w-80">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-red-200" />
              <input 
                type="text" 
                placeholder="Search email..." 
                className="bg-red-700 text-white placeholder-red-300 pl-10 pr-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-white w-full text-sm transition-all shadow-inner" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          {loading ? (
            <div className="py-20 text-center font-black animate-pulse text-gray-300 uppercase tracking-widest">Scanning Archive...</div>
          ) : orders.length === 0 ? (
            <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest">No Cancelled Records Found</div>
          ) : (
            <>
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-3">
                  <thead>
                    <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest px-4">
                      <th className="px-6 py-2">Account Info</th>
                      <th className="px-6 py-2">Lost Amount</th>
                      <th className="px-6 py-2 text-center">Payment</th>
                      <th className="px-6 py-2 text-center">Manage</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {orders.map((order) => (
                        <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -50 }} key={order._id} className="bg-white group hover:shadow-md transition-all border border-gray-100">
                          <td className="px-6 py-4 rounded-l-2xl border-y border-l border-gray-100">
                            <div className="font-bold text-gray-800 text-sm">{order.email}</div>
                            <div className="text-[9px] text-gray-400 font-mono uppercase tracking-tighter">ID: {order._id.slice(-8)}</div>
                          </td>
                          <td className="px-6 py-4 border-y border-gray-100">
                            <div className="text-sm font-black text-red-600">${order.total}</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase">{order.paymentMethod}</div>
                          </td>
                          <td className="px-6 py-4 border-y border-gray-100 text-center">
                            <div className="px-4 py-1 rounded-full text-[9px] font-black uppercase bg-red-50 text-red-600 border border-red-100">
                              {order.paymentStatus}
                            </div>
                          </td>
                          <td className="px-6 py-4 rounded-r-2xl border-y border-r border-gray-100 text-center">
                            <div className="flex justify-center gap-3">
                              <Link to={`/dashboard/admin/order-details/${order._id}`} className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-800 hover:text-white transition-all shadow-sm"><FaEye size={14} /></Link>
                              <button onClick={() => handleRestore(order._id)} className="w-10 h-10 flex items-center justify-center bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all" title="Restore Order"><FaUndoAlt size={14} /></button>
                              <button onClick={() => handleDelete(order._id)} className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all" title="Delete Permanent"><FaTrash size={14} /></button>
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
                    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }} key={order._id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col justify-between gap-3">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                           <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[8px] font-black uppercase border border-red-100">Cancelled</span>
                           <span className="text-[10px] font-black text-red-600">${order.total}</span>
                        </div>
                        <h4 className="text-[10px] font-bold text-gray-800 truncate mb-1">{order.email}</h4>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-50">
                        <Link to={`/dashboard/admin/order-details/${order._id}`} className="flex-1 py-2 bg-gray-50 text-gray-600 rounded-lg flex justify-center items-center"><FaEye size={10} /></Link>
                        <button onClick={() => handleRestore(order._id)} className="flex-1 py-2 bg-green-50 text-green-600 rounded-lg flex justify-center"><FaUndoAlt size={10} /></button>
                        <button onClick={() => handleDelete(order._id)} className="flex-1 py-2 bg-red-50 text-red-500 rounded-lg flex justify-center"><FaTrash size={10} /></button>
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

export default CancelledOrders;