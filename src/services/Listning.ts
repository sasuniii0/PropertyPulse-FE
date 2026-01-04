import type { Property } from "../components/SavedPropertiesMap";
import api from "./Api";

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

export interface MyListingsResponse {
  success: boolean;
  count: number;
  listings: ListingData[];
}

// Interface for a listing
export interface RecentListing {
  _id: string;
  title: string;
  price: number;
  images: string[];
  propertyType: string;
  location: { address: string };
  createdAt: string; // ISO date string from backend
}
const API = import.meta.env.VITE_API_URL + "/api/v1/listning";

// //getAll listnings
// export const getAllListingsAPI = (token: string) => {
//   if (!token) throw new Error("No token provided");
//   return axios.get<{ data: ListingData[] }>(`${API}/`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// }

// DELETE LISTING
// DELETE LISTING API
export const deleteListingAPI = async (token: string, id: string) => {
  try {
    const res = await api.delete(`${API}/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Delete response:", res.data); // ✅ log backend response
    return res.data;
  } catch (err: any) {
    console.error("Delete API error:", err.response?.data || err.message);
    throw err;
  }
};


// UPDATE LISTING
export const updateListingAPI = (token: string, id: string, data: Partial<EdiitListningData>) => {
  return api.put(`${API}/update/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// GET All Listings for Agent
export const getAllListingsAPI = (token: string) => {
  return api.get(`${API}/agent`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// GET All Listings for Agent
export const getAllListingsADMINAPI = (token: string) => {
  return api.get(`${API}/agent`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Get all listings by agent
export const getListingsByAgentAPI = (agentId: string, token: string) => {
  if (!token) throw new Error("No token provided");
  if (!agentId) throw new Error("No agent ID provided");  

  return api.get(`${API}/agent/${agentId}/listings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Get single listing by ID
export const getListingByIdAPI = (id: string, token: string) => {
  if (!token) throw new Error("No token provided");
  if (!id) throw new Error("No listing ID provided");

  return api.get(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getMyListningsAPI = async (token: string) => {
  return api.get<MyListingsResponse>(`${API}/my-listings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const getApprovedListingsAPI = async (token: string) => {
  const res = await api.get<{ data: EdiitListningData[] }>(`${API}/approved`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

// Fetch property locations
export const fetchLocationApiClient = async (token: string): Promise<Property[]> => {
  if (!token) throw new Error("No token provided");

  try {
    const res = await api.get<Property[]>(`${API}/get-locations`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Failed to fetch property locations:", err);
    return [];
  }
};

export const fetchRecentListings = async (token: string): Promise<RecentListing[]> => {
  try {
    const res = await api.get(`${API}/recent`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data.success) {
      return res.data.listings;
    } else {
      console.error("Failed to fetch recent listings:", res.data.message);
      return [];
    }
  } catch (err) {
    console.error("Error fetching recent listings:", err);
    return [];
  }
};

// Fetch all listings for the logged-in agent
export const getAgentListingsAPI = async (token: string) => {
  try {
    const response = await api.get(`${API}/agent/listings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data; // assuming backend returns { data: [...] }
  } catch (err: any) {
    console.error("Failed to fetch agent listings:", err);
    throw err;
  }
};

// Fetch all inquiries assigned to the logged-in agent
export const getInquiriesByAgentAPI = async (token: string) => {
  try {
    const response = await api.get(`${API}/agent/inquiries`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data; // assuming backend returns { data: [...] }
  } catch (err: any) {
    console.error("Failed to fetch agent inquiries:", err);
    throw err;
  }
};
