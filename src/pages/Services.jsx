import React from "react";
import { motion } from "framer-motion";
import { FiTruck, FiShield, FiPhoneCall, FiAward, FiRefreshCcw, FiLayers } from "react-icons/fi";
import { TbLeaf } from "react-icons/tb";

const Services = () => {
  const services = [
    {
      id: 1,
      title: "Fast Delivery",
      desc: "Freshness delivered to your doorstep within 24 hours without any hassle.",
      icon: <FiTruck size={36} className="text-green-600" />,
      bg: "bg-green-50",
    },
    {
      id: 2,
      title: "100% Organic",
      desc: "Directly sourced from certified local organic farms ensuring premium quality.",
      icon: <TbLeaf size={36} className="text-emerald-600" />,
      bg: "bg-emerald-50",
    },
    {
      id: 3,
      title: "Secure Payment",
      desc: "Multiple secure payment options including Stripe and COD for your safety.",
      icon: <FiShield size={36} className="text-blue-600" />,
      bg: "bg-blue-50",
    },
    {
      id: 4,
      title: "24/7 Support",
      desc: "Our dedicated expert team is always here to help you with any queries.",
      icon: <FiPhoneCall size={36} className="text-orange-600" />,
      bg: "bg-orange-50",
    },
    {
      id: 5,
      title: "Quality Award",
      desc: "Recognized as the best organic food provider for three consecutive years.",
      icon: <FiAward size={36} className="text-purple-600" />,
      bg: "bg-purple-50",
    },
    {
      id: 6,
      title: "Easy Returns",
      desc: "Not satisfied with the quality? Return within 7 days for a full refund.",
      icon: <FiRefreshCcw size={36} className="text-red-600" />,
      bg: "bg-red-50",
    },
    {
      id: 7,
      title: "Ecofriendly Packaging",
      desc: "We use 100% biodegradable packaging to protect our beautiful planet.",
      icon: <FiLayers size={36} className="text-cyan-600" />,
      bg: "bg-cyan-50",
    },
    {
      id: 8,
      title: "Premium Membership",
      desc: "Join our club for exclusive discounts and early access to fresh harvests.",
      icon: <TbLeaf size={36} className="text-yellow-600" />,
      bg: "bg-yellow-50",
    },
  ];

  return (
    <section className="py-24 bg-gray-50/50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-green-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-100 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-green-600 font-black uppercase tracking-widest text-sm"
          >
            Why Choose Us
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-gray-900 mt-4 mb-6 leading-tight"
          >
            Providing The Best <span className="text-green-600">Services</span> For You
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg font-medium"
          >
            We take pride in our commitment to quality, sustainability, and customer satisfaction. Explore what makes us different.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 group"
            >
              <div className={`w-20 h-20 ${service.bg} rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform duration-500`}>
                {service.icon}
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-4">{service.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;