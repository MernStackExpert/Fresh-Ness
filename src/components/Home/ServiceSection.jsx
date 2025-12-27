import React from "react";
import { motion } from "framer-motion";
import { IoCheckmarkCircle, IoCarOutline, IoShieldCheckmarkOutline, IoTimeOutline, IoWalletOutline } from "react-icons/io5";

const ServiceSection = () => {
  // নিচের এক্সট্রা সার্ভিস কার্ডের ডাটা
  const extraServices = [
    {
      title: "Free Delivery",
      desc: "On all orders over $50.00",
      icon: <IoCarOutline className="text-4xl text-green-600" />,
      bgColor: "bg-green-50",
    },
    {
      title: "Safe Payment",
      desc: "100% secure payment methods",
      icon: <IoShieldCheckmarkOutline className="text-4xl text-blue-600" />,
      bgColor: "bg-blue-50",
    },
    {
      title: "24/7 Support",
      desc: "Dedicated support anytime",
      icon: <IoTimeOutline className="text-4xl text-purple-600" />,
      bgColor: "bg-purple-50",
    },
    {
      title: "Easy Returns",
      desc: "30 days money back guarantee",
      icon: <IoWalletOutline className="text-4xl text-amber-600" />,
      bgColor: "bg-amber-50",
    },
  ];

  const features = [
    "Best Services than others",
    "100% Organic & Natural Products",
    "100% Returns & Refunds",
    "User-Friendly Mobile Apps",
  ];

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        
        {/* --- Main Banner Section (Image Design) --- */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
          
          {/* Left Side: Image with Floating Elements */}
          <div className="flex-1 relative">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-10 flex justify-center"
            >
              {/* Main Image with Arched Background */}
              <div className="relative w-[300px] h-[400px] md:w-[450px] md:h-[550px] bg-green-100 rounded-t-full overflow-hidden flex items-end">
                <img 
                  src="https://img.freepik.com/free-photo/delivery-man-with-face-mask-delivering-food-order-new-normal-concept_23-2148532986.jpg?t=st=1735310000~exp=1735313600~hmac=your-real-img-link" 
                  alt="Delivery Man"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Element: Strawberry */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute top-10 right-0 md:right-10 bg-white p-3 rounded-2xl shadow-xl z-20"
              >
                <span className="text-3xl">🍓</span>
              </motion.div>

              {/* Floating Element: Orange */}
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 4, delay: 1 }}
                className="absolute bottom-20 left-0 md:-left-10 bg-white p-3 rounded-2xl shadow-xl z-20"
              >
                <span className="text-3xl">🍊</span>
              </motion.div>

              {/* Stats Card: Sales */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="absolute bottom-10 right-0 md:-right-5 bg-white p-4 rounded-2xl shadow-2xl z-20 border border-gray-50"
              >
                <p className="text-xs text-gray-400 font-medium">This Month Sale</p>
                <p className="text-xl font-bold text-gray-800">$45,890</p>
                <div className="flex items-center gap-2 mt-1">
                   <span className="text-green-500 text-[10px] font-bold">↑ 2.35%</span>
                   <div className="flex gap-0.5 h-4 items-end">
                      <div className="w-1 bg-green-200 h-2"></div>
                      <div className="w-1 bg-green-400 h-3"></div>
                      <div className="w-1 bg-green-600 h-4"></div>
                   </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Side: Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                Best Quality Healthy And <br /> 
                <span className="text-green-600">Fresh Grocery</span>
              </h2>
              <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto lg:mx-0">
                We prioritize quality in each of our grocery. below are the advantage of our products. Organic food is food produced.
              </p>

              {/* Features List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {features.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 justify-center lg:justify-start">
                    <IoCheckmarkCircle className="text-green-500 text-2xl shrink-0" />
                    <span className="font-semibold text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-100"
              >
                Order Now
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* --- Extra Service Cards Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {extraServices.map((service, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              className={`${service.bgColor} p-8 rounded-3xl transition-all duration-300 group cursor-pointer`}
            >
              <div className="mb-4 transform group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ServiceSection;