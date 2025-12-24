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

  const [selectedListingView, setSelectedListingView] = useState<EdiitListningData | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

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

    // VIEW popup when row clicked
    const openViewPopup = async (id: string) => {
    if (!user) return;
    try {
        const res = await getListingByIdAdminAPI(id, user.token);
        setSelectedListingView(res.data.data);
        setViewModalOpen(true);
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
            {listings.map(listing => (
                <tr
                key={listing._id}
                className="border-t hover:bg-gray-50 transition cursor-pointer"
                onClick={() => openViewPopup(listing._id)}
                >
                <td className="p-3 font-medium text-gray-900">{listing.title || "Untitled"}</td>
                <td className="p-3 text-gray-600">{listing.propertyType || "N/A"}</td>
                <td className="p-3 text-gray-600">
                    {listing.agent ? typeof listing.agent === "object" ? listing.agent.name : listing.agent : "Unknown"}
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
                    onClick={(e) => {
                        e.stopPropagation(); // prevent row click
                        openEditPopup(listing._id);
                    }}
                    className="px-3 py-1.5 bg-teal-500 hover:bg-yellow-600 text-white text-xs"
                    >
                    Edit
                    </button>
                    <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(listing._id);
                    }}
                    className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs"
                    >
                    Delete
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
      </div>

      {/* View Modal */}
{viewModalOpen && selectedListingView && (
  <div 
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    onClick={() => setViewModalOpen(false)}
  >
    <div 
      className="bg-white w-full max-w-6xl shadow-2xl flex flex-col overflow-hidden"
      style={{ maxHeight: "90vh" }}
      onClick={(e) => e.stopPropagation()}
    >
      
      {/* Header - Fixed */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedListingView.title || "Property Details"}
          </h2>
          {selectedListingView.price && (
            <p className="text-2xl font-bold text-teal-600 mt-1">
              ${selectedListingView.price.toLocaleString()}
            </p>
          )}
        </div>
        <button
          onClick={() => setViewModalOpen(false)}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        
        {/* Images Gallery */}
        {selectedListingView.images && selectedListingView.images.length > 0 && (
          <div className="mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {selectedListingView.images.map((img, idx) => (
                <div 
                  key={idx}
                  className="relative aspect-video overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-shadow"
                >
                  <img
                    src={img}
                    alt={`Property view ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 border border-teal-200">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs font-medium text-teal-700 uppercase">Type</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{selectedListingView.propertyType || "N/A"}</p>
          </div>

          <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 border border-teal-200">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span className="text-xs font-medium text-teal-700 uppercase">Size</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{selectedListingView.size ? `${selectedListingView.size} sqft` : "N/A"}</p>
          </div>

          <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 border border-teal-200">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs font-medium text-teal-700 uppercase">Bedrooms</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{selectedListingView.bedrooms || "N/A"}</p>
          </div>

          <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 border border-teal-200">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
              </svg>
              <span className="text-xs font-medium text-teal-700 uppercase">Bathrooms</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{selectedListingView.bathrooms || "N/A"}</p>
          </div>
        </div>

        {/* Description */}
        {selectedListingView.description && (
          <div className="bg-gray-50 p-5 border border-gray-200 mb-6">
            <h3 className="font-semibold text-lg mb-3 text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed">{selectedListingView.description}</p>
          </div>
        )}

        {/* Location */}
        {selectedListingView.location && (
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-5 border border-slate-200">
            <h3 className="font-semibold text-lg mb-3 text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Location
            </h3>
            <p className="text-gray-700 font-medium mb-1">{selectedListingView.location.address || "Address not available"}</p>
            <p className="text-sm text-gray-500">
              Coordinates: {selectedListingView.location.lat || "N/A"}, {selectedListingView.location.lng || "N/A"}
            </p>
          </div>
        )}
      </div>

      {/* Footer - Fixed */}
      <div className="flex justify-between items-center gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={() => {/* Add to favorites logic */}}
          className="px-6 py-2.5 border-2 border-gray-300 hover:border-teal-400 font-medium text-gray-700 hover:bg-white hover:text-teal-600 transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Save
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => setViewModalOpen(false)}
            className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 font-medium text-gray-800 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {/* Contact logic */}}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 font-medium text-white transition-colors shadow-lg shadow-teal-600/30"
          >
            Contact Agent
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      {/* Edit Modal */}
        {isOpen && selectedListing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-6xl p-6 shadow-lg rounded-lg overflow-y-auto max-h-[90vh] space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Update Listing</h2>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                    value={selectedListing.title || ""}
                    onChange={e => setSelectedListing({ ...selectedListing, title: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    placeholder="Title"
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                <select
                    value={selectedListing.propertyType || ""}
                    onChange={e => setSelectedListing({ ...selectedListing, propertyType: e.target.value })}
                    className="w-full p-2 border rounded-md"
                >
                    <option value="HOUSE">House</option>
                    <option value="APARTMENT">Apartment</option>
                    <option value="LAND">Land</option>
                </select>
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                    type="number"
                    value={selectedListing.price || ""}
                    onChange={e => setSelectedListing({ ...selectedListing, price: Number(e.target.value) })}
                    className="w-full p-2 border rounded-md"
                    placeholder="Price"
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Size (sqft)</label>
                <input
                    type="number"
                    value={selectedListing.size || ""}
                    onChange={e => setSelectedListing({ ...selectedListing, size: Number(e.target.value) })}
                    className="w-full p-2 border rounded-md"
                    placeholder="Size"
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                <input
                    type="number"
                    value={selectedListing.bedrooms || ""}
                    onChange={e => setSelectedListing({ ...selectedListing, bedrooms: Number(e.target.value) })}
                    className="w-full p-2 border rounded-md"
                    placeholder="Bedrooms"
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                <input
                    type="number"
                    value={selectedListing.bathrooms || ""}
                    onChange={e => setSelectedListing({ ...selectedListing, bathrooms: Number(e.target.value) })}
                    className="w-full p-2 border rounded-md"
                    placeholder="Bathrooms"
                />
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                value={selectedListing.description || ""}
                onChange={e => setSelectedListing({ ...selectedListing, description: e.target.value })}
                className="w-full p-2 border rounded-md min-h-[80px]"
                placeholder="Description"
                />
            </div>

            {/* Images Upload (Optional) */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                <input
                type="file"
                multiple
                onChange={e => {
                    const files = e.target.files ? Array.from(e.target.files) : [];
                    setSelectedListing({ ...selectedListing, newImages: files });
                }}
                className="w-full p-2 border rounded-md"
                />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-4">
                <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-md"
                >
                Cancel
                </button>
                <button
                onClick={handleUpdate}
                disabled={saving}
                className="px-4 py-2 bg-teal-600 text-white rounded-md"
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
