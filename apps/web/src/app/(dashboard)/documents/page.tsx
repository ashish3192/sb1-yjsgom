import { DocumentReviewList } from '@/components/documents/document-review-list';

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Document Review</h1>
      </div>
      <DocumentReviewList />
    </div>
  );
}