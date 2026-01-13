import React, { useEffect, useState } from "react";
import { FiUsers, FiShoppingBag, FiDollarSign, FiBox } from "react-icons/fi";
import axiosInstance from "../../../utils/axiosInstance";
import RevenueDonutChart from "../../../components/AdminComponents/RevenueDonutChart";
import UserProgressChart from "../../../components/AdminComponents/UserProgressChart";
import OrderDonutChart from "../../../components/AdminComponents/OrderDonutChart";
import ProductPieChart from "../../../components/AdminComponents/ProductPieChart";
import { Link } from "react-router";

const AdminStats = () => {
  const [data, setData] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [userRes, productRes, orderRes] = await Promise.all([
          axiosInstance.get("/users"),
          axiosInstance.get("/products"),
          axiosInstance.get("/orders"),
        ]);

        const allOrders = orderRes.data.orders || [];

        const totalRevenue = allOrders
          .filter((order) => order.paymentStatus === "paid")
          .reduce((sum, order) => sum + (order.total || 0), 0);

        setOrders(allOrders);

        setData({
          users: userRes.data.totalUsers || 0,
          products: productRes.data.totalProducts || 0,
          orders: orderRes.data.totalOrder,
          revenue: totalRevenue,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);


  const statsConfig = [
    {
      label: "Revenue",
      value: `$${data.revenue.toLocaleString()}`,
      icon: <FiDollarSign size={22} />,
      color: "bg-green-600",
    },
    {
      label: "Users",
      value: data.users.toLocaleString(),
      icon: <FiUsers size={22} />,
      color: "bg-blue-600",
    },
    {
      label: "Orders",
      value: data.orders,
      icon: <FiShoppingBag size={22} />,
      color: "bg-purple-600",
    },
    {
      label: "Products",
      value: data.products.toLocaleString(),
      icon: <FiBox size={22} />,
      color: "bg-orange-600",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">
          Dashboard
        </h2>
        <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mt-1">
          Platform Analytics
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 ${stat.color} text-white rounded-3xl flex items-center justify-center shadow-lg`}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-1">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-black text-gray-900">
                  {stat.value}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RevenueDonutChart totalRevenue={data.revenue} />
        <UserProgressChart totalUsers={data.users} />
        <OrderDonutChart orders={orders} />
        <ProductPieChart totalProducts={data.products} />
      </div>

      <div className="bg-green-600 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-green-100">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-3xl font-black mb-2">
              Inventory is looking good
            </h3>
            <p className="text-green-100 font-medium max-w-md">
              You have {data.products} products live on your store. Keep adding
              more to increase sales.
            </p>
          </div>
          <Link to="/dashboard/admin/manage-products" className="px-10 py-4 bg-white text-green-600 font-black rounded-2xl hover:bg-green-50 transition-colors">
            Manage Products
          </Link>
        </div>
        <FiBox className="absolute -bottom-10 -right-10 text-white/10 w-64 h-64" />
      </div>
    </div>
  );
};

export default AdminStats;
