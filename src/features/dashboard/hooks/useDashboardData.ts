import { useMemo } from 'react';
import { Transaction } from '@/lib/types';

export const useDashboardData = (transactions: Transaction[]) => {
  const stats = useMemo(() => {
    return transactions.reduce(
      (acc, t) => {
        if (t.isExpense) {
          acc.totalExpense += t.amount;
        } else {
          acc.totalIncome += t.amount;
        }
        return acc;
      },
      { totalIncome: 0, totalExpense: 0 }
    );
  }, [transactions]);

  const balance = stats.totalIncome - stats.totalExpense;

  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    transactions.filter(t => t.isExpense).forEach(t => {
      data[t.category] = (data[t.category] || 0) + t.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const activityData = useMemo(() => {
    const weekDays = [];
    const now = new Date();
    const currentDay = now.getDay();
    
    for (let i = currentDay; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;
      
      weekDays.push({
        date: dateKey,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        income: 0,
        expense: 0
      });
    }
    
    const remainingDays = 7 - weekDays.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date();
      date.setDate(now.getDate() + i);
      date.setHours(0, 0, 0, 0);
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;
      
      weekDays.push({
        date: dateKey,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        income: 0,
        expense: 0
      });
    }
    
    transactions.forEach(t => {
      let dateKey: string;
      try {
        if (typeof t.date === 'string') {
          if (/^\d{4}-\d{2}-\d{2}$/.test(t.date)) {
            dateKey = t.date;
          } else {
            const transactionDate = new Date(t.date);
            if (!isNaN(transactionDate.getTime())) {
              dateKey = transactionDate.toISOString().split('T')[0];
            } else {
              return;
            }
          }
        } else {
          return;
        }
        
        const dayData = weekDays.find(d => d.date === dateKey);
        if (dayData) {
          if (t.isExpense) {
            dayData.expense += t.amount;
          } else {
            dayData.income += t.amount;
          }
        }
      } catch (error) {
        console.error('Error parsing transaction date:', t.date, error);
      }
    });
    
    return weekDays;
  }, [transactions]);

  return {
    stats,
    balance,
    categoryData,
    activityData
  };
};
