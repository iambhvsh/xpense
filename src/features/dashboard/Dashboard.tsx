import React, { useState, useEffect } from 'react';
import { Transaction } from '@/lib/types';
import { StatCard } from './components/StatCard';
import { ExpenseBreakdown } from './components/ExpenseBreakdown';
import { ActivityChart } from './components/ActivityChart';
import { useDashboardData } from './hooks/useDashboardData';

interface DashboardProps {
  transactions: Transaction[];
}

export const Dashboard: React.FC<DashboardProps> = React.memo(({ transactions }) => {
  const [mounted, setMounted] = useState(false);
  const { stats, balance, categoryData, activityData } = useDashboardData(transactions);
  
  useEffect(() => {
    // Use requestAnimationFrame for smoother mounting
    const rafId = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="space-y-4 pb-6 contain-layout">
      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <StatCard label="Balance" value={balance} type="balance" />
        <StatCard label="Income" value={stats.totalIncome} type="income" />
        <StatCard label="Spending" value={stats.totalExpense} type="expense" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <ExpenseBreakdown data={categoryData} mounted={mounted} />
        <ActivityChart data={activityData} mounted={mounted} />
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for better performance
  return prevProps.transactions.length === nextProps.transactions.length &&
         prevProps.transactions[0]?.id === nextProps.transactions[0]?.id;
});
