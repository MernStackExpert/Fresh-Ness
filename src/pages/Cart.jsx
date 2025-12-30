import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IoTrashOutline, IoAddOutline, IoRemoveOutline, 
  IoArrowBackOutline, IoBagCheckOutline, IoCartOutline,
  IoShieldCheckmarkOutline, IoTimerOutline
} from "react-icons/io5";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Constants for Shipping Logic
  const SHIPPING_THRESHOLD = 50;
  const SHIPPING_CHARGE = 2;

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart && Array.isArray(savedCart)) {
      setCartItems(savedCart);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      const total = cartItems.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0);
      setSubtotal(total);
      localStorage.setItem("cart", JSON.stringify(cartItems));
      window.dispatchEvent(new Event("storage"));
    }
  }, [cartItems, isInitialized]);

  const updateQuantity = (cartId, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (cartId) => {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
  };

  // Dynamic Shipping & Grand Total Calculation
  const isShippingFree = subtotal >= SHIPPING_THRESHOLD;
  const currentShipping = isShippingFree ? 0 : SHIPPING_CHARGE;
  const grandTotal = subtotal + currentShipping;

  if (!isInitialized) return <div className="min-h-screen flex items-center justify-center font-bold">Syncing Cart...</div>;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 bg-gray-50/50">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-32 h-32 md:w-48 md:h-48 bg-white shadow-2xl shadow-gray-200 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white">
            <IoCartOutline size={80} className="text-gray-200" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tighter">Your cart is empty</h2>
          <p className="text-gray-500 mb-10 font-medium text-lg">Looks like you haven't added any fresh groceries yet. Start filling it up!</p>
          <Link to="/all-grocerice" className="inline-flex items-center gap-3 bg-green-600 text-white px-10 py-5 rounded-[20px] font-black uppercase tracking-widest shadow-xl shadow-green-200 hover:bg-green-700 transition-all active:scale-95">
            <IoArrowBackOutline size={20} /> Shop Groceries
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pb-24 font-sans">
      <div className="bg-white border-b border-gray-100 pt-10 pb-6 md:py-16">
        <div className="container mx-auto px-4 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter">Shopping Bag</h1>
          <p className="text-gray-500 font-bold mt-2">
            <span className="text-green-600">{cartItems.length} Items</span> selected from FreshNess Market
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 md:mt-12">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 space-y-4">
            <AnimatePresence mode="popLayout">
              {cartItems.map((item) => (
                <motion.div
                  key={item.cartId}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-3 md:p-6 rounded-[24px] md:rounded-[40px] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500"
                >
                  <div className="flex items-center gap-4 md:gap-8">
                    <div className="w-24 h-24 md:w-36 md:h-36 rounded-[20px] md:rounded-[30px] overflow-hidden bg-gray-50 shrink-0 border border-gray-50 group">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="min-w-0">
                           <p className="text-[10px] md:text-xs font-black uppercase text-green-600 tracking-widest mb-1">{item.category}</p>
                           <h3 className="font-bold text-gray-900 text-base md:text-2xl truncate mb-1">{item.name}</h3>
                           <span className="inline-block bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-tight">Unit: {item.unit}</span>
                        </div>
                        <button onClick={() => removeItem(item.cartId)} className="p-2 md:p-3 text-gray-300 hover:text-red-500 transition-all cursor-pointer">
                          <IoTrashOutline size={22} />
                        </button>
                      </div>

                      <div className="mt-4 md:mt-6 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-100">
                          <button onClick={() => updateQuantity(item.cartId, -1)} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-red-500 transition-colors cursor-pointer"><IoRemoveOutline size={18} /></button>
                          <span className="w-10 md:w-14 text-center font-black text-gray-900 text-sm md:text-lg">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartId, 1)} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-green-600 transition-colors cursor-pointer"><IoAddOutline size={18} /></button>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Total</p>
                          <p className="font-black text-indigo-900 text-xl md:text-3xl tracking-tighter">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <aside className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-white p-6 md:p-10 rounded-[30px] md:rounded-[50px] shadow-2xl shadow-gray-200/50 border border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Order Summary</h2>
              
              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-center text-gray-500 font-bold">
                  <span className="text-sm uppercase tracking-widest">Subtotal</span>
                  <span className="text-gray-900 text-lg">${subtotal.toFixed(2)}</span>
                </div>
                
                {/* Dynamic Shipping Section */}
                <div className="flex justify-between items-start text-gray-500 font-bold">
                  <span className="text-sm uppercase tracking-widest mt-1">Shipping</span>
                  <div className="flex flex-col text-right">
                     {isShippingFree ? (
                       <>
                        <span className="text-green-600 font-black text-xs uppercase bg-green-50 px-2 py-1 rounded-md ml-auto">Free Delivery</span>
                        <span className="text-[10px] text-gray-400 font-medium mt-1">Order over $50 benefit</span>
                       </>
                     ) : (
                       <>
                        <span className="text-gray-900 text-lg">${SHIPPING_CHARGE.toFixed(2)}</span>
                        <span className="text-[10px] text-pink-500 font-bold mt-1">Add ${(SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for Free Shipping!</span>
                       </>
                     )}
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-100">
                  <div className="flex justify-between items-end">
                    <div>
                       <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Grand Total</p>
                       <p className="text-4xl font-black text-indigo-950 tracking-tighter">${grandTotal.toFixed(2)}</p>
                    </div>
                    <div className="bg-indigo-50 p-2 rounded-xl">
                       <IoBagCheckOutline className="text-indigo-600" size={32} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-green-600 text-white py-5 rounded-[22px] font-black text-xl flex items-center justify-center gap-3 shadow-2xl shadow-green-200 hover:bg-green-700 transition-all hover:-translate-y-1 active:scale-95 cursor-pointer uppercase tracking-widest">
                   Checkout Now
                </button>
                <div className="flex flex-col items-center gap-4 py-6 px-4 bg-gray-50 rounded-[22px]">
                   <div className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest">
                     <IoShieldCheckmarkOutline className="text-green-500" size={16} /> 100% Secure Checkout
                   </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cart;