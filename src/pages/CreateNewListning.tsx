import { useState } from 'react';
import {ImageIcon,UploadIcon,HomeIcon,MapPinIcon,DollarIcon,XIcon} from "../components/Icons"
import { useNavigate } from 'react-router-dom';
import LocationPickerMap from '../components/LocationPickerMap';
import api from '../services/Api';


export default function CreateNewListing() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    address: '',
    lat: '',
    lng: '',
    propertyType: 'HOUSE',
    listingType: 'SALE',
    bedrooms: '',
    bathrooms: '',
    size: '',
  });

  const [images, setImages] = useState<File[]>([]);
  // const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  // const [aiSummary, setAiSummary] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImages(prev => [...prev, ...Array.from(files)]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return alert("You must be logged in.");

    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("price", formData.price);
    form.append("size", formData.size);
    form.append("propertyType", formData.propertyType);
    form.append("listingType", formData.listingType);

    // Correct way to append nested location fields
    form.append("location[address]", formData.address);
    form.append("location[lat]", formData.lat);
    form.append("location[lng]", formData.lng);
    form.append("bedrooms", formData.bedrooms);
    form.append("bathrooms", formData.bathrooms);

    images.forEach(file => form.append("images", file));

    try {
      const res = await api.post(
        import.meta.env.VITE_API_URL + "/api/v1/listning/add",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          },
        }
      );
      alert("Listing submitted!");
      navigate("/manageListnings");
      console.log(res.data.data);
    } catch (err: any) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Server error");
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create New Listing</h1>
          <p className="text-sm text-gray-600">Add a new property to your listings and reach potential buyers</p>
        </div>

        <div className="space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 p-6">
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
              <div className="p-2 bg-teal-50">
                <HomeIcon />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
            </div>

            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Property Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Spacious 4-Bedroom House in Colombo 05"
                  className="w-full px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide a detailed description of the property..."
                  rows={5}
                  className="w-full px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-white resize-none"
                />
              </div>

              {/* AI Summary
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-gray-700">
                    AI Summary
                  </label>
                  <button
                    type="button"
                    onClick={generateAISummary}
                    disabled={!formData.description || isGeneratingAI}
                    className="flex items-center gap-2 px-3 py-1.5 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white transition-all duration-200 text-xs font-medium"
                  >
                    <SparklesIcon />
                    {isGeneratingAI ? 'Generating...' : 'Generate AI Summary'}
                  </button>
                </div>
                <textarea
                  value={aiSummary}
                  onChange={(e) => setAiSummary(e.target.value)}
                  placeholder="AI-generated summary will appear here..."
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none bg-purple-50"
                />
              </div> */}

              {/* Property Type and Listing Type */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Property Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-white appearance-none cursor-pointer"
                  >
                    <option value="HOUSE">House</option>
                    <option value="APARTMENT">Apartment</option>
                    <option value="COMMERCIAL">Commercial</option>
                    <option value="VILLA">Villa</option>
                    <option value="LAND">Land</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Listing Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="listingType"
                    value={formData.listingType}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      listingType: e.target.value
                    }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-white appearance-none cursor-pointer"
                  >
                    <option value="SALE">Sale</option>
                    <option value="RENT">Rent</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Property Details Card */}
          <div className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 p-6">
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
              <div className="p-2 bg-teal-50">
                <DollarIcon />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Property Details</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Price */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Price (LKR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="12000000"
                  className="w-full px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-white"
                />
              </div>

              {/* Size */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Size (sqft) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  placeholder="2100"
                  className="w-full px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-white"
                />
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Bedrooms <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  placeholder="4"
                  min="0"
                  className="w-full px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-white"
                />
              </div>

              {/* Bathrooms */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Bathrooms <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  placeholder="2"
                  min="0"
                  className="w-full px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Location Card */}
          <div className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 p-6">
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
              <div className="p-2 bg-teal-50">
                <MapPinIcon />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Location</h2>
            </div>

            <div className="space-y-5">
              {/* Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Colombo 05"
                  className="w-full px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-white"
                />
              </div>

              {/* Coordinates */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Latitude <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="lat"
                    value={formData.lat}
                    onChange={handleInputChange}
                    placeholder="6.9271"
                    step="any"
                    className="w-full px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Longitude <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="lng"
                    value={formData.lng}
                    onChange={handleInputChange}
                    placeholder="79.8612"
                    step="any"
                    className="w-full px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-white"
                  />
                </div>
              </div>

              {/* Map Location Picker */}
              <div className="overflow-hidden border border-gray-200">
                <LocationPickerMap
                  lat={formData.lat}
                  lng={formData.lng}
                  setFormData={setFormData}
                />
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Click on the map to select the property location
              </p>
            </div>
          </div>

          {/* Images Card */}
          <div className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 p-6">
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
              <div className="p-2 bg-teal-50">
                <ImageIcon />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Property Images</h2>
            </div>

            {/* Upload Area */}
            <div className="mb-5">
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 cursor-pointer hover:border-teal-400 transition-all duration-300 bg-gray-50 hover:bg-teal-50 group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="p-3 bg-gray-100 mb-3 group-hover:bg-teal-100 transition-colors duration-300">
                    <UploadIcon />
                  </div>
                  <p className="mb-2 text-sm text-gray-700 font-semibold">
                    Click to upload images
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 5MB)</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {images.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="overflow-hidden border border-gray-200 hover:border-teal-400 transition-all duration-300">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Property ${index + 1}`}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                    >
                      <XIcon />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 bg-teal-500 text-white text-xs px-2 py-0.5 font-medium">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-white transition-all duration-300 font-semibold text-sm shadow-sm hover:shadow-md"
            >
              Create Listing
            </button>
            <button
              type="button"
              className="px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-700 transition-all duration-300 font-semibold border border-gray-300 hover:border-gray-400 shadow-sm text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </main>
    </div>
  );

}