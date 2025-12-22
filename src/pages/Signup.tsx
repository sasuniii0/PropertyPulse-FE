import { useState } from 'react';
import { useAuthModal } from "../context/AuthModalContext";
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/Auth';
import { PulseIcon,GoogleIcon,FacebookIcon,EyeIcon,EyeOffIcon,MailIcon,LockIcon,UserIcon,PhoneIcon } from '../components/Icons';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setcontactNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState<"client" | "agent">("client");


  const { openSignIn, closeModal } = useAuthModal();
  const navigate = useNavigate()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simulate API call
    setTimeout(() => {
      console.log('Sign Up:', { name, email, contactNumber, password });
      setIsLoading(false);
    }, 1500);


    if(!name || !email || !contactNumber || !password || !confirmPassword || !role) {
      alert("Please fill all the details")
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setIsLoading(true);

    try{
      const obj = {
        name: name,
        email : email,
        contactNumber: contactNumber,
        password: password,
        role:role.toLocaleUpperCase()
      }

      const response : any = await signup(obj)
      console.log(response.data)

      alert("Registration successfull!")
      navigate('/signin')
      return;

    }catch(err){
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
      return;
    }
    
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      {/* Modal */}
      <div className="relative bg-white shadow-2xl w-[90%] max-w-md p-8 z-10 max-h-[90vh] overflow-y-auto">
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
          Create Account
        </h2>
        <p className="text-gray-600 text-center text-sm mb-6">
          Sign up to find your dream property in Sri Lanka
        </p>

        {/* Role Selector */}
        <div className="flex flex-col gap-3 mb-5">
        <div className="flex items-center justify-center gap-3">

            {/* Client Option */}
            <button
                type="button"
                onClick={() => setRole("client")}
                className={`w-40 py-2.5 border flex flex-col items-center gap-1 transition-all ${
                    role === "client"
                    ? "bg-teal-500 text-white border-teal-500"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                }`}
                >
                <span className="font-medium text-sm">I am a Client</span>
            </button>

            {/* Agent Option */}
            <button
                type="button"
                onClick={() => setRole("agent")}
                className={`w-40 py-2.5 border flex flex-col items-center gap-1 transition-all ${
                    role === "agent"
                    ? "bg-teal-500 text-white border-teal-500"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                }`}
                >
                <span className="font-medium text-sm">I am an Agent</span>
            </button>

        </div>
        </div>

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

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 px-3 py-2.5 mb-4 text-xs border border-red-200">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full pl-11 pr-3 py-2.5 text-sm border border-gray-300 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500 transition-all"
            />
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <UserIcon />
            </div>
          </div>

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
              type="tel"
              placeholder="Phone Number (+94 77 123 4567)"
              value={contactNumber}
              onChange={(e) => setcontactNumber(e.target.value)}
              required
              className="w-full pl-11 pr-3 py-2.5 text-sm border border-gray-300 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500 transition-all"
            />
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <PhoneIcon />
            </div>
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
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

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full pl-11 pr-3 py-2.5 text-sm border border-gray-300 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500 transition-all"
            />
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <LockIcon />
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-2.5">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-teal-500 border-gray-300 focus:ring-teal-500"
            />
            <label htmlFor="terms" className="text-xs text-gray-600">
              I agree to the{' '}
              <a href="#" className="text-teal-600 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-teal-600 hover:underline">Privacy Policy</a>
            </label>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white py-2.5 font-semibold text-sm transition-colors"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-center text-gray-600 text-xs mt-5">
          Already have an account?{' '}
          <button 
            className="text-teal-600 font-semibold hover:underline"
            onClick={openSignIn}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}