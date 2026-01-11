import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { FcGoogle } from "react-icons/fc";
import { IoMailOutline, IoLockClosedOutline, IoPersonOutline, IoCloudUploadOutline, IoLinkOutline } from "react-icons/io5";
import { AuthContext } from "../Provider/AuthContext";
import axios from "axios";

const Registration = () => {
  const { createUser, googleLogin, updateUserProfile, saveUserTODB } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  const imgbb_api_key = "26f8d54dc1b54255034bb60cb5a9fa8f";

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbb_api_key}`, formData);
    return response.data.data.display_url;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    let photo = activeTab === "url" ? form.photo.value : "";

    try {
      if (activeTab === "upload" && selectedFile) {
        photo = await uploadToImgBB(selectedFile);
      }

      const result = await createUser(email, password);
      await updateUserProfile(name, photo);

      const updatedUser = {
        ...result.user,
        displayName: name,
        photoURL: photo
      };
      await saveUserTODB(updatedUser);

      Toast.fire({ icon: "success", title: "Registration Successful!" });
      navigate("/");
    } catch (error) {
      console.error(error);
      Toast.fire({ icon: "error", title: error.message || "Registration failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      Toast.fire({ icon: "success", title: "Logged in with Google!" });
      navigate("/");
    } catch (error) {
      Toast.fire({ icon: "error", title: "Google login failed" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-500 font-medium">Join our organic food community</p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleRegister}>
          <div className="relative">
            <IoPersonOutline className="absolute left-4 top-4 text-gray-400" size={20} />
            <input
              name="name"
              type="text"
              required
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-green-500 transition-all font-medium"
              placeholder="Full Name"
            />
          </div>

          <div className="space-y-3">
            <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === "upload" ? "bg-white text-green-600 shadow-sm" : "text-gray-500"}`}
              >
                <IoCloudUploadOutline size={16} /> Upload
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("url")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === "url" ? "bg-white text-green-600 shadow-sm" : "text-gray-500"}`}
              >
                <IoLinkOutline size={16} /> URL
              </button>
            </div>

            {activeTab === "upload" ? (
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all overflow-hidden">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <IoCloudUploadOutline className="text-2xl text-gray-400 mb-1" />
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Upload Photo</p>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} required={activeTab === "upload"} />
              </label>
            ) : (
              <div className="relative">
                <IoLinkOutline className="absolute left-4 top-4 text-gray-400" size={20} />
                <input
                  name="photo"
                  type="url"
                  required={activeTab === "url"}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-green-500 transition-all font-medium"
                  placeholder="Photo URL"
                />
              </div>
            )}
          </div>

          <div className="relative">
            <IoMailOutline className="absolute left-4 top-4 text-gray-400" size={20} />
            <input
              name="email"
              type="email"
              required
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-green-500 transition-all font-medium"
              placeholder="Email address"
            />
          </div>

          <div className="relative">
            <IoLockClosedOutline className="absolute left-4 top-4 text-gray-400" size={20} />
            <input
              name="password"
              type="password"
              required
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-green-500 transition-all font-medium"
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-100 active:scale-95 disabled:bg-gray-400 cursor-pointer"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm uppercase">
            <span className="px-4 bg-white text-gray-400 font-bold">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full flex items-center justify-center gap-3 py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-95 cursor-pointer"
        >
          <FcGoogle size={24} />
          Sign up with Google
        </button>

        <p className="text-center text-gray-600 font-medium">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 font-black hover:underline cursor-pointer">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Registration;