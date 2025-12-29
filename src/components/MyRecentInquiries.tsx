import { useEffect, useState } from "react";
import { getMyInquiriesAPI } from "../services/Inquiry"; // adjust the path
import InquiryCard from "../components/InquiryCard";
import { useAuth } from "../context/AuthContext";

interface Inquiry {
  _id: string;
  propertyTitle: string;
  createdAt: string;
}

export default function MyRecentInquiries() {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      if (!user.token) return;
      try {
        const data = await getMyInquiriesAPI(user.token);
        setInquiries(data);
      } catch (error) {
        console.error("Failed to fetch inquiries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, [user.token]);

  if (loading) {
    return <p className="text-center mt-5">Loading your recent inquiries...</p>;
  }

  return (
    <div className="bg-white shadow-sm border border-gray-100 p-5">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Your Recent Inquiries</h2>
      <div className="space-y-3">
        {inquiries.length === 0 ? (
          <p className="text-gray-500 text-sm">You have no recent inquiries.</p>
        ) : (
          inquiries.map((inq) => (
            <InquiryCard
              key={inq._id}
              name={inq.propertyTitle}
              date={new Date(inq.createdAt).toLocaleDateString()}
            />
          ))
        )}
      </div>
    </div>
  );
}
