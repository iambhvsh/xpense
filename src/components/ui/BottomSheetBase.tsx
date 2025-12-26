/**
 * Bottom Sheet Base Component
 * Single reusable component for all bottom sheets in the app
 * Uses Web Animations API for smooth transitions
 */

import React, { useEffect, useRef, Suspense } from 'react';
import { Spinner } from './Spinner';

interface BottomSheetBaseProps {
  open: boolean;
  isClosing: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxHeight?: string;
  showDoneButton?: boolean;
  doneButtonText?: string;
  showCancelButton?: boolean;
  cancelButtonText?: string;
  suspenseFallback?: boolean;
}

const IOS_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';
const DURATION_IN = 400;
const DURATION_OUT = 350;

export const BottomSheetBase: React.FC<BottomSheetBaseProps> = ({
  open,
  isClosing,
  onClose,
  title,
  children,
  maxHeight = '85vh',
  showDoneButton = true,
  doneButtonText = 'Done',
  showCancelButton = false,
  cancelButtonText = 'Cancel',
  suspenseFallback = false
}) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Animate in when opened
  useEffect(() => {
    if (open && !isClosing) {
      const backdrop = backdropRef.current;
      const content = contentRef.current;
      
      if (!backdrop || !content) return;

      requestAnimationFrame(() => {
        backdrop.animate(
          [{ opacity: 0 }, { opacity: 1 }],
          { duration: DURATION_IN, easing: IOS_EASING, fill: 'forwards' }
        );

        content.animate(
          [
            { transform: 'translateY(100%)', opacity: 0 },
            { transform: 'translateY(0)', opacity: 1 }
          ],
          { duration: DURATION_IN, easing: IOS_EASING, fill: 'forwards' }
        );
      });
    }
  }, [open, isClosing]);

  // Animate out when closing
  useEffect(() => {
    if (isClosing) {
      const backdrop = backdropRef.current;
      const content = contentRef.current;
      
      if (!backdrop || !content) return;

      backdrop.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: DURATION_OUT, easing: IOS_EASING, fill: 'forwards' }
      );

      content.animate(
        [
          { transform: 'translateY(0)', opacity: 1 },
          { transform: 'translateY(100%)', opacity: 0 }
        ],
        { duration: DURATION_OUT, easing: IOS_EASING, fill: 'forwards' }
      );
    }
  }, [isClosing]);

  if (!open) return null;

  const content = suspenseFallback ? (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full py-12">
          <Spinner className="w-8 h-8 text-white" />
        </div>
      }
    >
      {children}
    </Suspense>
  ) : children;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        style={{ opacity: 0, willChange: 'opacity' }}
      />

      <div
        ref={contentRef}
        className="relative w-full max-w-[1024px] rounded-t-[28px] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          backdropFilter: 'blur(20px) saturate(150%)',
          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 20px 60px rgba(0, 0, 0, 0.8)',
          maxHeight,
          transform: 'translateY(100%)',
          opacity: 0,
          willChange: 'transform, opacity',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div 
          className="flex-none flex items-center justify-between h-14 px-4 border-b border-white/5" 
          style={{ background: 'rgba(28, 28, 30, 0.7)' }}
        >
          <h3 className="text-[20px] font-bold text-white tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="text-ios-blue text-[17px] font-semibold active:opacity-60 transition-opacity tracking-[-0.41px]"
          >
            {showCancelButton ? cancelButtonText : showDoneButton ? doneButtonText : ''}
          </button>
        </div>

        {/* Content */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain no-scrollbar smooth-scroll"
          style={{
            background: 'rgba(0, 0, 0, 0.98)',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)' }}>
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};
