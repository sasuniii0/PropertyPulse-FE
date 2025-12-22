import { useState } from 'react';
import {ImageIcon,UploadIcon,HomeIcon,MapPinIcon,DollarIcon,XIcon,SparklesIcon} from "../components/Icons"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LocationPickerMap from '../components/LocationPickerMap';


export default function CreateNewListing() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    address: '',
    lat: '',
    lng: '',
    propertyType: 'House',
    bedrooms: '',
    bathrooms: '',
    size: '',
  });

  const [images, setImages] = useState<File[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiSummary, setAiSummary] = useState('');

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

      const generateAISummary = async () => {
      setIsGeneratingAI(true);

      try {
        const response = await fetch("http://localhost:5000/api/v1/ai/generate-ai-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            price: formData.price,
            location: formData.address,
            propertyType: formData.propertyType,
            bedrooms: formData.bedrooms,
          }),
        });

        const data = await response.json();
        setAiSummary(data.summary);
      } catch (err) {
        console.log("AI summary error:", err);
      } finally {
        setIsGeneratingAI(false);
      }
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

    // Correct way to append nested location fields
    form.append("location[address]", formData.address);
    form.append("location[lat]", formData.lat);
    form.append("location[lng]", formData.lng);

    images.forEach(file => form.append("images", file));

    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/listning/add",
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
    } catch (err: any) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Server error");
    }
  };



  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-5xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Listing</h1>
          <p className="text-gray-500 mt-1">Add a new property to your listings</p>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <HomeIcon />
              Basic Information
            </h2>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Spacious 4-Bedroom House in Colombo 05"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide a detailed description of the property..."
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                />
              </div>

              {/* AI Summary */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    AI Summary
                  </label>
                  <button
                    type="button"
                    onClick={generateAISummary}
                    disabled={!formData.description || isGeneratingAI}
                    className="flex items-center gap-2 px-3 py-1 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white rounded-lg transition-colors text-sm font-medium"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-purple-50"
                />

              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type *
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="HOUSE">House</option>
                  <option value="APARTMENT">Apartment</option>
                  <option value="COMMERCIAL">Commercial</option>
                  <option value="VILLA">Villa</option>
                  <option value="LAND">Land</option>
                </select>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Details</h2>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <DollarIcon />
                  Price (LKR) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="12000000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size (sqft) *
                </label>
                <input
                  type="number"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  placeholder="2100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms *
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  placeholder="4"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Bathrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms *
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  placeholder="2"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPinIcon />
              Location
            </h2>

            <div className="space-y-4">
              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Colombo 05"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Coordinates */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude *
                  </label>
                  <input
                    type="number"
                    name="lat"
                    value={formData.lat}
                    onChange={handleInputChange}
                    placeholder="6.9271"
                    step="any"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude *
                  </label>
                  <input
                    type="number"
                    name="lng"
                    value={formData.lng}
                    onChange={handleInputChange}
                    placeholder="79.8612"
                    step="any"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Map Location Picker */}
            <div className="mt-4">
              <LocationPickerMap
                lat={formData.lat}
                lng={formData.lng}
                setFormData={setFormData}
              />
              <p className="text-sm text-gray-500 mt-2">
                Click on the map to select the property location
              </p>
            </div>
          </div>

          

          {/* Images */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon />
              Property Images
            </h2>

            {/* Upload Area */}
            <div className="mb-4">
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-teal-500 transition-colors bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadIcon />
                  <p className="mb-2 text-sm text-gray-600 font-medium">
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt={`Property ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                      />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <XIcon />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 bg-teal-500 text-white text-xs px-2 py-1 rounded">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors font-semibold text-lg"
            >
              Create Listing
            </button>
            <button
              type="button"
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}