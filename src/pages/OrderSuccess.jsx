import React from "react";
import { Link } from "react-router"; // react-router use korle
import { motion } from "framer-motion";
import { IoCheckmarkCircleOutline, IoBagCheckOutline, IoArrowForwardOutline } from "react-icons/io5";

const OrderSuccess = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl text-center border border-gray-100"
      >
        {/* Animated Icon */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <IoCheckmarkCircleOutline size={60} className="text-green-600" />
        </motion.div>

        <h1 className="text-3xl font-black text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 mb-8 font-medium">
          Hooray! Your order has been placed successfully. We've sent a confirmation email to you.
        </p>

        {/* Order Details Placeholder (Optional) */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-8 flex items-center justify-between border border-dashed border-gray-300">
          <div className="text-left">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Status</p>
            <p className="text-sm font-bold text-gray-800">Processing</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Delivery</p>
            <p className="text-sm font-bold text-gray-800">2-3 Working Days</p>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            to="/all-grocerice"
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-4 rounded-xl font-black hover:bg-green-700 transition shadow-lg shadow-green-100"
          >
            Continue Shopping <IoArrowForwardOutline />
          </Link>
          
          <Link
            to="/orders"
            className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 py-4 rounded-xl font-black border border-gray-200 hover:bg-gray-50 transition"
          >
            <IoBagCheckOutline /> View My Orders
          </Link>
        </div>

        <p className="mt-8 text-xs text-gray-400">
          Need help? <Link to="/contact" className="text-green-600 font-bold underline">Contact Support</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;