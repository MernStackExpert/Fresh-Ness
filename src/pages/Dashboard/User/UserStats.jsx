import React, { useContext, useEffect, useState } from "react";
import {
  FiHeart,
  FiPackage,
  FiCreditCard,
  FiShoppingBag,
  FiUser,
  FiActivity,
  FiArrowUpRight,
} from "react-icons/fi";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axiosInstance from "../../../utils/axiosInstance";
import { Link } from "react-router";
import { AuthContext } from "../../../Provider/AuthContext";

const UserStats = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [totalOrderCount, setTotalOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const spendingData = [
    { month: "Jan", amount: 45 },
    { month: "Feb", amount: 120 },
    { month: "Mar", amount: 78 },
    { month: "Apr", amount: 210 },
    { month: "May", amount: 145 },
    { month: "Jun", amount: 190 },
  ];

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const res = await axiosInstance.get(`/orders?email=${user?.email}`);
        setOrders(res.data.orders || []);
        setTotalOrderCount(res.data.totalOrder || 0);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    if (user?.email) fetchUserStats();
  }, [user?.email]);

  const totalSpent = orders.reduce(
    (sum, order) => sum + (order.paymentStatus === "paid" ? order.total : 0),
    0
  );

  const growthRate =
    totalOrderCount > 0 ? ((totalOrderCount / 10) * 100).toFixed(0) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 p-1 md:p-4"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight tracking-tighter uppercase">
            Overview
          </h2>
          <p className="text-gray-500 font-medium tracking-wide">
            Monitoring your real-time account activity
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-[1.5rem] border border-gray-100 shadow-sm w-fit">
          <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center text-white font-bold shadow-lg shadow-green-100">
            {user?.displayName?.charAt(0) || "U"}
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">
              Status: Verified
            </p>
            <p className="text-xs font-bold text-gray-700">{user?.email}</p>
          </div>
        </div>
      </header>

      <section className="bg-gray-900 p-8 md:p-12 rounded-[3rem] text-white flex flex-col md:flex-row justify-between items-center shadow-2xl shadow-gray-200 relative overflow-hidden">
        <div className="relative z-10 space-y-5">
          <div className="bg-green-500/20 text-green-400 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest w-fit border border-green-500/30 backdrop-blur-md">
            Customer Profile: Premium
          </div>
          <h3 className="text-3xl md:text-5xl font-black leading-tight tracking-tighter uppercase">
            Verified <br /> Store Partner
          </h3>
          <p className="opacity-60 font-medium max-w-sm text-sm">
            Thank you for your trust. You have completed {totalOrderCount}{" "}
            orders with us. Keep shopping for more rewards.
          </p>
        </div>
        <div className="mt-8 md:mt-0 relative z-10">
          <Link
            to="/dashboard/profile"
            className="bg-white text-gray-900 px-10 py-5 rounded-[1.5rem] font-black hover:bg-green-400 hover:scale-105 transition-all flex items-center gap-2 shadow-xl text-xs uppercase tracking-widest active:scale-95"
          >
            <FiUser size={16} /> Edit Profile Settings
          </Link>
        </div>
        <FiShoppingBag className="absolute -right-10 -bottom-10 text-white opacity-5 w-80 h-80 rotate-12" />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex items-center gap-6 shadow-sm hover:shadow-xl transition-all group">
          <div className="p-5 bg-blue-50 text-blue-600 rounded-[1.5rem] group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <FiPackage size={28} />
          </div>
          <div>
            <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest mb-1">
              Total Orders
            </p>
            <div className="flex items-end gap-2">
              <h5 className="text-3xl font-black text-gray-800">
                {totalOrderCount}
              </h5>
              <span className="text-green-500 text-[10px] font-black flex items-center gap-0.5 mb-1">
                <FiArrowUpRight /> {growthRate}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex items-center gap-6 shadow-sm hover:shadow-xl transition-all group">
          <div className="p-5 bg-pink-50 text-pink-600 rounded-[1.5rem] group-hover:bg-pink-600 group-hover:text-white transition-colors">
            <FiHeart size={28} />
          </div>
          <div>
            <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest mb-1">
              Wishlist
            </p>
            <h5 className="text-3xl font-black text-gray-800">0</h5>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex items-center gap-6 shadow-sm hover:shadow-xl transition-all group">
          <div className="p-5 bg-orange-50 text-orange-600 rounded-[1.5rem] group-hover:bg-orange-600 group-hover:text-white transition-colors">
            <FiCreditCard size={28} />
          </div>
          <div>
            <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest mb-1">
              Lifetime Spent
            </p>
            <h5 className="text-3xl font-black text-gray-800">
              ${totalSpent.toFixed(2)}
            </h5>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h4 className="text-xl font-black text-gray-800 mb-8 flex items-center gap-2 uppercase tracking-tighter">
            <FiActivity className="text-green-500" /> Expense Analysis
          </h4>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendingData}>
                <defs>
                  <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  dy={10}
                />
                <YAxis hide={true} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "24px",
                    border: "none",
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                    padding: "15px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#10b981"
                  strokeWidth={5}
                  fillOpacity={1}
                  fill="url(#colorSpent)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-xl font-black text-gray-800 flex items-center gap-2 uppercase tracking-tighter">
              <FiPackage className="text-blue-500" /> Recent Purchases
            </h4>
            <Link
              to="/dashboard/user/my-orders"
              className="bg-gray-100 px-4 py-2 rounded-xl text-[10px] font-black text-gray-600 hover:bg-gray-900 hover:text-white transition-all uppercase tracking-widest"
            >
              History
            </Link>
          </div>
          <div className="space-y-4 flex-1">
            {orders.slice(0, 4).map((order) => (
              <div
                key={order._id}
                className="flex items-center justify-between p-5 bg-gray-50 rounded-[1.5rem] border border-gray-100 group hover:bg-white hover:shadow-xl transition-all cursor-default"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                      order.orderStatus === "delivered"
                        ? "bg-green-500"
                        : "bg-amber-500"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-black text-gray-800 uppercase tracking-tighter">
                      Order #{order._id.slice(-6)}
                    </p>
                    <p className="text-[10px] text-gray-400 font-black uppercase">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-gray-900">
                    ${order.total}
                  </p>
                  <p
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border inline-block mt-1 ${
                      order.paymentStatus === "paid"
                        ? "bg-green-50 text-green-600 border-green-100"
                        : "bg-amber-50 text-amber-600 border-amber-100"
                    }`}
                  >
                    {order.paymentStatus}
                  </p>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full opacity-40 py-10">
                <FiShoppingBag size={40} className="mb-2" />
                <p className="text-xs font-bold uppercase tracking-widest">
                  No activity found
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default UserStats;
