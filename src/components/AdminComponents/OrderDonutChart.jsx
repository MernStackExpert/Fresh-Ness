import React from "react";

const OrderDonutChart = ({ orders }) => {
  const delivered = orders.filter(o => o.orderStatus === "delivered").length;
  const pending = orders.filter(o => o.orderStatus === "pending").length;
  const cancelled = orders.filter(o => o.orderStatus === "cancelled").length;
  const total = orders.length;

  const stats = [
    { name: "Delivered", value: delivered, color: "bg-emerald-500" },
    { name: "Pending", value: pending, color: "bg-indigo-500" },
    { name: "Cancelled", value: cancelled, color: "bg-rose-500" },
  ];

  return (
    <div className="relative h-[420px] w-full rounded-[3rem] bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200 shadow-[0_25px_60px_rgba(0,0,0,0.08)] p-10 flex flex-col justify-between overflow-hidden">
      <div>
        <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
          Order Breakdown
        </h3>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
          Real Order Status
        </p>
      </div>

      <div className="flex justify-center gap-10 items-end flex-1">
        {stats.map(item => {
          const height = total ? (item.value / total) * 100 : 0;
          return (
            <div key={item.name} className="flex flex-col items-center w-16">
              <div className="relative w-4 h-48 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`absolute bottom-0 w-full rounded-full ${item.color}`}
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className="mt-4 text-sm font-black text-gray-800">
                {item.value}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">
                {item.name}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
          Total Orders
        </span>
        <span className="text-3xl font-black text-gray-900">
          {total}
        </span>
      </div>
    </div>
  );
};

export default OrderDonutChart;
