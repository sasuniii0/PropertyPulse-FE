import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchLocationApiClient, getApprovedListingsAPI } from "../services/Listning";
import { MapPinIcon, BedIcon, BathIcon } from "../components/Icons";
import RecentPropertiesSlideshow from "./RecentPropertiesSlideShow";
import SavedPropertiesMap, { type Property } from "./SavedPropertiesMap";
import { fetchLocationApi } from "../services/Admin";

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const TrendingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export default function ClientHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<any[]>([]);
  const [clientLocations, setClientLocations] = useState<Property[]>([]);
  const [location, setLocation] = useState<Property[]>([]);

  console.log(location);
  

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await getApprovedListingsAPI(user.token);
        setProperties(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) fetchProperties();
  }, [user?.token]);

  const featuredProperties = properties.slice(0, 6);
  //const recentProperties = properties.slice(0, 4);

  useEffect(() => {
      if (!user || loading) return; // Wait until auth is fully loaded
    const getLocations = async () => {
      try {
        const token = localStorage.getItem("accessToken"); 
        if (!token) throw new Error("No token found");
  
        const data = await fetchLocationApi(token);
        setLocation(data);
  
        const clientData = await fetchLocationApiClient(token);
        setClientLocations(clientData);
      } catch (err) {
        console.error("Failed to fetch locations in component:", err);
      }
    };
  
    getLocations();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-gray-700 text-xl font-semibold">
        Loading properties...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-800 text-white">
        <RecentPropertiesSlideshow/>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-teal-100 flex items-center justify-center">
                <HomeIcon />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{properties.length}</div>
                <div className="text-sm text-gray-600 font-medium">Available Properties</div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-red-100 flex items-center justify-center">
                <HeartIcon />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">5</div>
                <div className="text-sm text-gray-600 font-medium">Saved Favorites</div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-purple-100 flex items-center justify-center">
                <TrendingIcon />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">12</div>
                <div className="text-sm text-gray-600 font-medium">New This Week</div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
          <section className="bg-white shadow-sm border border-gray-100 p-5 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Property Locations Map</h2>
            <SavedPropertiesMap properties={clientLocations} />
          </section>

        {/* Quick Actions */}
        <div className="bg-white shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Explore Properties</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate("/search?type=HOUSE")}
              className="flex flex-col items-center gap-3 p-4 border-2 border-gray-300 hover:border-teal-600 hover:bg-teal-50 transition-all group"
            >
              <div className="w-16 h-16 bg-blue-100 flex items-center justify-center group-hover:bg-teal-600 transition-colors">
                <svg className="w-8 h-8 text-blue-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-900">Houses</span>
            </button>

            <button
              onClick={() => navigate("/search?type=APARTMENT")}
              className="flex flex-col items-center gap-3 p-4 border-2 border-gray-300 hover:border-teal-600 hover:bg-teal-50 transition-all group"
            >
              <div className="w-16 h-16 bg-green-100 flex items-center justify-center group-hover:bg-teal-600 transition-colors">
                <svg className="w-8 h-8 text-green-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-900">Apartments</span>
            </button>

            <button
              onClick={() => navigate("/search?type=VILLA")}
              className="flex flex-col items-center gap-3 p-4 border-2 border-gray-300 hover:border-teal-600 hover:bg-teal-50 transition-all group"
            >
              <div className="w-16 h-16 bg-purple-100 flex items-center justify-center group-hover:bg-teal-600 transition-colors">
                <svg className="w-8 h-8 text-purple-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-900">Villas</span>
            </button>

            <button
              onClick={() => navigate("/search?type=LAND")}
              className="flex flex-col items-center gap-3 p-4 border-2 border-gray-300 hover:border-teal-600 hover:bg-teal-50 transition-all group"
            >
              <div className="w-16 h-16 bg-yellow-100 flex items-center justify-center group-hover:bg-teal-600 transition-colors">
                <svg className="w-8 h-8 text-yellow-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-900">Land</span>
            </button>
          </div>
        </div>

        {/* Featured Properties */}
        <div className="bg-white shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Featured Properties</h2>
              <p className="text-sm text-gray-600 mt-1">Handpicked properties just for you</p>
            </div>
            <button
              onClick={() => navigate("/search")}
              className="text-sm text-teal-600 font-semibold hover:text-teal-700"
            >
              View All →
            </button>
          </div>

          {featuredProperties.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-sm">No properties available at the moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-5">
              {featuredProperties.map((property) => (
                <div
                  key={property._id}
                  className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => {
                    navigate(`/property/${property._id}`);
                    window.scrollTo(0, 0);
                  }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={property.images?.[0] ?? "/placeholder.jpg"}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-teal-600 text-white px-3 py-1 text-xs font-semibold">
                      {property.propertyType}
                    </div>
                    <button
                      className="absolute top-2 left-2 w-8 h-8 bg-white hover:bg-red-50 flex items-center justify-center group/heart"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add to favorites logic
                      }}
                    >
                      <svg className="w-5 h-5 text-gray-400 group-hover/heart:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                      <MapPinIcon />
                      <span className="truncate">{property.location.address}</span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-1">
                      {property.title}
                    </h3>

                    <div className="flex items-center justify-between mb-3">
                      <p className="text-teal-600 font-bold text-lg">
                        LKR {property.price.toLocaleString()}
                      </p>
                      {property.bedrooms > 0 && (
                        <div className="flex gap-3 text-gray-500 text-xs">
                          <span className="flex items-center gap-1">
                            <BedIcon /> {property.bedrooms}
                          </span>
                          <span className="flex items-center gap-1">
                            <BathIcon /> {property.bathrooms}
                          </span>
                        </div>
                      )}
                    </div>

                    <button 
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 transition-colors text-xs font-semibold"
                    onClick={() => {
                          navigate(`/property/${property._id}`);
                          window.scrollTo(0, 0); // scroll to top immediately
                        }}
                        >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Why Choose Us */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Verified Listings</h3>
            <p className="text-sm text-gray-600">All properties are verified and approved by our team</p>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-16 h-16 bg-green-100 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Best Prices</h3>
            <p className="text-sm text-gray-600">Competitive pricing with no hidden charges</p>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-16 h-16 bg-purple-100 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Expert Support</h3>
            <p className="text-sm text-gray-600">Professional guidance throughout your journey</p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-8 border border-teal-800">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-3">Ready to Find Your Dream Home?</h2>
            <p className="text-teal-100 mb-6">Browse through thousands of verified properties and find the perfect match</p>
            <button
              onClick={() => navigate("/search")}
              className="bg-white text-teal-600 px-8 py-3 font-bold hover:bg-teal-50 transition-colors"
            >
              Start Searching Now
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}