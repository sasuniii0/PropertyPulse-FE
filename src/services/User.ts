import axios from "axios";
import api from "./Api";

export type UserData = {
  _id: string;
  name: string;
  email: string;
  contactNumber: string;
  role: string;
  isActive: boolean;
  bio?: string;
  savedListings?: string[];
  listings?: string[];
  ratings?: number;
  status?: "active" | "pending";
};

const API = "http://localhost:5000/api/v1/user";

// Fetch logged-in user details
export const getUserDetailsAPI = (id: string, token: string) => {
  if (!token) throw new Error("No token provided");
  return axios.get<{ data: UserData }>(`${API}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Main service to use in frontend
export const getMyDetails = async (token: string): Promise<UserData> => {
  if (!token) throw new Error("No access token");

  const res = await api.get(`${API}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  // Return only the user object
  return res.data.data;
};

// Update logged-in user details
export const updateMyDetails = async (token: string, data: Partial<UserData>) => {
  if (!token) throw new Error("No access token");

  const res = await axios.put(`${API}/updateMe`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data.data; // return updated user object
};

// Delete logged-in user account
export const deleteMyAccount = async (token: string) => {
  if (!token) throw new Error("No access token");

  const res = await axios.delete(`${API}/deleteMe`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

