import { useState } from 'react';
import { FilterIcon,SearchIcon,MapPinIcon,BathIcon,BedIcon } from '../components/Icons';

export default function SearchProperties() {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [propertyType, setPropertyType] = useState('all');
  const [bedrooms, setBedrooms] = useState('all');

  // Mock properties data (expanded)
  const allProperties = [
    {
      id: 1,
      name: 'Cinnamon Gardens Villa',
      price: '85,000,000',
      address: 'Colombo 7, Western Province',
      beds: 4,
      baths: 3,
      type: 'villa',
      img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      name: 'Nuwara Eliya Hill Plot',
      price: '18,500,000',
      address: 'Nuwara Eliya, Central Province',
      beds: 3,
      baths: 2,
      type: 'land',
      img: 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      name: 'Marine Drive Luxury Suite',
      price: '95,000,000',
      address: 'Colombo 4, Western Province',
      beds: 4,
      baths: 3,
      type: 'apartment',
      img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      name: 'Galle Fort Heritage Home',
      price: '72,000,000',
      address: 'Galle, Southern Province',
      beds: 3,
      baths: 2,
      type: 'house',
      img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop'
    },
    {
      id: 5,
      name: 'Kandy Lake View Apartment',
      price: '45,000,000',
      address: 'Kandy, Central Province',
      beds: 2,
      baths: 2,
      type: 'apartment',
      img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'
    },
    {
      id: 6,
      name: 'Mount Lavinia Beach Villa',
      price: '120,000,000',
      address: 'Mount Lavinia, Western Province',
      beds: 5,
      baths: 4,
      type: 'villa',
      img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop'
    },
    {
      id: 7,
      name: 'Negombo Beachfront Plot',
      price: '35,000,000',
      address: 'Negombo, Western Province',
      beds: 0,
      baths: 0,
      type: 'land',
      img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop'
    },
    {
      id: 8,
      name: 'Colombo 3 Modern Condo',
      price: '68,000,000',
      address: 'Colombo 3, Western Province',
      beds: 3,
      baths: 2,
      type: 'apartment',
      img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop'
    },
    {
      id: 9,
      name: 'Hikkaduwa Beach House',
      price: '55,000,000',
      address: 'Hikkaduwa, Southern Province',
      beds: 3,
      baths: 2,
      type: 'house',
      img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop'
    },
  ];

  // Filter properties based on search criteria
  const filteredProperties = allProperties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = propertyType === 'all' || property.type === propertyType;
    
    const matchesBedrooms = bedrooms === 'all' || 
                           (bedrooms === '1' && property.beds === 1) ||
                           (bedrooms === '2' && property.beds === 2) ||
                           (bedrooms === '3' && property.beds === 3) ||
                           (bedrooms === '4+' && property.beds >= 4);
    
    const priceNum = parseInt(property.price.replace(/,/g, ''));
    const matchesPrice = priceRange === 'all' ||
                        (priceRange === 'low' && priceNum < 50000000) ||
                        (priceRange === 'mid' && priceNum >= 50000000 && priceNum < 80000000) ||
                        (priceRange === 'high' && priceNum >= 80000000);
    
    return matchesSearch && matchesType && matchesBedrooms && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Search Properties</h1>
          <p className="text-gray-500 mt-1">Find your dream property from our listings</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="grid md:grid-cols-5 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Property Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="land">Land</option>
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">All Prices</option>
                <option value="low">Under 50M</option>
                <option value="mid">50M - 80M</option>
                <option value="high">Above 80M</option>
              </select>
            </div>

            {/* Bedrooms Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{filteredProperties.length}</span> properties found
          </p>
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <FilterIcon />
            <span className="text-sm font-medium">Sort By</span>
          </button>
        </div>

        {/* Properties Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {filteredProperties.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setPriceRange('all');
                  setPropertyType('all');
                  setBedrooms('all');
                }}
                className="mt-4 px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredProperties.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer group border border-gray-100">
                <div className="relative h-48 overflow-hidden">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-medium capitalize">
                    {p.type}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                    <MapPinIcon />
                    {p.address}
                  </div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{p.name}</h3>
                      <p className="text-teal-600 font-bold text-lg mt-1">LKR {p.price}</p>
                    </div>
                    {p.beds > 0 && (
                      <div className="flex gap-3 text-gray-500 text-sm">
                        <span className="flex items-center gap-1"><BedIcon /> {p.beds}</span>
                        <span className="flex items-center gap-1"><BathIcon /> {p.baths}</span>
                      </div>
                    )}
                  </div>
                  <button className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-lg transition-all text-sm font-medium">
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