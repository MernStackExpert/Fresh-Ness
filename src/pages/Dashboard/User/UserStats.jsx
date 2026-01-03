import React, { useContext, useEffect, useState } from "react";
import { FiHeart, FiPackage, FiCreditCard, FiShoppingBag, FiArrowRight, FiActivity } from "react-icons/fi";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axiosInstance from "../../../utils/axiosInstance";
import { Link } from "react-router";
import { AuthContext } from "../../../Provider/AuthContext";

const UserStats = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dummy Data for Chart
  const spendingData = [
    { month: 'Jan', amount: 45 },
    { month: 'Feb', amount: 120 },
    { month: 'Mar', amount: 78 },
    { month: 'Apr', amount: 210 },
    { month: 'May', amount: 145 },
    { month: 'Jun', amount: 190 },
  ];

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const res = await axiosInstance.get(`/orders/my-orders?email=${user?.email}`);
        setOrders(res.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    if (user?.email) fetchUserStats();
  }, [user?.email]);

  const totalSpent = orders.reduce((sum, order) => sum + (order.paymentStatus === 'paid' ? order.total : 0), 0);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 p-1 md:p-4">
      
      <header>
        <h2 className="text-3xl font-black text-gray-800 tracking-tight">User Dashboard</h2>
        <p className="text-gray-500 font-medium">Welcome back, {user?.displayName}!</p>
      </header>

      {/* Banner Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-700 p-8 md:p-12 rounded-[3rem] text-white flex flex-col md:flex-row justify-between items-center shadow-2xl shadow-green-100 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-3xl font-black mb-2">Freshness Rewards Club!</h3>
          <p className="opacity-90 font-medium text-lg">You have <span className="underline decoration-yellow-400 decoration-4">750</span> bonus points available.</p>
          <button className="mt-8 bg-white text-green-700 px-10 py-4 rounded-2xl font-black hover:bg-yellow-400 hover:scale-105 transition-all cursor-pointer shadow-xl uppercase text-xs tracking-widest">
            Redeem Points
          </button>
        </div>
        <FiShoppingBag className="absolute -right-10 -bottom-10 text-white opacity-10 w-64 h-64 rotate-12" />
      </section>
      
      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-5 bg-blue-50 text-blue-600 rounded-[1.5rem]"><FiPackage size={28}/></div>
          <div><p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-1">Total Orders</p><h5 className="text-3xl font-black text-gray-800">{orders.length}</h5></div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-5 bg-pink-50 text-pink-600 rounded-[1.5rem]"><FiHeart size={28}/></div>
          <div><p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-1">Wishlist</p><h5 className="text-3xl font-black text-gray-800">14</h5></div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-5 bg-orange-50 text-orange-600 rounded-[1.5rem]"><FiCreditCard size={28}/></div>
          <div><p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-1">Total Spent</p><h5 className="text-3xl font-black text-gray-800">${totalSpent.toFixed(2)}</h5></div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spending Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h4 className="text-xl font-black text-gray-800 mb-8 flex items-center gap-2"><FiActivity className="text-green-500" /> Spending Analysis</h4>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendingData}>
                <defs>
                  <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis hide={true} />
                <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorSpent)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-xl font-black text-gray-800 flex items-center gap-2"><FiPackage className="text-blue-500" /> Recent Activity</h4>
            <Link to="/dashboard/user/my-orders" className="text-xs font-black text-blue-600 hover:underline uppercase">View All</Link>
          </div>
          <div className="space-y-4 flex-1">
            {orders.slice(0, 4).map((order) => (
              <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${order.orderStatus === 'delivered' ? 'bg-green-500' : 'bg-amber-500'}`} />
                  <div>
                    <p className="text-sm font-black text-gray-800 uppercase tracking-tighter">Order #{order._id.slice(-6)}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-gray-900">${order.total}</p>
                  <p className={`text-[9px] font-black uppercase ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>{order.paymentStatus}</p>
                </div>
              </div>
            ))}
            {orders.length === 0 && <p className="text-center text-gray-400 py-10 font-bold uppercase tracking-widest text-xs">No orders found yet</p>}
          </div>
        </div>
      </section>

    </motion.div>
  );
};

export default UserStats;