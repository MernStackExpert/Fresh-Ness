import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { IoLocationOutline, IoCardOutline, IoCashOutline, IoChevronBackOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../Provider/AuthContext";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    city: "",
    address: "",
  });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    if (data.length === 0) {
      navigate("/cart");
      return;
    }
    setCartItems(data);
    const totalAmount = data.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
    setSubtotal(totalAmount);
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const shipping = subtotal >= 50 ? 0 : 2;
  const total = subtotal + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (paymentMethod === "COD") {
      setLoading(true);
      const orderData = {
        email: formData.email,
        products: cartItems,
        total: total,
        paymentMethod: "COD",
        shippingAddress: formData,
      };

      try {
        const response = await axiosInstance.post("/orders/", orderData);
        if (response.status === 201) {
          localStorage.removeItem("cart");
          window.dispatchEvent(new Event("cart-updated"));
          toast.success("Order Placed Successfully!");
          navigate("/order-success");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to place order");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-white border-b py-8">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-2 text-gray-500 hover:text-green-600 font-bold mb-4 border-none bg-transparent cursor-pointer"
          >
            <IoChevronBackOutline /> Back to Cart
          </button>
          <h1 className="text-3xl font-black text-gray-900">Checkout</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 rounded-2xl border shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <IoLocationOutline className="text-green-600" /> Shipping Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  value={formData.fullName}
                  onChange={handleChange}
                  type="text"
                  name="fullName"
                  required
                  className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-green-500"
                  placeholder="Full Name"
                />
                <input
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  name="email"
                  required
                  className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-green-500"
                  placeholder="Email Address"
                />
                <input
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel"
                  name="phone"
                  required
                  className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-green-500"
                  placeholder="Phone Number"
                />
                <input
                  value={formData.city}
                  onChange={handleChange}
                  type="text"
                  name="city"
                  required
                  className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-green-500"
                  placeholder="City"
                />
                <textarea
                  value={formData.address}
                  onChange={handleChange}
                  name="address"
                  rows="3"
                  required
                  className="md:col-span-2 w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-green-500"
                  placeholder="Full Address"
                ></textarea>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <IoCardOutline className="text-green-600" /> Payment Method
              </h2>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div
                  onClick={() => setPaymentMethod("COD")}
                  className={`p-4 border-2 rounded-2xl cursor-pointer flex items-center gap-4 ${
                    paymentMethod === "COD" ? "border-green-600 bg-green-50" : "border-gray-100"
                  }`}
                >
                  <IoCashOutline size={24} className={paymentMethod === "COD" ? "text-green-600" : "text-gray-400"} />
                  <span className={`font-bold ${paymentMethod === "COD" ? "text-green-600" : "text-gray-700"}`}>
                    Cash on Delivery
                  </span>
                </div>
                <div
                  onClick={() => setPaymentMethod("Online")}
                  className={`p-4 border-2 rounded-2xl cursor-pointer flex items-center gap-4 ${
                    paymentMethod === "Online" ? "border-green-600 bg-green-50" : "border-gray-100"
                  }`}
                >
                  <IoCardOutline size={24} className={paymentMethod === "Online" ? "text-green-600" : "text-gray-400"} />
                  <span className={`font-bold ${paymentMethod === "Online" ? "text-green-600" : "text-gray-700"}`}>
                    Online Payment
                  </span>
                </div>
              </div>

              <AnimatePresence>
                {paymentMethod === "Online" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="pt-4 border-t">
                    <Elements stripe={stripePromise}>
                      <CheckoutForm total={total} cartItems={cartItems} formData={formData} />
                    </Elements>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="bg-white rounded-2xl p-6 border shadow-sm sticky top-24">
              <h2 className="text-xl font-black mb-6 text-gray-800">Order Summary</h2>
              <div className="space-y-4 max-h-40 overflow-y-auto mb-6 pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.cartId} className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">{item.name} x {item.quantity}</span>
                    <span className="font-bold text-gray-800">${(item.quantity * item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3 border-t pt-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-bold text-gray-800">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className={`font-bold ${shipping === 0 ? "text-green-600" : "text-gray-800"}`}>
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-black border-t pt-3 mt-3">
                  <span className="text-gray-800">Total</span>
                  <span className="text-indigo-900">${total.toFixed(2)}</span>
                </div>
              </div>

              {paymentMethod === "COD" ? (
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full text-white py-4 rounded-xl font-black ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 cursor-pointer"
                  }`}
                >
                  {loading ? "Placing Order..." : "Place Order Now"}
                </button>
              ) : (
                <p className="text-xs text-gray-400 text-center italic">Complete payment above to finish order.</p>
              )}
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
};

export default Checkout;