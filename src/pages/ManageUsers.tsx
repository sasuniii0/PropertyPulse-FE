import { useEffect, useState } from "react";
import { activateAgentAPI, deactivateAgentAPI, getAllAgentsAPI } from "../services/Admin";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

interface Agent {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
}

export default function UserManage() {
  const { user } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading agents...</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-50 space-y-6">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold">Manage Users Dashboard</h1>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 space-y-4">
        {agents.length === 0 ? (
          <p className="text-gray-500">No agents found.</p>
        ) : (
          agents.map((agent) => (
            <div
              key={agent._id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div>
                <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                <p className="text-sm text-gray-500">{agent.email}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleAgentStatus(agent._id, agent.isActive)}
                  className={`px-4 py-2 rounded-lg text-white font-medium transition ${
                    agent.isActive
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {agent.isActive ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
