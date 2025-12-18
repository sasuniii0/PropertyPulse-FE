import { useState } from 'react';
import { BedIcon,BathIcon,MapPinIcon,HeartIcon,TrashIcon,ClockIcon } from '../components/Icons';

export default function SavedProperties() {
  // Mock saved properties data
  const [savedProperties, setSavedProperties] = useState([
    {
      id: 1,
      name: 'Cinnamon Gardens Villa',
      price: '85,000,000',
      address: 'Colombo 7, Western Province',
      beds: 4,
      baths: 3,
      type: 'villa',
      savedDate: '3 days ago',
      img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      name: 'Marine Drive Luxury Suite',
      price: '95,000,000',
      address: 'Colombo 4, Western Province',
      beds: 4,
      baths: 3,
      type: 'apartment',
      savedDate: '1 week ago',
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
      savedDate: '2 weeks ago',
      img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop'
    },
    {
      id: 6,
      name: 'Mount Lavinia Beach Villa',
      price: '120,000,000',
      address: 'Mount Lavinia, Western Province',
      beds: 5,
      baths: 4,
      type: 'villa',
      savedDate: '3 weeks ago',
      img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop'
    },
    {
      id: 8,
      name: 'Colombo 3 Modern Condo',
      price: '68,000,000',
      address: 'Colombo 3, Western Province',
      beds: 3,
      baths: 2,
      type: 'apartment',
      savedDate: '1 month ago',
      img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop'
    },
  ]);

  const handleRemove = (id: number) => {
    setSavedProperties(savedProperties.filter(p => p.id !== id));
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all saved properties?')) {
      setSavedProperties([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Saved Properties</h1>
            <p className="text-gray-500 mt-1">Your favorite properties all in one place</p>
          </div>
          {savedProperties.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium border border-red-200"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Stats Card */}
        {savedProperties.length > 0 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="p-6 bg-gradient-to-br from-teal-50 to-teal-100">
                <div className="flex items-center gap-3">
                  <div className="bg-teal-500 p-3 rounded-lg">
                    <HeartIcon filled={true} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-teal-900">{savedProperties.length}</div>
                    <div className="text-teal-600 text-sm font-medium">Saved Properties</div>
                  </div>
                </div>
              </div>
          </div>
        )}

        {/* Properties Grid or Empty State */}
        {savedProperties.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
                <HeartIcon filled={false} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Saved Properties</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Start exploring properties and save your favorites by clicking the heart icon on any property card.
              </p>
              <button className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors font-medium">
                Browse Properties
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {savedProperties.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 group border border-gray-100">
                <div className="relative h-48 overflow-hidden">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-medium capitalize">
                    {p.type}
                  </div>
                  <div className="absolute top-3 left-3 bg-red-500 text-white p-2 rounded-full">
                    <HeartIcon filled={true} />
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
                    <div className="flex gap-3 text-gray-500 text-sm">
                      <span className="flex items-center gap-1"><BedIcon /> {p.beds}</span>
                      <span className="flex items-center gap-1"><BathIcon /> {p.baths}</span>
                    </div>
                  </div>
                  
                  {/* Saved Date */}
                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-3 bg-gray-50 px-2 py-1 rounded">
                    <ClockIcon />
                    <span>Saved {p.savedDate}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-lg transition-all text-sm font-medium">
                      View Details
                    </button>
                    <button
                      onClick={() => handleRemove(p.id)}
                      className="px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                      title="Remove from saved"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tips Section */}
        {savedProperties.length > 0 && (
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">💡 Quick Tip</h3>
            <p className="text-gray-600 text-sm">
              Saved properties are stored in your account. You can compare them, schedule viewings, or share them with family and friends anytime!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}