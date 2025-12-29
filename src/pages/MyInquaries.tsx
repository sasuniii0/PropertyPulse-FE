import { useState, useEffect } from 'react';
import { MessageIcon, ClockIcon, CheckCircleIcon, AlertCircleIcon, EyeIcon, XIcon, MapPinIcon } from '../components/Icons';
import { useAuth } from '../context/AuthContext';
import { getClientInquiriesAPI, getAgentInquiriesAPI, respondToInquiryAPI, closeInquiryAPI, type InquiryData } from '../services/Inquiry';

export default function MyInquiries() {
  const { user } = useAuth();

  const [inquiries, setInquiries] = useState<InquiryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'PENDING' | 'RESPONDED' | 'CLOSED'>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<string | null>(null);
  const [responseText, setResponseText] = useState<Record<string, string>>({});

  // Fetch inquiries on mount
  useEffect(() => {
    const fetchInquiries = async () => {
      if (!user?.token) return;

      try {
        setLoading(true);

        const res =
          user.role === "CLIENT"
            ? await getClientInquiriesAPI(user.token)
            : await getAgentInquiriesAPI(user.token);

        setInquiries(res.data);
      } catch (err) {
        console.error("Failed to load inquiries", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, [user]);

  // Handle closing an inquiry (AGENT only)
  const handleCloseInquiry = async (id: string) => {
    if (!user?.token) return;

    try {
      await closeInquiryAPI(user.token, id);

      setInquiries(prev =>
        prev.map(i =>
          i._id === id ? { ...i, status: "CLOSED" } : i
        )
      );
    } catch {
      alert("Failed to close inquiry");
    }
  };

  // Handle sending response (AGENT only)
  const handleSendResponse = async (id: string) => {
    if (!user?.token) return;

    const response = responseText[id];
    if (!response || response.trim() === '') {
      alert("Please enter a response");
      return;
    }

    try {
      await respondToInquiryAPI(user.token, id, response);

      setInquiries(prev =>
        prev.map(i =>
          i._id === id
            ? { ...i, agentResponse: response, status: "RESPONDED" }
            : i
        )
      );

      setResponseText(prev => ({ ...prev, [id]: "" }));
      setSelectedInquiry(null);
    } catch {
      alert("Failed to send response");
    }
  };

  // Filter inquiries based on status
  const filteredInquiries = inquiries.filter(inq => {
    if (filter === 'all') return true;
    return inq.status === filter;
  });

  // Get status badge component
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="flex items-center gap-1 text-xs font-medium px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">
            <AlertCircleIcon />
            {user?.role === 'AGENT' ? 'Needs Response' : 'Pending'}
          </span>
        );
      case 'RESPONDED':
        return (
          <span className="flex items-center gap-1 text-xs font-medium px-3 py-1 bg-green-100 text-green-700 rounded-full">
            <CheckCircleIcon />
            Responded
          </span>
        );
      case 'CLOSED':
        return (
          <span className="flex items-center gap-1 text-xs font-medium px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
            <XIcon />
            Closed
          </span>
        );
      default:
        return null;
    }
  };

  // Calculate stats
  const stats = {
    total: inquiries.length,
    pending: inquiries.filter(i => i.status === 'PENDING').length,
    responded: inquiries.filter(i => i.status === 'RESPONDED').length,
    closed: inquiries.filter(i => i.status === 'CLOSED').length,
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 text-lg font-semibold">Loading inquiries...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-700 text-xl font-semibold">Unauthorized — please log in.</p>
        </div>
      </div>
    );
  }

  // CLIENT VIEW
  if (user.role === 'CLIENT') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Inquiries</h1>
            <p className="text-gray-600 text-sm mt-0.5">Track all your property inquiries and responses</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-gray-500 text-xs mt-1">Total Inquiries</div>
                </div>
                <div className="bg-blue-100 p-2.5">
                  <MessageIcon />
                </div>
              </div>
            </div>

            <div className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                  <div className="text-gray-500 text-xs mt-1">Pending</div>
                </div>
                <div className="bg-yellow-100 p-2.5 text-yellow-600">
                  <ClockIcon />
                </div>
              </div>
            </div>

            <div className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.responded}</div>
                  <div className="text-gray-500 text-xs mt-1">Responded</div>
                </div>
                <div className="bg-green-100 p-2.5 text-green-600">
                  <CheckCircleIcon />
                </div>
              </div>
            </div>

            <div className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-600">{stats.closed}</div>
                  <div className="text-gray-500 text-xs mt-1">Closed</div>
                </div>
                <div className="bg-gray-100 p-2.5 text-gray-600">
                  <XIcon />
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white shadow-sm border border-gray-100 p-1.5">
            <div className="flex gap-1">
              <button
                onClick={() => setFilter('all')}
                className={`flex-1 px-3 py-2 font-medium transition-colors text-sm ${
                  filter === 'all'
                    ? 'bg-teal-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All Inquiries
              </button>
              <button
                onClick={() => setFilter('PENDING')}
                className={`flex-1 px-3 py-2 font-medium transition-colors text-sm ${
                  filter === 'PENDING'
                    ? 'bg-yellow-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('RESPONDED')}
                className={`flex-1 px-3 py-2 font-medium transition-colors text-sm ${
                  filter === 'RESPONDED'
                    ? 'bg-green-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Responded
              </button>
              <button
                onClick={() => setFilter('CLOSED')}
                className={`flex-1 px-3 py-2 font-medium transition-colors text-sm ${
                  filter === 'CLOSED'
                    ? 'bg-gray-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Closed
              </button>
            </div>
          </div>

          {/* Inquiries List */}
          <div className="space-y-3">
            {filteredInquiries.length === 0 ? (
              <div className="bg-white shadow-sm border border-gray-100 p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 mb-3">
                  <MessageIcon />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No Inquiries Found</h3>
                <p className="text-gray-500 text-sm">
                  You don't have any {filter !== 'all' ? filter.toLowerCase() : ''} inquiries yet.
                </p>
              </div>
            ) : (
              filteredInquiries.map((inquiry) => (
                <div key={inquiry._id} className="bg-white shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <div className="p-5">
                    <div className="flex gap-4">
                      {/* Property Image */}
                      <div className="w-28 h-28 overflow-hidden flex-shrink-0">
                        <img 
                          src={inquiry.listing?.images?.[0] || '/placeholder-property.jpg'} 
                          alt={inquiry.listing?.title || 'Property'} 
                          className="w-full h-full object-cover" 
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-base font-bold text-gray-900">
                              {inquiry.listing?.title || 'Property'}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                              <MapPinIcon />
                              {inquiry.listing?.location?.address || 'Location not specified'}
                            </div>
                            <p className="text-teal-600 font-semibold text-sm mt-1">
                              LKR {inquiry.listing?.price?.toLocaleString() || 'N/A'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(inquiry.status)}
                            <button
                              onClick={() => setSelectedInquiry(selectedInquiry === inquiry._id ? null : inquiry._id)}
                              className="text-teal-600 hover:text-teal-700 flex items-center gap-1 text-xs font-medium"
                            >
                              <EyeIcon />
                              {selectedInquiry === inquiry._id ? 'Hide' : 'View'}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                          <ClockIcon />
                          Sent {formatDate(inquiry.createdAt)}
                        </div>

                        {/* Message Preview */}
                        {selectedInquiry !== inquiry._id && (
                          <p className="text-gray-600 text-xs line-clamp-2">{inquiry.message}</p>
                        )}

                        {/* Expanded View */}
                        {selectedInquiry === inquiry._id && (
                          <div className="mt-3 space-y-3">
                            {/* Your Message */}
                            <div className="bg-gray-50 p-3 border border-gray-200">
                              <div className="text-xs font-semibold text-gray-500 mb-1.5">YOUR MESSAGE</div>
                              <p className="text-gray-700 text-xs leading-relaxed">{inquiry.message}</p>
                            </div>

                            {/* Agent Response */}
                            {inquiry.agentResponse ? (
                              <div className="bg-teal-50 p-3 border-l-4 border-teal-500">
                                <div className="text-xs font-semibold text-teal-700 mb-1.5">AGENT RESPONSE</div>
                                <p className="text-gray-700 text-xs leading-relaxed">{inquiry.agentResponse}</p>
                              </div>
                            ) : (
                              <div className="bg-yellow-50 p-3 border-l-4 border-yellow-500">
                                <div className="text-xs font-semibold text-yellow-700 mb-1">WAITING FOR RESPONSE</div>
                                <p className="text-gray-600 text-xs">The agent hasn't responded yet. We'll notify you once they reply.</p>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2 pt-2">
                              <button 
                                onClick={() => window.location.href = `/property/${inquiry.listing?._id}`}
                                className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white transition-colors text-xs font-medium"
                              >
                                View Property
                              </button>
                              {inquiry.agentResponse && (
                                <button className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white transition-colors text-xs font-medium">
                                  Reply
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    );
  }

  // AGENT VIEW
  if (user.role === 'AGENT') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Client Inquiries</h1>
            <p className="text-gray-600 text-sm mt-0.5">Manage and respond to property inquiries from potential buyers</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-gray-500 text-xs mt-1">Total Inquiries</div>
                </div>
                <div className="bg-blue-100 p-2.5">
                  <MessageIcon />
                </div>
              </div>
            </div>

            <div className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                  <div className="text-gray-500 text-xs mt-1">Needs Response</div>
                </div>
                <div className="bg-yellow-100 p-2.5 text-yellow-600">
                  <AlertCircleIcon />
                </div>
              </div>
            </div>

            <div className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.responded}</div>
                  <div className="text-gray-500 text-xs mt-1">Responded</div>
                </div>
                <div className="bg-green-100 p-2.5 text-green-600">
                  <CheckCircleIcon />
                </div>
              </div>
            </div>

            <div className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-600">{stats.closed}</div>
                  <div className="text-gray-500 text-xs mt-1">Closed</div>
                </div>
                <div className="bg-gray-100 p-2.5 text-gray-600">
                  <XIcon />
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white shadow-sm border border-gray-100 p-1.5">
            <div className="flex gap-1">
              <button
                onClick={() => setFilter('all')}
                className={`flex-1 px-3 py-2 font-medium transition-colors text-sm ${
                  filter === 'all'
                    ? 'bg-teal-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All Inquiries
              </button>
              <button
                onClick={() => setFilter('PENDING')}
                className={`flex-1 px-3 py-2 font-medium transition-colors text-sm ${
                  filter === 'PENDING'
                    ? 'bg-yellow-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Needs Response
              </button>
              <button
                onClick={() => setFilter('RESPONDED')}
                className={`flex-1 px-3 py-2 font-medium transition-colors text-sm ${
                  filter === 'RESPONDED'
                    ? 'bg-green-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Responded
              </button>
              <button
                onClick={() => setFilter('CLOSED')}
                className={`flex-1 px-3 py-2 font-medium transition-colors text-sm ${
                  filter === 'CLOSED'
                    ? 'bg-gray-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Closed
              </button>
            </div>
          </div>

          {/* Inquiries List */}
          <div className="space-y-3">
            {filteredInquiries.length === 0 ? (
              <div className="bg-white shadow-sm border border-gray-100 p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 mb-3">
                  <MessageIcon />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No Inquiries Found</h3>
                <p className="text-gray-500 text-sm">
                  You don't have any {filter !== 'all' ? filter.toLowerCase() : ''} inquiries yet.
                </p>
              </div>
            ) : (
              filteredInquiries.map((inquiry) => (
                <div key={inquiry._id} className="bg-white shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <div className="p-5">
                    <div className="flex gap-4">
                      {/* Property Image */}
                      <div className="w-28 h-28 overflow-hidden flex-shrink-0">
                        <img 
                          src={inquiry.listing?.images?.[0] || '/placeholder-property.jpg'} 
                          alt={inquiry.listing?.title || 'Property'} 
                          className="w-full h-full object-cover" 
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-base font-bold text-gray-900">
                              {inquiry.listing?.title || 'Property'}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                              <MapPinIcon />
                              {inquiry.listing?.location?.address || 'Location not specified'}
                            </div>
                            <p className="text-teal-600 font-semibold text-sm mt-1">
                              LKR {inquiry.listing?.price?.toLocaleString() || 'N/A'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(inquiry.status)}
                            <button
                              onClick={() => setSelectedInquiry(selectedInquiry === inquiry._id ? null : inquiry._id)}
                              className="text-teal-600 hover:text-teal-700 flex items-center gap-1 text-xs font-medium"
                            >
                              <EyeIcon />
                              {selectedInquiry === inquiry._id ? 'Hide' : 'View'}
                            </button>
                          </div>
                        </div>

                        {/* Client Info */}
                        <div className="bg-blue-50 p-2.5 mb-2 border-l-2 border-blue-500">
                          <div className="text-xs font-semibold text-blue-900 mb-1">CLIENT INFORMATION</div>
                          <div className="text-xs text-gray-700 space-y-0.5">
                            <div><span className="font-medium">Name:</span> {inquiry.client?.name || 'N/A'}</div>
                            <div><span className="font-medium">Email:</span> {inquiry.client?.email || 'N/A'}</div>
                            <div><span className="font-medium">Phone:</span> {inquiry.client?.phone || 'N/A'}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                          <ClockIcon />
                          Received {formatDate(inquiry.createdAt)}
                        </div>

                        {/* Message Preview */}
                        {selectedInquiry !== inquiry._id && (
                          <p className="text-gray-600 text-xs line-clamp-2">{inquiry.message}</p>
                        )}

                        {/* Expanded View */}
                        {selectedInquiry === inquiry._id && (
                          <div className="mt-3 space-y-3">
                            {/* Client Message */}
                            <div className="bg-gray-50 p-3 border border-gray-200">
                              <div className="text-xs font-semibold text-gray-500 mb-1.5">CLIENT MESSAGE</div>
                              <p className="text-gray-700 text-xs leading-relaxed">{inquiry.message}</p>
                            </div>

                            {/* Your Response */}
                            {inquiry.agentResponse ? (
                              <div className="bg-teal-50 p-3 border-l-4 border-teal-500">
                                <div className="text-xs font-semibold text-teal-700 mb-1.5">YOUR RESPONSE</div>
                                <p className="text-gray-700 text-xs leading-relaxed">{inquiry.agentResponse}</p>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="text-xs font-semibold text-gray-700">SEND RESPONSE</div>
                                <textarea
                                  value={responseText[inquiry._id] || ''}
                                  onChange={(e) => setResponseText({ ...responseText, [inquiry._id]: e.target.value })}
                                  placeholder="Type your response to the client..."
                                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs resize-none"
                                  rows={4}
                                />
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2 pt-2 flex-wrap">
                              <button 
                                onClick={() => window.location.href = `/properties/${inquiry.listing?._id}`}
                                className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white transition-colors text-xs font-medium"
                              >
                                View Property
                              </button>
                              {!inquiry.agentResponse && inquiry.status === 'PENDING' && (
                                <button 
                                  onClick={() => handleSendResponse(inquiry._id)}
                                  className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white transition-colors text-xs font-medium flex items-center gap-1"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                  </svg>
                                  Send Response
                                </button>
                              )}
                              {inquiry.status !== 'CLOSED' && (
                                <button 
                                  onClick={() => handleCloseInquiry(inquiry._id)}
                                  className="px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white transition-colors text-xs font-medium"
                                >
                                  Mark as Closed
                                </button>
                              )}
                              <a 
                                href={`mailto:${inquiry.client?.email}`}
                                className="px-3 py-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 transition-colors text-xs font-medium"
                              >
                                Email Client
                              </a>
                              {inquiry.client?.phone && (
                                <a 
                                  href={`tel:${inquiry.client.phone}`}
                                  className="px-3 py-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 transition-colors text-xs font-medium"
                                >
                                  Call Client
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    );
  }

  return null;
}