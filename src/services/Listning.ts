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

export const getMyListningsAPI = async (token: string) => {
  return axios.get<{ data: ListingData[] }>(`${API}/my-listings`, {
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