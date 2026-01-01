import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import axios from "axios";
import herovideo from "/fresh-ness-hero.mp4";
import axiosInstance from "../../utils/axiosInstance";

const HeroSection = () => {
  const navigate = useNavigate();
  const [categoryCounts, setCategoryCounts] = useState({});

  const categories = [
    { name: "Vegetables", icon: "🧺", slug: "Vegetables" },
    { name: "Fresh Fruits", icon: "🍎", slug: "Fruits" },
    { name: "Desserts", icon: "🧁", slug: "Dairy" },
    { name: "Drinks & Juice", icon: "🧃", slug: "Beverages" },
    { name: "Fish & Meats", icon: "🐟", slug: "Meats" },
    { name: "Pets & Animals", icon: "🐶", slug: "Pets" },
  ];

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axiosInstance.get("/products?limit=1000");
        const allProducts = response.data.products;

        const counts = allProducts.reduce((acc, product) => {
          acc[product.category] = (acc[product.category] || 0) + 1;
          return acc;
        }, {});

        setCategoryCounts(counts);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCounts();
  }, []);

  const handleCategoryClick = (categorySlug) => {
    navigate(`/all-grocerice?category=${categorySlug}`);
  };

  return (
    <section className="bg-white py-6 md:py-10">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto lg:overflow-visible items-center justify-between gap-6 pb-10 custom-scrollbar">
          {categories.map((cat, idx) => {
            const dynamicCount = categoryCounts[cat.slug] || 0;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                onClick={() => handleCategoryClick(cat.slug)}
                className="flex items-center gap-3 min-w-max cursor-pointer group"
              >
                <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-2xl group-hover:bg-indigo-100 transition-colors">
                  {cat.icon}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">{cat.name}</h4>
                  <p className="text-xs text-gray-400">{dynamicCount} Products</p>
                </div>
                {idx !== categories.length - 1 && (
                  <div className="hidden lg:block h-6 w-[1px] bg-gray-100 ml-4"></div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[600px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 relative rounded-[2rem] overflow-hidden group min-h-[400px]"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={herovideo} type="video/mp4" />
            </video>

            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500"></div>

            <div className="relative z-10 p-8 md:p-16 h-full flex flex-col justify-center items-start text-white">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-indigo-600 px-5 py-1.5 rounded-full text-xs md:text-sm font-bold mb-6 tracking-wide shadow-lg"
              >
                100% FARM FRESH FOOD
              </motion.span>
              <h1
                className="text-4xl md:text-7xl font-bold leading-tight mb-4 drop-shadow-lg"
                style={{ fontFamily: "cursive" }}
              >
                Fresh Organic <br />
                <span className="text-amber-400">Food For All</span>
              </h1>
              <div className="flex items-center gap-4 mb-8">
                <span className="text-4xl md:text-6xl font-black text-white">
                  $59.00
                </span>
                <span className="text-lg line-through opacity-70">$80.00</span>
              </div>
              <button
                onClick={() => navigate("/all-grocerice")}
                className="bg-indigo-700 text-white px-10 py-4 rounded-full font-bold hover:bg-white hover:text-indigo-800 transition-all duration-300 shadow-xl active:scale-95"
              >
                Shop Now
              </button>
            </div>
          </motion.div>

          <div className="flex flex-col gap-6">
            <motion.div
              whileHover={{ y: -5 }}
              className="relative rounded-[2rem] overflow-hidden h-1/2 min-h-[250px] group shadow-lg"
            >
              <img
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800"
                alt="Creamy Fruits"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-blue-900/40 group-hover:bg-blue-900/30 transition-all"></div>

              <div className="relative z-10 p-8 text-white h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl md:text-3xl font-extrabold leading-tight drop-shadow-md">
                    Creamy Fruits <br /> baby Jem
                  </h3>
                  <p className="mt-4 text-sm font-medium opacity-90 uppercase tracking-widest">
                    Only For{" "}
                    <span className="text-2xl font-black text-amber-400">
                      $12.99
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => navigate("/all-grocerice")}
                  className="bg-white text-indigo-900 w-fit px-6 py-2 rounded-full text-xs font-black hover:bg-amber-400 hover:text-white transition-colors"
                >
                  SHOP NOW
                </button>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-6 h-1/2 min-h-[250px]">
              <motion.div
                whileHover={{ y: -5 }}
                className="relative rounded-[2rem] overflow-hidden group shadow-lg"
              >
                <img
                  src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=500"
                  alt="Diaper"
                  className="absolute inset-0 w-full h-full object-cover group-hover:rotate-2 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all"></div>
                <div className="relative z-10 p-4 h-full flex flex-col justify-between text-center items-center">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg">
                    <h4 className="font-black text-[10px] md:text-xs text-indigo-900 uppercase">
                      Baby Diaper
                    </h4>
                  </div>
                  <button
                    onClick={() => navigate("/all-grocerice")}
                    className="bg-white text-indigo-900 px-4 py-1.5 rounded-full text-[10px] font-bold shadow-md hover:bg-indigo-700 hover:text-white transition-all"
                  >
                    Buy Now
                  </button>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="relative rounded-[2rem] overflow-hidden group shadow-lg bg-pink-50"
              >
                <img
                  src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=500"
                  alt="Skincare"
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-pink-600/10 group-hover:bg-transparent"></div>

                <div className="absolute top-4 right-4 bg-pink-600 text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-[10px] md:text-[12px] font-black leading-tight shadow-xl z-20">
                  15% <br /> OFF
                </div>

                <div className="relative z-10 p-4 h-full flex flex-col justify-between items-center text-center">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg">
                    <h4 className="font-black text-[10px] md:text-xs text-gray-800 uppercase">
                      Dark Wash
                    </h4>
                  </div>
                  <button
                    onClick={() => navigate("/all-grocerice")}
                    className="bg-indigo-800 text-white px-4 py-1.5 rounded-full text-[10px] font-bold shadow-md"
                  >
                    Shop All
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;