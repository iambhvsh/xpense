import React, { useState, useMemo, useRef, useEffect } from 'react';
import { TransactionRecord } from '@/lib/db';
import { Category } from '@/types';
import { CATEGORY_COLORS } from '@/lib/constants';
import { formatCurrency, formatDate } from '@/lib/utils/currency';
import { Trash2, Coffee, ShoppingBag, Zap, Car, Activity, DollarSign, Film, MoreHorizontal, ChevronDown, Calendar, Tag, FileText } from 'lucide-react';

interface TransactionItemProps {
  transaction: TransactionRecord;
  onDelete: (id: number) => void;
  isLast: boolean;
}

const getIcon = (category: Category) => {
  const iconProps = { size: 18, strokeWidth: 2.5 };
  
  switch (category) {
    case Category.FOOD: return <Coffee {...iconProps} />;
    case Category.SHOPPING: return <ShoppingBag {...iconProps} />;
    case Category.UTILITIES: return <Zap {...iconProps} />;
    case Category.TRANSPORT: return <Car {...iconProps} />;
    case Category.HEALTH: return <Activity {...iconProps} />;
    case Category.INCOME: return <DollarSign {...iconProps} />;
    case Category.ENTERTAINMENT: return <Film {...iconProps} />;
    default: return <MoreHorizontal {...iconProps} />;
  }
};

export const TransactionItem: React.FC<TransactionItemProps> = React.memo(({ 
  transaction, 
  onDelete, 
  isLast 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (transaction.id) {
      onDelete(transaction.id);
    }
  };

  const handleToggle = () => {
    setIsExpanded(prev => !prev);
  };

  // Memoize expensive operations
  const icon = useMemo(() => getIcon(transaction.category as Category), [transaction.category]);
  const formattedAmount = useMemo(() => formatCurrency(transaction.amount), [transaction.amount]);
  const formattedDate = useMemo(() => formatDate(transaction.date), [transaction.date]);

  return (
    <div className="relative transaction-list-item">
      {/* Main Transaction Row */}
      <button 
        onClick={handleToggle}
        className="w-full flex items-center justify-between px-5 py-4 min-h-[72px] active:bg-[#2C2C2E] text-left transition-colors duration-150"
      >
        <div className="flex items-center gap-4 overflow-hidden flex-1">
          <div 
            className="w-12 h-12 rounded-[14px] flex items-center justify-center text-white shrink-0 shadow-sm"
            style={{ backgroundColor: CATEGORY_COLORS[transaction.category] }}
          >
            {icon}
          </div>
          
          <div className="flex flex-col min-w-0 flex-1">
            <h4 className="font-semibold text-white text-[17px] leading-tight truncate tracking-[-0.41px]">
              {transaction.description}
            </h4>
            <span className="text-[13px] text-[#8E8E93] mt-1.5 truncate tracking-[-0.08px] font-medium">
              {formattedDate}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <span 
            className={`font-bold text-[18px] tracking-[-0.41px] ${
              transaction.isExpense ? 'text-[#FF3B30]' : 'text-ios-green'
            }`} 
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {transaction.isExpense ? '-' : '+'}
            {formattedAmount}
          </span>
          
          <ChevronDown 
            size={20} 
            strokeWidth={2.5}
            className="text-[#8E8E93] transition-transform duration-300"
            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </div>
      </button>

      {/* Expanded Details */}
      <div 
        ref={detailsRef}
        className="overflow-hidden"
        style={{ 
          transform: isExpanded ? 'scaleY(1)' : 'scaleY(0)',
          transformOrigin: 'top',
          opacity: isExpanded ? 1 : 0,
          height: isExpanded ? 'auto' : 0,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div className="px-5 pb-4 pt-2 space-y-3 bg-[#0A0A0A]/30">
          {/* Category */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#2C2C2E] flex items-center justify-center shrink-0">
              <Tag size={14} strokeWidth={2.5} className="text-[#8E8E93]" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] text-[#8E8E93] tracking-[-0.08px]">Category</p>
              <p className="text-[15px] text-white font-medium tracking-[-0.24px] mt-0.5">
                {transaction.category}
              </p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#2C2C2E] flex items-center justify-center shrink-0">
              <Calendar size={14} strokeWidth={2.5} className="text-[#8E8E93]" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] text-[#8E8E93] tracking-[-0.08px]">Date</p>
              <p className="text-[15px] text-white font-medium tracking-[-0.24px] mt-0.5">
                {formattedDate}
              </p>
            </div>
          </div>

          {/* Note */}
          {transaction.note && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#2C2C2E] flex items-center justify-center shrink-0">
                <FileText size={14} strokeWidth={2.5} className="text-[#8E8E93]" />
              </div>
              <div className="flex-1">
                <p className="text-[13px] text-[#8E8E93] tracking-[-0.08px]">Note</p>
                <p className="text-[15px] text-white tracking-[-0.24px] mt-0.5 leading-relaxed">
                  {transaction.note}
                </p>
              </div>
            </div>
          )}

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="w-full mt-2 py-3 rounded-[12px] bg-[#FF3B30]/10 text-[#FF3B30] font-semibold text-[15px] tracking-[-0.24px] active:bg-[#FF3B30]/20 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 size={16} strokeWidth={2.5} />
            <span>Delete Transaction</span>
          </button>
        </div>
      </div>

      {/* Separator */}
      {!isLast && (
        <div className="absolute bottom-0 left-[76px] right-0 h-[0.33px] bg-[#38383A]" />
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.transaction.id === nextProps.transaction.id &&
    prevProps.transaction.amount === nextProps.transaction.amount &&
    prevProps.transaction.description === nextProps.transaction.description &&
    prevProps.isLast === nextProps.isLast
  );
});
