import React, { useState, useEffect } from 'react';
import { Search, Eye, Filter, MessageSquare, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';

// ===== Runtime-safe constants + types =====

export const INQUIRY_STATUS = {
  PENDING: "PENDING",
  RESPONDED: "RESPONDED",
  CLOSED: "CLOSED",
} as const;

export type InquiryStatus =
  typeof INQUIRY_STATUS[keyof typeof INQUIRY_STATUS];

export const PROPERTY_TYPE = {
  HOUSE: "HOUSE",
  APARTMENT: "APARTMENT",
  LAND: "LAND",
  COMMERCIAL: "COMMERCIAL",
  VILLA: "VILLA",
} as const;

export type PropertyType =
  typeof PROPERTY_TYPE[keyof typeof PROPERTY_TYPE];

export const LISTING_TYPE = {
  SALE: "SALE",
  RENT: "RENT",
} as const;

export type ListingType =
  typeof LISTING_TYPE[keyof typeof LISTING_TYPE];


interface Inquiry {
  _id: string;
  client: {
    _id: string;
    name: string;
    email: string;
    contactNumber?: string;
  };
  agent: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  listing: {
    _id: string;
    title: string;
    propertyType: PropertyType;
    listingType: ListingType;
    price: number;
    location: {
      address: string;
    };
  };
  message: string;
  agentResponse?: string;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
}

const AdminInquiryPage: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | 'ALL'>('ALL');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch inquiries from API
  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found. Please log in.');
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${apiUrl}/api/v1/inquiries/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Adjust based on your API response structure
      const inquiriesData = data.inquiries || data.data || data;
      setInquiries(Array.isArray(inquiriesData) ? inquiriesData : []);
    } catch (err: any) {
      console.error('Failed to fetch inquiries:', err);
      setError(err.message || 'Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

const getStatusIcon = (status: InquiryStatus) => {
  switch (status) {
    case INQUIRY_STATUS.PENDING:
      return <Clock className="w-4 h-4" />;
    case INQUIRY_STATUS.RESPONDED:
      return <MessageSquare className="w-4 h-4" />;
    case INQUIRY_STATUS.CLOSED:
      return <CheckCircle className="w-4 h-4" />;
  }
};


const getStatusColor = (status: InquiryStatus) => {
  switch (status) {
    case INQUIRY_STATUS.PENDING:
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    case INQUIRY_STATUS.RESPONDED:
      return 'bg-blue-100 text-blue-800 border border-blue-200';
    case INQUIRY_STATUS.CLOSED:
      return 'bg-green-100 text-green-800 border border-green-200';
  }
};

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = 
      inquiry.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.agent?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.listing?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || inquiry.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

const formatPrice = (price: number, type: ListingType) => {
  const formatted = new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 0,
  }).format(price);

  return type === LISTING_TYPE.RENT ? `${formatted}/month` : formatted;
};


const statusCounts = {
  all: inquiries.length,
  pending: inquiries.filter(i => i.status === INQUIRY_STATUS.PENDING).length,
  responded: inquiries.filter(i => i.status === INQUIRY_STATUS.RESPONDED).length,
  closed: inquiries.filter(i => i.status === INQUIRY_STATUS.CLOSED).length,
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-3" />
          <p className="text-gray-600 text-sm">Loading inquiries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Inquiries</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchInquiries}
            className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inquiry Management</h1>
          <p className="text-gray-600">Monitor and manage all property inquiries</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Inquiries</p>
                <p className="text-3xl font-bold text-gray-900">{statusCounts.all}</p>
              </div>
              <MessageSquare className="w-10 h-10 text-gray-400" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{statusCounts.pending}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-500" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 mb-1">Responded</p>
                <p className="text-3xl font-bold text-blue-600">{statusCounts.responded}</p>
              </div>
              <MessageSquare className="w-10 h-10 text-blue-500" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 mb-1">Closed</p>
                <p className="text-3xl font-bold text-green-600">{statusCounts.closed}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by client, agent, or listing..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as InquiryStatus | 'ALL')}
                className="px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="ALL">All Status</option>
                <option value={INQUIRY_STATUS.PENDING}>Pending</option>
                <option value={INQUIRY_STATUS.RESPONDED}>Responded</option>
                <option value={INQUIRY_STATUS.CLOSED}>Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Inquiries Table */}
        <div className="bg-white shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Listing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInquiries.map((inquiry) => (
                  <tr key={inquiry._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{inquiry.client?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{inquiry.client?.email || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{inquiry.listing?.title || 'N/A'}</div>
                      <div className="text-sm text-gray-500">
                        {inquiry.listing?.propertyType || 'N/A'} • {inquiry.listing?.price ? formatPrice(inquiry.listing.price, inquiry.listing.listingType) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{inquiry.agent?.name || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{inquiry.agent?.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                        {getStatusIcon(inquiry.status)}
                        {inquiry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(inquiry.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => {
                          setSelectedInquiry(inquiry);
                          setShowModal(true);
                        }}
                        className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-800 font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredInquiries.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No inquiries found</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedInquiry && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-teal-600 text-white sticky top-0">
              <h2 className="text-2xl font-bold">Inquiry Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center hover:bg-teal-700 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium ${getStatusColor(selectedInquiry.status)}`}>
                  {getStatusIcon(selectedInquiry.status)}
                  {selectedInquiry.status}
                </span>
              </div>

              {/* Listing Info */}
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Property Details
                </h3>
                <div className="space-y-1">
                  <p className="text-lg font-medium text-gray-900">{selectedInquiry.listing?.title}</p>
                  <p className="text-sm text-gray-600">{selectedInquiry.listing?.location?.address}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm bg-white px-2 py-1">{selectedInquiry.listing?.propertyType}</span>
                    <span className="text-sm bg-white px-2 py-1">{selectedInquiry.listing?.listingType}</span>
                    <span className="text-sm font-semibold text-teal-600">
                      {selectedInquiry.listing?.price ? formatPrice(selectedInquiry.listing.price, selectedInquiry.listing.listingType) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Client Info */}
              <div className="border-l-4 border-teal-600 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Client Information</h3>
                <div className="space-y-1">
                  <p className="text-sm"><span className="font-medium">Name:</span> {selectedInquiry.client?.name}</p>
                  <p className="text-sm"><span className="font-medium">Email:</span> {selectedInquiry.client?.email}</p>
                  {selectedInquiry.client?.contactNumber && (
                    <p className="text-sm"><span className="font-medium">Contact:</span> {selectedInquiry.client.contactNumber}</p>
                  )}
                </div>
              </div>

              {/* Agent Info */}
              <div className="border-l-4 border-teal-600 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Agent Information</h3>
                <div className="space-y-1">
                  <p className="text-sm"><span className="font-medium">Name:</span> {selectedInquiry.agent?.name}</p>
                  <p className="text-sm"><span className="font-medium">Email:</span> {selectedInquiry.agent?.email}</p>
                  {selectedInquiry.agent?.phone && (
                    <p className="text-sm"><span className="font-medium">Phone:</span> {selectedInquiry.agent.phone}</p>
                  )}
                </div>
              </div>

              {/* Client Message */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  Client Message
                </h3>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <p className="text-sm text-gray-700 whitespace-pre-line">{selectedInquiry.message}</p>
                  <p className="text-xs text-gray-500 mt-2">{formatDate(selectedInquiry.createdAt)}</p>
                </div>
              </div>

              {/* Agent Response */}
              {selectedInquiry.agentResponse && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Agent Response
                  </h3>
                  <div className="bg-green-50 border-l-4 border-green-500 p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-line">{selectedInquiry.agentResponse}</p>
                    <p className="text-xs text-gray-500 mt-2">{formatDate(selectedInquiry.updatedAt)}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end sticky bottom-0 bg-white">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInquiryPage;