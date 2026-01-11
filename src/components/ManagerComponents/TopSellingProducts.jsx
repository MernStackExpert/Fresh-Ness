import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const TopSellingProducts = ({ orders }) => {
  const productSales = {};
  
  orders.forEach(order => {
    order.products.forEach(p => {
      productSales[p.name] = (productSales[p.name] || 0) + p.quantity;
    });
  });

  const data = Object.keys(productSales)
    .map(name => ({ name, sales: productSales[name] }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm h-[400px]">
      <h3 className="text-xl font-black mb-6 text-gray-800 uppercase tracking-tight">Most Ordered Items</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={data}>
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={120} tick={{fontSize: 10, fontWeight: 'bold', fill: '#4b5563'}} />
          <Tooltip cursor={{fill: 'transparent'}} />
          <Bar dataKey="sales" fill="#8b5cf6" radius={[0, 10, 10, 0]} barSize={15} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopSellingProducts;