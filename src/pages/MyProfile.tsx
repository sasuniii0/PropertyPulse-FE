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
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6 text-gray-900">My Profile</h1>

      {/* Profile Card */}
      <div className="bg-white shadow-md rounded-xl border border-gray-100 overflow-hidden">
        {/* Profile Header */}
        <div className="h-32 bg-teal-500 relative">
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-4xl font-bold text-teal-600">
                {profile.name ? profile.name.split(" ").map(n => n[0]).join("") : "U"}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-20 px-8 pb-8 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
              <p className="text-gray-500 text-sm">
                {profile.isActive ? "Active User" : "Inactive User"} | Ratings: {profile.ratings || 0}
              </p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-teal-500 hover:bg-green-600 text-white rounded-lg font-medium transition"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">About Me</label>
            {!isEditing ? (
              <p className="bg-gray-50 p-3 rounded-lg">{profile.bio || "-"}</p>
            ) : (
              <textarea
                value={editForm.bio || ""}
                onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none resize-none"
              />
            )}
          </div>

          {/* Contact Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              ) : (
                <p className="bg-gray-50 p-3 rounded-lg">{profile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editForm.email}
                  onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              ) : (
                <p className="bg-gray-50 p-3 rounded-lg">{profile.email}</p>
              )}
            </div>

            {/* <div>
              <label className="block text-gray-700 font-semibold mb-1">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editForm.phone || ""}
                  onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              ) : (
                <p className="bg-gray-50 p-3 rounded-lg">{profile.phone || "-"}</p>
              )}
            </div> */}

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Contact Number</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.contactNumber || ""}
                  onChange={e => setEditForm({ ...editForm, contactNumber: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              ) : (
                <p className="bg-gray-50 p-3 rounded-lg">{profile.contactNumber || "-"}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg-teal-500 hover:bg-green-600 text-white font-medium rounded-lg transition"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Delete Account */}
          <div className="mt-6">
            <button
              onClick={handleDelete}
              className="w-full px-6 py-3 bg-gray-500 hover:bg-red-600 text-white font-medium rounded-lg transition"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
