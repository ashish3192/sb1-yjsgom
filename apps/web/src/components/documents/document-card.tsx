import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { DocumentReviewModal } from './document-review-modal';

interface Document {
  id: string;
  type: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  url: string;
  driver: {
    id: string;
    name: string;
    phone: string;
  };
}

interface Props {
  document: Document;
}

export function DocumentCard({ document }: Props) {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const getDocumentTypeName = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {getDocumentTypeName(document.type)}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Driver: {document.driver.name}
              </p>
              <p className="text-sm text-gray-500">
                Phone: {document.driver.phone}
              </p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Pending
            </span>
          </div>

          <div className="mt-4">
            <a
              href={document.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View Document
            </a>
          </div>

          <div className="mt-4">
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Review Document
            </button>
          </div>
        </div>
      </div>

      <DocumentReviewModal
        document={document}
        open={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </>
  );
}