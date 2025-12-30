import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import toast from "react-hot-toast";

const IconCart = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const IconHeart = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const IconSync = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <polyline points="23 4 23 10 17 10"></polyline>
    <polyline points="1 20 1 14 7 14"></polyline>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
);

const IconEye = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const IconStar = ({ filled }) => (
  <svg stroke="currentColor" fill={filled ? "currentColor" : "none"} strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const ProductCard = ({ product }) => {
  const discountLabel = product.discountPercentage > 0 ? `${product.discountPercentage}%` : null;

  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItem = {
      cartId: `${product._id}-default`,
      productId: product._id,
      name: product.name,
      image: product.thumbnail || product.singleImg,
      price: product.price,
      unit: "Standard",
      quantity: 1,
      category: product.category
    };

    const existingItemIndex = existingCart.findIndex(item => item.cartId === cartItem.cartId);

    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += 1;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    
    toast.success(`${product.name} added to cart!`, {
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
      position: "top-center"
    });

    window.dispatchEvent(new Event("storage"));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl md:rounded-3xl p-2 md:p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group relative overflow-hidden h-full flex flex-col"
    >
      <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10 flex flex-col gap-1 md:gap-2">
        {product.isNew && (
          <span className="bg-green-500 text-white text-[8px] md:text-[10px] font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-full uppercase shadow-sm">New</span>
        )}
        {discountLabel && (
          <span className="bg-pink-500 text-white text-[8px] md:text-[10px] font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-full uppercase shadow-sm">-{discountLabel}</span>
        )}
      </div>

      <div className="absolute top-2 right-2 md:top-4 md:right-[-50px] md:group-hover:right-4 transition-all duration-500 z-10 flex flex-col gap-1.5 md:gap-2">
        <button className="w-7 h-7 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm shadow-md rounded-full flex items-center justify-center text-gray-600 hover:bg-green-600 hover:text-white transition-all cursor-pointer">
          <span className="scale-75 md:scale-100"><IconHeart /></span>
        </button>
        <button className="w-7 h-7 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm shadow-md rounded-full flex items-center justify-center text-gray-600 hover:bg-green-600 hover:text-white transition-all cursor-pointer">
          <span className="scale-75 md:scale-100"><IconSync /></span>
        </button>
        <Link to={`/detailes/${product._id}`} className="w-7 h-7 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm shadow-md rounded-full flex items-center justify-center text-gray-600 hover:bg-green-600 hover:text-white transition-all cursor-pointer">
          <span className="scale-75 md:scale-100"><IconEye /></span>
        </Link>
      </div>

      <div className="relative h-32 md:h-60 w-full overflow-hidden rounded-xl md:rounded-2xl mb-3 md:mb-4 bg-gray-50">
        <img 
          src={product.thumbnail || product.singleImg} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
      </div>

      <div className="px-1 md:px-2 flex flex-col flex-grow">
        <p className="text-[8px] md:text-xs text-gray-400 font-bold mb-0.5 md:mb-1 uppercase tracking-wider">{product.category}</p>
        <Link to={`/detailes/${product._id}`}>
          <h3 className="text-xs md:text-base font-bold text-gray-800 hover:text-green-600 cursor-pointer transition-colors mb-1 md:mb-2 line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-0.5 md:gap-1 mb-2 md:mb-3 text-amber-400">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="scale-75 md:scale-100 origin-left">
                <IconStar filled={i < Math.floor(product.rating)} />
            </span>
          ))}
          <span className="text-gray-300 text-[9px] md:text-xs ml-0.5 md:ml-1">({product.rating})</span>
        </div>

        <div className="mt-auto"> 
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pt-2 md:pt-4 border-t border-gray-50">
             <div className="flex flex-wrap items-baseline gap-1">
                <span className="text-sm md:text-xl font-black text-indigo-900">${product.price.toFixed(2)}</span>
                {product.oldPrice && (
                  <span className="text-[10px] md:text-sm text-gray-400 line-through">${product.oldPrice.toFixed(2)}</span>
                )}
             </div>
             
             <motion.button 
              onClick={handleAddToCart}
              whileTap={{ scale: 0.9 }}
              className="bg-green-100 text-green-600 p-2 md:p-3 rounded-lg md:rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm w-fit self-end md:self-auto cursor-pointer"
             >
               <span className="scale-90 md:scale-100"><IconCart /></span>
             </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;