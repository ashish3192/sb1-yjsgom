import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { api } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { DocumentReviewModal } from './document-review-modal';

interface Driver {
  id: string;
  name: string;
  phone: string;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  documents: Array<{
    id: string;
    type: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
  }>;
}

const columnHelper = createColumnHelper<Driver>();

export function DriversTable() {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  
  const { data: drivers = [], isLoading } = useQuery({
    queryKey: ['drivers'],
    queryFn: async () => {
      const response = await api.get('/admin/drivers');
      return response.data;
    },
  });

  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => info.getValue() || 'Not provided',
    }),
    columnHelper.accessor('phone', {
      header: 'Phone',
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <Badge variant={getStatusVariant(info.getValue())}>
          {info.getValue().toLowerCase()}
        </Badge>
      ),
    }),
    columnHelper.accessor('documents', {
      header: 'Documents',
      cell: info => {
        const docs = info.getValue();
        const pendingCount = docs.filter(d => d.status === 'PENDING').length;
        return (
          <button
            onClick={() => setSelectedDriver(info.row.original)}
            className="text-blue-600 hover:text-blue-800"
          >
            Review ({pendingCount} pending)
          </button>
        );
      },
    }),
    columnHelper.accessor('id', {
      header: 'Actions',
      cell: info => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(info.getValue())}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(info.getValue())}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: drivers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleEdit = async (id: string) => {
    // Implement edit functionality
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this driver?')) {
      try {
        await api.delete(`/admin/drivers/${id}`);
        // Refetch drivers
        table.refetch();
      } catch (error) {
        console.error('Failed to delete driver:', error);
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedDriver && (
        <DocumentReviewModal
          driver={selectedDriver}
          onClose={() => setSelectedDriver(null)}
        />
      )}
    </div>
  );
}