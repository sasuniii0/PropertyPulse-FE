import { useState, useEffect } from "react";
import { MapPinIcon, BedIcon, BathIcon } from "../components/Icons";
import { useAuth } from "../context/AuthContext";
import { getAgentListingsAPI, getInquiriesByAgentAPI } from "../services/Listning";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type FilterType = "all" | "PENDING" | "APPROVED" | "REJECTED";
type PropertyTypeFilter = "all" | "HOUSE" | "APARTMENT" | "LAND" | "COMMERCIAL" | "VILLA";
type ListingTypeFilter = "all" | "SALE" | "RENT";
type SortType = "newest" | "oldest" | "price-high" | "price-low" | "inquiries";

export default function AgentProperties() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<FilterType>("all");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<PropertyTypeFilter>("all");
  const [listingTypeFilter, setListingTypeFilter] = useState<ListingTypeFilter>("all");
  const [sortBy, setSortBy] = useState<SortType>("newest");
  const [searchTerm, setSearchTerm] = useState("");

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

  // Calculate statistics
  const stats = {
    total: listings.length,
    approved: listings.filter((l) => l.status === "APPROVED").length,
    pending: listings.filter((l) => l.status === "PENDING").length,
    rejected: listings.filter((l) => l.status === "REJECTED").length,
    totalInquiries: inquiries.length,
  };

  // Filter and sort listings
  const filteredListings = listings
    .filter((listing) => {
      if (statusFilter !== "all" && listing.status !== statusFilter) return false;
      if (propertyTypeFilter !== "all" && listing.propertyType !== propertyTypeFilter) return false;
      if (listingTypeFilter !== "all" && listing.listingType !== listingTypeFilter) return false;
      
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          listing.title.toLowerCase().includes(search) ||
          listing.location.address.toLowerCase().includes(search) ||
          listing.description?.toLowerCase().includes(search)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "price-high":
          return b.price - a.price;
        case "price-low":
          return a.price - b.price;
        case "inquiries": {
          const aInq = inquiries.filter((inq) => inq.listing === a._id).length;
          const bInq = inquiries.filter((inq) => inq.listing === b._id).length;
          return bInq - aInq;
        }
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-gray-900 text-xl font-bold uppercase tracking-wide">
        Loading Agent Data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-8 py-12 space-y-8">
        {/* Header */}
        <div className="border-b-2 border-gray-900 pb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 uppercase tracking-tight mb-2">
                Property Management
              </h1>
              <p className="text-gray-600 text-sm uppercase tracking-wide">
                Track and Manage Your Listings
              </p>
            </div>
            <button
              onClick={() => navigate("/add-property")}
              className="border-2 border-gray-900 bg-gray-900 text-white font-bold py-3 px-8 uppercase tracking-wide hover:bg-gray-800 transition-colors"
            >
              + Add Property
            </button>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-white border-2 border-gray-900 p-6">
            <div className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-2">
              Total Properties
            </div>
            <div className="text-4xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white border-2 border-green-600 p-6">
            <div className="text-green-600 text-xs font-bold uppercase tracking-wider mb-2">
              Approved
            </div>
            <div className="text-4xl font-bold text-green-600">{stats.approved}</div>
          </div>
          <div className="bg-white border-2 border-yellow-600 p-6">
            <div className="text-yellow-600 text-xs font-bold uppercase tracking-wider mb-2">
              Pending
            </div>
            <div className="text-4xl font-bold text-yellow-600">{stats.pending}</div>
          </div>
          <div className="bg-white border-2 border-red-600 p-6">
            <div className="text-red-600 text-xs font-bold uppercase tracking-wider mb-2">
              Rejected
            </div>
            <div className="text-4xl font-bold text-red-600">{stats.rejected}</div>
          </div>
          <div className="bg-white border-2 border-blue-600 p-6">
            <div className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-2">
              Inquiries
            </div>
            <div className="text-4xl font-bold text-blue-600">{stats.totalInquiries}</div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white border-2 border-gray-900 p-6 space-y-6">
          {/* Search Bar */}
          <div>
            <input
              type="text"
              placeholder="SEARCH PROPERTIES..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-2 border-gray-900 px-4 py-3 font-medium uppercase tracking-wide focus:outline-none focus:border-teal-600"
            />
          </div>

          {/* Filter Controls */}
          <div className="space-y-4">
            {/* Status Filter */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-gray-900 uppercase tracking-wide min-w-[100px]">
                Status:
              </span>
              <div className="flex gap-2">
                {(["all", "APPROVED", "PENDING", "REJECTED"] as FilterType[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-6 py-2 text-xs font-bold uppercase tracking-wide transition-colors border-2 ${
                      statusFilter === status
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-900 border-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {status === "all" ? "All" : status}
                  </button>
                ))}
              </div>
            </div>

            {/* Property Type & Listing Type */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-gray-900 uppercase tracking-wide min-w-[100px]">
                Filters:
              </span>
              <select
                value={propertyTypeFilter}
                onChange={(e) => setPropertyTypeFilter(e.target.value as PropertyTypeFilter)}
                className="border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase tracking-wide focus:outline-none focus:border-teal-600"
              >
                <option value="all">All Types</option>
                <option value="HOUSE">House</option>
                <option value="APARTMENT">Apartment</option>
                <option value="LAND">Land</option>
                <option value="COMMERCIAL">Commercial</option>
                <option value="VILLA">Villa</option>
              </select>

              <select
                value={listingTypeFilter}
                onChange={(e) => setListingTypeFilter(e.target.value as ListingTypeFilter)}
                className="border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase tracking-wide focus:outline-none focus:border-teal-600"
              >
                <option value="all">All Listings</option>
                <option value="SALE">For Sale</option>
                <option value="RENT">For Rent</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortType)}
                className="border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase tracking-wide focus:outline-none focus:border-teal-600 ml-auto"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
                <option value="inquiries">Most Inquiries</option>
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex justify-between items-center pt-4 border-t-2 border-gray-900">
            <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">
              Showing {filteredListings.length} of {listings.length} Properties
            </p>
            {(statusFilter !== "all" || propertyTypeFilter !== "all" || listingTypeFilter !== "all" || searchTerm) && (
              <button
                onClick={() => {
                  setStatusFilter("all");
                  setPropertyTypeFilter("all");
                  setListingTypeFilter("all");
                  setSearchTerm("");
                }}
                className="text-sm text-gray-900 font-bold uppercase tracking-wide hover:underline"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="text-center py-20 bg-white border-2 border-gray-900">
            <svg
              className="w-20 h-20 text-gray-300 mx-auto mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="square"
                strokeLinejoin="miter"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <p className="text-gray-500 text-lg font-bold uppercase tracking-wide mb-2">
              No Properties Found
            </p>
            <p className="text-gray-400 text-sm uppercase tracking-wide mb-8">
              {searchTerm || statusFilter !== "all" || propertyTypeFilter !== "all" || listingTypeFilter !== "all"
                ? "Try Adjusting Your Filters"
                : "Start By Adding Your First Property"}
            </p>
            <button
              onClick={() => navigate("/add-property")}
              className="border-2 border-gray-900 bg-gray-900 text-white font-bold py-3 px-8 uppercase tracking-wide hover:bg-gray-800 transition-colors"
            >
              + Add Property
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filteredListings.map((listing) => {
              const listingInquiries = inquiries.filter((inq) => inq.listing === listing._id);
              const statusColors = {
                APPROVED: "border-green-600 bg-green-600",
                PENDING: "border-yellow-600 bg-yellow-600",
                REJECTED: "border-red-600 bg-red-600",
              };

              return (
                <div key={listing._id} className="bg-white border-2 border-gray-900 overflow-hidden">
                  {/* Image Section */}
                  <div className="relative h-56 overflow-hidden bg-gray-200">
                    <img
                      src={listing.images?.[0] ?? "/placeholder.jpg"}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Status Badge */}
                    <div
                      className={`absolute top-0 left-0 ${
                        statusColors[listing.status as keyof typeof statusColors]
                      } text-white px-4 py-2 text-xs font-bold uppercase tracking-wider`}
                    >
                      {listing.status}
                    </div>
                    {/* Property Type Badge */}
                    <div className="absolute top-0 right-0 bg-white text-gray-900 border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase tracking-wider">
                      {listing.propertyType}
                    </div>
                    {/* Listing Type Badge */}
                    <div className="absolute bottom-0 left-0 bg-teal-600 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider">
                      For {listing.listingType}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 space-y-4">
                    {/* Location */}
                    <div className="flex items-center gap-2 text-xs text-gray-600 uppercase tracking-wide">
                      <MapPinIcon />
                      <span className="truncate font-medium">{listing.location.address}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-gray-900 text-lg uppercase tracking-tight line-clamp-1">
                      {listing.title}
                    </h3>

                    {/* Price */}
                    <div className="border-t-2 border-b-2 border-gray-900 py-3">
                      <p className="text-gray-900 font-bold text-2xl">
                        LKR {listing.price.toLocaleString()}
                        {listing.listingType === "RENT" && (
                          <span className="text-sm font-normal text-gray-600">/month</span>
                        )}
                      </p>
                    </div>

                    {/* Property Details */}
                    {(listing.bedrooms > 0 || listing.size) && (
                      <div className="flex gap-4 text-gray-600 text-sm font-medium uppercase tracking-wide">
                        {listing.bedrooms > 0 && (
                          <>
                            <span className="flex items-center gap-1.5">
                              <BedIcon /> {listing.bedrooms}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <BathIcon /> {listing.bathrooms}
                            </span>
                          </>
                        )}
                        {listing.size && (
                          <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="square"
                                strokeLinejoin="miter"
                                strokeWidth={2}
                                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                              />
                            </svg>
                            {listing.size} sqft
                          </span>
                        )}
                      </div>
                    )}

                    {/* Inquiries */}
                    <div className="bg-gray-100 border-2 border-gray-900 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="square"
                              strokeLinejoin="miter"
                              strokeWidth={2}
                              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                          </svg>
                          <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                            {listingInquiries.length} {listingInquiries.length === 1 ? "Inquiry" : "Inquiries"}
                          </span>
                        </div>
                        {listingInquiries.length > 0 && (
                          <button
                            onClick={() => navigate(`/inquiries/${listing._id}`)}
                            className="text-xs font-bold uppercase tracking-wide text-gray-900 hover:underline"
                          >
                            View →
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => navigate(`/property/${listing._id}`)}
                        className="border-2 border-gray-900 bg-white text-gray-900 font-bold py-3 uppercase tracking-wide text-xs hover:bg-gray-100 transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/edit-property/${listing._id}`)}
                        className="border-2 border-gray-900 bg-gray-900 text-white font-bold py-3 uppercase tracking-wide text-xs hover:bg-gray-800 transition-colors"
                      >
                        Edit
                      </button>
                    </div>
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