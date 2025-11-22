import React from 'react';
import { TransactionRecord } from '../../lib/db';
import { StatCard } from './StatCard';
import { ExpenseBreakdown } from './ExpenseBreakdown';
import { ActivityChart } from './ActivityChart';
import { useDashboardData } from './useDashboardData';

interface DashboardProps {
  transactions: TransactionRecord[];
}

export const Dashboard: React.FC<DashboardProps> = React.memo(({ transactions }) => {
  const { stats, balance, categoryData, activityData } = useDashboardData(transactions);

  return (
    <div className="space-y-4 md:space-y-5 pb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <StatCard label="Balance" value={balance} type="balance" />
        <StatCard label="Income" value={stats.totalIncome} type="income" />
        <StatCard label="Spending" value={stats.totalExpense} type="expense" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <ExpenseBreakdown data={categoryData} />
        <ActivityChart data={activityData} />
      </div>
    </div>
  );
});
