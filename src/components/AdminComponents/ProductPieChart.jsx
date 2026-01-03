import React from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

const ProductPieChart = ({ totalProducts }) => {
  const maxProducts = Math.max(totalProducts, 100);

  const data = [
    {
      name: "Products",
      value: totalProducts,
      fill: "#8b5cf6",
    },
  ];

  return (
    <div className="relative h-[420px] w-full rounded-[3rem] bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200 shadow-[0_25px_60px_rgba(0,0,0,0.08)] p-10 flex flex-col justify-between overflow-hidden">
      <div>
        <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
          Inventory Meter
        </h3>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
          Product Capacity
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="100%"
            barSize={18}
            data={data}
            startAngle={210}
            endAngle={-30}
            maxAngle={270}
          >
            <RadialBar
              minAngle={15}
              background
              clockWise
              dataKey="value"
              cornerRadius={20}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        <div className="absolute flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Total Products
          </span>
          <span className="text-4xl font-black text-gray-900 mt-1">
            {totalProducts}
          </span>
          <span className="mt-2 text-xs font-bold text-violet-600 bg-violet-100 px-4 py-1 rounded-full">
            Inventory Active
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
          Capacity Scale
        </span>
        <span className="text-sm font-extrabold text-gray-700">
          0 → {maxProducts}
        </span>
      </div>

      <div className="absolute -top-24 -right-24 w-72 h-72 bg-violet-300/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-300/20 rounded-full blur-3xl" />
    </div>
  );
};

export default ProductPieChart;
