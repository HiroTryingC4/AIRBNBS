'use client';

import { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';
import { useConfirmation } from '@/lib/hooks/useConfirmation';

// Example component showing different ways to use the confirmation modal
export default function ExampleConfirmationUsage() {
  const confirmation = useConfirmation();
  const [message, setMessage] = useState('');

  // Example 1: Simple delete confirmation
  const handleDelete = () => {
    confirmation.showConfirmation(
      {
        title: 'Delete Item',
        message: 'Are you sure you want to delete this item? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger',
      },
      async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMessage('Item deleted successfully!');
      }
    );
  };

  // Example 2: Warning confirmation
  const handleWarningAction = () => {
    confirmation.showConfirmation(
      {
        title: 'Warning',
        message: 'This action will affect multiple records. Do you want to continue?',
        confirmText: 'Continue',
        cancelText: 'Cancel',
        type: 'warning',
      },
      async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setMessage('Action completed with warnings!');
      }
    );
  };

  // Example 3: Info confirmation
  const handleInfoAction = () => {
    confirmation.showConfirmation(
      {
        title: 'Confirm Action',
        message: 'This will send a notification to all users. Are you sure?',
        confirmText: 'Send',
        cancelText: 'Cancel',
        type: 'info',
      },
      async () => {
        await new Promise(resolve => setTimeout(resolve, 800));
        setMessage('Notification sent successfully!');
      }
    );
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Confirmation Modal Examples</h2>
      
      {message && (
        <div className="p-4 bg-green-100 text-green-700 rounded-lg">
          {message}
        </div>
      )}

      <div className="space-x-4">
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Delete (Danger)
        </button>
        
        <button
          onClick={handleWarningAction}
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
        >
          Warning Action
        </button>
        
        <button
          onClick={handleInfoAction}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Info Action
        </button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={confirmation.hideConfirmation}
        onConfirm={confirmation.handleConfirm}
        title={confirmation.title}
        message={confirmation.message}
        confirmText={confirmation.confirmText}
        cancelText={confirmation.cancelText}
        type={confirmation.type}
        loading={confirmation.loading}
      />
    </div>
  );
}