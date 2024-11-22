import { Dialog } from '@headlessui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface Document {
  id: string;
  type: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  url: string;
}

interface Driver {
  id: string;
  name: string;
  documents: Document[];
}

interface Props {
  driver: Driver;
  onClose: () => void;
}

export function DocumentReviewModal({ driver, onClose }: Props) {
  const queryClient = useQueryClient();

  const reviewDocument = useMutation({
    mutationFn: async ({
      documentId,
      status,
      rejectionReason,
    }: {
      documentId: string;
      status: 'APPROVED' | 'REJECTED';
      rejectionReason?: string;
    }) => {
      const response = await api.put(`/admin/documents/${documentId}/review`, {
        status,
        rejectionReason,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast.success('Document review updated');
    },
    onError: () => {
      toast.error('Failed to update document review');
    },
  });

  const handleReview = async (
    documentId: string,
    status: 'APPROVED' | 'REJECTED'
  ) => {
    let rejectionReason;
    if (status === 'REJECTED') {
      rejectionReason = prompt('Please provide a reason for rejection:');
      if (!rejectionReason) return;
    }

    await reviewDocument.mutateAsync({
      documentId,
      status,
      rejectionReason,
    });
  };

  const getDocumentTypeName = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full rounded bg-white p-6">
          <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Review Documents - {driver.name}
          </Dialog.Title>

          <div className="space-y-4">
            {driver.documents.map(doc => (
              <div
                key={doc.id}
                className="border rounded-lg p-4 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{getDocumentTypeName(doc.type)}</h3>
                    <p className="text-sm text-gray-500">
                      Status: {doc.status.toLowerCase()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReview(doc.id, 'APPROVED')}
                      disabled={doc.status === 'APPROVED'}
                      className="px-3 py-1 text-sm rounded-md bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReview(doc.id, 'REJECTED')}
                      disabled={doc.status === 'REJECTED'}
                      className="px-3 py-1 text-sm rounded-md bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View Document
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}