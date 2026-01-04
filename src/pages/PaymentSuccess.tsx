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
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        {/* Main Content */}
        <div className="border-2 border-gray-900">
          {/* Header with Success Icon */}
          <div className="border-b-2 border-gray-900 bg-teal-600 p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white mb-6">
              <svg
                className="w-12 h-12 text-teal-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3 uppercase tracking-wide">
              Payment Successful
            </h1>
            <p className="text-teal-100 text-lg">
              Your transaction has been completed successfully
            </p>
          </div>

          {/* Status Update Section */}
          <div className="p-8 border-b-2 border-gray-900">
            {isUpdating ? (
              <div className="bg-gray-100 border-2 border-gray-900 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 border-3 border-gray-900 border-t-transparent animate-spin"></div>
                  <p className="text-gray-900 font-semibold uppercase tracking-wide">
                    Updating Payment Status...
                  </p>
                </div>
              </div>
            ) : updateSuccess ? (
              <div className="bg-green-50 border-2 border-green-600 p-6">
                <div className="flex items-center gap-3 text-green-800">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="font-bold uppercase tracking-wide">Account Status Updated</p>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border-2 border-yellow-600 p-6">
                <div className="flex items-center gap-3 text-yellow-800">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="font-bold uppercase tracking-wide">Status Update Pending</p>
                </div>
              </div>
            )}
          </div>

          {/* Transaction Details */}
          <div className="p-8 bg-gray-50">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">
              Transaction Details
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-300">
                <span className="text-gray-600 font-medium uppercase text-sm tracking-wide">
                  Transaction ID
                </span>
                <span className="font-mono font-bold text-gray-900">
                  #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-300">
                <span className="text-gray-600 font-medium uppercase text-sm tracking-wide">
                  Date
                </span>
                <span className="font-semibold text-gray-900">
                  {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-300">
                <span className="text-gray-600 font-medium uppercase text-sm tracking-wide">
                  Time
                </span>
                <span className="font-semibold text-gray-900">
                  {new Date().toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium uppercase text-sm tracking-wide">
                  Payment Method
                </span>
                <span className="font-semibold text-gray-900">Card Payment</span>
              </div>
            </div>
          </div>

          {/* Countdown Section */}
          {!isUpdating && updateSuccess && (
            <div className="p-8 bg-gray-100 border-t-2 border-gray-900 text-center">
              <p className="text-gray-600 font-medium uppercase text-sm tracking-wide mb-4">
                Redirecting to Home Page
              </p>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 text-white font-bold text-2xl">
                {countdown}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/home")}
            className="border-2 border-gray-900 bg-gray-900 text-white font-bold py-4 px-6 uppercase tracking-wide hover:bg-gray-800 transition-colors"
          >
            Go to Home
          </button>
          <button
            onClick={() => navigate("/transactions")}
            className="border-2 border-gray-900 bg-white text-gray-900 font-bold py-4 px-6 uppercase tracking-wide hover:bg-gray-100 transition-colors"
          >
            View Transactions
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-300 text-center">
          <p className="text-sm text-gray-600 uppercase tracking-wide">
            Need Assistance?{" "}
            <button
              onClick={() => navigate("/support")}
              className="text-gray-900 font-bold hover:underline"
            >
              Contact Support
            </button>
          </p>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="uppercase tracking-wide font-medium">Secure Transaction</span>
          </div>
        </div>
      </div>
    </div>
  );
}