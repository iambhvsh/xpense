import React, { useMemo, useEffect } from 'react';
import { useTransactions, useCategories, useSetting } from '../../lib/hooks/useDatabase';
import { 
  calculateMonthlyBudget, 
  getCurrentMonthTransactions, 
  getPreviousMonthTransactions,
  compareMonths
} from '../../lib/utils/budget';
import { BudgetOverview } from '../../components/budget/BudgetOverview';
import { MonthComparison } from '../../components/budget/MonthComparison';
import { CategoryBudgetList } from '../../components/budget/CategoryBudgetList';
import { RecurringExpenses } from '../../components/budget/RecurringExpenses';
import { BudgetManager } from '../../components/budget/BudgetManager';
import { Spinner } from '../../components/ui/Spinner';
import { dbHelpers } from '../../lib/db';

export const Budget: React.FC = () => {
  // Process recurring expenses on mount
  useEffect(() => {
    dbHelpers.processRecurringExpenses();
  }, []);
  const { transactions, isLoading: transactionsLoading } = useTransactions();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { value: globalBudget } = useSetting<number>('global-monthly-budget');

  const currentMonthTransactions = useMemo(() => 
    getCurrentMonthTransactions(transactions), 
    [transactions]
  );

  const previousMonthTransactions = useMemo(() => 
    getPreviousMonthTransactions(transactions), 
    [transactions]
  );

  const budgetSummary = useMemo(() => 
    calculateMonthlyBudget(categories, currentMonthTransactions, globalBudget),
    [categories, currentMonthTransactions, globalBudget]
  );

  const monthComparison = useMemo(() => 
    compareMonths(currentMonthTransactions, previousMonthTransactions),
    [currentMonthTransactions, previousMonthTransactions]
  );

  if (transactionsLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Spinner className="w-8 h-8 text-[#8E8E93]" />
      </div>
    );
  }

  const hasBudgets = budgetSummary.totalBudget > 0;

  return (
    <div className="space-y-6 pb-10">
      {/* Budgets Section */}
      {hasBudgets ? (
        <>
          <BudgetOverview summary={budgetSummary} />
          <CategoryBudgetList 
            categoryBreakdown={budgetSummary.categoryBreakdown}
            transactions={currentMonthTransactions}
          />
        </>
      ) : (
        <BudgetManager />
      )}

      {/* Recurring Expenses Section */}
      <RecurringExpenses />
      
      {/* Month Comparison */}
      {(currentMonthTransactions.length > 0 || previousMonthTransactions.length > 0) && (
        <MonthComparison comparison={monthComparison} />
      )}
    </div>
  );
};
