import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updatePaymentStatus } from "../services/Payment";
import { useAuth } from "../context/AuthContext";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const {user} = useAuth();

  useEffect(() => {
    const markAsPaid = async () => {
      const data = await updatePaymentStatus(user.token);
      if (data.success && data.paymentStatus === "PAID") {
        console.log("Payment marked as PAID");
      } else {
        console.warn("Payment status could not be updated");
      }
    };

    markAsPaid();

    const timer = setTimeout(() => navigate("/home"), 2000);
    return () => clearTimeout(timer);
  }, [navigate, user.token]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h2 className="text-xl font-bold text-teal-600">
        Payment Successful 
      </h2>
    </div>
  );
}
