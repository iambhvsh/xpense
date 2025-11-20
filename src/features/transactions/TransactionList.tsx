import React, { useMemo } from 'react';
import { Transaction } from '@/lib/types';
import { TransactionItem } from './components/TransactionItem';
import { EmptyState } from '@/shared/components/EmptyState';
import { ShoppingBag } from 'lucide-react';
import { useDevicePerformance } from '@/lib/hooks/usePerformance';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = React.memo(({ 
  transactions, 
  onDelete 
}) => {
  const { shouldReduceAnimations } = useDevicePerformance();

  const grouped = useMemo(() => {
    return transactions.reduce((acc: Record<string, Transaction[]>, t: Transaction) => {
      const date = new Date(t.date);
      const key = date.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
      if (!acc[key]) acc[key] = [];
      acc[key].push(t);
      return acc;
    }, {});
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="No Transactions"
        description="Tap + to add your first transaction"
      />
    );
  }

  return (
    <div className="space-y-6 pb-10 contain-layout">
      {Object.entries(grouped).map(([month, items]: [string, Transaction[]]) => (
        <div 
          key={month} 
          className={shouldReduceAnimations ? '' : 'animate-fade-in'}
          style={{ willChange: shouldReduceAnimations ? 'auto' : 'opacity' }}
        >
          <h3 className="text-[13px] font-bold text-[#8E8E93] uppercase tracking-[0.06em] ml-0 mb-3">
            {month}
          </h3>
          
          <div className="bg-[#1C1C1E] md:bg-[#F5F5F7] rounded-[28px] overflow-hidden shadow-sm contain-paint gpu-accelerated">
            {items.map((transaction, index) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onDelete={onDelete}
                isLast={index === items.length - 1}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});
