import React, { useContext, useState } from "react";
import { AuthContext } from "../Provider/AuthContext";
import { IoCameraOutline, IoPersonOutline, IoMailOutline, IoCheckmarkCircleOutline, IoCloudUploadOutline, IoLinkOutline } from "react-icons/io5";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import axios from "axios";

const Profile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const isRestrictedAdmin = user?.email === "admin@freshness.com";

  const imgbb_api_key = "26f8d54dc1b54255034bb60cb5a9fa8f";

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPhotoURL(URL.createObjectURL(file));
    }
  };

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbb_api_key}`, formData);
    return response.data.data.display_url;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalPhotoURL = photoURL;

      if (activeTab === "upload" && selectedFile) {
        setUploading(true);
        finalPhotoURL = await uploadToImgBB(selectedFile);
        setUploading(false);
      }

      await updateUserProfile(name, finalPhotoURL);
      
      Toast.fire({
        icon: "success",
        title: "Profile updated successfully"
      });

    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Failed to update profile"
      });
      console.error(error);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-2xl mx-auto bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100 ${
        isRestrictedAdmin ? "pointer-events-none select-none" : ""
      }`}
      >
        <div className="h-32 bg-gradient-to-r from-green-500 to-indigo-600"></div>

        <div className="px-8 pb-10">
          <div className="relative -mt-16 mb-6 flex justify-center">
            <div className="relative group">
              <img
                src={photoURL || "https://i.ibb.co/vBR74KV/user.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg bg-white"
              />
              <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
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

              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 ml-1">Profile Photo</label>
                
                <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("upload")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${activeTab === "upload" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500"}`}
                  >
                    <IoCloudUploadOutline size={18} /> Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("url")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${activeTab === "url" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500"}`}
                  >
                    <IoLinkOutline size={18} /> URL
                  </button>
                </div>

                {activeTab === "upload" ? (
                  <div className="relative">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <IoCloudUploadOutline className={`text-3xl mb-2 ${selectedFile ? "text-green-500" : "text-gray-400"}`} />
                        <p className="text-xs font-bold text-gray-500">
                          {selectedFile ? `Selected: ${selectedFile.name}` : "Click to upload profile picture"}
                        </p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <IoLinkOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="url"
                      value={photoURL}
                      onChange={(e) => setPhotoURL(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-green-500 transition-all font-medium text-gray-700"
                      placeholder="Paste image URL here"
                    />
                  </div>
                )}
              </div>

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
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full mt-4 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 disabled:bg-gray-400 cursor-pointer"
            >
              {loading || uploading ? (uploading ? "Uploading Image..." : "Updating...") : "Save Changes"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;