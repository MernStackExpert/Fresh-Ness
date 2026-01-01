import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { AuthContext } from "../Provider/AuthContext";


const Login = () => {
  const { loginUser, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      await loginUser(email, password);
      toast.success("Welcome Back!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      toast.success("Logged in with Google!");
      navigate("/");
    } catch (error) {
      toast.error("Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
        <div className="text-center">
          <h2 className="text-4xl font-black text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-500 font-medium">Log in to your account</p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleLogin}>
          {/* Email Field */}
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

          {/* Password Field with Eye Toggle */}
          <div className="relative">
            <IoLockClosedOutline className="absolute left-4 top-4 text-gray-400" size={20} />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-green-500 transition-all font-medium"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-gray-400 hover:text-green-600 transition-colors"
            >
              {showPassword ? <IoEyeOffOutline size={22} /> : <IoEyeOutline size={22} />}
            </button>
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-sm font-bold text-green-600 hover:underline">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-100 active:scale-95 disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Log In"}
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

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full flex items-center justify-center gap-3 py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-95"
        >
          <FcGoogle size={24} />
          Sign in with Google
        </button>

        <p className="text-center text-gray-600 font-medium">
          New here?{" "}
          <Link to="/registration" className="text-green-600 font-black hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;