import { useState } from 'react';
import { useAuthModal } from "../context/AuthModalContext";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signin } from '../services/Auth';
import { PulseIcon,GoogleIcon,FacebookIcon,EyeIcon,EyeOffIcon,MailIcon,LockIcon } from '../components/Icons';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading] = useState(false);

  const { closeModal } = useAuthModal();
  const navigate = useNavigate()
  const { login } = useAuth();


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await signin(email, password); // Axios call

    // Check if response has the access token
    if (!res.data.accessToken) {
      return toast.error("Login failed. Please check your credentials.");
    }

    // Successful login: store tokens
    login(res.data.accessToken, res.data.refreshToken);

    // Send login email notification
    await fetch(`${import.meta.env.VITE_API_URL}/email/send-login-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: res.data.email,
        name: res.data.name,
        loginTime: new Date().toLocaleString(),
      }),
    });

    toast.success("Login successful!");
    navigate("/home");

  } catch (error: any) {
    // Axios errors contain response object
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401) {
        toast.error(error.response.data.message || "Invalid credentials");
      } else {
        toast.error(error.response.data.message || "Something went wrong. Please try again.");
      }
    } else {
      // Fallback for other errors
      toast.error("Network error. Please try again.");
    }
  }
};

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      {/* Modal */}
      <div className="relative bg-white shadow-2xl w-[90%] max-w-md p-8 z-10">
        {/* Close Button */}
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors text-2xl"
          onClick={closeModal}
        >
          ×
        </button>

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <PulseIcon />
          <span className="font-bold text-lg text-gray-800">PropertyPulse</span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-center text-gray-900 mb-1">
          Welcome Back
        </h2>
        <p className="text-gray-600 text-center text-sm mb-6">
          Sign in to continue your property search
        </p>

        {/* Social Login */}
        <div className="flex gap-3 mb-5">
          <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2.5 hover:bg-gray-50 transition-colors">
            <GoogleIcon />
            <span className="text-xs font-medium text-gray-700">Google</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2.5 hover:bg-gray-50 transition-colors">
            <FacebookIcon />
            <span className="text-xs font-medium text-gray-700">Facebook</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-xs">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-11 pr-3 py-2.5 text-sm border border-gray-300 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500 transition-all"
            />
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <MailIcon />
            </div>
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-11 pr-11 py-2.5 text-sm border border-gray-300 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500 transition-all"
            />
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <LockIcon />
            </div>
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-teal-600 text-xs hover:underline font-medium">
              Forgot Password?
            </button>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white py-2.5 font-semibold text-sm transition-colors"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-center text-gray-600 text-xs mt-5">
          Don't have an account?{' '}
          <button 
            className="text-teal-600 font-semibold hover:underline"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}