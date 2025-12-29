import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyDetails, updateMyDetails, deleteMyAccount } from "../services/User";
import { getPaymentDetails } from "../services/Payment";
import { startAgentPayment } from "../services/Payment";
import type { AgentPaymentData, PaymentDetails } from "../services/Payment";
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

type TabType = "profile" | "payment" | "settings";

export default function MyProfile() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editForm, setEditForm] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [paymentData, setPaymentData] = useState<PaymentDetails | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    listingAlerts: true,
    marketingEmails: false,
    twoFactorAuth: false,
  });

  console.log(paymentData);

  useEffect(() => {
    if (!user?.token) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await getMyDetails(user.token);
        setProfile(res);
        setEditForm(res);

        const resp = await getPaymentDetails(user.token);
        setPaymentData(resp)
        
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.token]);

  // Save profile changes
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

  // Handle payment
  const handlePayment = async () => {
    if (!user?.token) return;
    setPaymentLoading(true);
    try {
      const response = await startAgentPayment(user.token);
      console.log(response);
      
      if (response.url) {
        window.location.href = response.url;
      } else {
        toast.success("Payment initiated successfully");
        setPaymentData(response);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to process payment");
    } finally {
      setPaymentLoading(false);
    }
  };

  // Save settings
  const handleSaveSettings = () => {
    // In a real app, you'd save these to your backend
    toast.success("Settings saved successfully");
    console.log("Settings saved:", settings);
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading profile...</p>;
  if (!profile || !editForm) return <p className="text-center mt-10 text-gray-500">No profile found</p>;

  const getPaymentStatusColor = (status?: string) => {
    switch (status) {
      case "PAID":
        return "text-green-600 bg-green-50";
      case "PENDING":
        return "text-yellow-600 bg-yellow-50";
      case "OVERDUE":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">My Account</h1>

        {/* Tabs Navigation */}
        <div className="bg-white shadow-sm mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-6 py-3 text-sm font-medium transition-colors duration-200 border-b-2 ${
                activeTab === "profile"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("payment")}
              className={`px-6 py-3 text-sm font-medium transition-colors duration-200 border-b-2 ${
                activeTab === "payment"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Payment
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-6 py-3 text-sm font-medium transition-colors duration-200 border-b-2 ${
                activeTab === "settings"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Settings
            </button>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
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
        )}

        {/* Payment Tab */}
        {activeTab === "payment" && (
          <div className="bg-white shadow-sm p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Details</h2>
              <p className="text-sm text-gray-600">Manage your payment information and subscription</p>
            </div>

            {/* Payment Status Card */}
            <div className="border border-gray-200 p-5 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900">Agent Payment Status</h3>
                {paymentData && (
                  <span className={`px-3 py-1 text-xs font-medium ${getPaymentStatusColor(paymentData.paymentStatus)}`}>
                    
                  </span>
                )}
              </div>

              {paymentData ? (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-gray-900">{paymentData.paymentStatus}</span>
                  </div>
                  {paymentData.paymentStatus === "OVERDUE" && (
                    <div className="bg-red-50 border border-red-200 p-3 text-sm text-red-800">
                      Your payment is overdue. Please complete the payment to continue using agent features.
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-600">No payment information available</p>
              )}
            </div>

            {/* Payment Action */}
            <div className="border border-gray-200 p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Agent Subscription</h3>
              <p className="text-sm text-gray-600 mb-4">
                Subscribe to become an agent and list properties on our platform.
              </p>
              <button
                onClick={handlePayment}
                disabled={paymentLoading}
                className="w-full px-5 py-2.5 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors duration-200 shadow-sm"
              >
                {paymentLoading ? "Processing..." : "Start Payment"}
              </button>
            </div>

            {/* Payment History */}
            <div className="border border-gray-200 p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Payment History</h3>
              <div className="text-sm text-gray-600">
                <p>No payment history available</p>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="bg-white shadow-sm p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Account Settings</h2>
              <p className="text-sm text-gray-600">Manage your preferences and account settings</p>
            </div>

            {/* Notification Settings */}
            <div className="border border-gray-200 p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                    <p className="text-xs text-gray-600">Receive updates via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={e => setSettings({ ...settings, emailNotifications: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">SMS Notifications</p>
                    <p className="text-xs text-gray-600">Receive SMS alerts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.smsNotifications}
                      onChange={e => setSettings({ ...settings, smsNotifications: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Listing Alerts</p>
                    <p className="text-xs text-gray-600">Get notified about new listings</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.listingAlerts}
                      onChange={e => setSettings({ ...settings, listingAlerts: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Marketing Emails</p>
                    <p className="text-xs text-gray-600">Receive promotional content</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.marketingEmails}
                      onChange={e => setSettings({ ...settings, marketingEmails: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="border border-gray-200 p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Security</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-600">Add an extra layer of security</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.twoFactorAuth}
                      onChange={e => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                  </label>
                </div>

                <button className="w-full px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm transition-colors duration-200 border border-gray-300">
                  Change Password
                </button>
              </div>
            </div>

            {/* Save Settings Button */}
            <div className="pt-4">
              <button
                onClick={handleSaveSettings}
                className="w-full px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-medium text-sm transition-colors duration-200 shadow-sm"
              >
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}