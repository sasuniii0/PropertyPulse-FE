import { useEffect, useState } from "react";
import { approveListingAPI, getAllListingsAdminAPI, rejectListingAPI } from "../services/Admin";
import { useAuth } from "../context/AuthContext";
import type { ListingData } from "../services/Listning";

export default function PropertyApproval() {
  const { user } = useAuth();
  const [listings, setListings] = useState<ListingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      if (!user) return;
      try {
        const res = await getAllListingsAdminAPI(user.token);
        console.log(res);
        
        setListings(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [user]);

  const handleApprove = async (id: string) => {
    if (!user) return;
    try {
      await approveListingAPI(id, user.token);
      setListings(prev =>
        prev.map(l => (l._id === id ? { ...l, status: "approved" } : l))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to approve listing");
    }
  };

  const handleReject = async (id: string) => {
    if (!user) return;
    try {
      await rejectListingAPI(id, user.token);
      setListings(prev =>
        prev.map(l => (l._id === id ? { ...l, status: "rejected" } : l))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to reject listing");
    }
  };

  if (loading) return <p>Loading listings...</p>;

  const pendingListings = listings.filter(l => l.status === "PENDING");
  const approvedListings = listings.filter(l => l.status === "APPROVED");
  const rejectedListings = listings.filter(l => l.status === "REJECTED");  

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Property Approvals Dashboard</h1>
        <p className="text-gray-600 text-sm mt-0.5">Review and manage property listing approvals</p>
      </div>

      {/* Pending Listings */}
      <div className="bg-white shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            Pending Approvals
            <span className="bg-orange-500 text-white text-xs px-2 py-0.5 font-medium">
              {pendingListings.length}
            </span>
          </h2>
        </div>
        {pendingListings.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 mb-3">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No pending listings</p>
          </div>
        ) : (
          <div className="space-y-2">
            {pendingListings.map(listing => (
              <div
                key={listing._id}
                className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 hover:border-orange-300 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {listing.title || "Untitled Listing"}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Property Type: {listing.propertyType || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Agent:{" "}
                    {listing.agent
                      ? typeof listing.agent === "object"
                        ? listing.agent.name
                        : listing.agent
                      : "Unknown"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium transition-colors"
                    onClick={() => handleApprove(listing._id)}
                  >
                    Approve
                  </button>
                  <button
                    className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition-colors"
                    onClick={() => handleReject(listing._id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approved Listings */}
      <div className="bg-white shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            Approved Listings
            <span className="bg-green-500 text-white text-xs px-2 py-0.5 font-medium">
              {approvedListings.length}
            </span>
          </h2>
        </div>
        {approvedListings.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 mb-3">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No approved listings yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {approvedListings.map(listing => (
              <div
                key={listing._id}
                className="p-3 bg-green-50 border border-green-200"
              >
                <h3 className="font-semibold text-gray-900 text-sm">{listing.title}</h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  Type: {listing.propertyType || "N/A"} | Agent:{" "}
                  {listing.agent ? (typeof listing.agent === "object" ? listing.agent.name : listing.agent) : "Unknown"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rejected Listings */}
      <div className="bg-white shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            Rejected Listings
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 font-medium">
              {rejectedListings.length}
            </span>
          </h2>
        </div>
        {rejectedListings.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 mb-3">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No rejected listings yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {rejectedListings.map(listing => (
              <div
                key={listing._id}
                className="p-3 bg-red-50 border border-red-200"
              >
                <h3 className="font-semibold text-gray-900 text-sm">{listing.title}</h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  Type: {listing.propertyType || "N/A"} | Agent:{" "}
                  {listing.agent ? (typeof listing.agent === "object" ? listing.agent.name : listing.agent) : "Unknown"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
