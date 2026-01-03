import React from "react";
import { FiHeart, FiPackage, FiCreditCard } from "react-icons/fi";

const UserStats = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-black text-gray-800">My Dashboard</h2>
      <div className="bg-green-600 p-10 rounded-[3rem] text-white flex flex-col md:flex-row justify-between items-center shadow-2xl shadow-green-100">
        <div>
          <h3 className="text-2xl font-bold">Welcome to Freshness Club!</h3>
          <p className="opacity-80 mt-2">You have 500 reward points to spend.</p>
        </div>
        <button className="mt-6 md:mt-0 bg-white text-green-700 px-8 py-3 rounded-full font-black hover:bg-yellow-400 transition-colors">
          Redeem Now
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><FiPackage size={24}/></div>
          <div><p className="text-gray-500 font-bold">Total Orders</p><h5 className="text-xl font-black">12</h5></div>
        </div>
        <div className="bg-white p-6 rounded-3xl border flex items-center gap-4">
          <div className="p-4 bg-pink-50 text-pink-600 rounded-2xl"><FiHeart size={24}/></div>
          <div><p className="text-gray-500 font-bold">Wishlist</p><h5 className="text-xl font-black">08</h5></div>
        </div>
        <div className="bg-white p-6 rounded-3xl border flex items-center gap-4">
          <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl"><FiCreditCard size={24}/></div>
          <div><p className="text-gray-500 font-bold">Spent</p><h5 className="text-xl font-black">$420</h5></div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;