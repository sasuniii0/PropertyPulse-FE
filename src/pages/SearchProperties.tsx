import { useState , useEffect} from 'react';
import { FilterIcon,SearchIcon,MapPinIcon,BathIcon,BedIcon } from '../components/Icons';
import { getApprovedListingsAPI } from '../services/Listning';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SearchProperties() {
  const {user} = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [propertyType, setPropertyType] = useState('all');
  const [bedrooms, setBedrooms] = useState('all');
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<any[]>([]); 
  
  const navigate = useNavigate();

  // Fetch approved listings from backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await getApprovedListingsAPI(user.token);
        setProperties(data);
      } catch (err) {
        console.error('Failed to fetch properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [user.token]);

  // Filter properties based on search criteria
  const filteredProperties = properties.filter(property => {
    const matchesSearch =
      (property.title?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
      (property.location.address?.toLowerCase() ?? '').includes(searchTerm.toLowerCase());
    
    const matchesType = propertyType === 'all' || property.propertyType === propertyType;
    
    const matchesBedrooms = bedrooms === 'all' || 
                           (bedrooms === '1' && property.bedrooms === 1) ||
                           (bedrooms === '2' && property.bedrooms === 2) ||
                           (bedrooms === '3' && property.bedrooms === 3) ||
                           (bedrooms === '4+' && property.bedrooms >= 4);
    
    const priceNum = typeof property.price === 'string'
            ? parseInt(property.price.replace(/,/g, ''))
            : Number(property.price);
    const matchesPrice = priceRange === 'all' ||
                        (priceRange === 'low' && priceNum < 50000000) ||
                        (priceRange === 'mid' && priceNum >= 50000000 && priceNum < 80000000) ||
                        (priceRange === 'high' && priceNum >= 80000000);
    
    return matchesSearch && matchesType && matchesBedrooms && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Search Properties</h1>
          <p className="text-gray-600 text-sm mt-0.5">Find your dream property from our listings</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white shadow-sm border border-gray-100 p-5">
          <div className="grid md:grid-cols-5 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                />
              </div>
            </div>

            {/* Property Type Filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              >
                <option value="all">All Types</option>
                <option value="HOUSE">House</option>
                <option value="APARTMENT">Apartment</option>
                <option value="VILLA">Villa</option>
                <option value="LAND">Land</option>
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Price Range</label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              >
                <option value="all">All Prices</option>
                <option value="low">Under 50M</option>
                <option value="mid">50M - 80M</option>
                <option value="high">Above 80M</option>
              </select>
            </div>

            {/* Bedrooms Filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Bedrooms</label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              >
                <option value="all">Any</option>
                <option value="1">1 Bed</option>
                <option value="2">2 Beds</option>
                <option value="3">3 Beds</option>
                <option value="4+">4+ Beds</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600 text-sm">
            <span className="font-semibold text-gray-900">{filteredProperties.length}</span> properties found
          </p>
          <button className="flex items-center gap-2 px-3 py-1.5 text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200">
            <FilterIcon />
            <span className="text-xs font-medium">Sort By</span>
          </button>
        </div>

        {/* Properties Grid */}
        <div className="grid md:grid-cols-3 gap-5">
          {filteredProperties.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 mb-3">
                <SearchIcon />
              </div>
              <p className="text-gray-500 text-base mb-4">No properties found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setPriceRange('all');
                  setPropertyType('all');
                  setBedrooms('all');
                }}
                className="px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white transition-colors text-sm font-medium"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredProperties.map((p,index) => (
              <div key={p.id ?? index} className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer group border border-gray-100">
                <div className="relative h-44 overflow-hidden">
                  <img 
                    src={p.images?.[0] ?? '/placeholder.jpg'} 
                    alt={p.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute top-2 right-2 bg-teal-500 text-white px-2.5 py-0.5 text-xs font-medium capitalize">
                    {p.propertyType}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                    <MapPinIcon />
                    {p.location.address}
                  </div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{p.title}</h3>
                      <p className="text-teal-600 font-bold text-base mt-1">LKR {p.price}</p>
                    </div>
                    {p.bedrooms > 0 && (
                      <div className="flex gap-3 text-gray-500 text-xs">
                        <span className="flex items-center gap-1"><BedIcon /> {p.bedrooms}</span>
                        <span className="flex items-center gap-1"><BathIcon /> {p.bathrooms}</span>
                      </div>
                    )}
                  </div>
                  <button 
                        onClick={() => {
                          navigate(`/property/${p._id}`);
                          window.scrollTo(0, 0); // scroll to top immediately
                        }}
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 transition-colors text-xs font-medium"
                      >
                        View Details
                      </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}