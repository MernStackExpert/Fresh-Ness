import React, { useEffect, useState } from "react";
import { FaCheckDouble, FaSearch, FaEye, FaAward } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { Link } from "react-router";
import axiosInstance from "../../../../utils/axiosInstance";

const DeliveredOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDeliveredOrders = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/orders`, {
        params: { email: searchTerm },
      });

      let deliveredOrders = res.data.orders.filter((order) => order.orderStatus === "delivered");
      setOrders(deliveredOrders);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch delivered orders", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveredOrders();
  }, [searchTerm]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-2 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        
        <div className="bg-green-600 p-6 md:p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase flex items-center gap-3">
                <FaCheckDouble className="text-white" />
                Delivered Orders
              </h2>
              <p className="text-green-100 text-xs uppercase font-bold tracking-widest mt-1">Successfully Completed • {orders.length} orders</p>
            </div>

            <div className="relative w-full md:w-80">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-green-200" />
              <input 
                type="text" 
                placeholder="Find by Email..." 
                className="bg-green-700 text-white placeholder-green-300 pl-10 pr-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-white w-full text-sm transition-all shadow-inner" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          {loading ? (
            <div className="py-20 text-center font-black animate-pulse text-gray-300 uppercase tracking-widest">Generating History...</div>
          ) : orders.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                <FaAward size={30} />
              </div>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No Delivered Orders Found</p>
            </div>
          ) : (
            <>
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-3">
                  <thead>
                    <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest px-4">
                      <th className="px-6 py-2">Customer & Order Ref</th>
                      <th className="px-6 py-2">Total Paid</th>
                      <th className="px-6 py-2 text-center">Payment Status</th>
                      <th className="px-6 py-2 text-center">View</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {orders.map((order) => (
                        <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={order._id} className="bg-white group hover:shadow-md transition-all">
                          <td className="px-6 py-4 rounded-l-2xl border-y border-l border-gray-100">
                            <div className="font-bold text-gray-800 text-sm">{order.email}</div>
                            <div className="text-[9px] text-gray-400 font-mono uppercase tracking-tighter">REF: {order._id}</div>
                          </td>
                          <td className="px-6 py-4 border-y border-gray-100">
                            <div className="text-sm font-black text-green-600">${order.total}</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Verified Delivery</div>
                          </td>
                          <td className="px-6 py-4 border-y border-gray-100 text-center">
                            <div className="px-4 py-1 rounded-full text-[9px] font-black uppercase bg-green-50 text-green-600 border border-green-100">
                              {order.paymentStatus}
                            </div>
                          </td>
                          <td className="px-6 py-4 rounded-r-2xl border-y border-r border-gray-100 text-center">
                            <Link 
                              to={`/dashboard/admin/order-details/${order._id}`} 
                              className="inline-flex w-10 h-10 items-center justify-center bg-gray-900 text-white rounded-xl hover:bg-green-600 transition-all cursor-pointer shadow-md"
                            >
                              <FaEye size={14} />
                            </Link>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-2 gap-3 lg:hidden">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col justify-between gap-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-1">
                       <FaCheckDouble className="text-green-50/50 text-4xl" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                         <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded text-[8px] font-black uppercase border border-green-100">Paid</span>
                         <span className="text-[10px] font-black text-green-600">${order.total}</span>
                      </div>
                      <h4 className="text-[10px] font-bold text-gray-800 truncate mb-1">{order.email}</h4>
                    </div>
                    <Link to={`/dashboard/admin/order-details/${order._id}`} className="w-full py-2 bg-gray-900 text-white rounded-lg flex justify-center items-center gap-2 text-[10px] font-bold cursor-pointer hover:bg-green-600 transition-colors">
                      <FaEye size={12} /> View Details
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DeliveredOrders;