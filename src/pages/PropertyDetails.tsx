import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getListingByIdAPI, getListingsByAgentAPI } from "../services/Listning";
import { getUserByIdAPI } from "../services/User";
import toast, { Toaster } from "react-hot-toast";
import { createInquiryAPI } from '../services/Inquiry';
import { useAuth } from "../context/AuthContext";
import SaveButton from '../components/SaveButton';
import api from "../services/Api";
import axios from "axios";


interface Location {
  address: string;
  lat?: number;
  lng?: number;
}

interface Listing {
  _id: string;
  title: string;
  description?: string;
  price: number;
  propertyType?: string;
  size?: number;
  bedrooms?: number;
  bathrooms?: number;
  images?: string[];
  location?: Location;
  agentId: string;
  status?: string;
  createdAt?: string;
  amenities?: string[];
  yearBuilt?: number;
  parking?: number;
}

interface Agent {
  _id: string;
  name: string;
  email: string;
  contactNumber?: string;
  profileImage?: string;
}

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Listing | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [moreListings, setMoreListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);

  console.log(property);
  

  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchPropertyDetails = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No token");

        const propertyRes = await getListingByIdAPI(id, token);
        console.log(propertyRes);
        

        // ✅ SAFELY extract listing
        const propertyData = propertyRes?.data?.data;
        if (!propertyData) {
          throw new Error("Listing not found in response");
        }
        setProperty(propertyData);

        // ✅ agent can be object or string (id)
        const agentId =
          typeof propertyData.agent === "string"
            ? propertyData.agent
            : propertyData.agent?._id;

        if (agentId) {
          const agentRes = await getUserByIdAPI(agentId, token);          
          setAgent(agentRes.data.user);

          const moreListingsRes = await getListingsByAgentAPI(agentId, token);
          console.log(moreListings);
          
          const filtered = moreListingsRes.data.listings.filter(
            (l: Listing) =>
              l._id !== id && l.status?.toUpperCase() === "APPROVED"
          );

          setMoreListings(filtered.slice(0, 6));
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load property details");
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  const handleSendInquiry = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!user || !user.token) return toast.error("Please log in to send an inquiry");
  if (user.role !== 'CLIENT') return toast.error("Only clients can send inquiries");
  if (!inquiryMessage.trim()) return toast.error("Please enter a message");
  if (!property?._id) return toast.error("Property information is missing");

  setIsSubmitting(true);

  try {
    // 1️⃣ Create inquiry
    await createInquiryAPI(user.token, property._id, inquiryMessage);

    // 2️⃣ Get agent info safely
    const agentId = property.agentId; // Make sure this exists
    console.log(agentId);
    
    if (!agentId) {
      console.warn("Agent ID not found for this property, skipping email");
      toast.success("Inquiry sent! But agent email could not be delivered.");
      setShowContactModal(false);
      setInquiryMessage('');
      return;
    }

    const agentRes = await api.get(`/agents/${agentId}`);
    const agentData = agentRes.data;

    // 3️⃣ Fire-and-forget email to agent
    if (agentData?.email) {
      api.post('/email/send-inquiry', {
        to: agentData.email,
        subject: `New Inquiry for ${property.title}`,
        html: `
          <p>Hi ${agentData.name},</p>
          <p>You have received a new inquiry from ${user.name} (${user.email}) for your property <strong>${property.title}</strong>.</p>
          <p><strong>Message:</strong> ${inquiryMessage}</p>
          <p>Regards, <br/> PropertyPulse Team</p>
        `,
      }).catch(err => console.error("Failed to send inquiry email:", err));
    }

    toast.success("Inquiry sent successfully! The agent will respond soon.");
    setShowContactModal(false);
    setInquiryMessage('');

  } catch (error: any) {
    console.error("Failed to send inquiry:", error);

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        toast.error("Please log in again");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to send inquiry. Please try again.");
      }
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  } finally {
    setIsSubmitting(false);
  }
};


  const handleContactAgent = () => {
    // Check if user is logged in
    if (!user) {
      toast.error("Please log in to send an inquiry");
      return;
    }

    // Check if user is a client
    if (user.role !== 'CLIENT') {
      toast.error("Only clients can send inquiries");
      return;
    }

    // Initialize the message with property title
    if (property) {
      setInquiryMessage(`I'm interested in ${property.title} and would like more information.`);
    }
    setShowContactModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-teal-500 animate-spin mb-3"></div>
          <p className="text-gray-600 text-sm">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <p className="text-gray-600 text-lg mb-4">Property not found</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Header with Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back to listings</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Image Gallery */}
            <div className="bg-white shadow-sm border border-gray-100">
              {/* Main Image */}
              <div className="relative h-96 bg-gray-100">
                <img
                  src={property.images && property.images.length > 0 
                    ? property.images[selectedImage] 
                    : "/placeholder.png"}
                  alt={property.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/placeholder.png";
                  }}
                />
                
                {/* Image Counter */}
                {property.images && property.images.length > 0 && (
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 text-sm">
                    {selectedImage + 1} / {property.images.length}
                  </div>
                )}

                {/* Navigation Arrows */}
                {property.images && property.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage(prev => prev === 0 ? property.images!.length - 1 : prev - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 shadow-lg transition-colors"
                    >
                      <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setSelectedImage(prev => prev === property.images!.length - 1 ? 0 : prev + 1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 shadow-lg transition-colors"
                    >
                      <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Grid */}
              {property.images && property.images.length > 1 && (
                <div className="p-4 grid grid-cols-6 gap-2">
                  {property.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative h-16 overflow-hidden border-2 transition-all ${
                        selectedImage === idx ? "border-teal-600" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/placeholder.png";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Overview */}
            <div className="bg-white shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>

                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm">{property.location?.address || "Location not specified"}</span>
                  </div>

                  <div className="property-header justify-between items-center p-3">
                      {/* Save to Favorites button */}
                      <SaveButton 
                        listingId={property._id} 
                        size="md"
                        showLabel={true}
                        onToggle={(isSaved) => console.log('Saved status:', isSaved)}
                      />
                    </div>

                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-teal-600">
                    LKR {property.price?.toLocaleString()}
                  </div>
                  {property.propertyType && (
                    <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium">
                      {property.propertyType}
                    </span>
                  )}
                </div>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 border border-teal-200">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="text-xs font-medium text-teal-700 uppercase">Bedrooms</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{property.bedrooms || 0}</p>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 border border-teal-200">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                    </svg>
                    <span className="text-xs font-medium text-teal-700 uppercase">Bathrooms</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{property.bathrooms || 0}</p>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 border border-teal-200">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    <span className="text-xs font-medium text-teal-700 uppercase">Size</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{property.size || "N/A"}</p>
                  {property.size && <p className="text-xs text-gray-600 mt-1">sq ft</p>}
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 border border-teal-200">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                    <span className="text-xs font-medium text-teal-700 uppercase">Parking</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{property.parking || 0}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div className="bg-white shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Description
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Amenities & Features
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-700">
                      <svg className="w-5 h-5 text-teal-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Details */}
            <div className="bg-white shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Additional Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {property.yearBuilt && (
                  <div className="border-l-4 border-teal-600 pl-4">
                    <p className="text-sm text-gray-600 mb-1">Year Built</p>
                    <p className="text-lg font-semibold text-gray-900">{property.yearBuilt}</p>
                  </div>
                )}
                {property.createdAt && (
                  <div className="border-l-4 border-teal-600 pl-4">
                    <p className="text-sm text-gray-600 mb-1">Listed On</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(property.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {property.location && property.location.lat && property.location.lng && (
              <div className="bg-white shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Location
                </h2>

                <div className="bg-gray-100 h-64 flex items-center justify-center border border-gray-200">
                  <div className="text-center text-gray-600">
                    <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>

                    <p className="text-sm mb-1">Lat: {property.location.lat}, Lng: {property.location.lng}</p>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${property.location.lat},${property.location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:underline text-sm font-medium"
                    >
                      View on Google Maps
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Agent Card */}
            {agent && (
              <div className="bg-white shadow-sm border border-gray-100 p-6 sticky top-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Agent</h3>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                    {agent.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{agent.name}</h4>
                    <p className="text-sm text-gray-600">Property Agent</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-teal-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="break-all">{agent.email}</span>
                  </div>
                  {agent.contactNumber && (
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <svg className="w-5 h-5 text-teal-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{agent.contactNumber}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleContactAgent}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 font-medium transition-colors mb-2"
                >
                  Send Inquiry
                </button>
              </div>
            )}

            {/* Share Property */}
            <div className="bg-white shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Share Property</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  Twitter
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  WhatsApp
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* More from this Agent */}
        {moreListings.length > 0 && (
          <div className="mt-12">
            <div className="bg-white shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">More from {agent?.name}</h2>
                <button
                  onClick={() => navigate(`/agent/${agent?._id}/listings`)}
                  className="text-teal-600 hover:text-teal-700 font-medium text-sm flex items-center gap-1"
                >
                  View All
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-5">
                {moreListings.map((listing) => (
                  <div
                    key={listing._id}
                    onClick={() => navigate(`/property/${listing._id}`)}
                    className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer group border border-gray-100"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={listing.images && listing.images.length > 0 
                            ? listing.images[0] 
                            : "/placeholder.png"}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/placeholder.png";
                        }}
                      />
                    </div>

                    <div className="p-4">
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {listing.location?.address || "Unknown Address"}
                      </div>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{listing.title}</h3>
                          <p className="text-teal-600 font-bold text-base mt-1">
                            LKR {listing.price?.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-3 text-gray-500 text-xs">
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            {listing.bedrooms || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                            </svg>
                            {listing.bathrooms || 0}
                          </span>
                        </div>
                      </div>
                      <button
                          className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 transition-colors text-xs font-medium"
                          onClick={()=> navigate(`/property/${listing._id}`)}>
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contact Modal */}
      {showContactModal && agent && property && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowContactModal(false)}
        >
          <div 
            className="bg-white w-full max-w-md shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-teal-600 text-white">
              <h3 className="text-xl font-bold">Contact {agent.name}</h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="w-8 h-8 flex items-center justify-center hover:bg-teal-700 transition-colors"
                disabled={isSubmitting}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSendInquiry} className="p-6 space-y-4">
              {/* User Info - Auto-populated and read-only */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 bg-gray-50 text-gray-600"
                  value={user?.name || ''}
                  disabled
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 bg-gray-50 text-gray-600"
                  value={user?.email || ''}
                  disabled
                  readOnly
                />
              </div>

              {user?.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Phone</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 bg-gray-50 text-gray-600"
                    value={user.phone}
                    disabled
                    readOnly
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                  placeholder={`I'm interested in ${property.title}`}
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {inquiryMessage.length} characters
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Send Inquiry'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}