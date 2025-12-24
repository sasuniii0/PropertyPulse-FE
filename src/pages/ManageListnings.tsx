import { useState, useEffect } from 'react';
import {
  SearchIcon,
  TrashIcon,
  EyeIcon,
  SquareIcon,
  ToggleLeftIcon,
  ToggleRightIcon,
  PlusIcon,
  BedIcon,
  BathIcon,
  MapPinIcon,
  EditIcon
} from '../components/Icons';
import { getAllListingsAPI, updateListingAPI, deleteListingAPI } from '../services/Listning';
import type { EdiitListningData } from '../services/Listning';
import Modal from '../components/Modal';
import EditMap from '../components/Map';
import 'maplibre-gl/dist/maplibre-gl.css';


export default function ManageListings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [listings, setListings] = useState<any[]>([]);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editData, setEditData] = useState<EdiitListningData | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Fetch listings
useEffect(() => {
  const fetchListings = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No access token found');

      const res = await getAllListingsAPI(token);

      // Map backend _id to id for frontend usage
      console.log(res.data);
      const dataWithId = res.data.listings.map((item: any) => ({
        ...item,
        id: item._id,
      }));

      setListings(dataWithId);

    } catch (err: any) {
      console.error('Failed to load listings:', err);

      if (err.response?.status === 403) {
        setError('You are not authorized to view these listings.');
      } else {
        setError('Failed to load listings');
      }
    } finally {
      setLoading(false);
    }
  };

  fetchListings();
}, []);

  // Toggle listing active/inactive
  const toggleStatus = (id: string) => {
    setListings(listings.map(l => 
      l.id === id ? { ...l, status: l.status === 'active' ? 'inactive' : 'active' } : l
    ));
  };

  // Open delete modal
  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  // Confirm delete API
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const token = localStorage.getItem('accessToken')!;
      await deleteListingAPI(token, deleteId);
      setListings(prev => prev.filter(l => l.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  // Open edit modal
const handleEdit = (listing: any) => {
  setEditData({
    _id: listing.id,
    title: listing.title,
    propertyType: listing.propertyType,
    images: listing.images,
    price: listing.price,
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    size: listing.size,
    description: listing.description,
    location: {
      address: listing.location?.address || '',
      lat: listing.location?.lat || 0,
      lng: listing.location?.lng || 0,
    },
  });
};

const saveEdit = async () => {
  if (!editData) return;
  setSaving(true);

  try {
    const token = localStorage.getItem('accessToken')!;
    
    // Remove local file handling
    const dataToSend: Partial<EdiitListningData> = {
      title: editData.title,
      description: editData.description,
      price: editData.price,
      size: editData.size,
      propertyType: editData.propertyType,
      bedrooms: editData.bedrooms,
      bathrooms: editData.bathrooms,
      location: editData.location,
      images: editData.images, // just URLs from Cloudinary
    };

    await updateListingAPI(token, editData._id, dataToSend);

    // Update frontend list
    setListings(prev =>
      prev.map(l =>
        l.id === editData._id
          ? { ...l, ...dataToSend }
          : l
      )
    );

    setEditData(null);
  } catch (err) {
    console.error(err);
    alert('Update failed');
  } finally {
    setSaving(false);
  }
};



  // Filtered listings
  const filteredListings = listings.filter(listing => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.location?.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || listing.propertyType === filterType;
    return matchesSearch && matchesType;
  });

  const stats = {
    total: listings.length,
    active: listings.filter(l => l.status === 'active').length,
    inactive: listings.filter(l => l.status === 'inactive').length,
    totalViews: listings.reduce((acc, l) => acc + (l.views || 0), 0),
  };

  if (loading) return <div className="text-center mt-20 text-xl">Loading listings...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Listings</h1>
            <p className="text-gray-600 text-sm mt-0.5">View, edit, and manage all your property listings</p>
          </div>
          <button
            className="flex items-center gap-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white transition-colors font-medium text-sm shadow-sm"
            onClick={() => window.location.href = '/createListnings'}
          >
            <PlusIcon />
            New Listing
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 p-5">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-gray-500 text-xs mt-1">Total Listings</div>
          </div>
          <div className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 p-5">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-gray-500 text-xs mt-1">Active</div>
          </div>
          <div className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 p-5">
            <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
            <div className="text-gray-500 text-xs mt-1">Inactive</div>
          </div>
          <div className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 p-5">
            <div className="text-2xl font-bold text-blue-600">{stats.totalViews}</div>
            <div className="text-gray-500 text-xs mt-1">Total Views</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow-sm border border-gray-100 p-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full md:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search listings..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              />
            </div>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
            >
              <option value="all">All Types</option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Condo">Condo</option>
            </select>

            <div className="flex gap-1 bg-gray-100 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-1.5 font-medium transition-colors text-sm ${viewMode === 'grid' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-600'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-1.5 font-medium transition-colors text-sm ${viewMode === 'list' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-600'}`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        <div className="text-gray-600 text-sm">
          <span className="font-semibold text-gray-900">{filteredListings.length}</span> listings found
        </div>

        {/* Listings - Grid View */}
        {viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredListings.map(listing => (
              <div key={listing.id} className="bg-white shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="relative h-44">
                  <img src={listing.images?.[0]} alt={listing.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <span className={`px-2.5 py-0.5 text-xs font-medium ${listing.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {listing.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className="bg-teal-500 text-white px-2.5 py-0.5 text-xs font-medium">{listing.propertyType}</span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                    <MapPinIcon />
                    {listing.location?.address || 'No address'}
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-1">{listing.title}</h3>
                  <p className="text-teal-600 font-bold text-base mb-3">LKR {listing.price.toLocaleString()}</p>
                  <div className="flex items-center gap-4 text-gray-500 text-xs mb-3 pb-3 border-b border-gray-100">
                    <span className="flex items-center gap-1"><BedIcon /> {listing.bedrooms}</span>
                    <span className="flex items-center gap-1"><BathIcon /> {listing.bathrooms}</span>
                    <span className="flex items-center gap-1"><SquareIcon /> {listing.size}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><EyeIcon /> {listing.views || 0} views</span>
                    <span>{listing.inquiries || 0} inquiries</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleStatus(listing.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 transition-colors text-xs font-medium ${listing.status === 'active' ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-green-100 hover:bg-green-200 text-green-700'}`}
                    >
                      {listing.status === 'active' ? <ToggleLeftIcon /> : <ToggleRightIcon />}
                      {listing.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleEdit(listing)}
                      className="px-2 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => handleDelete(listing.id)}
                      className="px-2 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // LIST VIEW
          <div className="space-y-3">
            {filteredListings.map(listing => (
              <div key={listing.id} className="bg-white shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-300">
                <div className="flex gap-5">
                  <div className="w-44 h-28 overflow-hidden flex-shrink-0">
                    <img src={listing.images?.[0]} alt={listing.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-bold text-gray-900">{listing.title}</h3>
                          <span className={`px-2.5 py-0.5 text-xs font-medium ${listing.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {listing.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                          <span className="bg-teal-100 text-teal-700 px-2.5 py-0.5 text-xs font-medium">{listing.propertyType}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPinIcon />
                          {listing.location?.address || 'No address'}
                        </div>
                      </div>
                      <div className="text-right text-lg font-bold text-teal-600">LKR {listing.price.toLocaleString()}</div>
                    </div>
                    <p className="text-gray-600 text-xs mb-3 line-clamp-2">{listing.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5 text-gray-500 text-xs">
                        <span className="flex items-center gap-1"><BedIcon /> {listing.bedrooms}</span>
                        <span className="flex items-center gap-1"><BathIcon /> {listing.bathrooms}</span>
                        <span className="flex items-center gap-1"><SquareIcon /> {listing.size} sqft</span>
                        <span className="flex items-center gap-1"><EyeIcon /> {listing.views || 0} views</span>
                        <span>{listing.inquiries || 0} inquiries</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleStatus(listing.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors text-xs font-medium ${listing.status === 'active' ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-green-100 hover:bg-green-200 text-green-700'}`}
                        >
                          {listing.status === 'active' ? <ToggleLeftIcon /> : <ToggleRightIcon />}
                          {listing.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleEdit(listing)}
                          className="px-2 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => handleDelete(listing.id)}
                          className="px-2 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DELETE MODAL */}
        {deleteId && (
          <Modal onClose={() => setDeleteId(null)} title="Confirm Delete">
            <p className="text-sm text-gray-700 mb-4">Are you sure you want to delete this listing?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </Modal>
        )}

        {/* EDIT MODAL */}
        {editData && (
            <Modal onClose={() => setEditData(null)} title="Edit Listing" className="w-full max-w-5xl h-[90vh] overflow-y-auto">
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Title</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={e => setEditData({ ...editData, title: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Images</label>

                {/* File input for uploading new images */}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      const newImages = [...(editData.images || []), ...Array.from(files).map(f => URL.createObjectURL(f))];
                      setEditData({ ...editData, images: newImages });
                    }
                  }}
                  className="text-sm"
                />

                {/* Preview of uploaded images */}
                <div className="flex gap-2 mt-2 overflow-x-auto">
                  {editData.images?.map((img, i) => (
                    <div key={i} className="relative">
                      <img
                        src={img}
                        alt={`preview-${i}`}
                        className="w-20 h-20 object-cover border border-gray-200"
                      />
                      <button
                        onClick={() => {
                          const newImages = editData.images!.filter((_, idx) => idx !== i);
                          setEditData({ ...editData, images: newImages });
                        }}
                        className="absolute top-0.5 right-0.5 bg-red-500 text-white p-1 text-xs"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Price</label>
                <input
                  type="number"
                  value={editData.price}
                  onChange={e => setEditData({ ...editData, price: Number(e.target.value) })}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                />
              </div>

              {/* Location with Map */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Location</label>

                {/* Address Input */}
                <input
                  type="text"
                  placeholder="Enter property address"
                  value={editData.location?.address || ''}
                  onChange={e =>
                    setEditData({
                      ...editData,
                      location: { ...editData.location, address: e.target.value },
                    })
                  }
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />

                {/* Map Container */}
                <div className="relative w-full h-56 overflow-hidden border border-gray-300 shadow-sm">
                  {editData.location && (
                    <EditMap
                      location={{
                        lat: editData.location?.lat || 6.9271,
                        lng: editData.location?.lng || 79.8612,
                      }}
                      setLocation={loc =>
                        setEditData({ ...editData, location: { ...editData.location, ...loc } })
                      }
                    />
                  )}

                  {/* Lat/Lng & Address Overlay */}
                  <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm p-2 shadow text-xs text-gray-700 flex flex-col gap-0.5">
                    <div className="font-medium text-gray-800">{editData.location?.address || 'No Address'}</div>
                    <div className="flex gap-3">
                      <div>
                        <span className="font-semibold">Lat:</span>{' '}
                        {editData.location?.lat?.toFixed(6) ?? 'N/A'}
                      </div>
                      <div>
                        <span className="font-semibold">Lng:</span>{' '}
                        {editData.location?.lng?.toFixed(6) ?? 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bedrooms, Bathrooms, Size */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Bedrooms</label>
                  <input
                    type="number"
                    value={editData.bedrooms}
                    onChange={e => setEditData({ ...editData, bedrooms: Number(e.target.value) })}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Bathrooms</label>
                  <input
                    type="number"
                    value={editData.bathrooms}
                    onChange={e => setEditData({ ...editData, bathrooms: Number(e.target.value) })}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Size (sqft)</label>
                  <input
                    type="number"
                    value={editData.size}
                    onChange={e => setEditData({ ...editData, size: Number(e.target.value) })}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={editData.description}
                  onChange={e => setEditData({ ...editData, description: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all resize-none"
                  rows={4}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => setEditData(null)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </Modal>
        )}

      </main>
    </div>
  );
}
