import { Dialog } from '@headlessui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface Props {
  geofenceId: string;
  open: boolean;
  onClose: () => void;
}

export function AssignDriversModal({ geofenceId, open, onClose }: Props) {
  const queryClient = useQueryClient();
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);

  const { data: drivers = [], isLoading } = useQuery({
    queryKey: ['drivers'],
    queryFn: async () => {
      const response = await api.get('/admin/drivers');
      return response.data;
    },
  });

  const assignDrivers = useMutation({
    mutationFn: async (driverIds: string[]) => {
      await api.post(`/admin/geofences/${geofenceId}/assign`, { driverIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['geofences'] });
      toast.success('Drivers assigned successfully');
      onClose();
    },
    onError: () => {
      toast.error('Failed to assign drivers');
    },
  });

  const handleSubmit = () => {
    assignDrivers.mutate(selectedDrivers);
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md w-full rounded bg-white p-6">
          <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Assign Drivers to Geofence
          </Dialog.Title>

          {isLoading ? (
            <div>Loading drivers...</div>
          ) : (
            <div className="space-y-4">
              {drivers.map((driver) => (
                <label key={driver.id} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedDrivers.includes(driver.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDrivers([...selectedDrivers, driver.id]);
                      } else {
                        setSelectedDrivers(selectedDrivers.filter(id => id !== driver.id));
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {driver.name} ({driver.phone})
                  </span>
                </label>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={assignDrivers.isPending || selectedDrivers.length === 0}
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {assignDrivers.isPending ? 'Assigning...' : 'Assign Drivers'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}