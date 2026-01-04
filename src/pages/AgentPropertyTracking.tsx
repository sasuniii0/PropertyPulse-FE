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
            <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
            <p className="text-gray-600 text-sm mt-0.5">Manage and track your property listings</p>
          </div>
          <button
            onClick={() => navigate("/add-property")}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2.5 font-semibold transition-colors text-sm"
          >
            + Add New Property
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white shadow-sm border border-gray-100 p-5">
            <div className="text-gray-500 text-xs font-semibold mb-2">Total Properties</div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white shadow-sm border border-gray-100 p-5">
            <div className="text-green-600 text-xs font-semibold mb-2">Approved</div>
            <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
          </div>
          <div className="bg-white shadow-sm border border-gray-100 p-5">
            <div className="text-yellow-600 text-xs font-semibold mb-2">Pending</div>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          </div>
          <div className="bg-white shadow-sm border border-gray-100 p-5">
            <div className="text-red-600 text-xs font-semibold mb-2">Rejected</div>
            <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
          </div>
          <div className="bg-white shadow-sm border border-gray-100 p-5">
            <div className="text-blue-600 text-xs font-semibold mb-2">Total Inquiries</div>
            <div className="text-3xl font-bold text-blue-600">{stats.totalInquiries}</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white shadow-sm border border-gray-100 p-5">
          <div className="grid md:grid-cols-6 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Search</label>
              <input
                type="text"
                placeholder="Search by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as FilterType)}
                className="w-full px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              >
                <option value="all">All Status</option>
                <option value="APPROVED">Approved</option>
                <option value="PENDING">Pending</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            {/* Property Type Filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Property Type</label>
              <select
                value={propertyTypeFilter}
                onChange={(e) => setPropertyTypeFilter(e.target.value as PropertyTypeFilter)}
                className="w-full px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
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
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Listing Type</label>
              <select
                value={listingTypeFilter}
                onChange={(e) => setListingTypeFilter(e.target.value as ListingTypeFilter)}
                className="w-full px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              >
                <option value="all">All Listings</option>
                <option value="SALE">For Sale</option>
                <option value="RENT">For Rent</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortType)}
                className="w-full px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
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
        <div className="flex items-center justify-between">
          <p className="text-gray-600 text-sm">
            <span className="font-semibold text-gray-900">{filteredListings.length}</span> properties found
          </p>
          {(statusFilter !== "all" || propertyTypeFilter !== "all" || listingTypeFilter !== "all" || searchTerm) && (
            <button
              onClick={() => {
                setStatusFilter("all");
                setPropertyTypeFilter("all");
                setListingTypeFilter("all");
                setSearchTerm("");
              }}
              className="text-sm text-teal-600 hover:text-teal-700 font-semibold"
            >
              Clear All Filters
            </button>
          )}
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="text-center py-16 bg-white shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
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
            </div>
            <p className="text-gray-500 text-base mb-2">No properties found</p>
            <p className="text-gray-400 text-sm mb-6">
              {searchTerm || statusFilter !== "all" || propertyTypeFilter !== "all" || listingTypeFilter !== "all"
                ? "Try adjusting your filters"
                : "Start by adding your first property"}
            </p>
            <button
              onClick={() => navigate("/add-property")}
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2.5 font-semibold transition-colors text-sm"
            >
              + Add Your First Property
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

              return (
                <div
                  key={listing._id}
                  className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer group border border-gray-100"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={listing.images?.[0] ?? "/placeholder.jpg"}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Status Badge */}
                    <div
                      className={`absolute top-2 left-2 ${
                        statusColors[listing.status as keyof typeof statusColors]
                      } text-white px-2.5 py-0.5 text-xs font-semibold`}
                    >
                      {listing.status}
                    </div>
                    {/* Property Type Badge */}
                    <div className="absolute top-2 right-2 bg-teal-500 text-white px-2.5 py-0.5 text-xs font-medium capitalize">
                      {listing.propertyType}
                    </div>
                    {/* Listing Type Badge */}
                    {listing.listingType && (
                      <div className="absolute bottom-2 left-2 bg-white text-gray-900 px-2.5 py-0.5 text-xs font-semibold">
                        For {listing.listingType}
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    {/* Location */}
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                      <MapPinIcon />
                      <span className="truncate">{listing.location.address}</span>
                    </div>

                    {/* Title and Price */}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm line-clamp-1">
                          {listing.title}
                        </h3>
                        <p className="text-teal-600 font-bold text-base mt-1">
                          LKR {listing.price.toLocaleString()}
                          {listing.listingType === "RENT" && (
                            <span className="text-xs font-normal text-gray-500">/month</span>
                          )}
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

                    {/* Inquiries Info */}
                    <div className="bg-gray-50 border border-gray-200 p-3 mb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                          </svg>
                          <span className="text-xs font-semibold text-gray-700">
                            {listingInquiries.length} {listingInquiries.length === 1 ? "Inquiry" : "Inquiries"}
                          </span>
                        </div>
                        {listingInquiries.length > 0 && (
                          <button
                            onClick={() => navigate(`/inquiries/${listing._id}`)}
                            className="text-xs font-semibold text-teal-600 hover:text-teal-700"
                          >
                            View →
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          navigate(`/property/${listing._id}`);
                          window.scrollTo(0, 0);
                        }}
                        className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-2 transition-colors text-xs font-medium"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => navigate(`/edit-property/${listing._id}`)}
                        className="bg-teal-500 hover:bg-teal-600 text-white py-2 transition-colors text-xs font-medium"
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