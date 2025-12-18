import { useState } from 'react';
import { useAuthModal } from "../context/AuthModalContext";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyDetails, signin } from '../services/Auth';
import { PulseIcon,GoogleIcon,FacebookIcon,EyeIcon,EyeOffIcon,MailIcon,LockIcon } from '../components/Icons';

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { openSignUp, closeModal } = useAuthModal();
  const navigate = useNavigate()
  const {setUser} = useAuth()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Sign In:', { email, password });
      setIsLoading(false);
      // Handle successful login here
    }, 1500);

    if(!email || !password) {
      alert("Please fill in all fields")
      return;
    }

    try{
      const res = await signin(email,password)
      console.log(res.data.accessToken)

      if(!res.data.accessToken) {
        alert("Login failed. please try again")
        return
      }

      await localStorage.setItem("accessToken" , res.data.accessToken)
      await localStorage.setItem("refreshToken" , res.data.refreshToken)

      const details = await getMyDetails(res.data.accessToken)
      setUser(details.data)

      alert("Login successfull!")
      navigate("/home")
    }catch(error) {
      console.error("Login failed: " ,error)
      alert("Login failed. please try again.")
      return
    }

  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-[90%] max-w-md p-8 z-10">
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
          <span className="font-bold text-xl text-gray-800">PropertyPulse</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Sign in to continue your property search
        </p>

        {/* Social Login */}
        <div className="flex gap-4 mb-6">
          <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 hover:bg-gray-50 transition-all">
            <GoogleIcon />
            <span className="text-sm font-medium text-gray-700">Google</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 hover:bg-gray-50 transition-all">
            <FacebookIcon />
            <span className="text-sm font-medium text-gray-700">Facebook</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-sm">or</span>
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
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-teal-500 transition-colors"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
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
              className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl outline-none focus:border-teal-500 transition-colors"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <LockIcon />
            </div>
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-teal-600 text-sm hover:underline">
              Forgot Password?
            </button>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white py-3 rounded-xl font-semibold transition-all"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-center text-gray-500 mt-6">
          Don't have an account?{' '}
          <button 
            className="text-teal-600 font-semibold hover:underline"
            onClick={openSignUp}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}