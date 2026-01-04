import axios from "axios";

const API = import.meta.env.VITE_API_URL + "/api/v1/saved-properties";

export interface SavedPropertyListing {
  _id: string;
  title?: string;
  description?: string;
  price?: number;
  propertyType?: string;
  size?: number;
  bedrooms?: number;
  bathrooms?: number;
  images?: string[];
  location?: {
    address?: string;
    lat?: number;
    lng?: number;
  };
  agent?: {
    _id: string;
    name: string;
    email: string;
    contactNumber?: string;
  } | string;
  status?: string;
  createdAt?: string;
}

export interface SavedPropertyData {
  _id: string;
  user: string;
  listing: SavedPropertyListing;
  createdAt: string;
}

// Get all saved properties
export const getSavedPropertiesAPI = async (token: string): Promise<SavedPropertyData[]> => {
  if (!token) throw new Error("No token provided");

  try {
    const res = await axios.get<{ success: boolean; count: number; data: SavedPropertyData[] }>(API, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  } catch (err: any) {
    console.error("Failed to fetch saved properties:", err.response?.data || err);
    throw err;
  }
};

// Save a property
export const savePropertyAPI = (token: string, listingId: string) => {
  if (!token) throw new Error("No token provided");
  if (!listingId) throw new Error("No listing ID provided");

  return axios.post(API, { listingId }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Unsave a property
export const unsavePropertyAPI = (token: string, listingId: string) => {
  if (!token) throw new Error("No token provided");
  if (!listingId) throw new Error("No listing ID provided");

  return axios.delete(`${API}/${listingId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Check if a property is saved
export const checkIfSavedAPI = (token: string, listingId: string) => {
  if (!token) throw new Error("No token provided");
  if (!listingId) throw new Error("No listing ID provided");

  return axios.get<{ success: boolean; isSaved: boolean }>(`${API}/check/${listingId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Toggle save property (save if not saved, unsave if saved)
export const toggleSavePropertyAPI = (token: string, listingId: string) => {
  if (!token) throw new Error("No token provided");
  if (!listingId) throw new Error("No listing ID provided");

  return axios.post(`${API}/toggle`, { listingId }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
