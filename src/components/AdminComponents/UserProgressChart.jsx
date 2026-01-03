import React from "react";

const UserProgressChart = ({ totalUsers }) => {
  const targetUsers = 5000;
  const progress = Math.min((totalUsers / targetUsers) * 100, 100);

  return (
    <div className="relative h-[360px] w-full rounded-[3rem] bg-gradient-to-br from-indigo-50 via-white to-blue-50 border border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex flex-col justify-between p-10 overflow-hidden">
      <div>
        <h3 className="text-lg font-extrabold text-gray-800 tracking-wide">
          User Growth
        </h3>
        <p className="text-xs text-gray-400 font-semibold mt-1 uppercase tracking-widest">
          Active Users
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="mb-4">
          <span className="text-4xl font-black text-gray-900">
            {totalUsers.toLocaleString()}
          </span>
          <span className="ml-2 text-sm font-bold text-indigo-600">
            / {targetUsers.toLocaleString()}
          </span>
        </div>

        <div className="w-full h-5 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between mt-3 text-xs font-semibold text-gray-500">
          <span>0</span>
          <span>Target</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Completion
        </span>
        <span className="text-sm font-extrabold text-indigo-600">
          {progress.toFixed(1)}%
        </span>
      </div>

      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-300/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-300/30 rounded-full blur-3xl" />
    </div>
  );
};

export default UserProgressChart;
