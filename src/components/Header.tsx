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

  const NavButton = ({ icon: Icon, label, onClick, color = "teal" }: any) => (
    <button
      className={`flex items-center gap-2 px-4 py-2 hover:bg-${color}-50 hover:text-${color}-600 font-medium transition-all group`}
      onClick={onClick}
    >
      <span className="group-hover:scale-110 transition-transform">{Icon}</span>
      <span>{label}</span>
    </button>
  );

  const MobileNavButton = ({ icon: Icon, label, onClick, color = "teal" }: any) => (
    <button
      className={`flex items-center gap-3 px-6 py-4 hover:bg-${color}-50 hover:text-${color}-600 font-medium transition-all border-b border-gray-100 w-full text-left`}
      onClick={() => {
        onClick();
        setMobileMenuOpen(false);
      }}
    >
      <span>{Icon}</span>
      <span>{label}</span>
    </button>
  );

  if (user.role === "CLIENT") {
    return (
      <>
        <header className="bg-white border-b-2 border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 md:px-8 py-3">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => navigate("/home")}
              >
                <div className="group-hover:scale-110 transition-transform">
                  <PulseIcon />
                </div>
                <span className="font-bold text-xl text-gray-800 group-hover:text-teal-600 transition-colors">
                  PropertyPulse
                </span>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1 text-gray-700">
                <NavButton
                  icon={<ListingsIcon />}
                  label="Listings"
                  onClick={() => navigate("/search")}
                  color="teal"
                />
                <NavButton
                  icon={<UserIcon />}
                  label="My Profile"
                  onClick={() => navigate("/editme")}
                  color="blue"
                />
                <NavButton
                  icon={<HeartIcon />}
                  label="Favorites"
                  onClick={() => navigate("/favourites")}
                  color="red"
                />
                <NavButton
                  icon={<ListingsIcon />}
                  label="Inquiries"
                  onClick={() => navigate("/inquaries")}
                  color="purple"
                />
              </nav>

              {/* User Info & Actions */}
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 border border-gray-200">
                  <UserIcon />
                  <span className="text-sm text-gray-600">
                    <strong className="text-gray-900">{user.name}</strong>
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 transition-all border border-gray-200"
                  title="Logout"
                >
                  <LogoutIcon />
                </button>
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
                >
                  {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-[73px] bg-white z-40 overflow-y-auto border-b-2 border-gray-200">
            <nav className="flex flex-col">
              <div className="px-6 py-4 bg-gray-50 border-b-2 border-gray-200">
                <div className="flex items-center gap-3">
                  <UserIcon />
                  <span className="text-sm text-gray-600">
                    Welcome, <strong className="text-gray-900">{user.name}</strong>
                  </span>
                </div>
              </div>
              <MobileNavButton
                icon={<ListingsIcon />}
                label="Listings"
                onClick={() => navigate("/search")}
                color="teal"
              />
              <MobileNavButton
                icon={<UserIcon />}
                label="My Profile"
                onClick={() => navigate("/editme")}
                color="blue"
              />
              <MobileNavButton
                icon={<HeartIcon />}
                label="Favorites"
                onClick={() => navigate("/favourites")}
                color="red"
              />
              <MobileNavButton
                icon={<ListingsIcon />}
                label="Inquiries"
                onClick={() => navigate("/inquaries")}
                color="purple"
              />
            </nav>
          </div>
        )}
      </>
    );
  } else if (user.role === "AGENT") {
    return (
      <>
        <header className="bg-white border-b-2 border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 md:px-8 py-3">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => navigate("/home")}
              >
                <div className="group-hover:scale-110 transition-transform">
                  <PulseIcon />
                </div>
                <span className="font-bold text-xl text-gray-800 group-hover:text-teal-600 transition-colors">
                  PropertyPulse
                </span>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1 text-gray-700">
                <NavButton
                  icon={<CreateListingIcon />}
                  label="Create New"
                  onClick={() => navigate("/createListnings")}
                  color="teal"
                />
                <NavButton
                  icon={<ManageListingIcon />}
                  label="Manage Listings"
                  onClick={() => navigate("/manageListnings")}
                  color="red"
                />
                <NavButton
                  icon={<UserIcon />}
                  label="My Profile"
                  onClick={() => navigate("/editme")}
                  color="blue"
                />
                <NavButton
                  icon={<ListingsIcon />}
                  label="Inquiries"
                  onClick={() => navigate("/inquaries")}
                  color="purple"
                />
              </nav>

              {/* User Info & Actions */}
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 border border-gray-200">
                  <UserIcon />
                  <span className="text-sm text-gray-600">
                    <strong className="text-gray-900">{user.name}</strong>
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 transition-all border border-gray-200"
                  title="Logout"
                >
                  <LogoutIcon />
                </button>
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
                >
                  {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-[73px] bg-white z-40 overflow-y-auto border-b-2 border-gray-200">
            <nav className="flex flex-col">
              <div className="px-6 py-4 bg-gray-50 border-b-2 border-gray-200">
                <div className="flex items-center gap-3">
                  <UserIcon />
                  <span className="text-sm text-gray-600">
                    Welcome, <strong className="text-gray-900">{user.name}</strong>
                  </span>
                </div>
              </div>
              <MobileNavButton
                icon={<CreateListingIcon />}
                label="Create New"
                onClick={() => navigate("/createListnings")}
                color="teal"
              />
              <MobileNavButton
                icon={<ManageListingIcon />}
                label="Manage Listings"
                onClick={() => navigate("/manageListnings")}
                color="red"
              />
              <MobileNavButton
                icon={<UserIcon />}
                label="My Profile"
                onClick={() => navigate("/editme")}
                color="blue"
              />
              <MobileNavButton
                icon={<ListingsIcon />}
                label="Inquiries"
                onClick={() => navigate("/inquaries")}
                color="purple"
              />
            </nav>
          </div>
        )}
      </>
    );
  } else if (user.role === "ADMIN") {
    return (
      <>
        <header className="bg-white border-b-2 border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 md:px-8 py-3">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => navigate("/home")}
              >
                <div className="group-hover:scale-110 transition-transform">
                  <PulseIcon />
                </div>
                <span className="font-bold text-xl text-gray-800 group-hover:text-teal-600 transition-colors">
                  PropertyPulse
                </span>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1 text-gray-700">
                <NavButton
                  icon={<UserIcon />}
                  label="Manage Users"
                  onClick={() => navigate("/admin/manage-users")}
                  color="blue"
                />
                <NavButton
                  icon={<HomeIcon />}
                  label="Property Approvals"
                  onClick={() => navigate("/listning/")}
                  color="teal"
                />
                <NavButton
                  icon={<ManagePropertiesIcon />}
                  label="Manage Properties"
                  onClick={() => navigate("/admin-listning")}
                  color="purple"
                />
                <NavButton
                  icon={<UserIcon />}
                  label="My Profile"
                  onClick={() => navigate("/editme")}
                  color="blue"
                />
              </nav>

              {/* User Info & Actions */}
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 border border-gray-200">
                  <UserIcon />
                  <span className="text-sm text-gray-600">
                    <strong className="text-gray-900">{user.name}</strong>
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 transition-all border border-gray-200"
                  title="Logout"
                >
                  <LogoutIcon />
                </button>
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
                >
                  {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-[73px] bg-white z-40 overflow-y-auto border-b-2 border-gray-200">
            <nav className="flex flex-col">
              <div className="px-6 py-4 bg-gray-50 border-b-2 border-gray-200">
                <div className="flex items-center gap-3">
                  <UserIcon />
                  <span className="text-sm text-gray-600">
                    Welcome, <strong className="text-gray-900">{user.name}</strong>
                  </span>
                </div>
              </div>
              <MobileNavButton
                icon={<UserIcon />}
                label="Manage Users"
                onClick={() => navigate("/admin/manage-users")}
                color="blue"
              />
              <MobileNavButton
                icon={<HomeIcon />}
                label="Property Approvals"
                onClick={() => navigate("/listning/")}
                color="teal"
              />
              <MobileNavButton
                icon={<ManagePropertiesIcon />}
                label="Manage Properties"
                onClick={() => navigate("/admin-listning")}
                color="purple"
              />
              <MobileNavButton
                icon={<UserIcon />}
                label="My Profile"
                onClick={() => navigate("/editme")}
                color="blue"
              />
            </nav>
          </div>
        )}
      </>
    );
  }
}