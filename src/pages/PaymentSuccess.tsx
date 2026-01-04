import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updatePaymentStatus } from "../services/Payment";
import { useAuth } from "../context/AuthContext";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [countdown, setCountdown] = useState(5);
  const [isUpdating, setIsUpdating] = useState(true);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const markAsPaid = async () => {
      try {
        setIsUpdating(true);
        const data = await updatePaymentStatus(user.token);
        if (data.success && data.paymentStatus === "PAID") {
          console.log("Payment marked as PAID");
          setUpdateSuccess(true);
        } else {
          console.warn("Payment status could not be updated");
          setUpdateSuccess(false);
        }
      } catch (error) {
        console.error("Error updating payment status:", error);
        setUpdateSuccess(false);
      } finally {
        setIsUpdating(false);
      }
    };

    markAsPaid();
  }, [user.token]);

  useEffect(() => {
    if (!isUpdating && updateSuccess) {
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            navigate("/home");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [isUpdating, updateSuccess, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center space-y-6 relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 via-green-500 to-emerald-500"></div>
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-teal-100 rounded-full opacity-20"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-green-100 rounded-full opacity-20"></div>

          {/* Animated Success Icon */}
          <div className="relative">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-teal-500 to-green-500 rounded-full flex items-center justify-center shadow-lg animate-scale-in">
              <svg
                className="w-12 h-12 text-white animate-check-draw"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            {/* Pulse Ring Animation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-teal-400 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-3 relative z-10">
            <h1 className="text-3xl font-bold text-gray-900 animate-fade-in-up">
              Payment Successful!
            </h1>
            <p className="text-gray-600 text-base animate-fade-in-up animation-delay-100">
              Thank you for your payment. Your transaction has been completed successfully.
            </p>
          </div>

          {/* Status Update Info */}
          {isUpdating ? (
            <div className="bg-gray-50 rounded-lg p-4 animate-fade-in-up animation-delay-200">
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-3 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-gray-600 font-medium">
                  Updating your payment status...
                </p>
              </div>
            </div>
          ) : updateSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in-up animation-delay-200">
              <div className="flex items-center justify-center gap-2 text-green-700">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm font-medium">Account status updated</p>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 animate-fade-in-up animation-delay-200">
              <div className="flex items-center justify-center gap-2 text-yellow-700">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm font-medium">Status update pending</p>
              </div>
            </div>
          )}

          {/* Transaction Details */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 space-y-3 animate-fade-in-up animation-delay-300">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-mono font-semibold text-gray-900">
                #{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </span>
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Date & Time</span>
              <span className="font-medium text-gray-900">
                {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Payment Method</span>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 4h16a2 2 0 012 2v2H2V6a2 2 0 012-2zm-2 6h20v8a2 2 0 01-2 2H4a2 2 0 01-2-2v-8zm4 4a1 1 0 100 2h3a1 1 0 100-2H6z" />
                </svg>
                <span className="font-medium text-gray-900">Card Payment</span>
              </div>
            </div>
          </div>

          {/* Redirect Message */}
          {!isUpdating && updateSuccess && (
            <div className="pt-2 animate-fade-in-up animation-delay-400">
              <p className="text-gray-500 text-sm mb-3">
                Redirecting to home page in
              </p>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-100 text-teal-600 rounded-full font-bold text-xl">
                {countdown}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 space-y-3 animate-fade-in-up animation-delay-500">
            <button
              onClick={() => navigate("/home")}
              className="w-full bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Go to Home
            </button>
            <button
              onClick={() => navigate("/transactions")}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg border-2 border-gray-200 transition-all duration-300"
            >
              View Transaction History
            </button>
          </div>

          {/* Support Link */}
          <div className="pt-4 border-t border-gray-100 animate-fade-in-up animation-delay-600">
            <p className="text-xs text-gray-500">
              Need help?{" "}
              <button
                onClick={() => navigate("/support")}
                className="text-teal-600 hover:text-teal-700 font-medium underline"
              >
                Contact Support
              </button>
            </p>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center animate-fade-in-up animation-delay-700">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <svg className="w-5 h-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Your payment is secure and encrypted</span>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes check-draw {
          0% {
            stroke-dasharray: 0, 100;
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dasharray: 100, 0;
            stroke-dashoffset: 0;
          }
        }

        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-check-draw {
          animation: check-draw 0.6s ease-in-out 0.3s both;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out both;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-700 {
          animation-delay: 0.7s;
        }
      `}</style>
    </div>
  );
}