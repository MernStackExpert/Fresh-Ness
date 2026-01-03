import React, { useContext, useState } from "react";
import { AuthContext } from "../Provider/AuthContext";
import { IoCameraOutline, IoPersonOutline, IoMailOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Profile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUserProfile(name, photoURL);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100"
      >
        {/* Header Background */}
        <div className="h-32 bg-gradient-to-r from-green-500 to-indigo-600"></div>

        <div className="px-8 pb-10">
          <div className="relative -mt-16 mb-6 flex justify-center">
            <div className="relative group">
              <img
                src={photoURL || "https://i.ibb.co/vBR74KV/user.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg bg-white"
              />
              <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <IoCameraOutline className="text-white text-3xl" />
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-gray-900">{user?.displayName || "User Name"}</h2>
            <p className="text-gray-500 font-medium">{user?.email}</p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                <div className="relative">
                  <IoPersonOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-green-500 transition-all font-medium text-gray-700"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>

              {/* Photo URL Field */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Profile Photo URL</label>
                <div className="relative">
                  <IoCameraOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="url"
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-green-500 transition-all font-medium text-gray-700"
                    placeholder="Paste image URL here"
                  />
                </div>
              </div>

              {/* Email Field (Read Only) */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Email Address (Locked)</label>
                <div className="relative">
                  <IoMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full pl-12 pr-4 py-4 bg-gray-100 border border-gray-200 rounded-2xl cursor-not-allowed text-gray-400 font-medium"
                  />
                  <IoCheckmarkCircleOutline className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" size={20} />
                </div>
                <p className="text-[10px] text-gray-400 ml-1">Email cannot be changed for security reasons.</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 disabled:bg-gray-400"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;