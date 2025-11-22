import { useMemo } from 'react';
import { TransactionRecord } from '../../../lib/db';

export const useDashboardData = (transactions: TransactionRecord[]) => {
  const stats = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    
    for (let i = 0; i < transactions.length; i++) {
      const t = transactions[i];
      if (t.isExpense) {
        totalExpense += t.amount;
      } else {
        totalIncome += t.amount;
      }
    }
    
    return { totalIncome, totalExpense };
  }, [transactions]);

  const balance = useMemo(() => stats.totalIncome - stats.totalExpense, [stats]);

  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    
    for (let i = 0; i < transactions.length; i++) {
      const t = transactions[i];
      if (t.isExpense) {
        data[t.category] = (data[t.category] || 0) + t.amount;
      }
    }
    
    const result: Array<{ name: string; value: number }> = [];
    for (const name in data) {
      result.push({ name, value: data[name] });
    }
    
    return result;
  }, [transactions]);

  const activityData = useMemo(() => {
    const now = new Date();
    const currentDay = now.getDay();
    const weekDays: Array<{ date: string; dayName: string; income: number; expense: number }> = [];
    
    // Pre-allocate array
    for (let i = currentDay; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      weekDays.push({
        date: `${year}-${month}-${day}`,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        income: 0,
        expense: 0
      });
    }
    
    const remainingDays = 7 - weekDays.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() + i);
      date.setHours(0, 0, 0, 0);
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      weekDays.push({
        date: `${year}-${month}-${day}`,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        income: 0,
        expense: 0
      });
    }
    
    // Create date map for O(1) lookup
    const dateMap = new Map<string, { income: number; expense: number }>();
    for (const day of weekDays) {
      dateMap.set(day.date, day);
    }
    
    // Single pass through transactions
    for (let i = 0; i < transactions.length; i++) {
      const t = transactions[i];
      let dateKey: string;
      
      if (typeof t.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(t.date)) {
        dateKey = t.date;
      } else {
        try {
          const transactionDate = new Date(t.date);
          if (!isNaN(transactionDate.getTime())) {
            dateKey = transactionDate.toISOString().split('T')[0];
          } else {
            continue;
          }
        } catch {
          continue;
        }
      }
      
      const dayData = dateMap.get(dateKey);
      if (dayData) {
        if (t.isExpense) {
          dayData.expense += t.amount;
        } else {
          dayData.income += t.amount;
        }
      }
    }
    
    return weekDays;
  }, [transactions]);

  return {
    stats,
    balance,
    categoryData,
    activityData
  };
};
