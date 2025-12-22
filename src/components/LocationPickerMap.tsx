import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import React from "react";

type LocationPickerMapProps = {
  lat: string;
  lng: string;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
};

const LocationMarker: React.FC<LocationPickerMapProps> = ({
  lat,
  lng,
  setFormData,
}) => {
  useMapEvents({
    async click(e) {
      const clickedLat = e.latlng.lat;
      const clickedLng = e.latlng.lng;

      // 1️⃣ Set lat & lng
      setFormData((prev: any) => ({
        ...prev,
        lat: clickedLat.toString(),
        lng: clickedLng.toString(),
      }));

      // 2️⃣ Reverse Geocoding (Lat/Lng → Address)
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${clickedLat}&lon=${clickedLng}`
        );
        const data = await res.json();

        if (data?.display_name) {
          setFormData((prev: any) => ({
            ...prev,
            address: data.display_name,
          }));
        }
      } catch (error) {
        console.error("Reverse geocoding failed", error);
      }
    },
  });

  if (!lat || !lng) return null;

  return <Marker position={[Number(lat), Number(lng)]} />;
};

const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  lat,
  lng,
  setFormData,
}) => {
  const position: [number, number] =
    lat && lng
      ? [Number(lat), Number(lng)]
      : [6.9271, 79.8612]; // Default: Colombo

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker lat={lat} lng={lng} setFormData={setFormData} />
    </MapContainer>
  );
};

export default LocationPickerMap;
