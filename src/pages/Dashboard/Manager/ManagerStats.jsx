import React from "react";
import { FiBox, FiTruck, FiAlertCircle } from "react-icons/fi";

const ManagerStats = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-black text-gray-800">Manager Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2rem] border-2 border-green-100">
          <FiBox size={40} className="text-green-600 mb-4" />
          <h4 className="text-xl font-bold">Total Stock</h4>
          <p className="text-4xl font-black mt-2">5,200</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border-2 border-orange-100">
          <FiTruck size={40} className="text-orange-600 mb-4" />
          <h4 className="text-xl font-bold">In Transit</h4>
          <p className="text-4xl font-black mt-2">18</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border-2 border-red-100">
          <FiAlertCircle size={40} className="text-red-600 mb-4" />
          <h4 className="text-xl font-bold">Low Stock Alert</h4>
          <p className="text-4xl font-black mt-2">04</p>
        </div>
      </div>
    </div>
  );
};

export default ManagerStats;