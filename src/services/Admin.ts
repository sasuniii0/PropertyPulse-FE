import axios from "axios";

export interface ListingData {
  _id: string;
  title?: string;
  propertyType?: string;
  agent?: {
    _id: string;
    name: string;
    email: string;
  } | string;
  status: string;
}

const API = "http://localhost:5000/api/v1/admin";

// Get pending listings
export const getPendingListings = (token: string) => {
  console.log("Fetching pending listings with token:", token);
  if (!token) throw new Error("No token provided");
  return axios.get<{ data: ListingData[] }>(`${API}/pending-listnings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Approve listing
export const approveListingAPI = (id: string, token: string) => {

  if (!token) throw new Error("No token provided");
  return axios.post(
    `${API}/approve`,
    { id },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// Reject listing
export const rejectListingAPI = (id: string, token: string) => {
  if (!token) throw new Error("No token provided");
  return axios.post(
    `${API}/reject`,
    { id },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// Activate agent
export const activateAgentAPI = (id: string, token: string) => {
  if (!token) throw new Error("No token provided");
  return axios.put(`${API}/agents/${id}/active`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Deactivate agent
export const deactivateAgentAPI = (id: string, token: string) => {
  if (!token) throw new Error("No token provided");
  return axios.put(`${API}/agents/${id}/deactivate`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Get all agents
export const getAllAgentsAPI = (token: string) => {
  if (!token) throw new Error("No token provided");
  return axios.get(`${API}/agents`, { headers: { Authorization: `Bearer ${token}` } });
};
