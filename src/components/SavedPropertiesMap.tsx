import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export interface Property {
  _id: string;
  title: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
}

// Fit map to all markers
const FitBounds: React.FC<{ properties: Property[] }> = ({ properties }) => {
  const map = useMap();
  const bounds = properties
    .filter((p) => p.location)
    .map((p) => [p.location.lat, p.location.lng] as [number, number]);
  if (bounds.length) map.fitBounds(bounds);
  return null;
};

interface Props {
  properties: Property[];
}

const SavedPropertiesMap: React.FC<Props> = ({ properties }) => {
  const center: [number, number] =
    properties.length && properties[0].location
      ? [properties[0].location.lat, properties[0].location.lng]
      : [6.9271, 79.8612]; // default Colombo

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden">
        <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitBounds properties={properties} />
        {properties.map(
            (p) =>
            p.location && (
                <Marker key={p._id} position={[p.location.lat, p.location.lng]}>
                <Popup>
                    <div>
                    <h3 className="font-bold">{p.title}</h3>
                    <p>{p.location.address}</p>
                    </div>
                </Popup>
                </Marker>
            )
        )}
        </MapContainer>
    </div>
    );
};

export default SavedPropertiesMap;
