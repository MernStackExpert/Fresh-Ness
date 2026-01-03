
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

const AboutSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Side: Images */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2 relative"
          >
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000" 
                alt="Organic Farming" 
                className="w-full h-[500px] object-cover"
              />
            </div>
            {/* Floating Card */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-10 -right-10 z-20 bg-white p-8 rounded-[2rem] shadow-xl hidden md:block"
            >
              <h4 className="text-4xl font-black text-green-600">10k+</h4>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Happy Customers</p>
            </motion.div>
          </motion.div>

          {/* Right Side: Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2 space-y-8"
          >
            <span className="text-green-600 font-black uppercase tracking-[0.3em] text-sm">Our Story</span>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">
              We Provide Healthy Food For Your <span className="text-green-600">Family.</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed font-medium">
              Freshness is at the heart of everything we do. We started with a simple mission: to connect local farmers directly with your kitchen. Our products are 100% organic, hand-picked, and delivered with love.
            </p>
            
            <div className="grid grid-cols-2 gap-6 pb-4">
              <div className="space-y-2">
                <h5 className="font-black text-gray-800 text-lg underline decoration-green-300 decoration-4">Our Mission</h5>
                <p className="text-sm text-gray-500 font-medium">To promote a healthy lifestyle through organic nutrition.</p>
              </div>
              <div className="space-y-2">
                <h5 className="font-black text-gray-800 text-lg underline decoration-green-300 decoration-4">Our Vision</h5>
                <p className="text-sm text-gray-500 font-medium">Becoming the world's most trusted organic food partner.</p>
              </div>
            </div>

            <button 
              onClick={() => navigate("/all-grocerice")}
              className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-green-600 transition-all duration-300 shadow-xl active:scale-95"
            >
              Learn More
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;