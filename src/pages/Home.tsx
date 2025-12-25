import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ActionCard from "../components/ActionCard";
import StatCard from "../components/StatCard";
import InquiryCard from "../components/InquiryCard";
import ActivityCard from "../components/ActivityCard";
import { useState , useEffect } from "react";
import { approveListingAPI, rejectListingAPI , getPendingListings, fetchLocationApi} from "../services/Admin";
import type { ListingData} from "../services/Admin";
import { SettingsIcon , HomeIcon,PulseIcon,SearchIcon,HeartIcon,PlusIcon,HomeIconSmall,EditIcon,ChartIcon,UserIcon,BedIcon,BathIcon,MapPinIcon } from "../components/Icons";
import toast from "react-hot-toast";
import { getAllListingsAPI, getApprovedListingsAPI, getMyListningsAPI, type EdiitListningData } from "../services/Listning";
import SavedPropertiesMap from "../components/SavedPropertiesMap"; 
import type { Property } from "../components/SavedPropertiesMap";
import type {UserData} from '../services/User'
import {getRecentUsers} from '../services/Admin'
import {fetchLocationApiClient} from '../services/Listning'
import type {AgentPaymentData } from '../components/PaymentPopup'
import { PaymentPopup } from "../components/PaymentPopup";

export default function Home() {
  const { user, loading } = useAuth();
  const [pendingListings, setPendingListings] = useState<ListingData[]>([]);
  const [myListings, setMyListings] = useState<EdiitListningData[]>([]);
  const [, setProperties] = useState<EdiitListningData[]>([]);
  const [approvedListings, setApprovedListings] = useState<EdiitListningData[]>([]);
  const [preview, ] = useState<string | null>(null);
  const [recentUsers, setRecentUsers] = useState<UserData[]>([]);
  const [location, setLocation] = useState<Property[]>([]);
  const [clientLocations, setClientLocations] = useState<Property[]>([]);

  // Payment related states
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [agentPaymentData, setAgentPaymentData] = useState<AgentPaymentData | null>(null);

  const navigate = useNavigate();

  // Check payment status for agents
  useEffect(() => {
    if (!user || user.role !== "AGENT") return;

    const checkPaymentStatus = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/agent/payment-status', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        
        const data = await response.json();
        
        setAgentPaymentData(data);
        
        // Check if should show popup (not dismissed this session)
        const popupDismissed = sessionStorage.getItem('paymentPopupDismissed');
        
        if ((data.paymentStatus === 'expired' || data.paymentStatus === 'due_soon') && !popupDismissed) {
          setShowPaymentPopup(true);
        }
        
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    };

    checkPaymentStatus();
  }, [user]);

  useEffect(() => {
  const getLocations = async () => {
    try {
      const token = localStorage.getItem("accessToken"); 
      if (!token) throw new Error("No token found");

      const data = await fetchLocationApi(token);
      setLocation(data);

      const clientData = await fetchLocationApiClient(token);
      setClientLocations(clientData);
    } catch (err) {
      console.error("Failed to fetch locations in component:", err);
    }
  };

  getLocations();
}, []);

useEffect(() => {
  const fetchRecentUsers = async () => {
    if (!user) return;

    try {
      const users = await getRecentUsers(user.token);
      setRecentUsers(users);
    } catch (error) {
      console.error("Failed to fetch recent users:", error);
    }
  };

  fetchRecentUsers();
}, [user]);

   useEffect(() => {
    if (!user) return;

    const fetchListings = async () => {
      try {
        const res = await getPendingListings(user.token);
        if (!user.token) {
          throw new Error("No access token");
        }
        if (res.data && Array.isArray(res.data.data)) {
          setPendingListings(res.data.data);
        } else {
          console.warn("Unexpected response:", res.data);
        }
      } catch (error) {
        console.error("Failed to fetch pending listings:", error);
      }
    };

    fetchListings();
  }, [user]);

    const fetchPendingListings = async () => {
    if (!user) return;
    try {
      const res = await getPendingListings(user.token);
      if (res.data && Array.isArray(res.data.data)) {
        setPendingListings(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch pending listings:", error);
    }
  };

  const handleApprove = async (id: string) => {
    if (!user) return;

    try {
      await approveListingAPI(id, user.token);
      setPendingListings(prev => prev.filter(item => item._id !== id));
      toast.success("Listing Approved!");
      fetchPendingListings(); // refresh UI
    } catch (err) {
      console.error("Approval failed:", err);
      toast.error("Approval failed!");
    }
  };

  const handleReject = async (id: string) => {
    if (!user) return;

    try {
      await rejectListingAPI(id, user.token);
      setPendingListings(prev => prev.filter(item => item._id !== id));
      toast.success("Listing Rejected!");
      fetchPendingListings();
    } catch (err) {
      console.error("Rejection failed:", err);
      toast.error("Rejection failed!");
    }
  };

    useEffect(() => {
    if (!user) return;

    const loadAvailableProperties = async () => {
        try {
          const res = await getAllListingsAPI(user.token);
          if (res.data && Array.isArray(res.data.data)) {
            setProperties(res.data.data); // <- set all listings for client
          } else {
            console.warn("Unexpected response from getAllListingsAPI:", res.data);
          }
        } catch (err) {
          console.error("Failed to load available properties:", err);
        }
      };

      loadAvailableProperties();
    }, [user]);

    useEffect(() => {
      if (!user) return;

      const loadAgentListings = async () => {
        if (user.role === "AGENT") {
          try {
            const res = await getMyListningsAPI(user.token);
            if (res.data && Array.isArray(res.data.data)) {
              setMyListings(res.data.data); // <- only agent listings
            }
          } catch (err) {
            console.error("Failed to load agent listings:", err);
          }
        }
      };

      loadAgentListings();
    }, [user]);

    useEffect(() => {
      if (!user) return;
      const loadApprovedListings = async () => {
        try {
          const data = await getApprovedListingsAPI(user.token);
          setApprovedListings(data);
        } catch (err) {
          console.error("Failed to fetch approved listings:", err);
        }
      };
      loadApprovedListings();
    }, [user]);

    const topAgents = [
      {
        rank: 1,
        name: "Nimal Perera",
        sales: 34,
        value: "150M",
        badge: "🥇",
      },
    ];

    useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handlePayNow = () => {
    // Navigate to payment page
    navigate('/payment', { state: { agentData: agentPaymentData } });
  };

  const handleClosePaymentPopup = () => {
    // Only allow closing if not expired
    if (agentPaymentData && agentPaymentData.paymentDaysRemaining > 0) {
      setShowPaymentPopup(false);
      // Set flag to not show again this session
      sessionStorage.setItem('paymentPopupDismissed', 'true');
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-gray-700 text-xl font-semibold">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-gray-700 text-xl font-semibold">
        Unauthorized — please log in.
      </div>
    );
  }
  

  // CLIENT DASHBOARD
  if (user.role === "CLIENT") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          {/* Welcome Section */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
            <p className="text-gray-600 text-sm mt-0.5">Find your dream property today</p>
          </div>

          {/* Map Section */}
          <section className="bg-white shadow-sm border border-gray-100 p-5 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Property Locations Map</h2>
            <SavedPropertiesMap properties={clientLocations} />
          </section>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-4 gap-4">
            <ActionCard icon={<SearchIcon />} title="Search Properties" desc="Browse all listings" color="bg-teal-100" onClick={() => navigate("/search")} />
            <ActionCard icon={<HeartIcon />} title="Saved Properties" desc="View your favorites" color="bg-red-100" onClick={() => navigate("/favourites")}/>
            <ActionCard icon={<UserIcon />} title="My Profile" desc="Update your details" color="bg-blue-100" onClick={() => navigate("/editme")}/>
            <ActionCard icon={<HomeIconSmall />} title="My Inquiries" desc="Track your requests" color="bg-purple-100" onClick={() => navigate("/inquaries")}/>
          </div>

          {/* Available Properties */}
          <div className="bg-white shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Available Properties</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {approvedListings.map((p) => (
                <div 
                  key={p._id} 
                  className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer group border border-gray-100"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img 
                      src={p.images && p.images.length > 0 
                          ? p.images[0] 
                          : "/placeholder.png"} 
                      alt={p.title || "Property Image"} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/placeholder.png";
                      }}
                    />
                  </div>
                  {preview && (
                    <div className="mt-4 w-48 h-48 border border-gray-200 overflow-hidden">
                      <img 
                        src={preview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/placeholder.png";
                        }}
                      />
                    </div>
                  )}

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

          {/* Market Overview */}
          <div className="bg-white shadow-sm border border-gray-100 p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <PulseIcon /> Market Overview
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              <StatCard label="Properties Available" value="452" />
              <StatCard label="Average Price" value="LKR 320M" />
              <StatCard label="New Listings This Week" value="38" />
            </div>
          </div>

          {/* Recent Inquiries */}
          <div className="bg-white shadow-sm border border-gray-100 p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Your Recent Inquiries</h2>
            <div className="space-y-3">
              <InquiryCard name="Oceanview Apartment" date="2 days ago" />
              <InquiryCard name="Lakeside Villa" date="5 days ago" />
              <InquiryCard name="City Center Studio" date="1 week ago" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if(user.role === "ADMIN"){
    return(
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Control Panel</h1>
          <p className="text-gray-600 text-sm mt-0.5">Monitor and manage the entire platform</p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 shadow-sm text-white">
            <div className="text-2xl font-bold">1,248</div>
            <div className="text-blue-100 text-xs mt-1">Total Users</div>
            <div className="text-xs text-blue-200 mt-2">↑ 12% this month</div>
          </div>
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-5 shadow-sm text-white">
            <div className="text-2xl font-bold">452</div>
            <div className="text-teal-100 text-xs mt-1">Active Listings</div>
            <div className="text-xs text-teal-200 mt-2">↑ 8% this month</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-5 shadow-sm text-white">
            <div className="text-2xl font-bold">89</div>
            <div className="text-purple-100 text-xs mt-1">Active Agents</div>
            <div className="text-xs text-purple-200 mt-2">↑ 5% this month</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-5 shadow-sm text-white">
            <div className="text-2xl font-bold">23</div>
            <div className="text-orange-100 text-xs mt-1">Pending Approvals</div>
            <div className="text-xs text-orange-200 mt-2">Requires attention</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 shadow-sm text-white">
            <div className="text-2xl font-bold">156</div>
            <div className="text-green-100 text-xs mt-1">Sales This Month</div>
            <div className="text-xs text-green-200 mt-2">↑ 18% vs last month</div>
          </div>
        </div>

        {/* Map Section */}
        <section className="bg-white shadow-sm border border-gray-100 p-5 rounded-lg">
          <h2 className="text-lg font-bold mb-4">Property Locations Map</h2>
          <SavedPropertiesMap properties={location} />
        </section>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4">
          <ActionCard 
            icon={<UserIcon />} 
            title="Manage Users" 
            desc="View all users & roles" 
            color="bg-blue-100"
            onClick={() => navigate("/admin/manage-users")} 
          />
          <ActionCard 
            icon={<HomeIcon />} 
            title="Property Approvals" 
            desc="Review pending listings" 
            color="bg-orange-100" 
          />
          <ActionCard 
            icon={<ChartIcon />} 
            title="Platform Analytics" 
            desc="View detailed reports" 
            color="bg-purple-100" 
          />
          <ActionCard 
            icon={<SettingsIcon />} 
            title="System Settings" 
            desc="Configure platform" 
            color="bg-gray-100" 
          />
        </div>

        {/* Pending Approvals Section */}
        <div className="bg-white shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="bg-orange-500 text-white w-5 h-5 flex items-center justify-center text-xs">
                {pendingListings.length}
              </span>
              Pending Property Approvals
            </h2>
            <button className="text-teal-600 text-xs font-medium hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-2">
            {pendingListings.map((listing) => (
              <div
                key={listing._id}
                className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {listing.title || "Untitled Listing"}
                  </h3>
                  <p className="text-xs text-gray-500">
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
                    className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium"
                    onClick={() => handleApprove(listing._id)}
                  >
                    Approve
                  </button>

                  <button
                    className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium"
                    onClick={() => handleReject(listing._id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users & Activity Grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Recent User Registrations */}
          <div className="bg-white shadow-sm border border-gray-100 p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Recent User Registrations</h2>
            <div className="space-y-2">
              {recentUsers.map((user) => (
                <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-xs">{user.name}</h3>
                    </div>-
                    <div>
                      <h5 className="font-semibold text-gray-900 text-xs">{user.role}</h5>
                    </div>
                  </div>
                  <span
                  className={`text-xs px-2 py-1 rounded ${
                    user.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {user.isActive ? "active" : "pending"}
                </span>
                </div>
              ))}
            </div>
          </div>

          {/* System Activity */}
          <div className="bg-white shadow-sm border border-gray-100 p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4">System Activity Log</h2>
            <div className="space-y-2">
              <ActivityCard 
                activity="New agent registration: Priya Fernando" 
                time="1 hour ago" 
              />
              <ActivityCard 
                activity="Property listing approved: Marine Drive Suite" 
                time="2 hours ago" 
              />
              <ActivityCard 
                activity="User reported: Spam listing flagged" 
                time="4 hours ago" 
              />
              <ActivityCard 
                activity="Payment processed: LKR 2.5M transaction" 
                time="6 hours ago" 
              />
            </div>
          </div>
        </div>

        {/* Platform Statistics */}
        <div className="bg-white shadow-sm border border-gray-100 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <PulseIcon /> Platform Statistics
          </h2>
          <div className="grid md:grid-cols-4 gap-5">
            <StatCard label="Total Revenue" value="LKR 45.2M" />
            <StatCard label="Active Sessions" value="326" />
            <StatCard label="Avg. Response Time" value="2.3 mins" />
            <StatCard label="Customer Satisfaction" value="4.8/5.0" />
          </div>
        </div>

        {/* Top Performing Agents */}
        <div className="bg-white shadow-sm border border-gray-100 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Top Performing Agents</h2>
          <div className="space-y-2">
            {topAgents.map((agent, index) => (
              <div 
                key={agent.rank} 
                className={`flex items-center justify-between p-3 border ${
                  index === 0 
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-xl font-bold">{agent.badge}</div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{agent.name}</h3>
                    <p className="text-xs text-gray-600">
                      {agent.sales} sales • LKR {agent.value} total value
                    </p>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-medium">
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
    )
  }

  // AGENT DASHBOARD
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* Payment Popup */}
      <PaymentPopup
        isOpen={showPaymentPopup}
        onClose={handleClosePaymentPopup}
        agentData={agentPaymentData}
        onPayNow={handlePayNow}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
          <p className="text-gray-600 text-sm mt-0.5">Manage your property listings and track performance</p>
        </div>

        {/* Payment Status Banner (if expiring soon) */}
        {agentPaymentData && agentPaymentData.paymentDaysRemaining <= 7 && agentPaymentData.paymentDaysRemaining > 0 && (
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-semibold text-gray-900">Payment Due Soon</p>
                <p className="text-sm text-gray-600">
                  {agentPaymentData.paymentDaysRemaining} day{agentPaymentData.paymentDaysRemaining !== 1 ? 's' : ''} remaining
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPaymentPopup(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Pay Now
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-5 shadow-sm text-white">
            <div className="text-2xl font-bold">12</div>
            <div className="text-teal-100 text-xs mt-1">Active Listings</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 shadow-sm text-white">
            <div className="text-2xl font-bold">328</div>
            <div className="text-blue-100 text-xs mt-1">Total Views</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-5 shadow-sm text-white">
            <div className="text-2xl font-bold">15</div>
            <div className="text-purple-100 text-xs mt-1">Inquiries</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-5 shadow-sm text-white">
            <div className="text-2xl font-bold">3</div>
            <div className="text-orange-100 text-xs mt-1">Sold This Month</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <ActionCard icon={<PlusIcon />} title="Create New Listing" desc="Add a new property" color="bg-green-100" onClick={() => navigate("/createListnings")}/>
          <ActionCard icon={<EditIcon />} title="Manage Listings" desc="Edit or remove properties" color="bg-blue-100" onClick={() => navigate("/manageListnings")}/>
          <ActionCard icon={<ChartIcon />} title="View Analytics" desc="Track performance" color="bg-orange-100" onClick={() => navigate("/viewAll")}/>
        </div>

        {/* My Active Listings */}
        <div className="bg-white shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">My Active Listings</h2>
            <button className="text-teal-600 text-xs font-medium hover:underline">View All</button>
          </div>
          
          {/* My Active Listings */}
          <div className="grid md:grid-cols-3 gap-5">
            {myListings.map((p) => (
              <div
                key={p._id}
                onClick={() => navigate(`/listning/${p._id}`)}
                className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer group border border-gray-100"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={p.images && p.images.length > 0 ? p.images[0] : "/placeholder.png"}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                      <span className="flex items-center gap-1">
                        <BedIcon /> {p.bedrooms || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <BathIcon /> {p.bathrooms || 0}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-1.5 transition-colors text-xs font-medium">
                      Edit
                    </button>
                    <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1.5 transition-colors text-xs font-medium">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow-sm border border-gray-100 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <ActivityCard activity="New inquiry for Cinnamon Gardens Villa" time="2 hours ago" />
            <ActivityCard activity="Marine Drive Suite viewed 15 times" time="5 hours ago" />
            <ActivityCard activity="Nuwara Eliya Plot listing updated" time="1 day ago" />
          </div>
        </div>
      </main>
    </div>
  );
}

// REUSABLE COMPONENTS






