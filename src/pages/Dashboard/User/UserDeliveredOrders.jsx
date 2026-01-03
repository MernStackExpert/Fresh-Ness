import React, { useContext, useEffect, useState } from "react";
import { FaCheckDouble, FaSearch, FaEye, FaAward } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../../utils/axiosInstance";
import { Link } from "react-router";
import { AuthContext } from "../../../Provider/AuthContext";

const UserDeliveredOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]); // ইনিশিয়াল স্টেট অ্যারে
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDeliveredOrders = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/orders?email=${user?.email}`);
      
      // এখানে লজিক পরিবর্তন করা হয়েছে: res.data.orders থেকে ফিল্টার হবে
      const allOrders = res.data.orders || []; 
      const delivered = allOrders.filter((order) => order.orderStatus === "delivered");
      
      setOrders(delivered);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchDeliveredOrders();
    }
  }, [user?.email]);

  const filteredOrders = orders.filter(order => 
    order._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-2 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black text-gray-800 tracking-tight uppercase flex items-center gap-3">
               <FaCheckDouble className="text-green-600" /> Delivered History
            </h2>
            <p className="text-gray-500 font-medium italic">List of your successfully received orders</p>
          </div>
          
          <div className="relative w-full md:w-72">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by ID..." 
              className="bg-white pl-10 pr-4 py-3 rounded-2xl border border-gray-100 shadow-sm w-full outline-none focus:ring-2 focus:ring-green-400 font-bold text-sm transition-all" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
        </header>

        {loading ? (
          <div className="py-20 text-center text-gray-300 font-black animate-pulse uppercase tracking-widest">
            Retrieving History...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-16 text-center shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaAward size={30} className="text-gray-200" />
            </div>
            <h3 className="text-xl font-black text-gray-400 uppercase tracking-tighter">No delivered orders yet</h3>
          </div>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence>
              {filteredOrders.map((order) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={order._id}
                  className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-green-100 transition-all"
                >
                  <div className="flex items-center gap-5 w-full md:w-auto">
                    <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-xl shadow-inner border border-green-100">
                      <FaCheckDouble />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-800 text-sm tracking-tighter uppercase">Order #{order._id.slice(-10)}</h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
                        Delivered on {new Date(order.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full md:w-auto md:gap-12 py-4 md:py-0 border-y md:border-y-0 border-gray-50">
                    <div className="text-center">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Items</p>
                      <p className="text-sm font-black text-gray-700">{order.products?.length || 0}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Paid Amount</p>
                      <p className="text-sm font-black text-green-600">${order.total?.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex-1 md:flex-none flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl text-[9px] font-black uppercase">
                       <FaAward size={10} /> Completed
                    </div>
                    <Link 
                      to={`/dashboard/user/order-details/${order._id}`} 
                      className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center hover:bg-green-600 transition-all shadow-lg active:scale-90"
                    >
                      <FaEye size={16} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UserDeliveredOrders;