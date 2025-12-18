import { useEffect, useState } from "react";
import { approveListingAPI, rejectListingAPI } from "../services/Admin";
import { getAllListingsAPI } from "../services/Listning";
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
        const res = await getAllListingsAPI(user.token);
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
    <div className="min-h-screen p-6 bg-gray-50 space-y-6">
      <h1 className="text-2xl font-bold">Property Approvals Dashboard</h1>

      {/* Pending Listings */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h2 className="text-xl font-bold mb-4">
          Pending Approvals ({pendingListings.length})
        </h2>
        {pendingListings.length === 0 ? (
          <p>No pending listings.</p>
        ) : (
          <div className="space-y-3">
            {pendingListings.map(listing => (
              <div
                key={listing._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {listing.title || "Untitled Listing"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Property Type: {listing.propertyType || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
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
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm"
                    onClick={() => handleApprove(listing._id)}
                  >
                    Approve
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
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
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h2 className="text-xl font-bold mb-4">Approved Listings ({approvedListings.length})</h2>
        {approvedListings.length === 0 ? (
          <p>No approved listings yet.</p>
        ) : (
          <div className="space-y-3">
            {approvedListings.map(listing => (
              <div
                key={listing._id}
                className="p-4 bg-green-50 rounded-lg border border-green-200"
              >
                <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                <p className="text-sm text-gray-500">
                  Type: {listing.propertyType || "N/A"} | Agent:{" "}
                  {listing.agent ? (typeof listing.agent === "object" ? listing.agent.name : listing.agent) : "Unknown"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rejected Listings */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h2 className="text-xl font-bold mb-4">Rejected Listings ({rejectedListings.length})</h2>
        {rejectedListings.length === 0 ? (
          <p>No rejected listings yet.</p>
        ) : (
          <div className="space-y-3">
            {rejectedListings.map(listing => (
              <div
                key={listing._id}
                className="p-4 bg-red-50 rounded-lg border border-red-200"
              >
                <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                <p className="text-sm text-gray-500">
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
