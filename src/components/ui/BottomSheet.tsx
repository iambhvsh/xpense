/**
 * Bottom Sheet - Uses Universal Bottom Sheet
 */

import React from 'react';
import { UniversalBottomSheet } from './UniversalBottomSheet';

interface BottomSheetProps {
  open: boolean;
  isClosing: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxHeight?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  open,
  isClosing,
  onClose,
  title,
  children,
  maxHeight = '70vh'
}) => {
  return (
    <UniversalBottomSheet
      open={open}
      isClosing={isClosing}
      onClose={onClose}
      title={title}
      maxHeight={maxHeight}
      showDoneButton
      doneButtonText="Done"
    >
      {children}
    </UniversalBottomSheet>
  );
};
