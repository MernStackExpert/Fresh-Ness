import React, { useContext, useEffect, useState } from "react";
import { FiPackage, FiAlertCircle, FiTruck, FiStar } from "react-icons/fi";
import { AuthContext } from "../../../Provider/AuthContext";
import axiosInstance from "../../../utils/axiosInstance";
import OrderStatusChart from "../../../components/ManagerComponents/OrderStatusChart";
import ManagerCategoryChart from "../../../components/ManagerComponents/ManagerCategoryChart";
import ManagerStockPieChart from "../../../components/ManagerComponents/ManagerStockPieChart";
import TopSellingProducts from "../../../components/ManagerComponents/TopSellingProducts";


const ManagerStats = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    products: [],
    orders: [],
    stats: {
      totalProducts: 0,
      outOfStock: 0,
      pendingOrders: 0,
      avgRating: 0
    }
  });

  useEffect(() => {
    const fetchManagerData = async () => {
      try {
        const [productRes, orderRes] = await Promise.all([
          axiosInstance.get("/products?limit=1000"),
          axiosInstance.get("/orders?limit=1000")
        ]);

        const allProducts = productRes.data.products || [];
        const allOrders = orderRes.data.orders || [];

        const outOfStock = allProducts.filter(p => p.stock === 0).length;
        const pendingOrders = allOrders.filter(o => o.orderStatus === "pending").length;
        const totalRating = allProducts.reduce((sum, p) => sum + (p.rating || 0), 0);
        const avgRating = allProducts.length > 0 ? (totalRating / allProducts.length).toFixed(1) : 0;

        setData({
          products: allProducts,
          orders: allOrders,
          stats: {
            totalProducts: productRes.data.totalProducts,
            outOfStock,
            pendingOrders,
            avgRating
          }
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchManagerData();
  }, []);

  const config = [
    { label: "Total Products", value: data.stats.totalProducts, icon: <FiPackage size={22} />, color: "bg-blue-600" },
    { label: "Out of Stock", value: data.stats.outOfStock, icon: <FiAlertCircle size={22} />, color: "bg-red-600" },
    { label: "Pending Orders", value: data.stats.pendingOrders, icon: <FiTruck size={22} />, color: "bg-orange-600" },
    { label: "Avg Rating", value: `${data.stats.avgRating}/5`, icon: <FiStar size={22} />, color: "bg-emerald-600" },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Manager Stats</h2>
        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Real-time Inventory & Order Analytics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {config.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 ${stat.color} text-white rounded-3xl flex items-center justify-center shadow-lg`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <OrderStatusChart orders={data.orders} />
        <ManagerCategoryChart products={data.products} />
        <ManagerStockPieChart stats={data.stats} products={data.products} />
        <TopSellingProducts orders={data.orders} />
      </div>
    </div>
  );
};

export default ManagerStats;