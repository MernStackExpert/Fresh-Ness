import React, { useState, useContext, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router";
import {
  FiGrid,
  FiShoppingBag,
  FiUsers,
  FiBox,
  FiSettings,
  FiMenu,
  FiLogOut,
  FiBarChart2,
  FiUser,
  FiBell,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { AuthContext } from "../Provider/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";

const DashboardLayout = () => {
  const {
    user: firebaseUser,
    logOut,
    loading: authLoading,
  } = useContext(AuthContext);
  const [dbUser, setDbUser] = useState(null);
  const [dbLoading, setDbLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!authLoading && firebaseUser?.email) {
        try {
          const response = await axiosInstance.get(
            `/users?email=${firebaseUser.email}`
          );
          if (response.data.result?.length > 0) {
            setDbUser(response.data.result[0]);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setDbLoading(false);
        }
      } else if (!authLoading && !firebaseUser) {
        setDbLoading(false);
      }
    };
    fetchUserData();
  }, [firebaseUser, authLoading]);

  if (authLoading || dbLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-green-100 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-green-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-4 font-bold text-gray-500 animate-pulse">
          Loading Workspace...
        </p>
      </div>
    );
  }

  const orderManagement = {
    name: "Order Management",
    icon: <FiBarChart2 size={20} />,
    children: [
      {
        name: "Manage Orders",
        path: "/dashboard/am/manage-orders",
        icon: <FiShoppingBag size={18} />,
      },
      {
        name: "Shipped Orders",
        path: "/dashboard/am/shipped-orders",
        icon: <FiTruck size={18} />,
      },
      {
        name: "Delivered Orders",
        path: "/dashboard/am/delivered-orders",
        icon: <FiCheckCircle size={18} />,
      },
      {
        name: "Cancelled Orders",
        path: "/dashboard/am/cancelled-orders",
        icon: <FiXCircle size={18} />,
      },
    ],
  };

  const adminMenu = [
    { name: "Overview", path: "/dashboard", icon: <FiGrid size={20} /> },
    {
      name: "Manage Users",
      path: "/dashboard/admin/manage-user",
      icon: <FiUsers size={20} />,
    },
    {
      name: "Manage Products",
      path: "/dashboard/admin/manage-products",
      icon: <FiBox size={20} />,
    },
    {
      name: "Add Products",
      path: "/dashboard/admin-manger/add-products",
      icon: <FiBox size={20} />,
    },
    orderManagement,
  ];

  const managerMenu = [
    {
      name: "Inventory",
      path: "/dashboard/inventory",
      icon: <FiBox size={20} />,
    },
    orderManagement,
  ];

  const userMenu = [
    { name: "Overview", path: "/dashboard", icon: <FiGrid size={20} /> },
    {
      name: "My Orders",
      path: "/dashboard/my-orders",
      icon: <FiShoppingBag size={20} />,
    },
    {
      name: "Delivered Orders",
      path: "/dashboard/delivered-orders",
      icon: <FiCheckCircle size={18} />,
    },
    {
      name: "Cancelled Orders",
      path: "/dashboard/cancelled-orders",
      icon: <FiXCircle size={18} />,
    },
  ];

  const commonMenu = [
    { name: "Profile", path: "/dashboard/profile", icon: <FiUser size={20} /> },
  ];

  let finalMenu = [];
  if (dbUser?.role === "admin") finalMenu = [...adminMenu, ...commonMenu];
  else if (dbUser?.role === "manager")
    finalMenu = [...managerMenu, ...commonMenu];
  else finalMenu = [...userMenu, ...commonMenu];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="p-8">
        <Link
          to="/"
          className="text-2xl font-black text-green-600 tracking-tighter flex items-center gap-2"
        >
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <FiBox className="text-white" size={18} />
          </div>
          FRESHNESS.
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {finalMenu.map((item) =>
          item.children ? (
            <div key={item.name}>
              <button
                onClick={() => setOrderOpen(!orderOpen)}
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl font-bold text-gray-500 hover:bg-green-50 hover:text-green-600 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-[14px]">{item.name}</span>
                </div>
                <motion.span animate={{ rotate: orderOpen ? 180 : 0 }}>
                  ▼
                </motion.span>
              </button>

              <AnimatePresence>
                {orderOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="ml-10 mt-1 space-y-1 overflow-hidden"
                  >
                    {item.children.map((sub) => (
                      <Link
                        key={sub.name}
                        to={sub.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-bold transition ${
                          location.pathname === sub.path
                            ? "text-green-600 bg-green-50"
                            : "text-gray-400 hover:text-green-600"
                        }`}
                      >
                        {sub.icon}
                        {sub.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${
                location.pathname === item.path
                  ? "bg-green-600 text-white shadow-md shadow-green-100"
                  : "text-gray-500 hover:bg-green-50 hover:text-green-600"
              }`}
            >
              {item.icon}
              <span className="text-[14px]">{item.name}</span>
            </Link>
          )
        )}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={logOut}
          className="flex items-center gap-3 px-4 py-3 w-full text-gray-500 font-bold hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200"
        >
          <FiLogOut size={18} />
          <span className="text-[14px]">Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 lg:hidden shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* 🔒 HEADER — UNCHANGED */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiMenu size={22} />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest opacity-40">
                Dashboard /{" "}
                <span className="text-green-600 opacity-100">
                  {dbUser?.role}
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-all relative">
              <FiBell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-8 w-[1px] bg-gray-100"></div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-[13px] font-black text-gray-900 leading-none">
                  {dbUser?.fullName}
                </p>
                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">
                  Verified {dbUser?.role}
                </p>
              </div>
              <div className="relative group cursor-pointer">
                <img
                  src={
                    dbUser?.photoURL ||
                    `https://ui-avatars.com/api/?name=${dbUser?.fullName}&background=22c55e&color=fff`
                  }
                  className="w-10 h-10 rounded-xl border-2 border-white shadow-sm object-cover ring-1 ring-gray-100 group-hover:ring-green-500 transition-all"
                  alt="avatar"
                />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-[1400px] mx-auto"
          >
            <Outlet context={{ dbUser }} />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
