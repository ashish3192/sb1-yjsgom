import { useState } from 'react';
import { AddDriverModal } from './add-driver-modal';

export function AddDriverButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Add Driver
      </button>

      <AddDriverModal open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}