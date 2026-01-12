import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { FiUser, FiShield, FiStar } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../../../Provider/AuthContext";

const roles = ["all", "user", "manager", "admin"];

const ManageUsers = () => {
  const { user: currentUser } = useContext(AuthContext); 
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const limit = 10;

  const isRestrictedAdmin = currentUser?.email === "admin@freshness.com";

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/users?page=1&limit=1000`);
      setUsers(res.data.result || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setSearchLoading(true);

    const applyFilters = () => {
      let temp = [...users];

      if (search.trim()) {
        const s = search.toLowerCase();
        temp = temp.filter(
          (u) =>
            (u.fullName && u.fullName.toLowerCase().includes(s)) ||
            (u.email && u.email.toLowerCase().includes(s))
        );
      }

      if (roleFilter !== "all") {
        temp = temp.filter((u) => u.role === roleFilter);
      }

      const calculatedTotalPages = Math.ceil(temp.length / limit);
      setTotalPages(calculatedTotalPages || 1);

      const start = (page - 1) * limit;
      const end = start + limit;
      setFilteredUsers(temp.slice(start, end));

      setSearchLoading(false);
    };

    const delay = setTimeout(applyFilters, 400);
    return () => clearTimeout(delay);
  }, [users, search, roleFilter, page]);

  const updateRole = async (id, role) => {
    // block update if user is restricted
    if (isRestrictedAdmin) {
      toast.error("Restricted Admin cannot update roles!");
      return;
    }

    try {
      setUpdatingId(id);
      await axiosInstance.patch(`/users/${id}`, { role });
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
      toast.success(`Role updated to ${role.toUpperCase()}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Toaster position="top-right" />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            Manage Users
          </h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
            Access Control Panel {isRestrictedAdmin && "(View Only Mode)"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search users..."
            className="w-full sm:w-64 px-5 py-3 rounded-2xl border border-gray-200 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
          <select
            value={roleFilter}
            onChange={(e) => {
              setPage(1);
              setRoleFilter(e.target.value);
            }}
            className="px-4 py-3 rounded-2xl border border-gray-200 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden relative min-h-[400px]">
        {searchLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50/50">
              <tr className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] text-left">
                <th className="px-8 py-5">User Profile</th>
                <th className="px-8 py-5">Role</th>
                <th className="px-8 py-5">Joined Date</th>
                <th className="px-8 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            user.photoURL ||
                            `https://ui-avatars.com/api/?name=${user.fullName}`
                          }
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-gray-100 group-hover:ring-indigo-100 transition-all"
                          alt=""
                        />
                        <div>
                          <p className="font-bold text-gray-800 text-sm">
                            {user.fullName}
                          </p>
                          <p className="text-xs text-gray-400 font-medium">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                          user.role === "admin"
                            ? "bg-red-50 text-red-600"
                            : user.role === "manager"
                            ? "bg-indigo-50 text-indigo-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-tighter">
                      {new Date(user.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center gap-2">
                        {/* USER ROLE BUTTON */}
                        <button
                          disabled={updatingId === user._id || isRestrictedAdmin}
                          onClick={() => updateRole(user._id, "user")}
                          className={`p-2.5 rounded-xl border transition-all ${
                            user.role === "user"
                              ? "bg-gray-900 text-white border-gray-900 shadow-lg"
                              : isRestrictedAdmin 
                                ? "bg-gray-50 text-gray-200 border-gray-100 cursor-not-allowed" 
                                : "bg-white text-gray-400 hover:text-gray-900"
                          }`}
                          title={isRestrictedAdmin ? "Disabled for Demo" : "User Role"}
                        >
                          <FiUser size={16} />
                        </button>

                        {/* MANAGER ROLE BUTTON */}
                        <button
                          disabled={updatingId === user._id || isRestrictedAdmin}
                          onClick={() => updateRole(user._id, "manager")}
                          className={`p-2.5 rounded-xl border transition-all ${
                            user.role === "manager"
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100"
                              : isRestrictedAdmin 
                                ? "bg-gray-50 text-gray-200 border-gray-100 cursor-not-allowed" 
                                : "bg-white text-gray-400 hover:text-indigo-600"
                          }`}
                          title={isRestrictedAdmin ? "Disabled for Demo" : "Manager Role"}
                        >
                          <FiShield size={16} />
                        </button>

                        {/* ADMIN ROLE BUTTON */}
                        <button
                          disabled={updatingId === user._id || isRestrictedAdmin}
                          onClick={() => updateRole(user._id, "admin")}
                          className={`p-2.5 rounded-xl border transition-all ${
                            user.role === "admin"
                              ? "bg-red-600 text-white border-red-600 shadow-lg shadow-red-100"
                              : isRestrictedAdmin 
                                ? "bg-gray-50 text-gray-200 border-gray-100 cursor-not-allowed" 
                                : "bg-white text-gray-400 hover:text-red-600"
                          }`}
                          title={isRestrictedAdmin ? "Disabled for Demo" : "Admin Role"}
                        >
                          <FiStar size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                      No users found
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-6 bg-gray-50/30 flex items-center justify-between border-t border-gray-50">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50 disabled:opacity-30 transition-all"
            >
              Prev
            </button>
            <button
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50 disabled:opacity-30 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;