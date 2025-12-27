import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

// --- Inline SVG Icons ---
const IconStar = ({ filled }) => (
  <svg stroke="currentColor" fill={filled ? "#FBBF24" : "none"} strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const IconQuote = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg" className="opacity-10">
    <path d="M14.017 21L14.017 18C14.017 16.899 14.892 16 16.017 16H19.017C19.567 16 20.017 15.55 20.017 15V9C20.017 8.45 19.567 8 19.017 8H16.017C14.912 8 14.017 7.105 14.017 6V3H21.017C22.117 3 23.017 3.895 23.017 5V15C23.017 18.315 20.332 21 17.017 21H14.017ZM1.017 21V18C1.017 16.899 1.892 16 3.017 16H6.017C6.567 16 7.017 15.55 7.017 15V9C7.017 8.45 6.567 8 6.017 8H3.017C1.912 8 1.017 7.105 1.017 6V3H8.017C9.117 3 10.017 3.895 10.017 5V15C10.017 18.315 7.332 21 4.017 21H1.017Z" />
  </svg>
);

const RatingSection = () => {
  // Review Data (Duplicate kora hoyeche infinite loop-er jonno)
  const baseReviews = [
    { id: 1, name: "Anika Rahman", role: "Verified Buyer", rating: 5, comment: "The organic vegetables are incredibly fresh! Picked moments ago. Delivery was super fast.", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150", date: "2 days ago" },
    { id: 2, name: "Tanvir Ahmed", role: "Regular Customer", rating: 4, comment: "Quality is top-notch. Loved the Fuji apples. Highly recommended for daily needs.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150", date: "1 week ago" },
    { id: 3, name: "Sumi Akter", role: "Verified Buyer", rating: 5, comment: "Best organic shop in town! The packaging is eco-friendly and fruits are always juicy.", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150", date: "3 days ago" },
    { id: 4, name: "Rakib Hasan", role: "Tech Enthusiast", rating: 5, comment: "Pure honey and reasonable pricing. I am extremely satisfied with their service.", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150", date: "5 days ago" },
    { id: 5, name: "Maria Sultana", role: "Home Maker", rating: 5, comment: "Guaranteed freshness! Finally found a reliable organic shop for my family.", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150", date: "1 day ago" },
    { id: 6, name: "Jashim Uddin", role: "Fitness Trainer", rating: 4, comment: "Great products for a healthy lifestyle. Impressed with the quality control.", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150", date: "4 days ago" }
  ];

  // Infinite slide er jonno array triple kora hoyeche
  const reviews = [...baseReviews, ...baseReviews, ...baseReviews];
  
  const [currentIndex, setCurrentIndex] = useState(baseReviews.length);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Responsive items per view logic
  const getItemsPerView = () => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };

  const [itemsPerView, setItemsPerView] = useState(getItemsPerView());

  useEffect(() => {
    const handleResize = () => setItemsPerView(getItemsPerView());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-slide logic
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      handleNext();
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused, currentIndex]);

  const handleNext = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  // Infinite loop reset logic
  useEffect(() => {
    if (currentIndex >= baseReviews.length * 2) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(baseReviews.length);
      }, 500); // Animation duration er sathe mil rekhe
    }
    if (currentIndex <= baseReviews.length - 1) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(baseReviews.length * 2 - 1);
      }, 500);
    }
  }, [currentIndex, baseReviews.length]);

  return (
    <section className="py-12 md:py-20 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14 px-4">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-green-600 font-bold uppercase tracking-widest text-[10px] md:text-xs"
          >
            TESTIMONIALS
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-4xl font-black text-gray-900 mt-2"
          >
            What Our <span className="text-indigo-800">Healthy Family</span> Says
          </motion.h2>
          <div className="flex items-center justify-center gap-2 mt-4 text-xs md:text-sm">
            <div className="flex text-amber-400">
               {[...Array(5)].map((_, i) => <IconStar key={i} filled={true} />)}
            </div>
            <span className="font-bold text-gray-500">4.9/5 Rating</span>
          </div>
        </div>

        {/* Continuous Slider Container */}
        <div 
          className="relative max-w-6xl mx-auto px-2"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-hidden">
            <motion.div 
              className="flex"
              animate={{ 
                x: `calc(-${currentIndex * (100 / itemsPerView)}%)` 
              }}
              transition={isTransitioning ? { duration: 0.5, ease: "easeInOut" } : { duration: 0 }}
            >
              {reviews.map((review, idx) => (
                <div 
                  key={`${review.id}-${idx}`} 
                  className="px-2 md:px-3 shrink-0"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <div className="relative p-6 md:p-8 h-full rounded-2xl md:rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[220px] md:min-h-[260px]">
                    <div>
                        <div className="absolute top-4 right-6 text-indigo-100 group-hover:text-indigo-200 transition-colors">
                          <IconQuote />
                        </div>

                        {/* Stars */}
                        <div className="flex gap-0.5 mb-4 text-amber-400">
                          {[...Array(5)].map((_, i) => (
                              <IconStar key={i} filled={i < review.rating} />
                          ))}
                        </div>

                        {/* Comment */}
                        <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-6 italic line-clamp-4">
                          "{review.comment}"
                        </p>
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border border-gray-100">
                        <img src={review.image} alt={review.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-xs md:text-sm">
                          {review.name}
                        </h4>
                        <p className="text-[10px] text-gray-400">{review.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Dots for current view range */}
        <div className="flex justify-center gap-1.5 mt-8">
          {baseReviews.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIsTransitioning(true);
                setCurrentIndex(i + baseReviews.length);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                (currentIndex % baseReviews.length) === i ? "bg-indigo-800 w-6" : "bg-gray-200 w-1.5"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default RatingSection;