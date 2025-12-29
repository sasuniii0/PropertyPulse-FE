import axios from "axios";

export interface InquiryData {
  _id: string;
  listing: any;
  client?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  agent?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  message: string;
  agentResponse?: string;
  status: "PENDING" | "RESPONDED" | "CLOSED";
  createdAt: string;
}

const API = "http://localhost:5000/api/v1/inquiries";

// Create Inquiry (CLIENT)
export const createInquiryAPI = (
  token: string,
  listingId: string,
  message: string
) => {
  if (!token) throw new Error("No token provided");

  return axios.post(
    `${API}/create`,
    { listingId, message },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

// Get My Inquiries (CLIENT)
export const getClientInquiriesAPI = (token: string) => {
  if (!token) throw new Error("No token provided");

  return axios.get<InquiryData[]>(`${API}/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Get Inquiries for Agent Listings (AGENT)
export const getAgentInquiriesAPI = (token: string) => {
  if (!token) throw new Error("No token provided");

  return axios.get<InquiryData[]>(`${API}/agent`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Respond to Inquiry (AGENT)
export const respondToInquiryAPI = (
  token: string,
  inquiryId: string,
  response: string
) => {
  if (!token) throw new Error("No token provided");
  if (!inquiryId) throw new Error("No inquiry ID provided");

  return axios.patch(
    `${API}/${inquiryId}/respond`,
    { response },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

// Close Inquiry (AGENT)
export const closeInquiryAPI = (token: string, inquiryId: string) => {
  if (!token) throw new Error("No token provided");
  if (!inquiryId) throw new Error("No inquiry ID provided");

  return axios.patch(
    `${API}/${inquiryId}/close`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
