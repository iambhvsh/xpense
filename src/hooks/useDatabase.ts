import { useState, useEffect, useCallback } from 'react';
import { db, dbHelpers, TransactionRecord, initializeDatabase } from '../lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

// Hook for transactions
export function useTransactions() {
  const transactions = useLiveQuery(
    () => dbHelpers.getAllTransactions(),
    []
  );

  const addTransaction = useCallback(async (transaction: Omit<TransactionRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await dbHelpers.addTransaction(transaction);
  }, []);

  const updateTransaction = useCallback(async (id: number, updates: Partial<TransactionRecord>) => {
    return await dbHelpers.updateTransaction(id, updates);
  }, []);

  const deleteTransaction = useCallback(async (id: number) => {
    await dbHelpers.deleteTransaction(id);
  }, []);

  return {
    transactions: transactions || [],
    addTransaction,
    updateTransaction,
    deleteTransaction,
    isLoading: transactions === undefined
  };
}

// Hook for categories
export function useCategories() {
  const categories = useLiveQuery(
    () => dbHelpers.getAllCategories(),
    []
  );

  const addCategory = useCallback(async (name: string) => {
    return await dbHelpers.addCategory(name);
  }, []);

  const deleteCategory = useCallback(async (id: number) => {
    await dbHelpers.deleteCategory(id);
  }, []);

  return {
    categories: categories || [],
    addCategory,
    deleteCategory,
    isLoading: categories === undefined
  };
}

// Hook for settings
export function useSetting<T = any>(key: string, defaultValue?: T) {
  const [value, setValue] = useState<T | undefined>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dbHelpers.getSetting<T>(key).then(val => {
      setValue(val !== undefined ? val : defaultValue);
      setIsLoading(false);
    });
  }, [key, defaultValue]);

  const updateSetting = useCallback(async (newValue: T) => {
    await dbHelpers.setSetting(key, newValue);
    setValue(newValue);
  }, [key]);

  return {
    value,
    updateSetting,
    isLoading
  };
}

// Hook for database initialization
export function useDatabaseInit() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Open database
        await db.open();
        
        // Initialize with default data
        await initializeDatabase();
        
        setIsInitialized(true);
      } catch (err) {
        console.error('Database initialization failed:', err);
        setError(err as Error);
      }
    };

    init();
  }, []);

  return {
    isInitialized,
    error
  };
}

// Hook for recurring expenses
export function useRecurringExpenses() {
  const expenses = useLiveQuery(
    () => dbHelpers.getAllRecurringExpenses(),
    []
  );

  const addRecurringExpense = useCallback(async (expense: Omit<import('../lib/db').RecurringExpenseRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await dbHelpers.addRecurringExpense(expense);
  }, []);

  const updateRecurringExpense = useCallback(async (id: number, updates: Partial<import('../lib/db').RecurringExpenseRecord>) => {
    return await dbHelpers.updateRecurringExpense(id, updates);
  }, []);

  const deleteRecurringExpense = useCallback(async (id: number) => {
    await dbHelpers.deleteRecurringExpense(id);
  }, []);

  const skipOnce = useCallback(async (id: number, frequency: 'daily' | 'weekly' | 'monthly' | 'yearly') => {
    const expense = expenses?.find(e => e.id === id);
    if (!expense) return;
    
    // Calculate next occurrence after skipping one
    const currentNext = new Date(expense.nextRun);
    let nextRun = new Date(currentNext);
    
    switch (frequency) {
      case 'daily':
        nextRun.setDate(nextRun.getDate() + 1);
        break;
      case 'weekly':
        nextRun.setDate(nextRun.getDate() + 7);
        break;
      case 'monthly':
        nextRun.setMonth(nextRun.getMonth() + 1);
        break;
      case 'yearly':
        nextRun.setFullYear(nextRun.getFullYear() + 1);
        break;
    }
    
    await updateRecurringExpense(id, { nextRun: nextRun.toISOString() });
  }, [expenses, updateRecurringExpense]);

  return {
    expenses: expenses || [],
    addRecurringExpense,
    updateRecurringExpense,
    deleteRecurringExpense,
    skipOnce,
    isLoading: expenses === undefined
  };
}

// Hook for database statistics
export function useDatabaseStats() {
  const [stats, setStats] = useState({
    transactionCount: 0,
    categoryCount: 0,
    storageSize: '0 KB'
  });

  useEffect(() => {
    const updateStats = async () => {
      const transactionCount = await db.transactions.count();
      const categoryCount = await db.categories.count();
      
      // Estimate storage size (rough approximation)
      const transactions = await db.transactions.toArray();
      const categories = await db.categories.toArray();
      const settings = await db.settings.toArray();
      
      const dataSize = JSON.stringify({ transactions, categories, settings }).length;
      const kb = (dataSize / 1024).toFixed(2);
      
      setStats({
        transactionCount,
        categoryCount,
        storageSize: `${kb} KB`
      });
    };

    updateStats();
    
    // Update stats when data changes
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return stats;
}
