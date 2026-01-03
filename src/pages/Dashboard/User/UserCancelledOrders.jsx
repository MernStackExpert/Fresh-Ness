import React, { useContext, useEffect, useState } from "react";
import {
  FaTimesCircle,
  FaRegFileAlt,
  FaSearch,
  FaEye,
  FaCalendarTimes,
  FaExclamationTriangle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../../utils/axiosInstance";
import { Link } from "react-router";
import { AuthContext } from "../../../Provider/AuthContext";

const UserCancelledOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCancelledOrders = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/orders?email=${user?.email}`);
        const cancelled = res.data.orders.filter(
          (order) => order.orderStatus === "cancelled"
        );
        setOrders(cancelled);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.email) fetchCancelledOrders();
  }, [user?.email]);

  const filteredOrders = orders.filter((order) =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-2 md:p-8 bg-gray-50 min-h-screen"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black text-gray-800 tracking-tight uppercase flex items-center gap-3">
              <FaTimesCircle className="text-red-500" /> Cancelled Orders
            </h2>
            <p className="text-gray-500 font-medium italic">
              Archive of your cancelled or rejected requests
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID..."
              className="bg-white pl-10 pr-4 py-3 rounded-2xl border border-gray-100 shadow-sm w-full outline-none focus:ring-2 focus:ring-red-400 font-bold text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {loading ? (
          <div className="py-20 text-center text-gray-300 font-black animate-pulse uppercase tracking-widest">
            Scanning Archive Records...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-16 text-center shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaRegFileAlt size={30} className="text-gray-200" />
            </div>
            <h3 className="text-xl font-black text-gray-400 uppercase tracking-tighter">
              No cancellation history found
            </h3>
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
                  className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-red-100 transition-all"
                >
                  <div className="flex items-center gap-5 w-full md:w-auto">
                    <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center text-xl shadow-inner">
                      <FaCalendarTimes />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-800 text-sm tracking-tighter">
                        ORDER #{order._id.slice(-10).toUpperCase()}
                      </h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
                        Cancelled on{" "}
                        {new Date(order.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full md:w-auto md:gap-12 py-4 md:py-0 border-y md:border-y-0 border-gray-50">
                    <div className="text-center">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        Items
                      </p>
                      <p className="text-sm font-black text-gray-700">
                        {order.products.length}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        Total
                      </p>
                      <p className="text-sm font-black text-red-600">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-center hidden sm:block">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        Status
                      </p>
                      <span className="text-[9px] font-black bg-red-50 text-red-500 px-2 py-0.5 rounded border border-red-100 uppercase italic">
                        Void
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex-1 md:flex-none flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-xl text-[9px] font-black uppercase">
                      <FaExclamationTriangle size={10} />{" "}
                      {order.paymentStatus === "paid"
                        ? "Refund Pending"
                        : "No Payment"}
                    </div>
                    <Link
                      to={`/dashboard/user/order-details/${order._id}`}
                      className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center hover:bg-red-600 transition-all shadow-lg active:scale-90"
                      title="View Order Details"
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

export default UserCancelledOrders;
