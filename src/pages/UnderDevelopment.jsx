import React from "react";
import { motion } from "framer-motion";

const UnderDevelopment = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl border border-gray-100 p-8 max-w-lg w-full text-center shadow-sm"
      >
        <img
          src="https://illustrations.popsy.co/green/web-design.svg"
          alt="Under Development"
          className="w-64 mx-auto mb-6"
        />

        <h1 className="text-2xl font-black text-gray-800 mb-2">
          Page Under Development
        </h1>

        <p className="text-sm font-bold text-gray-400">
          We are working hard to bring this feature to you very soon.
        </p>
      </motion.div>
    </div>
  );
};

export default UnderDevelopment;
