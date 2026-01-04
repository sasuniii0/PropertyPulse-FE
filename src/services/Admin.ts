import axios from "axios";
import type { Property } from "../components/SavedPropertiesMap";
import type { UserData } from "./User";

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

export interface EdiitListningData{
  _id: string;
  title?: string;
  propertyType?: string;
  images?: string[];
  // New location field
  location?: {
    address?: string;  // formatted address from Google Maps
    lat?: number;      // latitude
    lng?: number;      // longitude
  };
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  size?: number;
  description?: string;
  newImages?: File[]; // if you want to handle newly uploaded images
}
//const API = "http://localhost:5000/api/v1/admin" || import.meta.env.BASE_URL;
const API = import.meta.env.VITE_API_URL + "/api/v1/admin";

// Get pending listings
export const getPendingListings = (token: string) => {
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

// Get all agents
export const getAllUsersAPI = (token: string) => {
  if (!token) throw new Error("No token provided");
  return axios.get(`${API}/users`, { headers: { Authorization: `Bearer ${token}` } });
};

// Get ALL listings (Admin)
export const getAllListingsAdminAPI = (token: string) => {
  if (!token) throw new Error("No token provided");
  return axios.get<{ data: ListingData[] }>(`${API}/listnings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Get SINGLE listing (View)
export const getListingByIdAdminAPI = (id: string, token: string) => {
  if (!token) throw new Error("No token provided");
  return axios.get(`${API}/single-listning/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Update listing
export const updateListingAdminAPI = (
  id: string,
  data: Partial<EdiitListningData>,
  token: string
) => {
  if (!token) throw new Error("No token provided");
  return axios.put(`${API}/update-listning/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Delete listing
export const deleteListingAdminAPI = (id: string, token: string) => {
  if (!token) throw new Error("No token provided");
  return axios.delete(`${API}/delete-listning/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// fetching location
export const fetchLocationApi = async (token: string): Promise<Property[]> => {
  try {
    if (!token) throw new Error("No token provided for fetching locations");

    const res = await axios.get(`${API}/get-locations`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (err) {
    console.error("Failed to fetch property locations:", err);
    return [];
  }
};

// Fetch recent users (Admin)
export const getRecentUsers = async (token: string): Promise<UserData[]> => {
  if (!token) throw new Error("No access token");

  const res = await axios.get<{ data: UserData[] }>(
    `${API}/recent-users`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data.data;
};
