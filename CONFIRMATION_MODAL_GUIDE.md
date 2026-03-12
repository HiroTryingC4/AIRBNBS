# Confirmation Modal System

A reusable confirmation modal system has been implemented throughout the application to replace browser `confirm()` dialogs with a more professional and customizable UI.

## Components

### 1. ConfirmationModal Component
Located at: `components/ConfirmationModal.tsx`

A fully-featured modal component with:
- Three types: `danger`, `warning`, `info`
- Loading states
- Keyboard support (Escape to close)
- Backdrop click to close
- Customizable text and colors

### 2. useConfirmation Hook
Located at: `lib/hooks/useConfirmation.ts`

A custom hook that manages the modal state and provides easy-to-use methods.

## Usage

### Basic Setup

```tsx
import ConfirmationModal from '@/components/ConfirmationModal';
import { useConfirmation } from '@/lib/hooks/useConfirmation';

export default function MyComponent() {
  const confirmation = useConfirmation();

  const handleDelete = () => {
    confirmation.showConfirmation(
      {
        title: 'Delete Item',
        message: 'Are you sure you want to delete this item?',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger',
      },
      async () => {
        // Your async action here
        await deleteItem();
      }
    );
  };

  return (
    <div>
      <button onClick={handleDelete}>Delete</button>
      
      {/* Add the modal at the end of your component */}
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
```

### Modal Types

#### Danger (Red)
```tsx
confirmation.showConfirmation({
  title: 'Delete Property',
  message: 'This action cannot be undone.',
  type: 'danger',
}, async () => {
  await deleteProperty();
});
```

#### Warning (Yellow)
```tsx
confirmation.showConfirmation({
  title: 'Warning',
  message: 'This will affect multiple records.',
  type: 'warning',
}, async () => {
  await updateMultipleRecords();
});
```

#### Info (Blue)
```tsx
confirmation.showConfirmation({
  title: 'Confirm Action',
  message: 'This will send notifications to users.',
  type: 'info',
}, async () => {
  await sendNotifications();
});
```

## Features

- **Loading States**: The modal shows a spinner and disables buttons during async operations
- **Error Handling**: Errors in the confirmation action are caught and logged
- **Keyboard Support**: Press Escape to close (when not loading)
- **Accessibility**: Proper ARIA labels and focus management
- **Responsive**: Works on mobile and desktop
- **Customizable**: All text and button labels can be customized

## Currently Implemented In

- ✅ Admin Properties Page (delete properties)
- ✅ Admin Reviews Page (publish/unpublish reviews)
- ✅ Admin Inquiries Page (delete inquiries)

## Adding to New Pages

1. Import the components:
```tsx
import ConfirmationModal from '@/components/ConfirmationModal';
import { useConfirmation } from '@/lib/hooks/useConfirmation';
```

2. Initialize the hook:
```tsx
const confirmation = useConfirmation();
```

3. Use in your action handlers:
```tsx
const handleAction = () => {
  confirmation.showConfirmation(options, asyncAction);
};
```

4. Add the modal component to your JSX:
```tsx
<ConfirmationModal {...confirmation} />
```

## Benefits Over Browser confirm()

- ✅ Professional, branded appearance
- ✅ Loading states for async operations
- ✅ Better mobile experience
- ✅ Customizable styling
- ✅ Consistent across all browsers
- ✅ Better accessibility
- ✅ Error handling built-in