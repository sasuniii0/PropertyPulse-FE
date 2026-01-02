import { useState, useEffect } from "react";
import { MapPinIcon, BedIcon, BathIcon } from "../components/Icons";
import { useAuth } from "../context/AuthContext";
import { getAgentListingsAPI, getInquiriesByAgentAPI } from "../services/Listning";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AgentProperties() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.token) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const agentListings = await getAgentListingsAPI(user.token);
        const agentInquiries = await getInquiriesByAgentAPI(user.token);

        setListings(agentListings);
        setInquiries(agentInquiries);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load agent data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.token]);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-gray-700 text-xl font-semibold">
        Loading agent data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
          <p className="text-gray-600 text-sm mt-0.5">Track your properties and inquiries</p>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-base mb-4">No properties found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {listings.map((listing) => {
              const listingInquiries = inquiries.filter(
                (inq) => inq.listing === listing._id
              );

              return (
                <div
                  key={listing._id}
                  className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer border border-gray-100"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={listing.images?.[0] ?? "/placeholder.jpg"}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-teal-500 text-white px-2.5 py-0.5 text-xs font-medium capitalize">
                      {listing.propertyType}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                      <MapPinIcon />
                      {listing.location.address}
                    </div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">{listing.title}</h3>
                        <p className="text-teal-600 font-bold text-base mt-1">
                          LKR {listing.price.toLocaleString()}
                        </p>
                        <p className="text-gray-500 text-xs mt-0.5">
                          Status: {listing.status}
                        </p>
                      </div>
                      {listing.bedrooms > 0 && (
                        <div className="flex gap-3 text-gray-500 text-xs">
                          <span className="flex items-center gap-1">
                            <BedIcon /> {listing.bedrooms}
                          </span>
                          <span className="flex items-center gap-1">
                            <BathIcon /> {listing.bathrooms}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-gray-600 mb-2">
                      <p>
                        Inquiries:{" "}
                        <span className="font-medium">{listingInquiries.length}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => navigate(`/property/${listing._id}`)}
                      className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 transition-colors text-xs font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
