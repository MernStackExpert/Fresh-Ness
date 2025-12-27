import React from "react";
import { motion } from "framer-motion";

// --- Inline SVG Icons ---
const IconSnowflake = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line><line x1="19.07" y1="4.93" x2="4.93" y2="19.07"></line></svg>
);
const IconArrowRight = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);
const IconTimer = () => (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);

const DiscountSection = () => {
  // Discount Products Data
  const discountProducts = [
    { id: 1, name: "Organic Honey & Nuts", price: 25.00, discountPrice: 18.00, image: "https://images.unsplash.com/photo-1599408194820-4130423565c1?auto=format&fit=crop&q=80&w=400" },
    { id: 2, name: "Hot Chocolate Mix", price: 15.00, discountPrice: 10.50, image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&q=80&w=400" },
    { id: 3, name: "Winter Citrus Box", price: 35.00, discountPrice: 28.00, image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=400" },
  ];

  return (
    <section className="py-16 bg-[#F0F8FF] min-h-screen overflow-hidden relative flex items-center justify-center">
      {/* Background Decoration (Snowflakes animation) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: ["0%", "100%"], x: ["0%", i % 2 === 0 ? "20%" : "-20%"] }}
            transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
            className="absolute text-blue-300"
            style={{ left: `${i * 10}%`, top: `-${(i * 5) % 20}%`, fontSize: `${20 + i * 5}px` }}
          >
            <IconSnowflake />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 rounded-[2rem] md:rounded-[3rem] bg-white shadow-2xl overflow-hidden border border-blue-50">
          
          {/* --- Left Side: Winter Offer Banner --- */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative p-8 md:p-12 lg:p-16 bg-[#0B2F4F] text-white flex flex-col justify-center overflow-hidden group min-h-[400px]"
          >
            {/* Real Winter Image Background */}
            <img 
              src="https://images.unsplash.com/photo-1516550125529-21c0d0716095?auto=format&fit=crop&q=80&w=1000" 
              alt="Winter Sale" 
              className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay transition-transform duration-1000 group-hover:scale-110"
            />
            
            <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-2 mb-6">
                    <span className="bg-blue-400/30 text-blue-100 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest backdrop-blur-md border border-blue-300/40 flex items-center gap-2">
                        <IconSnowflake /> Winter Special
                    </span>
                    <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-red-500/20">
                        <IconTimer /> Limited Time
                    </span>
                </div>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-black leading-none mb-6">
                    WINTER <br /> <span className="text-blue-300">MEGA SALE</span>
                </h2>
                <p className="text-base md:text-xl text-blue-100/90 mb-10 max-w-sm font-medium leading-relaxed">
                    Get up to <span className="font-black text-yellow-400 text-2xl md:text-3xl italic">50% OFF</span> on all winter essentials. Stay warm and cozy with our organic collection.
                </p>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-500 text-white px-10 py-4 rounded-full font-bold flex items-center gap-3 shadow-xl shadow-blue-500/40 hover:bg-blue-600 transition-all group/btn w-fit"
                >
                    Shop The Sale <IconArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                </motion.button>
            </div>
          </motion.div>

          {/* --- Right Side: Special Products List --- */}
          <div className="p-8 md:p-12 lg:p-16 bg-white flex flex-col justify-center">
             <div className="mb-8">
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-3">
                    Hot Deals For You <span className="text-red-500 animate-pulse">🔥</span>
                </h3>
                <div className="w-16 h-1.5 bg-blue-500 rounded-full mt-2"></div>
             </div>

             <div className="flex flex-col gap-5">
                {discountProducts.map((product, i) => (
                    <motion.div 
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        whileHover={{ x: 10, backgroundColor: '#F8FBFF' }}
                        className="flex items-center gap-5 p-4 rounded-3xl border border-gray-100 cursor-pointer transition-all relative overflow-hidden group/item shadow-sm hover:shadow-md"
                    >
                        {/* Discount Badge */}
                        <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-tighter shadow-sm">
                            SAVE ${ (product.price - product.discountPrice).toFixed(0) }
                        </div>
                        
                        <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-2xl overflow-hidden shadow-inner">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" />
                        </div>
                        
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-base md:text-lg mb-1 group-hover/item:text-blue-600 transition-colors">{product.name}</h4>
                            <div className="flex items-center gap-3">
                                <span className="font-black text-xl md:text-2xl text-blue-900">${product.discountPrice.toFixed(2)}</span>
                                <span className="text-sm text-gray-400 line-through font-medium">${product.price.toFixed(2)}</span>
                            </div>
                        </div>

                        <motion.button 
                            whileHover={{ scale: 1.1, backgroundColor: '#3B82F6', color: '#fff' }}
                            className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0 shadow-sm transition-all"
                        >
                            <IconArrowRight />
                        </motion.button>
                    </motion.div>
                ))}
             </div>
             
             <button className="mt-10 group text-blue-600 font-black text-sm md:text-base flex items-center gap-2 hover:text-blue-800 transition-all self-center lg:self-start">
                 VIEW ALL WINTER DEALS 
                 <span className="bg-blue-600 text-white p-1 rounded-full group-hover:translate-x-2 transition-transform">
                    <IconArrowRight />
                 </span>
             </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DiscountSection;