import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HomeIcon } from "lucide-react";

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// SVG Icons
const PulseIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 16L8 8L12 20L16 12L20 18L24 10L28 16" stroke="#0F766E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

export const ListingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

// CreateListingIcon.tsx
export const CreateListingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M12 5v14M5 12h14" /> {/* Plus icon for creating new listing */}
  </svg>
);

// ManageListingIcon.tsx
export const ManageListingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M4 6h16M4 12h16M4 18h16" /> {/* List icon for managing listings */}
  </svg>
);

// ManagePropertiesIcon.tsx
export const ManagePropertiesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    {/* Building */}
    <rect x="3" y="3" width="18" height="18" rx="2" />
    
    {/* Windows / property units */}
    <path d="M7 7h3M14 7h3" />
    <path d="M7 11h3M14 11h3" />
    <path d="M7 15h3M14 15h3" />
  </svg>
);



export default function Header () {
    const navigate = useNavigate()

    const {user} = useAuth()

    const handleLogout = () => {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        navigate("/signin")
    }

    if (user.role === "CLIENT"){
        return (
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">

                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/home")}>
                    <PulseIcon />
                    <span className="font-bold text-xl text-gray-800 hover:text-teal-600 transition-colors">PropertyPulse</span>
                </div>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-6 text-gray-700">
                    <button
                        className="flex items-center gap-2 hover:text-teal-600 font-medium transition-colors"
                        onClick={() => navigate("/home")}
                        >
                        <ListingsIcon /> Listings
                    </button>
                    <button
                        className="flex items-center gap-2 hover:text-blue-600 font-medium transition-colors"
                        onClick={() => navigate("/editme")}
                        >
                        <UserIcon /> My Profile
                    </button>
                    <button
                        className="flex items-center gap-2 hover:text-red-600 font-medium transition-colors"
                        onClick={() => navigate("/favourites")}
                        >
                        <HeartIcon /> Favorites
                    </button>
                    <button
                        className="flex items-center gap-2 hover:text-purple-600 font-medium transition-colors"
                        onClick={() => navigate("/inquaries")}
                        >
                        <ListingsIcon /> Inquiries
                    </button>
                </nav>

                {/* User Info & Logout */}
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Welcome, <strong>{user.name}</strong></span>
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all focus:outline-none"
                        title="Logout"
                        >
                        <LogoutIcon />
                    </button>
                </div>

                {/* Mobile menu button (optional) */}
                {/* Add hamburger menu here if you want responsive nav */}
                </div>
            </header>
        );
    }else if(user.role === "AGENT"){
        return(
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">

                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/home")}>
                    <PulseIcon />
                    <span className="font-bold text-xl text-gray-800 hover:text-teal-600 transition-colors">PropertyPulse</span>
                </div>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-6 text-gray-700">
                    <button
                        className="flex items-center gap-2 hover:text-teal-600 font-medium transition-colors"
                        onClick={() => navigate("/createListnings")}
                        >
                        <CreateListingIcon /> Create New
                    </button>
                    <button
                        className="flex items-center gap-2 hover:text-red-600 font-medium transition-colors"
                        onClick={() => navigate("/manageListnings")}
                        >
                        <ManageListingIcon /> Manage Listnings
                    </button>
                    <button
                        className="flex items-center gap-2 hover:text-blue-600 font-medium transition-colors"
                        onClick={() => navigate("/editme")}
                        >
                        <UserIcon /> My Profile
                    </button>
                    <button
                        className="flex items-center gap-2 hover:text-purple-600 font-medium transition-colors"
                        onClick={() => navigate("/inquaries")}
                        >
                        <ListingsIcon /> Inquiries
                    </button>
                </nav>

                {/* User Info & Logout */}
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Welcome, <strong>{user.name}</strong></span>
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all focus:outline-none"
                        title="Logout"
                        >
                        <LogoutIcon />
                    </button>
                </div>

                {/* Mobile menu button (optional) */}
                {/* Add hamburger menu here if you want responsive nav */}
                </div>
            </header>
        )
    }else if(user.role === "ADMIN"){
        return(
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/home")}>
                    <PulseIcon />
                    <span className="font-bold text-xl text-gray-800 hover:text-teal-600 transition-colors">PropertyPulse</span>
                </div>
                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-6 text-gray-700">
                    <button 
                        className="flex items-center gap-2 hover:text-blue-600 font-medium transition-colors"
                        onClick={() => navigate("/admin/manage-users")}
                        >
                        <UserIcon /> Manage Users
                    </button>
                    <button 
                        className="flex items-center gap-2 hover:text-blue-600 font-medium transition-colors"
                        onClick={() => navigate("/listning/")}
                        >
                        <HomeIcon /> Property Approvals
                    </button>
                    <button 
                        className="flex items-center gap-2 hover:text-blue-600 font-medium transition-colors"
                        onClick={() => navigate("/admin-listning")}
                        >
                        <ManagePropertiesIcon /> Manage Properties
                    </button>
                    <button
                        className="flex items-center gap-2 hover:text-blue-600 font-medium transition-colors"
                        onClick={() => navigate("/editme")}
                        >
                        <UserIcon /> My Profile
                    </button>
                </nav>
                {/* User Info & Logout */}
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Welcome, <strong>{user.name}</strong></span>
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all focus:outline-none"
                        title="Logout"
                        >
                        <LogoutIcon />
                    </button>
                </div>
                </div>
            </header>
        )
    }
}