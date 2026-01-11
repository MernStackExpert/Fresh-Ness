import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const ManagerCategoryChart = ({ products }) => {
  const categoryMap = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(categoryMap).map(key => ({
    name: key,
    value: categoryMap[key]
  }));

  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#8b5cf6", "#06b6d4"];

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm h-[450px] flex flex-col">
      <h3 className="text-xl font-black mb-6 text-gray-800 uppercase tracking-tight">Category Distribution</h3>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={data} 
              cx="50%" 
              cy="45%" 
              innerRadius={60} 
              outerRadius={85} 
              paddingAngle={5} 
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
               contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Legend 
              verticalAlign="bottom" 
              align="center"
              iconType="circle"
              iconSize={8}
              layout="horizontal"
              wrapperStyle={{ paddingTop: '25px', fontSize: '11px', fontWeight: '700', textTransform: 'capitalize' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ManagerCategoryChart;