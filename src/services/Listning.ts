import axios from "axios";
import type { Property } from "../components/SavedPropertiesMap";

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
const API = "http://localhost:5000/api/v1/listning";

// //getAll listnings
// export const getAllListingsAPI = (token: string) => {
//   if (!token) throw new Error("No token provided");
//   return axios.get<{ data: ListingData[] }>(`${API}/`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// }

// DELETE LISTING
export const deleteListingAPI = (token: string, id: string) => {
  return axios.delete(`${API}/delete/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// UPDATE LISTING
export const updateListingAPI = (token: string, id: string, data: Partial<EdiitListningData>) => {
  return axios.put(`${API}/update/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// GET All Listings for Agent
export const getAllListingsAPI = (token: string) => {
  return axios.get(`${API}/agent`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Get all listings by agent
export const getListingsByAgentAPI = (agentId: string, token: string) => {
  if (!token) throw new Error("No token provided");
  if (!agentId) throw new Error("No agent ID provided");

  console.log("hikedjew");
  

  return axios.get(`${API}/agent/${agentId}/listings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Get single listing by ID
export const getListingByIdAPI = (id: string, token: string) => {
  if (!token) throw new Error("No token provided");
  if (!id) throw new Error("No listing ID provided");

  return axios.get(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getMyListningsAPI = async (token: string) => {
  return axios.get<MyListingsResponse>(`${API}/my-listings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const getApprovedListingsAPI = async (token: string) => {
  const res = await axios.get<{ data: EdiitListningData[] }>(`${API}/approved`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

// Fetch property locations
export const fetchLocationApiClient = async (token: string): Promise<Property[]> => {
  if (!token) throw new Error("No token provided");

  try {
    const res = await axios.get<Property[]>(`${API}/get-locations`, {
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
    const res = await axios.get("http://localhost:5000/api/v1/listning/recent", {
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
