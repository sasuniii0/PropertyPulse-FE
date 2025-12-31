import { useState, useEffect } from "react";
import { fetchRecentListings } from "../services/Listning";
import type { RecentListing } from "../services/Listning";
import { useAuth } from "../context/AuthContext";

export default function RecentPropertiesSlideshow() {
  const {user} = useAuth()
  const [listings, setListings] = useState<RecentListing[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchRecentListings(user.token);
      setListings(data);
    };
    fetchData();
  }, []);

  // Slide change every 3 seconds
  useEffect(() => {
    if (listings.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % listings.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [listings]);

  if (listings.length === 0) return null;

  const currentListing = listings[currentIndex];

  return (
    <div className="relative w-full h-96 overflow-hidden shadow-sm">
    {/* Image */}
    <img
        src={currentListing.images?.[0] ?? "/placeholder.jpg"}
        alt={currentListing.title}
        className="w-full h-full object-cover transition-transform duration-500"
    />

    {/* Overlay */}
    <div className="absolute bottom-0 left-0 w-full bg-teal-500 bg-opacity-70 p-4 text-white">
        <h3 className="text-lg font-bold">{currentListing.title}</h3>
        <p className="text-sm">{currentListing.location.address}</p>
        <p className="font-semibold mt-1">LKR {currentListing.price.toLocaleString()}</p>
    </div>

    {/* Navigation Dots */}
    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
        {listings.map((_, idx) => (
        <span
            key={idx}
            className={`w-2 h-2 rounded-full ${
            idx === currentIndex ? "bg-white" : "bg-teal-300"
            }`}
        />
        ))}
    </div>
    </div>
  );
}
