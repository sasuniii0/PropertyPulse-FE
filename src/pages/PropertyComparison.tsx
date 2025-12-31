import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getSavedPropertiesAPI, type SavedPropertyData } from '../services/SavedProperty';
import { comparePropertiesAPI, type ComparisonResult } from '../services/PropertyComparison';
import toast from 'react-hot-toast';

export default function PropertyComparison() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [savedProperties, setSavedProperties] = useState<SavedPropertyData[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [comparing, setComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);

  useEffect(() => {
    if (!user?.token) {
      navigate('/login');
      return;
    }

    if (user.role !== 'CLIENT') {
      toast.error('Only clients can compare properties');
      navigate('/');
      return;
    }

    fetchSavedProperties();
  }, [user, navigate]);

  const fetchSavedProperties = async () => {
    if (!user?.token) return;

    try {
      setLoading(true);
      const data = await getSavedPropertiesAPI(user.token);
      setSavedProperties(data);
    } catch (error: any) {
      console.error('Failed to fetch saved properties:', error);
      toast.error('Failed to load saved properties');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProperty = (propertyId: string) => {
    if (selectedProperties.includes(propertyId)) {
      setSelectedProperties(prev => prev.filter(id => id !== propertyId));
    } else if (selectedProperties.length < 2) {
      setSelectedProperties(prev => [...prev, propertyId]);
    } else {
      toast.error('You can only select 2 properties to compare');
    }
  };

  const handleCompare = async () => {
    if (selectedProperties.length !== 2) {
      toast.error('Please select exactly 2 properties to compare');
      return;
    }

    if (!user?.token) return;

    try {
      setComparing(true);
      const result = await comparePropertiesAPI(user.token, selectedProperties[0], selectedProperties[1]);
      setComparisonResult(result);
      toast.success('Comparison completed!');
    } catch (error: any) {
      console.error('Failed to compare properties:', error);
      toast.error('Failed to compare properties');
    } finally {
      setComparing(false);
    }
  };

  const handleReset = () => {
    setSelectedProperties([]);
    setComparisonResult(null);
  };

  const getSelectedProperty = (index: number) => {
    const propertyId = selectedProperties[index];
    return savedProperties.find(sp => sp.listing._id === propertyId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg font-medium">Loading properties...</p>
        </div>
      </div>
    );
  }

  if (savedProperties.length < 2) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="mb-6">
            <svg className="w-20 h-20 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Not Enough Properties</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            You need at least 2 saved properties to use the comparison feature. 
            Start saving your favorite properties!
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/properties')}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium transition-colors"
            >
              Browse Properties
            </button>
            <button
              onClick={() => navigate('/saved-properties')}
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              View Saved
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="mb-8">
          <div className="inline-block mb-3">
            <span className="px-4 py-1.5 bg-teal-50 text-teal-700 text-sm font-semibold border border-teal-200">
              AI-Powered Analysis
            </span>
          </div>
          
          <div className='flex items-center gap-3 mb-2'>
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                Property Comparison
          </h1>
            </div>
          </div>
          <p className="text-gray-600">
            Select 2 properties from your saved listings and let AI analyze them for you
          </p>
        </div>

        {!comparisonResult ? (
          <>
            {/* Selection Status */}
            <div className="bg-white border border-gray-200 shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${selectedProperties.length >= 1 ? 'bg-teal-500' : 'bg-gray-300'}`}></div>
                    <span className="text-gray-700 font-medium">Property 1</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${selectedProperties.length >= 2 ? 'bg-teal-500' : 'bg-gray-300'}`}></div>
                    <span className="text-gray-700 font-medium">Property 2</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  {selectedProperties.length > 0 && (
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium border border-gray-300 hover:bg-gray-50"
                    >
                      Clear Selection
                    </button>
                  )}
                  <button
                    onClick={handleCompare}
                    disabled={selectedProperties.length !== 2 || comparing}
                    className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {comparing ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                      </span>
                    ) : (
                      'Compare Properties'
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Properties Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProperties.map((savedProp) => {
                const property = savedProp.listing;
                const isSelected = selectedProperties.includes(property._id);
                const selectionIndex = selectedProperties.indexOf(property._id);
                
                return (
                  <div
                    key={savedProp._id}
                    onClick={() => handleSelectProperty(property._id)}
                    className={`relative bg-white shadow-sm hover:shadow-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-teal-500 shadow-lg' 
                        : 'border-gray-200 hover:border-teal-300'
                    }`}
                  >
                    {/* Selection Badge */}
                    {isSelected && (
                      <div className="absolute top-4 left-4 z-10 w-10 h-10 bg-teal-600 flex items-center justify-center text-white font-bold shadow-md">
                        {selectionIndex + 1}
                      </div>
                    )}

                    {/* Image */}
                    <div className="relative h-56 overflow-hidden bg-gray-100">
                      <img
                        src={property.images?.[0] || '/placeholder.png'}
                        alt={property.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/placeholder.png';
                        }}
                      />
                      
                      {/* Property Type Badge */}
                      <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-white text-gray-800 text-xs font-bold shadow-md">
                        {property.propertyType}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 text-xl mb-2 line-clamp-1">
                        {property.title}
                      </h3>

                      <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span className="line-clamp-1">{property.location?.address || 'Location not specified'}</span>
                      </div>

                      <div className="text-teal-600 font-bold text-2xl mb-4">
                        LKR {property.price?.toLocaleString()}
                      </div>

                      {/* Property Features */}
                      <div className="flex gap-4 text-gray-600 text-sm pb-4 border-b border-gray-200">
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          <span>{property.bedrooms || 0} Beds</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                          </svg>
                          <span>{property.bathrooms || 0} Baths</span>
                        </div>
                        {property.size && (
                          <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                            <span>{property.size} sqft</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 text-center">
                        <span className={`text-sm font-semibold ${isSelected ? 'text-teal-600' : 'text-gray-500'}`}>
                          {isSelected ? '✓ Selected' : 'Click to select'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Comparison Results */
          <div className="space-y-8">
            {/* Back Button */}
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">Back to Selection</span>
            </button>

            {/* Side by Side Comparison */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {[0, 1].map((index) => {
                const savedProp = getSelectedProperty(index);
                if (!savedProp) return null;
                const property = savedProp.listing;

                return (
                  <div key={index} className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                    <div className="relative h-64 bg-gray-100">
                      <img
                        src={property.images?.[0] || '/placeholder.png'}
                        alt={property.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/placeholder.png';
                        }}
                      />
                      <div className="absolute top-4 left-4 w-10 h-10 bg-teal-600 flex items-center justify-center text-white font-bold shadow-md">
                        {index + 1}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h3>
                      <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {property.location?.address}
                      </div>
                      
                      <div className="text-teal-600 font-bold text-3xl mb-6">
                        LKR {property.price?.toLocaleString()}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-gray-700">
                        <div>
                          <span className="text-gray-500 text-sm block mb-1">Property Type</span>
                          <span className="font-semibold">{property.propertyType}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 text-sm block mb-1">Listing Type</span>
                          <span className="font-semibold">{property.propertyType}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 text-sm block mb-1">Bedrooms</span>
                          <span className="font-semibold">{property.bedrooms || 0}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 text-sm block mb-1">Bathrooms</span>
                          <span className="font-semibold">{property.bathrooms || 0}</span>
                        </div>
                        {property.size && (
                          <div>
                            <span className="text-gray-500 text-sm block mb-1">Size</span>
                            <span className="font-semibold">{property.size} sqft</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI Analysis */}
            <div className="bg-white border border-gray-200 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
                <div className="w-12 h-12 bg-teal-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">AI Analysis</h2>
              </div>

              <div className="space-y-8">
                {/* Key Differences */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-1 h-5 bg-teal-600"></span>
                    Key Differences
                  </h3>
                  <div className="bg-gray-50 border border-gray-200 p-5 text-gray-700 leading-relaxed">
                    {comparisonResult.keyDifferences}
                  </div>
                </div>

                {/* Pros and Cons */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="w-1 h-5 bg-teal-600"></span>
                      Property 1 - Pros & Cons
                    </h3>
                    <div className="bg-gray-50 border border-gray-200 p-5 space-y-4">
                      <div>
                        <span className="text-green-600 font-bold block mb-2 text-sm uppercase tracking-wide">✓ Pros</span>
                        <p className="text-gray-700 text-sm leading-relaxed">{comparisonResult.property1Pros}</p>
                      </div>
                      <div>
                        <span className="text-red-600 font-bold block mb-2 text-sm uppercase tracking-wide">✗ Cons</span>
                        <p className="text-gray-700 text-sm leading-relaxed">{comparisonResult.property1Cons}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="w-1 h-5 bg-teal-600"></span>
                      Property 2 - Pros & Cons
                    </h3>
                    <div className="bg-gray-50 border border-gray-200 p-5 space-y-4">
                      <div>
                        <span className="text-green-600 font-bold block mb-2 text-sm uppercase tracking-wide">✓ Pros</span>
                        <p className="text-gray-700 text-sm leading-relaxed">{comparisonResult.property2Pros}</p>
                      </div>
                      <div>
                        <span className="text-red-600 font-bold block mb-2 text-sm uppercase tracking-wide">✗ Cons</span>
                        <p className="text-gray-700 text-sm leading-relaxed">{comparisonResult.property2Cons}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Best For */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-1 h-5 bg-teal-600"></span>
                    Best Suited For
                  </h3>
                  <div className="bg-gray-50 border border-gray-200 p-5 text-gray-700 leading-relaxed">
                    {comparisonResult.bestFor}
                  </div>
                </div>

                {/* Recommendation */}
                <div className="bg-teal-50 border-2 border-teal-600 p-6">
                  <h3 className="text-xl font-bold text-teal-900 mb-3 flex items-center gap-2">
                    <svg className="w-6 h-6 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    Final Recommendation
                  </h3>
                  <p className="text-gray-800 text-base leading-relaxed">
                    {comparisonResult.recommendation}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-6">
              <button
                onClick={() => navigate('/saved-properties')}
                className="px-8 py-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                View All Saved
              </button>
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-colors"
              >
                Compare More Properties
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}