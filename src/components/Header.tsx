import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HomeIcon } from "lucide-react";
import { useState } from "react";

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const PulseIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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

export const CreateListingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const ManageListingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

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
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M7 7h3M14 7h3" />
    <path d="M7 11h3M14 11h3" />
    <path d="M7 15h3M14 15h3" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const InquiriesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;

    logout();
    navigate("/signin");
  };

  const NavLink = ({ icon: Icon, label, onClick, isActive = false }: any) => (
    <button
      className={`flex items-center gap-2 px-5 py-2.5 font-medium transition-all relative group ${
        isActive
          ? "text-teal-600 bg-teal-50"
          : "text-gray-700 hover:text-teal-600 hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <span className="transition-transform group-hover:scale-110">{Icon}</span>
      <span className="text-sm">{label}</span>
      {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600"></div>}
    </button>
  );

  const MobileNavLink = ({ icon: Icon, label, onClick }: any) => (
    <button
      className="flex items-center gap-4 px-6 py-4 text-gray-700 hover:bg-teal-50 hover:text-teal-600 font-medium transition-all border-b border-gray-100 w-full text-left group"
      onClick={() => {
        onClick();
        setMobileMenuOpen(false);
      }}
    >
      <span className="transition-transform group-hover:scale-110">{Icon}</span>
      <span className="text-sm">{label}</span>
    </button>
  );

  if (user.role === "CLIENT") {
    return (
      <>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-0">
            <div className="flex items-center justify-between">
              {/* Left: Logo */}
              <div
                className="flex items-center gap-3 cursor-pointer py-4 group"
                onClick={() => navigate("/home")}
              >
                <div className="transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <PulseIcon />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xl text-gray-900 group-hover:text-teal-600 transition-colors leading-tight">
                    PropertyPulse
                  </span>
                  <span className="text-xs text-gray-500 font-medium">Find Your Dream Home</span>
                </div>
              </div>

              {/* Center: Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                <NavLink icon={<ListingsIcon />} label="Listings" onClick={() => navigate("/search")} />
                <NavLink icon={<HeartIcon />} label="Favorites" onClick={() => navigate("/favourites")} />
                <NavLink icon={<InquiriesIcon />} label="Inquiries" onClick={() => navigate("/inquaries")} />
                <NavLink icon={<UserIcon />} label="Me" onClick={() => navigate("/editme")} />
              </nav>

              {/* Right: User Info & Logout */}
              <div className="flex items-center gap-3">
                {/* User Info - Desktop */}
                <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
                  <div className="w-8 h-8 bg-teal-600 flex items-center justify-center text-white font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium">Welcome back</span>
                    <span className="text-sm font-bold text-gray-900">{user.name}</span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-11 h-11 bg-red-50 hover:bg-red-100 text-red-600 transition-all border border-red-200 group"
                  title="Logout"
                >
                  <span className="transition-transform group-hover:translate-x-0.5">
                    <LogoutIcon />
                  </span>
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden flex items-center justify-center w-11 h-11 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all border border-gray-300"
                >
                  {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[81px] bg-white z-40 overflow-y-auto">
            <div className="bg-gradient-to-r from-teal-50 to-teal-100 px-6 py-5 border-b-2 border-teal-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-600 flex items-center justify-center text-white font-bold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-teal-700 font-semibold uppercase tracking-wide">Welcome back</span>
                  <span className="text-base font-bold text-gray-900">{user.name}</span>
                </div>
              </div>
            </div>
            <nav className="flex flex-col">
              <MobileNavLink icon={<ListingsIcon />} label="Listings" onClick={() => navigate("/search")} />
              <MobileNavLink icon={<HeartIcon />} label="Favorites" onClick={() => navigate("/favourites")} />
              <MobileNavLink icon={<InquiriesIcon />} label="Inquiries" onClick={() => navigate("/inquaries")} />
              <MobileNavLink icon={<UserIcon />} label="My Profile" onClick={() => navigate("/editme")} />
            </nav>
          </div>
        )}
      </>
    );
  } else if (user.role === "AGENT") {
    return (
      <>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-0">
            <div className="flex items-center justify-between">
              {/* Left: Logo */}
              <div
                className="flex items-center gap-3 cursor-pointer py-4 group"
                onClick={() => navigate("/home")}
              >
                <div className="transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <PulseIcon />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xl text-gray-900 group-hover:text-teal-600 transition-colors leading-tight">
                    PropertyPulse
                  </span>
                  <span className="text-xs text-gray-500 font-medium">Agent Dashboard</span>
                </div>
              </div>

              {/* Center: Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                <NavLink icon={<CreateListingIcon />} label="Create New" onClick={() => navigate("/createListnings")} />
                <NavLink icon={<ManageListingIcon />} label="Manage Listings" onClick={() => navigate("/manageListnings")} />
                <NavLink icon={<InquiriesIcon />} label="Inquiries" onClick={() => navigate("/inquaries")} />
                <NavLink icon={<UserIcon />} label="Me" onClick={() => navigate("/editme")} />
              </nav>

              {/* Right: User Info & Logout */}
              <div className="flex items-center gap-3">
                {/* User Info - Desktop */}
                <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
                  <div className="w-8 h-8 bg-teal-600 flex items-center justify-center text-white font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium">Agent</span>
                    <span className="text-sm font-bold text-gray-900">{user.name}</span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-11 h-11 bg-red-50 hover:bg-red-100 text-red-600 transition-all border border-red-200 group"
                  title="Logout"
                >
                  <span className="transition-transform group-hover:translate-x-0.5">
                    <LogoutIcon />
                  </span>
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden flex items-center justify-center w-11 h-11 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all border border-gray-300"
                >
                  {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[81px] bg-white z-40 overflow-y-auto">
            <div className="bg-gradient-to-r from-teal-50 to-teal-100 px-6 py-5 border-b-2 border-teal-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-600 flex items-center justify-center text-white font-bold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-teal-700 font-semibold uppercase tracking-wide">Agent</span>
                  <span className="text-base font-bold text-gray-900">{user.name}</span>
                </div>
              </div>
            </div>
            <nav className="flex flex-col">
              <MobileNavLink icon={<CreateListingIcon />} label="Create New" onClick={() => navigate("/createListnings")} />
              <MobileNavLink icon={<ManageListingIcon />} label="Manage Listings" onClick={() => navigate("/manageListnings")} />
              <MobileNavLink icon={<InquiriesIcon />} label="Inquiries" onClick={() => navigate("/inquaries")} />
              <MobileNavLink icon={<UserIcon />} label="Me" onClick={() => navigate("/editme")} />
            </nav>
          </div>
        )}
      </>
    );
  } else if (user.role === "ADMIN") {
    return (
      <>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-0">
            <div className="flex items-center justify-between">
              {/* Left: Logo */}
              <div
                className="flex items-center gap-3 cursor-pointer py-4 group"
                onClick={() => navigate("/home")}
              >
                <div className="transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <PulseIcon />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xl text-gray-900 group-hover:text-teal-600 transition-colors leading-tight">
                    PropertyPulse
                  </span>
                  <span className="text-xs text-gray-500 font-medium">Admin Dashboard</span>
                </div>
              </div>

              {/* Center: Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                <NavLink icon={<UserIcon />} label="Users" onClick={() => navigate("/admin/manage-users")} />
                <NavLink icon={<HomeIcon />} label="Approvals" onClick={() => navigate("/listning/")} />
                <NavLink icon={<ManagePropertiesIcon />} label="Properties" onClick={() => navigate("/admin-listning")} />
                <NavLink icon={<InquiriesIcon />} label="Inquiries" onClick={() => navigate("/inquaries")} />
                <NavLink icon={<UserIcon />} label="Me" onClick={() => navigate("/editme")} />
              </nav>

              {/* Right: User Info & Logout */}
              <div className="flex items-center gap-3">
                {/* User Info - Desktop */}
                <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
                  <div className="w-8 h-8 bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-blue-700 font-semibold uppercase tracking-wide">Administrator</span>
                    <span className="text-sm font-bold text-gray-900">{user.name}</span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-11 h-11 bg-red-50 hover:bg-red-100 text-red-600 transition-all border border-red-200 group"
                  title="Logout"
                >
                  <span className="transition-transform group-hover:translate-x-0.5">
                    <LogoutIcon />
                  </span>
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden flex items-center justify-center w-11 h-11 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all border border-gray-300"
                >
                  {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[81px] bg-white z-40 overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-5 border-b-2 border-blue-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-blue-700 font-semibold uppercase tracking-wide">Administrator</span>
                  <span className="text-base font-bold text-gray-900">{user.name}</span>
                </div>
              </div>
            </div>
            <nav className="flex flex-col">
              <MobileNavLink icon={<UserIcon />} label="Manage Users" onClick={() => navigate("/admin/manage-users")} />
              <MobileNavLink icon={<HomeIcon />} label="Property Approvals" onClick={() => navigate("/listning/")} />
              <MobileNavLink icon={<ManagePropertiesIcon />} label="Manage Properties" onClick={() => navigate("/admin-listning")} />
              <MobileNavLink icon={<InquiriesIcon />} label="Inquiries" onClick={() => navigate("/inquaries")} />
              <MobileNavLink icon={<UserIcon />} label="My Profile" onClick={() => navigate("/editme")} />
            </nav>
          </div>
        )}
      </>
    );
  }
}