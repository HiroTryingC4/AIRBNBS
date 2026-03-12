'use client';

import { useState, useCallback } from 'react';

interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

interface ConfirmationState extends ConfirmationOptions {
  isOpen: boolean;
  loading: boolean;
  onConfirm?: () => void | Promise<void>;
}

export function useConfirmation() {
  const [state, setState] = useState<ConfirmationState>({
    isOpen: false,
    loading: false,
    title: '',
    message: '',
  });

  const showConfirmation = useCallback((
    options: ConfirmationOptions,
    onConfirm: () => void | Promise<void>
  ) => {
    setState({
      ...options,
      isOpen: true,
      loading: false,
      onConfirm,
    });
  }, []);

  const hideConfirmation = useCallback(() => {
    if (!state.loading) {
      setState(prev => ({ ...prev, isOpen: false }));
    }
  }, [state.loading]);

  const handleConfirm = useCallback(async () => {
    if (!state.onConfirm) return;

    try {
      setState(prev => ({ ...prev, loading: true }));
      await state.onConfirm();
      setState(prev => ({ ...prev, isOpen: false, loading: false }));
    } catch (error) {
      console.error('Confirmation action failed:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [state.onConfirm]);

  return {
    ...state,
    showConfirmation,
    hideConfirmation,
    handleConfirm,
  };
}