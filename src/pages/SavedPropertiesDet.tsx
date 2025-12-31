import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getSavedPropertiesAPI, unsavePropertyAPI, type SavedPropertyData } from '../services/SavedProperty';
import toast from 'react-hot-toast';

// For the propertyType field of a property
export type PropertyType = 'HOUSE' | 'APARTMENT' | 'VILLA' | 'LAND';

// Optional: Include 'all' for filtering
export type PropertyFilter = PropertyType | 'all';

export default function SavedProperties() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [savedProperties, setSavedProperties] = useState<SavedPropertyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<PropertyFilter>('all');

  useEffect(() => {
    if (!user?.token) {
      navigate('/login');
      return;
    }

    if (user.role !== 'CLIENT') {
      toast.error('Only clients can view saved properties');
      navigate('/');
      return;
    }

    fetchSavedProperties();
  }, [user, navigate]);

  const fetchSavedProperties = async () => {
    if (!user?.token) return;

    const token = user.token

    try {
        console.log(token);
        
      setLoading(true);
      const data = await getSavedPropertiesAPI(token);
      setSavedProperties(data);
      setLoading(false);
      
    } catch (error: any) {
      console.error('Failed to fetch saved properties:', error);
      toast.error('Failed to load saved properties');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (listingId: string, propertyTitle: string) => {
    if (!user?.token) return;

    try {
      await unsavePropertyAPI(user.token, listingId);
      setSavedProperties(prev => prev.filter(sp => sp.listing._id !== listingId));
      toast.success(`${propertyTitle} removed from saved properties`);
    } catch (error: any) {
      console.error('Failed to unsave property:', error);
      toast.error('Failed to remove property');
    }
  };

  const filteredProperties = savedProperties.filter(sp => {
    if (filter === 'all') return true;
    return sp.listing.propertyType === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading saved properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Saved Properties</h1>
            </div>
          </div>
          <p className="text-gray-600">
            You have {savedProperties.length} {savedProperties.length === 1 ? 'property' : 'properties'} saved
          </p>
        </div>

        {/* Filter Tabs */}
        {savedProperties.length > 0 && (
          <div className="bg-white shadow-sm border border-gray-100 p-1.5 mb-6">
            <div className="flex gap-1 overflow-x-auto">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 font-medium transition-colors text-sm whitespace-nowrap ${
                  filter === 'all'
                    ? 'bg-teal-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All ({savedProperties.length})
              </button>
              <button
                onClick={() => setFilter('HOUSE')}
                className={`px-4 py-2 font-medium transition-colors text-sm whitespace-nowrap ${
                  filter === 'HOUSE'
                    ? 'bg-teal-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Houses ({savedProperties.filter(sp => sp.listing.propertyType === 'House').length})
              </button>
              <button
                onClick={() => setFilter('APARTMENT')}
                className={`px-4 py-2 font-medium transition-colors text-sm whitespace-nowrap ${
                  filter === 'APARTMENT'
                    ? 'bg-teal-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Apartments ({savedProperties.filter(sp => sp.listing.propertyType === 'Apartment').length})
              </button>
              <button
                onClick={() => setFilter('VILLA')}
                className={`px-4 py-2 font-medium transition-colors text-sm whitespace-nowrap ${
                  filter === 'VILLA'
                    ? 'bg-teal-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Villas ({savedProperties.filter(sp => sp.listing.propertyType === 'Villa').length})
              </button>
              <button
                onClick={() => setFilter('LAND')}
                className={`px-4 py-2 font-medium transition-colors text-sm whitespace-nowrap ${
                  filter === 'LAND'
                    ? 'bg-teal-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Land ({savedProperties.filter(sp => sp.listing.propertyType === 'Land').length})
              </button>
            </div>
          </div>
        )}
        <div className='pt-4 pb-4'>
          <button
          onClick={() => navigate('/compare-properties')}
          className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium transition-colors text-sm "
        >
          Compare Properties
        </button>
        </div>

        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <div className="bg-white shadow-sm border border-gray-100 p-12 text-center">
            <svg className="w-24 h-24 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Saved Properties</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You haven't saved any properties yet. Start exploring and save your favorites!"
                : `No ${filter.toLowerCase()}s in your saved properties.`
              }
            </p>
            <button
              onClick={() => navigate('/properties')}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium transition-colors"
            >
              Browse Properties
            </button>
          </div>
        )}

        {/* Properties Grid */}
        {filteredProperties.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((savedProp) => {
              const property = savedProp.listing;
              
              return (
                <div
                  key={savedProp._id}
                  className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden group"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={property.images?.[0] || '/placeholder.png'}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/placeholder.png';
                      }}
                    />
                    
                    {/* Unsave Button */}
                    <button
                      onClick={() => handleUnsave(property._id, property.title ?? " ")}
                      className="absolute top-3 right-3 w-10 h-10 bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-colors group/btn"
                      title="Remove from saved"
                    >
                      <svg className="w-5 h-5 text-red-500 group-hover/btn:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </button>

                    {/* Property Type Badge */}
                    {property.propertyType && (
                      <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/70 text-white text-xs font-medium">
                        {property.propertyType}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {property.location?.address || 'Location not specified'}
                    </div>

                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">
                      {property.title}
                    </h3>

                    <p className="text-teal-600 font-bold text-xl mb-3">
                      LKR {property.price?.toLocaleString()}
                    </p>

                    {/* Property Features */}
                    <div className="flex gap-4 text-gray-600 text-sm mb-4 pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span>{property.bedrooms || 0} Beds</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                        </svg>
                        <span>{property.bathrooms || 0} Baths</span>
                      </div>
                      {property.size && (
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                          <span>{property.size} sqft</span>
                        </div>
                      )}
                    </div>

                    {/* Saved Date */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Saved {new Date(savedProp.createdAt).toLocaleDateString()}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/property/${property._id}`)}
                        className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium transition-colors text-sm"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => navigate(`/property/${property._id}`)}
                        className="px-4 py-2 border border-teal-600 text-teal-600 hover:bg-teal-50 font-medium transition-colors text-sm"
                      >
                        Contact Agent
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}