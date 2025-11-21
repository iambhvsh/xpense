/**
 * Optimized Alert Modal
 * Uses Web Animations API with parent-controlled state
 */

import React, { useEffect, useRef } from 'react';

export type AlertAction = {
  label: string;
  variant?: 'default' | 'danger';
  onPress?: () => void | Promise<void>;
};

interface AlertModalProps {
  open: boolean;
  title?: string;
  message?: string;
  actions?: AlertAction[];
  onAction?: (action: AlertAction) => void;
  onClose: () => void;
  processing?: boolean;
}

const IOS_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';
const DURATION_IN = 250;
const DURATION_OUT = 200;

export const AlertModal: React.FC<AlertModalProps> = ({
  open,
  title,
  message,
  actions,
  onAction,
  onClose,
  processing = false
}) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);

  // Animate in when opened
  useEffect(() => {
    if (open && !hasAnimatedRef.current) {
      hasAnimatedRef.current = true;
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
            { transform: 'scale(0.94)', opacity: 0 },
            { transform: 'scale(1)', opacity: 1 }
          ],
          { duration: DURATION_IN, easing: IOS_EASING, fill: 'forwards' }
        );
      });
    } else if (!open) {
      hasAnimatedRef.current = false;
    }
  }, [open]);

  if (!open) return null;

  const actionButtons =
    actions && actions.length > 0
      ? actions
      : [{ label: 'OK', onPress: onClose }];

  const handleAction = (action: AlertAction) => {
    if (processing) return;
    if (onAction) {
      onAction(action);
    } else {
      action.onPress?.();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => {
          if (!processing) onClose();
        }}
        style={{ opacity: 0, willChange: 'opacity' }}
      />

      <div className="relative w-full max-w-[270px]">
        <div
          ref={contentRef}
          className="bg-[#1C1C1E] rounded-[14px] w-full overflow-hidden shadow-2xl"
          style={{
            transform: 'scale(0.94)',
            opacity: 0,
            willChange: 'transform, opacity'
          }}
        >
          <div className="px-4 pt-5 pb-4 text-center">
            {title && (
              <h3 className="text-[17px] font-semibold text-white tracking-[-0.41px] mb-2">
                {title}
              </h3>
            )}
            {message && (
              <p className="text-[13px] text-[#D7D7DB] tracking-[-0.08px] leading-[18px] whitespace-pre-line">
                {message}
              </p>
            )}
          </div>

          {actionButtons.map((action, index) => {
            const isDanger = action.variant === 'danger';
            return (
              <div
                key={`${action.label}-${index}`}
                className="border-t border-[#38383A]"
              >
                <button
                  disabled={processing}
                  onClick={() => handleAction(action)}
                  className={`w-full py-3 text-[17px] font-semibold tracking-[-0.41px] transition-colors ${
                    processing ? 'opacity-40 cursor-not-allowed' : 'active:bg-[#2C2C2E]'
                  } ${isDanger ? 'text-[#FF3B30]' : 'text-[#007AFF]'}`}
                >
                  {action.label}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
