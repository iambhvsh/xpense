/**
 * Add Transaction Modal
 */

import React from 'react';
import { BottomSheetBase } from '../ui/BottomSheetBase';

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
    <BottomSheetBase
      open={open}
      isClosing={isClosing}
      onClose={onClose}
      title="New Transaction"
      showCancelButton
      cancelButtonText="Cancel"
      suspenseFallback
    >
      {children}
    </BottomSheetBase>
  );
};
