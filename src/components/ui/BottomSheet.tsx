/**
 * Bottom Sheet - For pickers and simple content
 */

import React from 'react';
import { BottomSheetBase } from './BottomSheetBase';

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
    <BottomSheetBase
      open={open}
      isClosing={isClosing}
      onClose={onClose}
      title={title}
      maxHeight={maxHeight}
      showDoneButton
      doneButtonText="Done"
    >
      {children}
    </BottomSheetBase>
  );
};
