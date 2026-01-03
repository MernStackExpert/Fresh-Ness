import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const RevenueDonutChart = ({ totalRevenue }) => {
  const data = [
    { name: "Completed", value: totalRevenue * 0.65, color: "#22c55e" },
    { name: "Pending", value: totalRevenue * 0.2, color: "#eab308" },
    { name: "Processing", value: totalRevenue * 0.15, color: "#6366f1" },
  ];

  return (
    <div className="relative h-[420px] w-full rounded-[3rem] bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200 shadow-[0_20px_60px_rgba(0,0,0,0.08)] flex flex-col items-center justify-center overflow-hidden">
      <h3 className="text-lg font-extrabold text-gray-800 tracking-wide mb-2">
        Revenue Overview
      </h3>

      <div className="w-full h-full">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              innerRadius={95}
              outerRadius={135}
              dataKey="value"
              paddingAngle={6}
              stroke="none"
              cornerRadius={20}
            >
              {data.map((item, index) => (
                <Cell key={index} fill={item.color} />
              ))}
            </Pie>
            <Tooltip
              cursor={false}
              contentStyle={{
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(8px)",
                borderRadius: "18px",
                border: "none",
                boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
                fontWeight: "600",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-xs uppercase tracking-[0.3em] text-gray-400 font-bold">
          Total Revenue
        </span>
        <span className="text-3xl font-black text-gray-900 mt-1">
          ${totalRevenue.toLocaleString()}
        </span>
        <span className="mt-2 text-xs font-semibold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
          +12.5% Growth
        </span>
      </div>

      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl" />
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-300/20 rounded-full blur-3xl" />
    </div>
  );
};

export default RevenueDonutChart;
