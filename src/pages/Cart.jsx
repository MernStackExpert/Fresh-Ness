import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoTrashOutline,
  IoAddOutline,
  IoRemoveOutline,
  IoArrowBackOutline,
  IoCartOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [ready, setReady] = useState(false);

  const SHIPPING_THRESHOLD = 50;
  const SHIPPING_CHARGE = 2;

  const notifyNavbar = () => {
    window.dispatchEvent(new Event("cart-updated"));
  };

  useEffect(() => {
    const syncCart = () => {
      const data = JSON.parse(localStorage.getItem("cart"));
      setCartItems(Array.isArray(data) ? data : []);
      setReady(true);
    };
    syncCart();
    window.addEventListener("storage", syncCart);
    return () => window.removeEventListener("storage", syncCart);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const total = cartItems.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );
    setSubtotal(total);
    
    localStorage.setItem("cart", JSON.stringify(cartItems));
    notifyNavbar(); 
  }, [cartItems, ready]);

  const updateQty = (id, value) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartId === id
          ? { ...item, quantity: Math.max(1, item.quantity + value) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.cartId !== id));
  };

  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
  const total = subtotal + shipping;
  const progress = Math.min((subtotal / SHIPPING_THRESHOLD) * 100, 100);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-green-600 font-bold animate-pulse">
        Syncing Cart...
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-6">
        <div className="text-center">
          <div className="w-32 h-32 bg-white rounded-full shadow flex items-center justify-center mx-auto mb-6">
            <IoCartOutline size={60} className="text-gray-300" />
          </div>
          <h2 className="text-3xl font-black mb-3">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">
            Add some fresh groceries to continue
          </p>
          <Link
            to="/all-grocerice"
            className="inline-flex items-center gap-3 bg-green-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-700 transition"
          >
            <IoArrowBackOutline /> Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
       <div className="bg-white border-b py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-black">Your Cart</h1>
          <p className="text-gray-500 mt-2 font-bold">
            {cartItems.length} items selected
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white p-4 rounded-xl border">
              <div className="flex justify-between text-xs font-bold mb-2">
                <span>Free Shipping</span>
                <span>
                  {subtotal >= SHIPPING_THRESHOLD
                    ? "Unlocked"
                    : `$${(SHIPPING_THRESHOLD - subtotal).toFixed(2)} left`}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className={`h-full ${
                    subtotal >= SHIPPING_THRESHOLD
                      ? "bg-green-500"
                      : "bg-amber-400"
                  }`}
                />
              </div>
            </div>

            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.cartId}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-xl p-4 border flex gap-4"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-xs uppercase font-bold text-green-600">
                          {item.category}
                        </p>
                        <h3 className="font-bold text-gray-900 line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-400">
                          Unit: {item.unit}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.cartId)}
                        className="text-gray-500 cursor-pointer hover:text-red-500"
                      >
                        <IoTrashOutline size={18} />
                      </button>
                    </div>

                    <div className="mt-3 flex justify-between items-center">
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() => updateQty(item.cartId, -1)}
                          className="px-2 py-1 cursor-pointer"
                        >
                          <IoRemoveOutline />
                        </button>
                        <span className="px-3 font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.cartId, 1)}
                          className="px-2 py-1 cursor-pointer"
                        >
                          <IoAddOutline />
                        </button>
                      </div>
                      <p className="font-black text-indigo-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <aside className="lg:col-span-4">
            <div className="bg-white rounded-2xl p-6 border sticky top-24">
              <h2 className="text-xl font-black mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between font-bold">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t pt-4 flex justify-between items-end">
                  <span className="font-black text-lg">Total</span>
                  <span className="font-black text-2xl text-indigo-900">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button className="w-full bg-green-600 text-white py-4 rounded-xl font-black hover:bg-green-700 transition mb-4 cursor-pointer">
                Checkout Now
              </button>

              <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-400">
                <IoShieldCheckmarkOutline className="text-green-500" />
                Secure Checkout
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cart;