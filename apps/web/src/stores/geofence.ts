import { create } from 'zustand';

interface Geofence {
  id: string;
  name: string;
  coordinates: Array<{ lat: number; lng: number }>;
  drivers?: Array<{ id: string; name: string }>;
}

interface GeofenceStore {
  geofences: Geofence[];
  selectedGeofence: Geofence | null;
  setGeofences: (geofences: Geofence[]) => void;
  addGeofence: (geofence: Omit<Geofence, 'id'>) => void;
  setSelectedGeofence: (geofence: Geofence | null) => void;
}

export const useGeofenceStore = create<GeofenceStore>((set) => ({
  geofences: [],
  selectedGeofence: null,
  setGeofences: (geofences) => set({ geofences }),
  addGeofence: (geofence) =>
    set((state) => ({
      geofences: [
        ...state.geofences,
        { ...geofence, id: Math.random().toString(36).substr(2, 9) },
      ],
    })),
  setSelectedGeofence: (geofence) => set({ selectedGeofence: geofence }),
}));