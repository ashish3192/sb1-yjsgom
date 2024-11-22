import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { DocumentCard } from './document-card';

export function DocumentReviewList() {
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const response = await api.get('/admin/documents');
      return response.data;
    },
  });

  const pendingDocuments = documents.filter(doc => doc.status === 'PENDING');

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-r-transparent"></div>
      </div>
    );
  }

  if (pendingDocuments.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900">No pending documents</h3>
        <p className="mt-1 text-sm text-gray-500">All documents have been reviewed</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pendingDocuments.map((document) => (
        <DocumentCard key={document.id} document={document} />
      ))}
    </div>
  );
}