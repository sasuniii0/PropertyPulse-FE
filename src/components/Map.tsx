// EditMap.tsx
import type { MapRef } from "react-map-gl/maplibre";
import 'maplibre-gl/dist/maplibre-gl.css';
import { useRef, useEffect } from 'react';
import Map, { Marker } from "react-map-gl/maplibre";


interface MapProps {
  location: { lat: number; lng: number };
  setLocation: (loc: { lat: number; lng: number }) => void;
}

export default function EditMap({ location, setLocation }: MapProps) {
  const mapRef = useRef<MapRef>(null);

  // Trigger resize after modal is fully rendered
  useEffect(() => {
    setTimeout(() => {
      mapRef.current?.resize();
    }, 200);
  }, [location]);


  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-gray-300">
      <Map
        ref={mapRef}
        initialViewState={{
          latitude: location.lat,
          longitude: location.lng,
          zoom: 13,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        interactiveLayerIds={[]}
        onClick={evt => setLocation({ lat: evt.lngLat.lat, lng: evt.lngLat.lng })}
      >
        <Marker latitude={location.lat} longitude={location.lng} />
      </Map>
    </div>
  );
}
