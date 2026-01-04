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
      // Status filter
      if (statusFilter !== "all" && listing.status !== statusFilter) return false;
      
      // Property type filter
      if (propertyTypeFilter !== "all" && listing.propertyType !== propertyTypeFilter) return false;
      
      // Listing type filter
      if (listingTypeFilter !== "all" && listing.listingType !== listingTypeFilter) return false;
      
      // Search filter
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
      <div className="w-full h-screen flex justify-center items-center text-gray-700 text-xl font-semibold">
        Loading agent data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
            <p className="text-gray-600 text-sm mt-1">Manage and track your property listings</p>
          </div>
          <button
            onClick={() => navigate("/add-property")}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Property
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <div className="text-gray-500 text-xs font-medium uppercase tracking-wide">Total Properties</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</div>
          </div>
          <div className="bg-green-50 p-5 rounded-lg shadow-sm border border-green-100">
            <div className="text-green-700 text-xs font-medium uppercase tracking-wide">Approved</div>
            <div className="text-3xl font-bold text-green-700 mt-2">{stats.approved}</div>
          </div>
          <div className="bg-yellow-50 p-5 rounded-lg shadow-sm border border-yellow-100">
            <div className="text-yellow-700 text-xs font-medium uppercase tracking-wide">Pending</div>
            <div className="text-3xl font-bold text-yellow-700 mt-2">{stats.pending}</div>
          </div>
          <div className="bg-red-50 p-5 rounded-lg shadow-sm border border-red-100">
            <div className="text-red-700 text-xs font-medium uppercase tracking-wide">Rejected</div>
            <div className="text-3xl font-bold text-red-700 mt-2">{stats.rejected}</div>
          </div>
          <div className="bg-blue-50 p-5 rounded-lg shadow-sm border border-blue-100">
            <div className="text-blue-700 text-xs font-medium uppercase tracking-wide">Total Inquiries</div>
            <div className="text-3xl font-bold text-blue-700 mt-2">{stats.totalInquiries}</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search properties by title, location, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-3">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <div className="flex gap-2">
                {(["all", "APPROVED", "PENDING", "REJECTED"] as FilterType[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      statusFilter === status
                        ? "bg-teal-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status === "all" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Property Type Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Type:</span>
              <select
                value={propertyTypeFilter}
                onChange={(e) => setPropertyTypeFilter(e.target.value as PropertyTypeFilter)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Types</option>
                <option value="HOUSE">House</option>
                <option value="APARTMENT">Apartment</option>
                <option value="LAND">Land</option>
                <option value="COMMERCIAL">Commercial</option>
                <option value="VILLA">Villa</option>
              </select>
            </div>

            {/* Listing Type Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Listing:</span>
              <div className="flex gap-2">
                {(["all", "SALE", "RENT"] as ListingTypeFilter[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setListingTypeFilter(type)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      listingTypeFilter === type
                        ? "bg-teal-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {type === "all" ? "All" : type.charAt(0) + type.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm font-medium text-gray-700">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortType)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-teal-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
                <option value="inquiries">Most Inquiries</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredListings.length}</span> of{" "}
            <span className="font-semibold">{listings.length}</span> properties
          </p>
          {(statusFilter !== "all" || propertyTypeFilter !== "all" || listingTypeFilter !== "all" || searchTerm) && (
            <button
              onClick={() => {
                setStatusFilter("all");
                setPropertyTypeFilter("all");
                setListingTypeFilter("all");
                setSearchTerm("");
              }}
              className="text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              Clear All Filters
            </button>
          )}
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-100">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <p className="text-gray-500 text-base mb-2">No properties found</p>
            <p className="text-gray-400 text-sm mb-6">
              {searchTerm || statusFilter !== "all" || propertyTypeFilter !== "all" || listingTypeFilter !== "all"
                ? "Try adjusting your filters"
                : "Start by adding your first property"}
            </p>
            <button
              onClick={() => navigate("/add-property")}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Your First Property
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {filteredListings.map((listing) => {
              const listingInquiries = inquiries.filter((inq) => inq.listing === listing._id);
              const statusColors = {
                APPROVED: "bg-green-500",
                PENDING: "bg-yellow-500",
                REJECTED: "bg-red-500",
              };
              const statusTextColors = {
                APPROVED: "text-green-700 bg-green-50 border-green-200",
                PENDING: "text-yellow-700 bg-yellow-50 border-yellow-200",
                REJECTED: "text-red-700 bg-red-50 border-red-200",
              };

              return (
                <div
                  key={listing._id}
                  className="bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 rounded-lg overflow-hidden group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={listing.images?.[0] ?? "/placeholder.jpg"}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* Status Badge */}
                    <div
                      className={`absolute top-3 left-3 ${
                        statusColors[listing.status as keyof typeof statusColors]
                      } text-white px-3 py-1 text-xs font-semibold rounded-full shadow-lg`}
                    >
                      {listing.status}
                    </div>
                    {/* Property Type Badge */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 text-xs font-medium rounded-full">
                      {listing.propertyType}
                    </div>
                    {/* Listing Type Badge */}
                    <div className="absolute bottom-3 left-3 bg-teal-600 text-white px-3 py-1 text-xs font-semibold rounded-full">
                      For {listing.listingType}
                    </div>
                  </div>

                  <div className="p-5">
                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                      <MapPinIcon />
                      <span className="truncate">{listing.location.address}</span>
                    </div>

                    {/* Title and Price */}
                    <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-1">
                      {listing.title}
                    </h3>
                    <p className="text-teal-600 font-bold text-xl mb-3">
                      LKR {listing.price.toLocaleString()}
                      {listing.listingType === "RENT" && (
                        <span className="text-sm font-normal text-gray-500">/month</span>
                      )}
                    </p>

                    {/* Property Details */}
                    {(listing.bedrooms > 0 || listing.size) && (
                      <div className="flex gap-4 text-gray-600 text-sm mb-4 pb-4 border-b border-gray-100">
                        {listing.bedrooms > 0 && (
                          <>
                            <span className="flex items-center gap-1.5">
                              <BedIcon /> {listing.bedrooms} Beds
                            </span>
                            <span className="flex items-center gap-1.5">
                              <BathIcon /> {listing.bathrooms} Baths
                            </span>
                          </>
                        )}
                        {listing.size && (
                          <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                              />
                            </svg>
                            {listing.size} sqft
                          </span>
                        )}
                      </div>
                    )}

                    {/* Inquiries and Actions */}
                    <div className="space-y-3">
                      <div
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          statusTextColors[listing.status as keyof typeof statusTextColors]
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                          </svg>
                          <span className="text-sm font-semibold">
                            {listingInquiries.length} {listingInquiries.length === 1 ? "Inquiry" : "Inquiries"}
                          </span>
                        </div>
                        {listingInquiries.length > 0 && (
                          <button
                            onClick={() => navigate(`/inquiries/${listing._id}`)}
                            className="text-xs font-medium hover:underline"
                          >
                            View All →
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => navigate(`/property/${listing._id}`)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg transition-colors text-sm font-medium"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => navigate(`/edit-property/${listing._id}`)}
                          className="bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-lg transition-colors text-sm font-medium"
                        >
                          Edit
                        </button>
                      </div>
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