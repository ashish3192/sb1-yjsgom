import { DriversTable } from '@/components/drivers/drivers-table';
import { AddDriverButton } from '@/components/drivers/add-driver-button';

export default function DriversPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Drivers</h1>
        <AddDriverButton />
      </div>
      <DriversTable />
    </div>
  );
}