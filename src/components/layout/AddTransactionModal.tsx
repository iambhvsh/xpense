/**
 * Add Transaction Modal - Uses Universal Bottom Sheet
 */

import React from 'react';
import { UniversalBottomSheet } from '../ui/UniversalBottomSheet';

interface AddTransactionModalProps {
  open: boolean;
  isClosing: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  open,
  isClosing,
  onClose,
  children
}) => {
  return (
    <UniversalBottomSheet
      open={open}
      isClosing={isClosing}
      onClose={onClose}
      title="New Transaction"
      showCancelButton
      cancelButtonText="Cancel"
      suspenseFallback
    >
      {children}
    </UniversalBottomSheet>
  );
};
