import { useState } from 'react';
import { MessageIcon,ClockIcon,CheckCircleIcon,AlertCircleIcon,EyeIcon,XIcon,MapPinIcon } from '../components/Icons';

export default function MyInquiries() {
  const [filter, setFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState<number | null>(null);

  // Mock inquiries data
  const inquiries = [
    {
      id: 1,
      propertyName: 'Cinnamon Gardens Villa',
      propertyImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop',
      location: 'Colombo 7, Western Province',
      status: 'pending',
      date: '2 days ago',
      message: 'Hi, I am interested in scheduling a viewing for this property. Are weekends available?',
      agentResponse: null,
      price: 'LKR 85,000,000'
    },
    {
      id: 2,
      propertyName: 'Marine Drive Luxury Suite',
      propertyImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
      location: 'Colombo 4, Western Province',
      status: 'responded',
      date: '5 days ago',
      message: 'Could you provide more details about the amenities and parking availability?',
      agentResponse: 'Thank you for your interest! The property includes 2 covered parking spaces, gym, pool, and 24/7 security. I can arrange a viewing this week.',
      price: 'LKR 95,000,000'
    },
    {
      id: 3,
      propertyName: 'Galle Fort Heritage Home',
      propertyImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
      location: 'Galle, Southern Province',
      status: 'pending',
      date: '1 week ago',
      message: 'Is this property negotiable on price? Also, what is the condition of the roof and electrical systems?',
      agentResponse: null,
      price: 'LKR 72,000,000'
    },
    {
      id: 4,
      propertyName: 'Kandy Lake View Apartment',
      propertyImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
      location: 'Kandy, Central Province',
      status: 'responded',
      date: '2 weeks ago',
      message: 'I would like to know about the monthly maintenance fees and whether pets are allowed.',
      agentResponse: 'Monthly maintenance is LKR 15,000. Unfortunately, pets are not permitted in this complex as per building regulations.',
      price: 'LKR 45,000,000'
    },
    {
      id: 5,
      propertyName: 'Mount Lavinia Beach Villa',
      propertyImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
      location: 'Mount Lavinia, Western Province',
      status: 'closed',
      date: '3 weeks ago',
      message: 'Interested in purchasing. Can we discuss payment terms?',
      agentResponse: 'Property has been sold. Thank you for your interest. We have similar properties available if you would like.',
      price: 'LKR 120,000,000'
    },
  ];

  const filteredInquiries = inquiries.filter(inq => {
    if (filter === 'all') return true;
    return inq.status === filter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center gap-1 text-xs font-medium px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">
            <AlertCircleIcon />
            Pending
          </span>
        );
      case 'responded':
        return (
          <span className="flex items-center gap-1 text-xs font-medium px-3 py-1 bg-green-100 text-green-700 rounded-full">
            <CheckCircleIcon />
            Responded
          </span>
        );
      case 'closed':
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

  const stats = {
    total: inquiries.length,
    pending: inquiries.filter(i => i.status === 'pending').length,
    responded: inquiries.filter(i => i.status === 'responded').length,
    closed: inquiries.filter(i => i.status === 'closed').length,
  };

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
              onClick={() => setFilter('pending')}
              className={`flex-1 px-3 py-2 font-medium transition-colors text-sm ${
                filter === 'pending'
                  ? 'bg-yellow-500 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('responded')}
              className={`flex-1 px-3 py-2 font-medium transition-colors text-sm ${
                filter === 'responded'
                  ? 'bg-green-500 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Responded
            </button>
            <button
              onClick={() => setFilter('closed')}
              className={`flex-1 px-3 py-2 font-medium transition-colors text-sm ${
                filter === 'closed'
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
              <p className="text-gray-500 text-sm">You don't have any {filter !== 'all' ? filter : ''} inquiries yet.</p>
            </div>
          ) : (
            filteredInquiries.map((inquiry) => (
              <div key={inquiry.id} className="bg-white shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="p-5">
                  <div className="flex gap-4">
                    {/* Property Image */}
                    <div className="w-28 h-28 overflow-hidden flex-shrink-0">
                      <img src={inquiry.propertyImage} alt={inquiry.propertyName} className="w-full h-full object-cover" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-base font-bold text-gray-900">{inquiry.propertyName}</h3>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                            <MapPinIcon />
                            {inquiry.location}
                          </div>
                          <p className="text-teal-600 font-semibold text-sm mt-1">{inquiry.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(inquiry.status)}
                          <button
                            onClick={() => setSelectedInquiry(selectedInquiry === inquiry.id ? null : inquiry.id)}
                            className="text-teal-600 hover:text-teal-700 flex items-center gap-1 text-xs font-medium"
                          >
                            <EyeIcon />
                            {selectedInquiry === inquiry.id ? 'Hide' : 'View'}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                        <ClockIcon />
                        Sent {inquiry.date}
                      </div>

                      {/* Message Preview */}
                      {selectedInquiry !== inquiry.id && (
                        <p className="text-gray-600 text-xs line-clamp-2">{inquiry.message}</p>
                      )}

                      {/* Expanded View */}
                      {selectedInquiry === inquiry.id && (
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
                            <button className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white transition-colors text-xs font-medium">
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