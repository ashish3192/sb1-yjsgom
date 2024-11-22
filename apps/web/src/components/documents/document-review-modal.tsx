import { Dialog } from '@headlessui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

interface Document {
  id: string;
  type: string;
  status: string;
  url: string;
  driver: {
    name: string;
    phone: string;
  };
}

interface Props {
  document: Document;
  open: boolean;
  onClose: () => void;
}

export function DocumentReviewModal({ document, open, onClose }: Props) {
  const [rejectionReason, setRejectionReason] = useState('');
  const queryClient = useQueryClient();

  const reviewDocument = useMutation({
    mutationFn: async ({
      status,
      reason,
    }: {
      status: 'APPROVED' | 'REJECTED';
      reason?: string;
    }) => {
      await api.put(`/admin/documents/${document.id}/review`, {
        status,
        rejectionReason: reason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document review updated');
      onClose();
    },
    onError: () => {
      toast.error('Failed to update document review');
    },
  });

  const handleApprove = () => {
    reviewDocument.mutate({ status: 'APPROVED' });
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    reviewDocument.mutate({ status: 'REJECTED', reason: rejectionReason });
  };

  const getDocumentTypeName = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full rounded bg-white p-6">
          <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
            Review Document
          </Dialog.Title>

          <div className="mt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Document Type</h3>
                <p className="mt-1">{getDocumentTypeName(document.type)}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Driver</h3>
                <p className="mt-1">{document.driver.name}</p>
                <p className="text-sm text-gray-500">{document.driver.phone}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Document Preview</h3>
                <div className="mt-2">
                  <a
                    href={document.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Document in New Tab
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Rejection Reason</h3>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  placeholder="Required if rejecting the document"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleReject}
              disabled={reviewDocument.isPending}
              className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={handleApprove}
              disabled={reviewDocument.isPending}
              className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Approve
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}