import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyDetails,updateMyDetails,deleteMyAccount } from "../services/User";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

// Define user type based on your schema
interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  contactNumber?: string;
  bio?: string;
  savedListings?: string[];
  listings?: string[];
  ratings?: number;
  isActive?: boolean;
}

export default function MyProfile() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editForm, setEditForm] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch profile on load
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const data = await getMyDetails(user.token); // res = { message, data }
        setProfile(data); // <-- fix
        setEditForm(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };


    fetchProfile();
  }, [user]);

    /// Save profile changes
  const handleSave = async () => {
    if (!user || !editForm) return;
    try {
      const updatedProfile = await updateMyDetails(user.token, editForm);
      setProfile(updatedProfile);
      setUser({ ...user, ...updatedProfile });
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save changes");
    }
  };

  // Delete account
  const handleDelete = async () => {
    if (!user) return;
    if (!confirm("Are you sure you want to delete your account? This action is irreversible.")) return;

    try {
      await deleteMyAccount(user.token);
      toast.success("Account deleted");
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete account");
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading profile...</p>;
  if (!profile || !editForm) return <p className="text-center mt-10 text-gray-500">No profile found</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">My Profile</h1>

        {/* Profile Card */}
        <div className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
          {/* Profile Header */}
          <div className="h-28 bg-gradient-to-r from-teal-500 to-teal-600 relative">
            <div className="absolute -bottom-12 left-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-teal-600">
                  {profile.name ? profile.name.split(" ").map(n => n[0]).join("") : "U"}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-16 px-6 pb-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                <p className="text-gray-500 text-xs mt-0.5">
                  {profile.isActive ? "Active User" : "Inactive User"} | Ratings: {profile.ratings || 0}
                </p>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium transition-colors duration-200 shadow-sm"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-gray-700 font-semibold text-xs mb-1.5">About Me</label>
              {!isEditing ? (
                <p className="bg-gray-50 p-3 text-sm text-gray-700 border border-gray-200">{profile.bio || "-"}</p>
              ) : (
                <textarea
                  value={editForm.bio || ""}
                  onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                  rows={4}
                  className="w-full p-3 text-sm border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none resize-none transition-all duration-200"
                />
              )}
            </div>

            {/* Contact Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold text-xs mb-1.5">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full p-2.5 text-sm border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all duration-200"
                  />
                ) : (
                  <p className="bg-gray-50 p-2.5 text-sm text-gray-700 border border-gray-200">{profile.name}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-semibold text-xs mb-1.5">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full p-2.5 text-sm border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all duration-200"
                  />
                ) : (
                  <p className="bg-gray-50 p-2.5 text-sm text-gray-700 border border-gray-200">{profile.email}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-semibold text-xs mb-1.5">Contact Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.contactNumber || ""}
                    onChange={e => setEditForm({ ...editForm, contactNumber: e.target.value })}
                    className="w-full p-2.5 text-sm border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all duration-200"
                  />
                ) : (
                  <p className="bg-gray-50 p-2.5 text-sm text-gray-700 border border-gray-200">{profile.contactNumber || "-"}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100">
                <button
                  onClick={handleSave}
                  className="flex-1 px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-medium text-sm transition-colors duration-200 shadow-sm"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm border border-gray-300 hover:border-gray-400 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Delete Account */}
            <div className="mt-5 pt-4 border-t border-gray-100">
              <button
                onClick={handleDelete}
                className="w-full px-5 py-2.5 bg-gray-500 hover:bg-red-600 text-white font-medium text-sm transition-colors duration-200 shadow-sm"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
