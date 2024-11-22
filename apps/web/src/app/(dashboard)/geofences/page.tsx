import { GeofenceMap } from '@/components/geofences/geofence-map';
import { GeofenceList } from '@/components/geofences/geofence-list';

export default function GeofencesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Geofences</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GeofenceMap />
        </div>
        <div>
          <GeofenceList />
        </div>
      </div>
    </div>
  );
}