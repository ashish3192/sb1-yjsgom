import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { useGeofenceStore } from '@/stores/geofence';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

export function GeofenceMap() {
  const { addGeofence, geofences, selectedGeofence } = useGeofenceStore();
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Fix for Leaflet icons in Next.js
    if (typeof window !== 'undefined') {
      const L = require('leaflet');
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/images/marker-icon-2x.png',
        iconUrl: '/images/marker-icon.png',
        shadowUrl: '/images/marker-shadow.png',
      });
    }
  }, []);

  const handleCreated = (e: any) => {
    const layer = e.layer;
    const coordinates = layer.getLatLngs()[0].map((latlng: any) => ({
      lat: latlng.lat,
      lng: latlng.lng,
    }));

    addGeofence({
      coordinates,
      name: `Geofence ${geofences.length + 1}`,
    });
  };

  return (
    <div className="h-[600px] rounded-lg overflow-hidden shadow-md">
      <MapContainer
        center={[20.5937, 78.9629]} // Center of India
        zoom={5}
        className="h-full w-full"
        whenCreated={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={handleCreated}
            draw={{
              rectangle: false,
              circle: false,
              circlemarker: false,
              marker: false,
              polyline: false,
            }}
          />
        </FeatureGroup>

        {/* Render existing geofences */}
        {geofences.map((geofence) => (
          <Polygon
            key={geofence.id}
            positions={geofence.coordinates}
            pathOptions={{
              color: selectedGeofence?.id === geofence.id ? '#2563eb' : '#4b5563',
              fillColor: selectedGeofence?.id === geofence.id ? '#3b82f6' : '#6b7280',
              fillOpacity: 0.3,
            }}
            eventHandlers={{
              click: () => {
                useGeofenceStore.getState().setSelectedGeofence(geofence);
              },
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}