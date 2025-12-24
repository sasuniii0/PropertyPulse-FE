import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getAllListingsAdminAPI,
  getListingByIdAdminAPI,
  updateListingAdminAPI,
  deleteListingAdminAPI
} from "../services/Admin";
import type { ListingData, EdiitListningData } from "../services/Admin";

export default function AdminListings() {
  const { user } = useAuth();

  const [listings, setListings] = useState<ListingData[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<EdiitListningData | null>(null);
  const [saving, setSaving] = useState(false);

  // Fetch all listings
  useEffect(() => {
    const fetchListings = async () => {
      if (!user) return;
      try {
        const res = await getAllListingsAdminAPI(user.token);
        setListings(res.data.data || []);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch listings");
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [user]);

  // Delete listing
  const handleDelete = async (id: string) => {
    if (!user) return;

    if (!window.confirm("Are you sure you want to delete this listing?")) return;

    try {
      await deleteListingAdminAPI(id, user.token);
      setListings(prev => prev.filter(l => l._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete listing");
    }
  };

  // Open edit modal and load listing
  const openEditPopup = async (id: string) => {
    if (!user) return;
    try {
      const res = await getListingByIdAdminAPI(id, user.token);
      setSelectedListing(res.data.data);
      setIsOpen(true);
    } catch (err) {
      console.error(err);
      alert("Failed to load listing");
    }
  };

  // Update selected listing
  const handleUpdate = async () => {
    if (!user || !selectedListing) return;

    try {
      setSaving(true);

      const updateData: Partial<EdiitListningData> = {
        title: selectedListing.title,
        propertyType: selectedListing.propertyType,
        price: selectedListing.price,
        size: selectedListing.size,
        bedrooms: selectedListing.bedrooms,
        bathrooms: selectedListing.bathrooms,
        description: selectedListing.description,
        location: selectedListing.location,
      };

      await updateListingAdminAPI(selectedListing._id, updateData, user.token);

      setListings(prev =>
        prev.map(l => (l._id === selectedListing._id ? { ...l, ...updateData } : l))
      );

      setIsOpen(false);
      setSelectedListing(null);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Loading listings...</p>;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Listings</h1>
        <p className="text-sm text-gray-600">View, update, and delete property listings</p>
      </div>

      {/* Listings Table */}
      <div className="bg-white border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Property Type</th>
              <th className="p-3 text-left">Agent</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  No listings available
                </td>
              </tr>
            ) : (
              listings.map(listing => (
                <tr key={listing._id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3 font-medium text-gray-900">{listing.title || "Untitled"}</td>
                  <td className="p-3 text-gray-600">{listing.propertyType || "N/A"}</td>
                  <td className="p-3 text-gray-600">
                    {listing.agent
                      ? typeof listing.agent === "object"
                        ? listing.agent.name
                        : listing.agent
                      : "Unknown"}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded
                        ${
                          listing.status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : listing.status === "REJECTED"
                            ? "bg-red-100 text-red-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                    >
                      {listing.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => openEditPopup(listing._id)}
                      className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(listing._id)}
                      className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isOpen && selectedListing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg p-6 shadow-lg relative space-y-2">
            <h2 className="text-lg font-semibold mb-2">Update Listing</h2>

            <input
              value={selectedListing.title || ""}
              onChange={e => setSelectedListing({ ...selectedListing, title: e.target.value })}
              className="w-full p-2 border"
              placeholder="Title"
            />

            <input
              type="number"
              value={selectedListing.price || ""}
              onChange={e => setSelectedListing({ ...selectedListing, price: Number(e.target.value) })}
              className="w-full p-2 border"
              placeholder="Price"
            />

            <input
              type="number"
              value={selectedListing.size || ""}
              onChange={e => setSelectedListing({ ...selectedListing, size: Number(e.target.value) })}
              className="w-full p-2 border"
              placeholder="Size (sqft)"
            />

            <input
              type="number"
              value={selectedListing.bedrooms || ""}
              onChange={e => setSelectedListing({ ...selectedListing, bedrooms: Number(e.target.value) })}
              className="w-full p-2 border"
              placeholder="Bedrooms"
            />

            <input
              type="number"
              value={selectedListing.bathrooms || ""}
              onChange={e => setSelectedListing({ ...selectedListing, bathrooms: Number(e.target.value) })}
              className="w-full p-2 border"
              placeholder="Bathrooms"
            />

            <textarea
              value={selectedListing.description || ""}
              onChange={e => setSelectedListing({ ...selectedListing, description: e.target.value })}
              className="w-full p-2 border"
              placeholder="Description"
            />

            <div className="flex justify-end gap-2 mt-3">
              <button onClick={() => setIsOpen(false)} className="px-4 py-2 bg-gray-200">Cancel</button>
              <button
                onClick={handleUpdate}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white"
              >
                {saving ? "Saving..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
