import { useGeofenceStore } from '@/stores/geofence';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';

export function GeofenceList() {
  const { geofences, selectedGeofence, setSelectedGeofence } = useGeofenceStore();
  const queryClient = useQueryClient();

  const deleteGeofence = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/geofences/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['geofences'] });
      toast.success('Geofence deleted');
    },
    onError: () => {
      toast.error('Failed to delete geofence');
    },
  });

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium">Geofences</h2>
      </div>
      <div className="divide-y">
        {geofences.map((geofence) => (
          <div
            key={geofence.id}
            className={`p-4 cursor-pointer hover:bg-gray-50 ${
              selectedGeofence?.id === geofence.id ? 'bg-blue-50' : ''
            }`}
            onClick={() => setSelectedGeofence(geofence)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{geofence.name}</h3>
                <p className="text-sm text-gray-500">
                  {geofence.drivers?.length || 0} drivers assigned
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Open edit modal
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this geofence?')) {
                      deleteGeofence.mutate(geofence.id);
                    }
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}