import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApprovedListingsAPI } from "../services/Listning";
import { MapPinIcon, BedIcon, BathIcon } from "../components/Icons";
import type{ EdiitListningData } from "../services/Listning";
import { useAuth } from "../context/AuthContext"; // optional if you have auth

export default function AvailableProperties() {
  const [properties, setProperties] = useState<EdiitListningData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth(); // optional if you want token

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Pass token if user exists
        const token = user?.token || "";
        const data = await getApprovedListingsAPI(token);
        setProperties(data);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [user]);

  if (loading) return <p className="text-center mt-10">Loading properties...</p>;
  if (properties.length === 0)
    return <p className="text-center mt-10">No available properties found.</p>;

  return (
    <div className="bg-white shadow-sm border border-gray-100 p-5">
      <h2 className="text-lg font-bold text-gray-900 mb-5">Available Properties</h2>
      <div className="grid md:grid-cols-3 gap-5">
        {properties.map((p) => (
          <div
            key={p._id}
            className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer group border border-gray-100"
          >
            <div className="relative h-44 overflow-hidden">
              <img
                src={p.images && p.images.length > 0 ? p.images[0] : "/placeholder.png"}
                alt={p.title || "Property Image"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/placeholder.png";
                }}
              />
            </div>

            <div className="p-4">
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                <MapPinIcon />
                {p.location?.address || "Unknown Address"}
              </div>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{p.title || "Untitled"}</h3>
                  <p className="text-teal-600 font-bold text-base mt-1">
                    LKR {p.price?.toLocaleString() || "N/A"}
                  </p>
                </div>
                <div className="flex gap-3 text-gray-500 text-xs">
                  <span className="flex items-center gap-1"><BedIcon /> {p.bedrooms || 0}</span>
                  <span className="flex items-center gap-1"><BathIcon /> {p.bathrooms || 0}</span>
                </div>
              </div>
              <button
                onClick={() => navigate(`/property/${p._id}`)}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 transition-colors text-xs font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
