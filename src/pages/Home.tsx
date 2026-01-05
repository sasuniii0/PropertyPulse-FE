import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ActionCard from "../components/ActionCard";
import StatCard from "../components/StatCard";
import ActivityCard from "../components/ActivityCard";
import { useState , useEffect } from "react";
import { approveListingAPI, rejectListingAPI , getPendingListings, fetchLocationApi, getTopAgentsAPI} from "../services/Admin";
import type { ListingData} from "../services/Admin";
import { SettingsIcon , HomeIcon,PulseIcon,SearchIcon,HeartIcon,PlusIcon,HomeIconSmall,EditIcon,ChartIcon,UserIcon,BedIcon,BathIcon,MapPinIcon } from "../components/Icons";
import toast from "react-hot-toast";
import { getAllListingsAPI, getApprovedListingsAPI, getMyListningsAPI, type EdiitListningData } from "../services/Listning";
import SavedPropertiesMap from "../components/SavedPropertiesMap"; 
import type { Property } from "../components/SavedPropertiesMap";
import type {UserData} from '../services/User'
import {getRecentUsers} from '../services/Admin'
import {fetchLocationApiClient} from '../services/Listning'
import MyRecentInquiries from '../components/MyRecentInquiries'
import { PaymentPopup } from "../components/PaymentPopup";
import { startAgentPayment } from "../services/Payment";
import RecentPropertiesSlideshow from "../components/RecentPropertiesSlideShow";
import api from "../services/Api";
import { getDashboardMetricsAPI } from "../services/MarketAnalytics";
import AgentHome from "../components/AgentHome";
import ClientHome from "../components/ClientHome";

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

  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  useEffect(() => {
  if (!user || user.role !== "AGENT") return;

  const checkPayment = async () => {
    if (!user || loading) return; // Wait until auth is fully loaded
    try {
      const response = await api.get(import.meta.env.VITE_API_URL + "/api/v1/user/payment-status", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (paymentStatus){

      }
      const status = response.data.paymentStatus;
      setPaymentStatus(status);

      // Show popup if PENDING
      if (status === "PENDING") {
        setShowPaymentPopup(true);
      }
    } catch (err) {
      console.error("Payment check failed:", err);
    }
  };

  checkPayment();
}, [user]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user || loading) return; // Wait until auth is fully loaded
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

const handlePayNow = async () => {
  if (!user?.token) return;

  try {
    const data = await startAgentPayment(user.token);
    window.location.href = data.url; // Stripe checkout
  } catch (err) {
    console.error("Payment failed", err);
  }
};

useEffect(() => {
  
  const fetchRecentUsers = async () => {
    if (!user || loading) return; // Wait until auth is fully loaded
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
    if (!user || loading) return; // Wait until auth is fully loaded
    if (!user) return;

    const fetchListings = async () => {
      if (!user || loading) return; // Wait until auth is fully loaded
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
        if (!user || loading) return; // Wait until auth is fully loaded
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
    if (!user || loading) return; // Wait until auth is fully loaded
    if (user.role === "AGENT") {
      try {
        const res = await getMyListningsAPI(user.token);

        if (res.data?.success) {
          setMyListings(res.data.listings); // ✅ FIX HERE
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
        if (!user || loading) return; // Wait until auth is fully loaded
        try {
          const data = await getApprovedListingsAPI(user.token);
          setApprovedListings(data);
        } catch (err) {
          console.error("Failed to fetch approved listings:", err);
        }
      };
      loadApprovedListings();
    }, [user]);

    const [metrics, setMetrics] = useState({
      totalUsers: 0,
      activeListings: 0,
      activeAgents: 0,
      pendingApprovals: 0,
      monthlySales: 0,
    });

    useEffect(() => {
      if (!user?.token) return;

      getDashboardMetricsAPI(user.token)
        .then((res) => setMetrics(res.metrics))
        .catch(console.error);
    }, [user]);

    const [topAgents, setTopAgents] = useState<any[]>([]);

    useEffect(() => {
      if (!user?.token) return;

      getTopAgentsAPI(user.token)
        .then((res) => {
          const ranked = res.agents.map((agent: any, index: number) => ({
            ...agent,
            rank: index + 1,
            badge: index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "⭐",
          }));

          setTopAgents(ranked);
        })
        .catch(console.error);
    }, [user]);


    useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

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
        <ClientHome />
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          {/* Welcome Section */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
            <p className="text-gray-600 text-sm mt-0.5">Find your dream property today</p>
          </div>

          <RecentPropertiesSlideshow/>
          
          {/* Quick Actions */}
          <div className="grid md:grid-cols-4 gap-4">
            <ActionCard icon={<SearchIcon />} title="Search Properties" desc="Browse all listings" color="bg-teal-100" onClick={() => navigate("/search")} />
            <ActionCard icon={<HeartIcon />} title="Saved Properties" desc="View your favorites" color="bg-red-100" onClick={() => navigate("/favourites")}/>
            <ActionCard icon={<UserIcon />} title="My Profile" desc="Update your details" color="bg-teal-100" onClick={() => navigate("/editme")}/>
            <ActionCard icon={<HomeIconSmall />} title="My Inquiries" desc="Track your requests" color="bg-purple-100" onClick={() => navigate("/inquaries")}/>
          </div>

          {/* Map Section */}
          <section className="bg-white shadow-sm border border-gray-100 p-5 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Property Locations Map</h2>
            <SavedPropertiesMap properties={clientLocations} />
          </section>

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
                        onClick={() => {
                          navigate(`/property/${p._id}`);
                          window.scrollTo(0, 0); // scroll to top immediately
                        }}
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
          <MyRecentInquiries />
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
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-5 shadow-sm text-white">
            <div className="text-2xl font-bold">{metrics.totalUsers}</div>
            <div className="text-teal-100 text-xs mt-1">Total Users</div>
          </div>

          <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-5 shadow-sm text-white">
            <div className="text-2xl font-bold">{metrics.activeListings}</div>
            <div className="text-teal-100 text-xs mt-1">Active Listings</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-5 shadow-sm text-white">
            <div className="text-2xl font-bold">{metrics.activeAgents}</div>
            <div className="text-purple-100 text-xs mt-1">Active Agents</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-5 shadow-sm text-white">
            <div className="text-2xl font-bold">{metrics.pendingApprovals}</div>
            <div className="text-orange-100 text-xs mt-1">Pending Approvals</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 shadow-sm text-white">
            <div className="text-2xl font-bold">{metrics.monthlySales}</div>
            <div className="text-green-100 text-xs mt-1">Sales This Month</div>
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
            color="bg-teal-100"
            onClick={() => navigate("/admin/manage-users")} 
          />
          <ActionCard 
            icon={<HomeIcon />} 
            title="Property Approvals" 
            desc="Review pending listings" 
            color="bg-orange-100" 
            onClick={() => navigate("/listning")}
          />
          <ActionCard 
            icon={<ChartIcon />} 
            title="Platform Analytics" 
            desc="View detailed reports" 
            color="bg-purple-100" 
            onClick={() => navigate("/analytics")}
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
                <button 
                className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-medium">
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

      <AgentHome />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <PaymentPopup
          isOpen={showPaymentPopup}
          onClose={() => setShowPaymentPopup(false)}
          onPayNow={handlePayNow}
        />

        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
          <p className="text-gray-600 text-sm mt-0.5">Manage your property listings and track performance</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-5 shadow-sm text-white">
            <div className="text-2xl font-bold">12</div>
            <div className="text-teal-100 text-xs mt-1">Active Listings</div>
          </div>
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-5 shadow-sm text-white">
            <div className="text-2xl font-bold">328</div>
            <div className="text-teal-100 text-xs mt-1">Total Views</div>
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
          <ActionCard icon={<EditIcon />} title="Manage Listings" desc="Edit or remove properties" color="bg-teal-100" onClick={() => navigate("/manageListnings")}/>
          <ActionCard icon={<ChartIcon />} title="View Analytics" desc="Track performance" color="bg-orange-100" onClick={() => navigate("/agent-tracking")}/>
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
                onClick={() => {
                          navigate(`/property/${p._id}`);
                          window.scrollTo(0, 0); // scroll to top immediately
                        }}
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
                    <button 
                    className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-1.5 transition-colors text-xs font-medium"
                    onClick={() => {
                          navigate(`/property/${p._id}`);
                          window.scrollTo(0, 0); // scroll to top immediately
                        }}
                    >
                      View Details
                    </button>
                    {/* <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1.5 transition-colors text-xs font-medium">
                      Delete
                    </button> */}
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






