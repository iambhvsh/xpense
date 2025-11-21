import React, { useMemo, useState, useCallback } from 'react';
import { TransactionRecord } from '@/lib/db';
import { TransactionItem } from '@/components/transactions/TransactionItem';
import { EmptyState } from '@/components/ui/EmptyState';
import { ShoppingBag } from 'lucide-react';

interface TransactionListProps {
  transactions: TransactionRecord[];
  onDelete: (id: number) => void;
}

const ITEMS_PER_PAGE = 20;

export const TransactionList: React.FC<TransactionListProps> = React.memo(({ 
  transactions, 
  onDelete 
}) => {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const grouped = useMemo(() => {
    return transactions.reduce((acc: Record<string, TransactionRecord[]>, t: TransactionRecord) => {
      const date = new Date(t.date);
      const key = date.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
      if (!acc[key]) acc[key] = [];
      acc[key].push(t);
      return acc;
    }, {});
  }, [transactions]);

  const visibleTransactions = useMemo(() => {
    const entries = Object.entries(grouped);
    const result: [string, TransactionRecord[]][] = [];
    let count = 0;

    for (const [month, items] of entries) {
      if (count >= visibleCount) break;
      const remaining = visibleCount - count;
      result.push([month, items.slice(0, remaining)]);
      count += items.length;
    }

    return result;
  }, [grouped, visibleCount]);

  const hasMore = transactions.length > visibleCount;

  const loadMore = useCallback(() => {
    requestAnimationFrame(() => {
      setVisibleCount(prev => prev + ITEMS_PER_PAGE);
    });
  }, []);

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
    <div className="space-y-6 pb-10">
      {visibleTransactions.map(([month, items]: [string, TransactionRecord[]]) => (
        <div key={month}>
          <h3 className="text-[13px] font-bold text-[#8E8E93] uppercase tracking-[0.06em] ml-0 mb-3">
            {month}
          </h3>
          
          <div className="bg-[#1C1C1E] rounded-[28px] overflow-hidden shadow-sm">
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

      {hasMore && (
        <button
          onClick={loadMore}
          className="w-full py-3 text-ios-blue text-[17px] font-semibold active:opacity-60 transition-opacity"
        >
          Load More
        </button>
      )}
    </div>
  );
});
