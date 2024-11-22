import { DashboardStats } from '@/components/dashboard/stats';
import { RecentDrivers } from '@/components/dashboard/recent-drivers';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <DashboardStats />
      <RecentDrivers />
    </div>
  );
}