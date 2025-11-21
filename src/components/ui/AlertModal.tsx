import React from 'react';

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

export const AlertModal: React.FC<AlertModalProps> = ({
  open,
  title,
  message,
  actions,
  onAction,
  onClose,
  processing = false
}) => {
  if (!open) return null;

  const actionButtons =
    actions && actions.length > 0
      ? actions
      : [
          {
            label: 'OK',
            onPress: onClose
          }
        ];

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
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 gpu-accelerated"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in gpu-accelerated"
        onClick={() => {
          if (!processing) onClose();
        }}
      />

      <div className="relative w-full max-w-[270px]">
        <div
          className="bg-[#1C1C1E] md:bg-white rounded-[14px] w-full overflow-hidden animate-scale-in shadow-2xl gpu-accelerated"
          style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
        >
          <div className="px-4 pt-5 pb-4 text-center">
            {title && (
              <h3 className="text-[17px] font-semibold text-white md:text-[#000000] tracking-[-0.41px] mb-2">
                {title}
              </h3>
            )}
            {message && (
              <p className="text-[13px] text-[#D7D7DB] md:text-[#8E8E93] tracking-[-0.08px] leading-[18px] whitespace-pre-line">
                {message}
              </p>
            )}
          </div>

          {actionButtons.map((action, index) => {
            const isDanger = action.variant === 'danger';
            return (
              <div
                key={`${action.label}-${index}`}
                className="border-t border-[#38383A] md:border-[#C6C6C8]"
              >
                <button
                  disabled={processing}
                  onClick={() => handleAction(action)}
                  className={`w-full py-3 text-[17px] font-semibold tracking-[-0.41px] transition-colors ${
                    processing ? 'opacity-40 cursor-not-allowed' : 'active:bg-[#2C2C2E] md:active:bg-[#E5E5EA]'
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

