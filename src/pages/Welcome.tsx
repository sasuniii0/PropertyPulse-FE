import { useState  } from 'react';
import Signin from './Signin';
import Signup from './Signup';
import { useAuthModal } from "../context/AuthModalContext";
import { PulseIcon,SearchIcon,ChevronDownIcon,BedIcon,BathIcon,MapPinIcon,HomeIcon } from '../components/Icons';

export default function Welcome() {
  const [city, setCity] = useState('Colombo 7');
  const [propertyType, setPropertyType] = useState('Villa');
  const [price] = useState('75,000,000');  

  const { modal, openSignIn } = useAuthModal();

  const properties = [
    {
      id: 1,
      name: 'Cinnamon Gardens Villa',
      price: '85,000,000',
      address: 'Colombo 7, Western Province',
      beds: 4,
      baths: 3,
      img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop'
    },
    {
      id: 5,
      name: 'Nuwara Eliya Hill Plot',
      price: '18,500,000',
      address: 'Nuwara Eliya, Central Province',
      perches: 20,
      type: 'land',
      img: 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=400&h=300&fit=crop'
    },
    {
      id: 8,
      name: 'Marine Drive Luxury Suite',
      price: '95,000,000',
      address: 'Colombo 4, Western Province',
      beds: 4,
      baths: 3,
      floor: 18,
      type: 'apartment',
      img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop'
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Auth Modals */}
      {modal === "signin" && (
        <Signin/>
      )}
      {modal === "signup" && (
        <Signup/>
      )}

      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2 text-white">
          <PulseIcon />
          <span className="font-bold text-xl">PropertyPulse</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-white/90">
          <a href="#" className="hover:text-white border-b-2 border-white pb-1">Home</a>
          <a href="#" className="hover:text-white">Contacts</a>
          <a href="#" className="hover:text-white">Support</a>
          <a href="#" className="hover:text-white">Location</a>
          <a href="#" className="hover:text-white">About us</a>
        </div>
        <button 
          onClick={openSignIn}
          className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-full transition-all"
        >
          Try now
        </button>
      </nav>

      {/* Hero Section */}
      <div className="relative h-[700px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-teal-900">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&h=900&fit=crop"
            alt="Modern House"
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
        </div>

        <div className="relative z-10 flex flex-col justify-center h-full px-8 md:px-16 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            Your Ideal Property<br />Just a Click Away
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-md">
            Smart Real Estate Finder is your go-to platform for discovering the perfect home in Sri Lanka. Browse thousands of listings across Colombo, Kandy, Galle, and beyond with smart search filters and interactive tools.
          </p>
          <button className="flex items-center gap-3 bg-teal-500/20 border border-teal-400 text-white px-6 py-3 rounded-full w-fit hover:bg-teal-500/30 transition-all">
            <span>Search</span>
            <span className="text-xl">→</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-2xl p-6 flex flex-wrap md:flex-nowrap items-center gap-4 z-20 w-[90%] max-w-3xl">
          <div className="flex-1 min-w-[140px]">
            <label className="text-xs text-gray-500 flex items-center gap-1">City <ChevronDownIcon /></label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="font-semibold text-gray-800 w-full outline-none mt-1"
            />
          </div>
          <div className="w-px h-12 bg-gray-200 hidden md:block" />
          <div className="flex-1 min-w-[140px]">
            <label className="text-xs text-gray-500 flex items-center gap-1">Property Type <ChevronDownIcon /></label>
            <input
              type="text"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="font-semibold text-gray-800 w-full outline-none mt-1"
            />
          </div>
          <div className="w-px h-12 bg-gray-200 hidden md:block" />
          <div className="flex-1 min-w-[140px]">
            <label className="text-xs text-gray-500 flex items-center gap-1">Price <ChevronDownIcon /></label>
            <div className="font-semibold text-gray-800 mt-1">LKR {price}</div>
          </div>
          <button className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all">
            <SearchIcon />
            Search
          </button>
        </div>
      </div>

      {/* Most Viewed Section */}
      <div className="pt-16 pb-20 px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Most Viewed</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Discover a range of properties across Sri Lanka. Book securely and get expert customer support for a stress-free experience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {properties.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer group">
              <div className="relative h-48 overflow-hidden">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                  <MapPinIcon />
                  {p.address}
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{p.name}</h3>
                    <p className="text-teal-600 font-bold text-xl mt-1">LKR {p.price}</p>
                  </div>
                  <div className="flex gap-3 text-gray-500 text-sm">
                    <span className="flex items-center gap-1"><BedIcon /> {p.beds}</span>
                    <span className="flex items-center gap-1"><BathIcon /> {p.baths}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-10">
          <div className="w-2 h-2 rounded-full bg-gray-300" />
          <div className="w-2 h-2 rounded-full bg-teal-500" />
          <div className="w-2 h-2 rounded-full bg-gray-300" />
        </div>
      </div>

      {/* Projects & Stats Section */}
      <div className="py-20 px-8 bg-stone-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text & Stats */}
            <div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                PropertyPulse offers the most excellent land alternatives in Sri Lanka, as well as a variety of support services, such as legal and financial assistance, to help you realize your property dreams. In Sri Lanka's highly competitive real estate market, PropertyPulse acquired over 300,000 customers, sufficient proof of our capacity and leadership in the real estate industry.
              </p>
              
              <button className="flex items-center gap-2 mb-12 group">
                <span className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">→</span>
                </span>
                <span className="text-teal-500 font-medium group-hover:underline">Explore more</span>
              </button>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-8">
                <div className="border-l-2 border-teal-500 pl-4">
                  <div className="text-5xl font-bold text-gray-900">29+</div>
                  <div className="text-gray-600 mt-1">Years of Trust</div>
                </div>
                <div className="border-l-2 border-teal-500 pl-4">
                  <div className="text-5xl font-bold text-gray-900">18</div>
                  <div className="text-gray-600 mt-1">Districts Covered</div>
                </div>
                <div className="border-l-2 border-teal-500 pl-4">
                  <div className="text-5xl font-bold text-gray-900">300K+</div>
                  <div className="text-gray-600 mt-1">Satisfied Customers</div>
                </div>
              </div>
            </div>

            {/* Right Side - Project Cards */}
            <div className="space-y-4">
              {/* Lands Card */}
              <div className="relative h-40 rounded-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=400&fit=crop" 
                  alt="Lands" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold">LANDS</h3>
                  <p className="text-teal-500 text-3xl font-bold">10000+</p>
                  <p className="text-sm tracking-wider">LAND PROJECTS</p>
                </div>
              </div>

              {/* Houses & Apartments Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Houses Card */}
                <div className="relative h-56 rounded-2xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=500&fit=crop" 
                    alt="Houses" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-xl font-bold">HOUSES</h3>
                    <p className="text-teal-500 text-2xl font-bold">5</p>
                    <p className="text-xs tracking-wider">ON GOING PROJECTS</p>
                    <p className="text-teal-500 text-2xl font-bold mt-2">28</p>
                    <p className="text-xs tracking-wider">COMPLETED PROJECTS</p>
                  </div>
                </div>

                {/* Apartments Card */}
                <div className="relative h-56 rounded-2xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=500&fit=crop" 
                    alt="Apartments" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-xl font-bold">APARTMENTS</h3>
                    <p className="text-teal-500 text-2xl font-bold">11</p>
                    <p className="text-xs tracking-wider">ON GOING PROJECTS</p>
                    <p className="text-teal-500 text-2xl font-bold mt-2">42</p>
                    <p className="text-xs tracking-wider">COMPLETED PROJECTS</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Easiest Method Section */}
      <div className="bg-gray-50 py-20 px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop"
              alt="Modern House"
              className="rounded-2xl shadow-xl"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-teal-100 p-3 rounded-xl">
                <HomeIcon />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              The Easiest Method<br />To Find a Property
            </h2>
            <p className="text-gray-500 mb-8">
              Our platform simplifies the property search process with smart filters, interactive maps, and personalized recommendations based on your preferences. Discover your ideal property in Colombo, Kandy, Galle, or anywhere in Sri Lanka.
            </p>
            <button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full transition-all">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <PulseIcon />
                <span className="font-bold text-xl">PropertyPulse</span>
              </div>
              <p className="text-white/60 text-sm">
                Your trusted partner for finding the perfect property in Sri Lanka.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Locations</h4>
              <div className="space-y-2 text-white/60 text-sm">
                <p>Colombo</p>
                <p>Kandy</p>
                <p>Galle</p>
                <p>Negombo</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-white/60 text-sm">
                <p>About Us</p>
                <p>Careers</p>
                <p>Contact</p>
                <p>Blog</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-white/60 text-sm">
                <p>+94 11 234 5678</p>
                <p>info@propertypulse.lk</p>
                <p>Colombo 03, Sri Lanka</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-sm">© 2025 PropertyPulse. All rights reserved.</p>
            <div className="flex gap-6 text-white/60 text-sm">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}