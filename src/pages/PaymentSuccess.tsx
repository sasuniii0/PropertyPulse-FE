import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => navigate("/home"), 2000);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h2 className="text-xl font-bold text-teal-600">
        Payment Successful 
      </h2>
    </div>
  );
}
