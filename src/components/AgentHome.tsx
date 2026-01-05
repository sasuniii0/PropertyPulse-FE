import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAgentListingsAPI, getInquiriesByAgentAPI } from "../services/Listning";
import { MapPinIcon, BedIcon, BathIcon } from "../components/Icons";

const TrendingUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const ActivityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default function AgentHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const agentListings = await getAgentListingsAPI(user.token);
        const agentInquiries = await getInquiriesByAgentAPI(user.token);
        setListings(agentListings);
        setInquiries(agentInquiries);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) fetchData();
  }, [user?.token]);

  const stats = {
    total: listings.length,
    approved: listings.filter((l) => l.status === "APPROVED").length,
    pending: listings.filter((l) => l.status === "PENDING").length,
    inquiries: inquiries.length,
  };

  const recentListings = listings.slice(0, 3);
  const recentInquiries = inquiries.slice(0, 5);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-gray-700 text-xl font-semibold">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-8 shadow-sm border border-teal-700">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-teal-100">Here's what's happening with your properties today.</p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                <ActivityIcon />
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1">TOTAL</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</div>
            <div className="text-sm text-gray-600 font-medium">Total Properties</div>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 flex items-center justify-center">
                <CheckCircleIcon />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1">LIVE</span>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">{stats.approved}</div>
            <div className="text-sm text-gray-600 font-medium">Approved Listings</div>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 flex items-center justify-center">
                <ClockIcon />
              </div>
              <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1">WAITING</span>
            </div>
            <div className="text-3xl font-bold text-yellow-600 mb-1">{stats.pending}</div>
            <div className="text-sm text-gray-600 font-medium">Pending Approval</div>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 flex items-center justify-center">
                <TrendingUpIcon />
              </div>
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1">NEW</span>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-1">{stats.inquiries}</div>
            <div className="text-sm text-gray-600 font-medium">Total Inquiries</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate("/createListnings")}
              className="flex items-center gap-4 p-4 border-2 border-teal-600 bg-teal-50 hover:bg-teal-100 transition-colors group"
            >
              <div className="w-12 h-12 bg-teal-600 flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900 text-sm">Add New Property</div>
                <div className="text-xs text-gray-600">List a new property</div>
              </div>
            </button>

            <button
              onClick={() => navigate("/manageListnings")}
              className="flex items-center gap-4 p-4 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors group"
            >
              <div className="w-12 h-12 bg-gray-600 flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900 text-sm">Manage Listings</div>
                <div className="text-xs text-gray-600">View all properties</div>
              </div>
            </button>

            <button
              onClick={() => navigate("/inquaries")}
              className="flex items-center gap-4 p-4 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors group"
            >
              <div className="w-12 h-12 bg-purple-600 flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900 text-sm">View Inquiries</div>
                <div className="text-xs text-gray-600">Check messages</div>
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Recent Listings</h2>
                <button
                onClick={() => navigate("/manageListnings")}
                className="text-sm text-teal-600 font-semibold hover:text-teal-700"
                >
                View All →
                </button>
            </div>

            {recentListings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No listings yet. Create your first property!</p>
                </div>
            ) : (
                <div className="space-y-4">
                {recentListings.map((listing) => (
                    <div
                    key={listing._id}
                    onClick={() => navigate(`/property/${listing._id}`)}
                    className="group grid grid-cols-[96px_1fr] gap-4 p-4 border border-gray-200 hover:border-teal-500 hover:bg-teal-50 transition cursor-pointer"
                    >
                    {/* Image */}
                    <img
                        src={listing.images?.[0] ?? "/placeholder.jpg"}
                        alt={listing.title}
                        className="w-24 h-24 object-cover rounded"
                    />

                    {/* Content */}
                    <div className="flex flex-col justify-between min-h-[96px]">
                        {/* Top row */}
                        <div className="flex items-start justify-between gap-3">
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
                            {listing.title}
                        </h3>

                        <span
                            className={`shrink-0 text-xs font-semibold px-2 py-1 rounded ${
                            listing.status === "APPROVED"
                                ? "bg-green-100 text-green-700"
                                : listing.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                        >
                            {listing.status}
                        </span>
                        </div>

                        {/* Address */}
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <MapPinIcon />
                        <span className="truncate">{listing.location.address}</span>
                        </div>

                        {/* Bottom row */}
                        <div className="flex items-center justify-between mt-2">
                        <p className="text-teal-600 font-bold text-sm">
                            LKR {listing.price.toLocaleString()}
                        </p>

                        {listing.bedrooms > 0 && (
                            <div className="flex items-center gap-4 text-gray-500 text-xs">
                            <span className="flex items-center gap-1">
                                <BedIcon/>
                                {listing.bedrooms}
                            </span>
                            <span className="flex items-center gap-1">
                                <BathIcon/>
                                {listing.bathrooms}
                            </span>
                            </div>
                        )}
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            )}
            </div>

          {/* Recent Inquiries */}
          <div className="bg-white shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Inquiries</h2>
              <button
                onClick={() => navigate("/inquaries")}
                className="text-sm text-teal-600 font-semibold hover:text-teal-700"
              >
                View All →
              </button>
            </div>
            {recentInquiries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No inquiries yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentInquiries.map((inquiry, index) => (
                  <div
                    key={index}
                    className="p-3 border border-gray-200 hover:border-teal-600 hover:bg-teal-50 transition-all cursor-pointer"
                    onClick={() => navigate("/inquaries")}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-semibold text-gray-900 text-xs">{inquiry.name}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">{inquiry.message}</p>
                    <div className="text-xs text-teal-600 font-medium">{inquiry.email}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Performance Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-600 p-6">
          <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Pro Tips
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Add high-quality photos to attract more buyers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Respond to inquiries within 24 hours for better engagement</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Update your listings regularly to stay visible</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}