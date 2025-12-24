import { useEffect, useState } from "react";
import { activateAgentAPI, deactivateAgentAPI, getAllAgentsAPI  , getAllUsersAPI} from "../services/Admin";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

interface Agent {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  contactNumber?: string;
  createdAt?: string;
  role?: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  contactNumber?: string;
  createdAt?: string;
  role?: string;
}

export default function UserManage() {
  const { user } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [viewMode, setViewMode] = useState<"agents" | "users">("agents");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedViewItem, setSelectedViewItem] = useState<Agent | User | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch agents
        const agentsRes = await getAllAgentsAPI(user.token);
        setAgents(agentsRes.data.agents || []);

        // Fetch users
        const usersRes = await getAllUsersAPI(user.token);
        setUsers(usersRes.data.clients || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const toggleAgentStatus = async (agentId: string, isActive: boolean) => {
    if (!user) return;
    try {
      if (isActive) {
        await deactivateAgentAPI(agentId, user.token);
        toast.success("Agent deactivated successfully");
      } else {
        await activateAgentAPI(agentId, user.token);
        toast.success("Agent activated successfully");
      }

      setAgents((prev) =>
        prev.map((a) => (a._id === agentId ? { ...a, isActive: !isActive } : a))
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update agent status");
    }
  };

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    if (!user) return;
    try {
      // TODO: Implement user activation/deactivation API
      // if (isActive) {
      //   await deactivateUserAPI(userId, user.token);
      //   toast.success("User deactivated successfully");
      // } else {
      //   await activateUserAPI(userId, user.token);
      //   toast.success("User activated successfully");
      // }

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isActive: !isActive } : u))
      );
      toast.success(`User ${isActive ? 'deactivated' : 'activated'} successfully`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user status");
    }
  };

  const openViewModal = (item: Agent | User) => {
    setSelectedViewItem(item);
    setViewModalOpen(true);
  };

  // Get current data based on view mode
  const currentData = viewMode === "agents" ? agents : users;

  // Filter data based on search and status
  const filteredData = currentData.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === "all" ||
      (filterStatus === "active" && item.isActive) ||
      (filterStatus === "inactive" && !item.isActive);

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: currentData.length,
    active: currentData.filter(d => d.isActive).length,
    inactive: currentData.filter(d => !d.isActive).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-teal-500 animate-spin mb-3"></div>
          <p className="text-gray-600 text-sm">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100 space-y-6">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management Dashboard</h1>
        <p className="text-gray-600 text-sm mt-0.5">Manage agents and user accounts</p>
      </div>

      {/* View Mode Toggle */}
      <div className="bg-white shadow-sm border border-gray-100 p-1 inline-flex gap-1">
        <button
          onClick={() => setViewMode("agents")}
          className={`px-6 py-2.5 text-sm font-medium transition-colors ${
            viewMode === "agents" 
              ? "bg-teal-600 text-white shadow-sm" 
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Agents
        </button>
        <button
          onClick={() => setViewMode("users")}
          className={`px-6 py-2.5 text-sm font-medium transition-colors ${
            viewMode === "users" 
              ? "bg-teal-600 text-white shadow-sm" 
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Users
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-gray-500 text-xs mt-1">Total {viewMode === "agents" ? "Agents" : "Users"}</div>
            </div>
            <div className="bg-teal-100 p-2.5">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-gray-500 text-xs mt-1">Active</div>
            </div>
            <div className="bg-green-100 p-2.5">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
              <div className="text-gray-500 text-xs mt-1">Inactive</div>
            </div>
            <div className="bg-red-100 p-2.5">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-1 bg-gray-100 p-1">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                filterStatus === "all" ? "bg-white text-teal-600 shadow-sm" : "text-gray-600"
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilterStatus("active")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                filterStatus === "active" ? "bg-white text-green-600 shadow-sm" : "text-gray-600"
              }`}
            >
              Active ({stats.active})
            </button>
            <button
              onClick={() => setFilterStatus("inactive")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                filterStatus === "inactive" ? "bg-white text-red-600 shadow-sm" : "text-gray-600"
              }`}
            >
              Inactive ({stats.inactive})
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        <span className="font-semibold text-gray-900">{filteredData.length}</span> {viewMode} found
      </div>

      {/* Data List */}
      <div className="bg-white shadow-sm border border-gray-100 p-5">
        {filteredData.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 mb-3">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No {viewMode} found matching your criteria.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredData.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 hover:border-teal-300 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                    {item.name.charAt(0).toUpperCase()}
                  </div>
                  
                  {/* Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                      <span className={`px-2 py-0.5 text-xs font-medium ${
                        item.isActive 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{item.email}</p>
                    {item.contactNumber && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {item.contactNumber}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openViewModal(item)}
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 transition-colors text-xs font-medium border border-gray-300"
                    title="View Details"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => viewMode === "agents" 
                      ? toggleAgentStatus(item._id, item.isActive)
                      : toggleUserStatus(item._id, item.isActive)
                    }
                    className={`px-3 py-1.5 text-white font-medium transition-colors text-xs ${
                      item.isActive
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {item.isActive ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {viewModalOpen && selectedViewItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setViewModalOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ maxHeight: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {viewMode === "agents" ? "Agent" : "User"} Details
                </h2>
                <p className="text-sm text-gray-500 mt-1">Complete profile information</p>
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

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              
              {/* Profile Section */}
              <div className="flex items-center gap-4 mb-6 p-5 bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
                  {selectedViewItem.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{selectedViewItem.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{selectedViewItem.email}</p>
                  <div className="mt-2">
                    <span className={`px-3 py-1 text-xs font-medium ${
                      selectedViewItem.isActive 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-700"
                    }`}>
                      {selectedViewItem.isActive ? "Active Account" : "Inactive Account"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-xs font-medium text-gray-600 uppercase">Full Name</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{selectedViewItem.name}</p>
                </div>

                <div className="bg-gray-50 p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-medium text-gray-600 uppercase">Email Address</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 break-all">{selectedViewItem.email}</p>
                </div>

                <div className="bg-gray-50 p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-xs font-medium text-gray-600 uppercase">Contact Number</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{selectedViewItem.contactNumber || "Not provided"}</p>
                </div>

                <div className="bg-gray-50 p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-xs font-medium text-gray-600 uppercase">Account Status</span>
                  </div>
                  <p className={`text-sm font-semibold ${
                    selectedViewItem.isActive ? "text-green-600" : "text-red-600"
                  }`}>
                    {selectedViewItem.isActive ? "Active" : "Inactive"}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-medium text-gray-600 uppercase">Role</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 capitalize">{selectedViewItem.role || viewMode}</p>
                </div>

                <div className="bg-gray-50 p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-medium text-gray-600 uppercase">Member Since</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedViewItem.createdAt 
                      ? new Date(selectedViewItem.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })
                      : "N/A"
                    }
                  </p>
                </div>
              </div>

              {/* Account ID */}
              <div className="bg-gray-50 p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  <span className="text-xs font-medium text-gray-600 uppercase">Account ID</span>
                </div>
                <p className="text-xs font-mono text-gray-700 bg-white p-2 border border-gray-200">
                  {selectedViewItem._id}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setViewModalOpen(false);
                  if (viewMode === "agents") {
                    toggleAgentStatus(selectedViewItem._id, selectedViewItem.isActive);
                  } else {
                    toggleUserStatus(selectedViewItem._id, selectedViewItem.isActive);
                  }
                }}
                className={`px-6 py-2.5 font-medium transition-colors text-white ${
                  selectedViewItem.isActive
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {selectedViewItem.isActive ? "Deactivate Account" : "Activate Account"}
              </button>
              <button
                onClick={() => setViewModalOpen(false)}
                className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 font-medium text-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}