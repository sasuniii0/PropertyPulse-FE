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

// user.ts or types.ts
export type PaymentStatus = "PENDING" | "PAID" | "OVERDUE";

export interface AgentPaymentData {
  success: boolean;
  paymentStatus: PaymentStatus;
}


const API =import.meta.env.VITE_API_URL + "/api/v1/user";

// Fetch logged-in user details
export const getUserDetailsAPI = (token: string) => {
  if (!token) throw new Error("No token provided");
  return api.get<{ data: UserData }>(`${API}/me`, {
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

  const res = await api.put(`${API}/updateMe`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data.data; // return updated user object
};

// Delete logged-in user account
export const deleteMyAccount = async (token: string) => {
  if (!token) throw new Error("No access token");

  const res = await api.delete(`${API}/deleteMe`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

// Get single user by ID
export const getUserByIdAPI = (id: string, token: string) => {
  if (!token) throw new Error("No token provided");
  if (!id) throw new Error("No user ID provided");

  return api.get(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getAgentPaymentStatus = async (token: string): Promise<AgentPaymentData> => {
  const res = await api.get(`${API}/payment-status`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = res.data;

  // Ensure it matches AgentPaymentData
  return {
    success: data.success,
    paymentStatus: data.paymentStatus,
  };
};
