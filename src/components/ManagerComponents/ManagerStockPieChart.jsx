import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const ManagerStockPieChart = ({ stats, products }) => {
  const healthyStock = products.filter(p => p.stock >= 10).length;
  
  const data = [
    { name: "Healthy", value: healthyStock },
    { name: "Low Stock", value: stats.lowStock },
    { name: "Out of Stock", value: stats.outOfStock }
  ];
  
  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm h-[450px] flex flex-col">
      <h3 className="text-xl font-black mb-6 text-gray-800 uppercase tracking-tight">Stock Health Summary</h3>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={data} 
              cx="50%" 
              cy="45%" 
              innerRadius={70} 
              outerRadius={90} 
              paddingAngle={8}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Legend 
              verticalAlign="bottom" 
              align="center"
              iconType="circle"
              iconSize={10}
              wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ManagerStockPieChart;