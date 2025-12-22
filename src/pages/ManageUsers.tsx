import { useEffect, useState } from "react";
import { activateAgentAPI, deactivateAgentAPI, getAllAgentsAPI } from "../services/Admin";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

interface Agent {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  contactNumber?: string;
  createdAt?: string;
}

export default function UserManage() {
  const { user } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchAgents = async () => {
      try {
        const res = await getAllAgentsAPI(user.token);
        setAgents(res.data.agents || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch agents");
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
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

  // Filter agents based on search and status
  const filteredAgents = agents.filter((agent) => {
    const matchesSearch = 
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === "all" ||
      (filterStatus === "active" && agent.isActive) ||
      (filterStatus === "inactive" && !agent.isActive);

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: agents.length,
    active: agents.filter(a => a.isActive).length,
    inactive: agents.filter(a => !a.isActive).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-teal-500 animate-spin mb-3"></div>
          <p className="text-gray-600 text-sm">Loading agents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100 space-y-6">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Users Dashboard</h1>
        <p className="text-gray-600 text-sm mt-0.5">Manage agent accounts and permissions</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-gray-500 text-xs mt-1">Total Agents</div>
            </div>
            <div className="bg-blue-100 p-2.5">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-gray-500 text-xs mt-1">Active Agents</div>
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
              <div className="text-gray-500 text-xs mt-1">Inactive Agents</div>
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
        <span className="font-semibold text-gray-900">{filteredAgents.length}</span> agents found
      </div>

      {/* Agents List */}
      <div className="bg-white shadow-sm border border-gray-100 p-5">
        {filteredAgents.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 mb-3">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No agents found matching your criteria.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredAgents.map((agent) => (
              <div
                key={agent._id}
                className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 hover:border-teal-300 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                    {agent.name.charAt(0).toUpperCase()}
                  </div>
                  
                  {/* Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 text-sm">{agent.name}</h3>
                      <span className={`px-2 py-0.5 text-xs font-medium ${
                        agent.isActive 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        {agent.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{agent.email}</p>
                    {agent.contactNumber && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {agent.contactNumber}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedAgent(selectedAgent === agent._id ? null : agent._id)}
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 transition-colors text-xs font-medium border border-gray-300"
                    title="View Details"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => toggleAgentStatus(agent._id, agent.isActive)}
                    className={`px-3 py-1.5 text-white font-medium transition-colors text-xs ${
                      agent.isActive
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {agent.isActive ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}