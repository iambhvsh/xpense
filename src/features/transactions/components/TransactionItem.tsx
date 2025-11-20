import React from 'react';
import { Transaction, Category } from '@/lib/types';
import { CATEGORY_COLORS } from '@/lib/constants';
import { formatCurrency, formatDate } from '@/lib/utils/currency';
import { Trash2, Coffee, ShoppingBag, Zap, Car, Activity, DollarSign, Film, MoreHorizontal } from 'lucide-react';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
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
  const handleDelete = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(transaction.id);
  }, [transaction.id, onDelete]);

  const icon = React.useMemo(() => getIcon(transaction.category), [transaction.category]);
  const formattedAmount = React.useMemo(() => formatCurrency(transaction.amount), [transaction.amount]);
  const formattedDate = React.useMemo(() => formatDate(transaction.date), [transaction.date]);

  return (
    <div className="relative flex items-center justify-between px-5 py-4 min-h-[72px] transaction-list-item">
      {!isLast && (
        <div className="absolute bottom-0 left-[76px] right-0 h-[0.33px] bg-[#38383A]" />
      )}

      <div className="flex items-center gap-4 overflow-hidden flex-1">
        <div 
          className="w-12 h-12 rounded-[14px] flex items-center justify-center text-white shrink-0 shadow-sm gpu-accelerated"
          style={{ backgroundColor: CATEGORY_COLORS[transaction.category] }}
        >
          {icon}
        </div>
        
        <div className="flex flex-col min-w-0 flex-1">
          <h4 className="font-semibold text-white md:text-[#1D1D1F] text-[17px] leading-tight truncate tracking-[-0.41px]">
            {transaction.description}
          </h4>
          <span className="text-[13px] text-[#8E8E93] mt-1.5 truncate tracking-[-0.08px] font-medium">
            {formattedDate}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-4 shrink-0">
        <span 
          className={`font-bold text-[18px] tracking-[-0.41px] ${
            transaction.isExpense ? 'text-white md:text-[#1D1D1F]' : 'text-ios-green'
          }`} 
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {transaction.isExpense ? '-' : '+'}
          {formattedAmount}
        </span>
        
        <button 
          onClick={handleDelete}
          className="w-9 h-9 flex items-center justify-center text-[#8E8E93] hover:text-ios-red active:opacity-60 rounded-full transition-opacity"
          aria-label="Delete transaction"
        >
          <Trash2 size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.transaction.id === nextProps.transaction.id &&
         prevProps.transaction.amount === nextProps.transaction.amount &&
         prevProps.transaction.description === nextProps.transaction.description &&
         prevProps.isLast === nextProps.isLast;
});
