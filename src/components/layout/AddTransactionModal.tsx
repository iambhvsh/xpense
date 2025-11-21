import React, { Suspense } from 'react';

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
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 gpu-accelerated">
      <div
        className={`absolute inset-0 bg-black/50 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
        onClick={onClose}
        style={{
          transform: 'translate3d(0, 0, 0)',
          touchAction: 'none'
        }}
      />

      <div
        className={`relative w-full max-h-[85vh] md:h-auto md:w-full md:max-w-[540px] rounded-t-[28px] md:rounded-[28px] flex flex-col md:max-h-[85vh] shadow-2xl overflow-hidden ${
          isClosing ? 'md:animate-scale-out animate-slide-down' : 'md:animate-scale-in animate-slide-up'
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{
          backdropFilter: 'blur(20px) saturate(150%)',
          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 20px 60px rgba(0, 0, 0, 0.8)',
          transform: 'translate3d(0, 0, 0)'
        }}
      >
        <div className="flex-none flex items-center justify-between h-14 px-4 border-b border-white/5 contain-layout" style={{ background: 'rgba(28, 28, 30, 0.7)' }}>
          <h3 className="text-[20px] font-bold text-white tracking-tight">New Transaction</h3>
          <button
            onClick={onClose}
            className="text-ios-blue text-[17px] font-semibold active:opacity-60 transition-opacity tracking-[-0.41px]"
          >
            Cancel
          </button>
        </div>

        <div
          className="overflow-y-auto overscroll-contain no-scrollbar smooth-scroll"
          style={{
            background: 'linear-gradient(to bottom, rgba(28, 28, 30, 0.7) 0%, rgba(0, 0, 0, 0.95) 40%, rgba(0, 0, 0, 1) 80%)',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y',
            maxHeight: 'calc(85vh - 56px)'
          }}
        >
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full py-12">
                <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            {children}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

