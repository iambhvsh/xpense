import { TransactionRecord, CategoryRecord } from '../db';

export interface BudgetStatus {
  spent: number;
  budget: number;
  percentage: number;
  remaining: number;
  isOverBudget: boolean;
  warningLevel: 'none' | 'warning' | 'critical' | 'exceeded';
}

export interface CategoryBudgetStatus extends BudgetStatus {
  categoryId: number;
  categoryName: string;
}

export interface MonthlyBudgetSummary {
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  percentage: number;
  warningLevel: 'none' | 'warning' | 'critical' | 'exceeded';
  categoryBreakdown: CategoryBudgetStatus[];
}

export interface MonthComparison {
  currentMonth: {
    spent: number;
    income: number;
    net: number;
  };
  previousMonth: {
    spent: number;
    income: number;
    net: number;
  };
  changes: {
    spentChange: number;
    spentChangePercent: number;
    incomeChange: number;
    incomeChangePercent: number;
  };
}

/**
 * Get warning level based on percentage
 */
export function getWarningLevel(percentage: number): 'none' | 'warning' | 'critical' | 'exceeded' {
  if (percentage >= 100) return 'exceeded';
  if (percentage >= 90) return 'critical';
  if (percentage >= 75) return 'warning';
  return 'none';
}

/**
 * Get color for warning level
 */
export function getWarningColor(level: 'none' | 'warning' | 'critical' | 'exceeded'): string {
  switch (level) {
    case 'exceeded': return '#FF3B30';
    case 'critical': return '#FF9500';
    case 'warning': return '#FFCC00';
    default: return '#34C759';
  }
}

/**
 * Calculate budget status for a category
 */
export function calculateCategoryBudget(
  category: CategoryRecord,
  transactions: TransactionRecord[]
): CategoryBudgetStatus | null {
  if (!category.monthlyBudget || category.monthlyBudget <= 0) {
    return null;
  }

  // Only count expenses (not income) for this category
  const spent = transactions
    .filter(t => 
      t.category === category.name && 
      t.amount > 0 && 
      t.isExpense
    )
    .reduce((sum, t) => sum + t.amount, 0);

  const budget = category.monthlyBudget;
  const percentage = budget > 0 ? (spent / budget) * 100 : 0;
  const remaining = budget - spent;

  return {
    categoryId: category.id!,
    categoryName: category.name,
    spent,
    budget,
    percentage,
    remaining,
    isOverBudget: spent > budget,
    warningLevel: getWarningLevel(percentage)
  };
}

/**
 * Calculate monthly budget summary
 */
export function calculateMonthlyBudget(
  categories: CategoryRecord[],
  transactions: TransactionRecord[],
  globalBudget?: number
): MonthlyBudgetSummary {
  const categoryBreakdown: CategoryBudgetStatus[] = [];
  let totalBudget = 0;
  let totalSpent = 0;

  // Pre-calculate spending by category for O(1) lookup
  const spendingByCategory = new Map<string, number>();
  for (let i = 0; i < transactions.length; i++) {
    const t = transactions[i];
    if (t.amount > 0 && t.isExpense) {
      spendingByCategory.set(
        t.category,
        (spendingByCategory.get(t.category) || 0) + t.amount
      );
    }
  }

  // Calculate per-category budgets in single pass
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    if (!category.monthlyBudget || category.monthlyBudget <= 0) continue;

    const spent = spendingByCategory.get(category.name) || 0;
    const budget = category.monthlyBudget;
    const percentage = budget > 0 ? (spent / budget) * 100 : 0;

    categoryBreakdown.push({
      categoryId: category.id!,
      categoryName: category.name,
      spent,
      budget,
      percentage,
      remaining: budget - spent,
      isOverBudget: spent > budget,
      warningLevel: getWarningLevel(percentage)
    });

    totalBudget += budget;
    totalSpent += spent;
  }

  const effectiveBudget = globalBudget || totalBudget;
  const percentage = effectiveBudget > 0 ? (totalSpent / effectiveBudget) * 100 : 0;

  return {
    totalBudget: effectiveBudget,
    totalSpent,
    totalRemaining: effectiveBudget - totalSpent,
    percentage,
    warningLevel: getWarningLevel(percentage),
    categoryBreakdown
  };
}

/**
 * Get transactions for current month
 */
export function getCurrentMonthTransactions(transactions: TransactionRecord[]): TransactionRecord[] {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  return transactions.filter(t => {
    const date = new Date(t.date);
    return date >= startOfMonth && date <= endOfMonth;
  });
}

/**
 * Get transactions for previous month
 */
export function getPreviousMonthTransactions(transactions: TransactionRecord[]): TransactionRecord[] {
  const now = new Date();
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  return transactions.filter(t => {
    const date = new Date(t.date);
    return date >= startOfPrevMonth && date <= endOfPrevMonth;
  });
}

/**
 * Compare current month vs previous month
 */
export function compareMonths(
  currentMonthTransactions: TransactionRecord[],
  previousMonthTransactions: TransactionRecord[]
): MonthComparison {
  const currentSpent = currentMonthTransactions
    .filter(t => t.amount > 0 && t.isExpense)
    .reduce((sum, t) => sum + t.amount, 0);

  const currentIncome = currentMonthTransactions
    .filter(t => !t.isExpense)
    .reduce((sum, t) => sum + t.amount, 0);

  const prevSpent = previousMonthTransactions
    .filter(t => t.amount > 0 && t.isExpense)
    .reduce((sum, t) => sum + t.amount, 0);

  const prevIncome = previousMonthTransactions
    .filter(t => !t.isExpense)
    .reduce((sum, t) => sum + t.amount, 0);

  const spentChange = currentSpent - prevSpent;
  // If there was no spending last month but there is this month,
  // show this as a 100% change instead of 0% (undefined/infinite in reality).
  const spentChangePercent =
    prevSpent > 0
      ? (spentChange / prevSpent) * 100
      : currentSpent > 0
        ? 100
        : 0;

  const incomeChange = currentIncome - prevIncome;
  const incomeChangePercent =
    prevIncome > 0
      ? (incomeChange / prevIncome) * 100
      : currentIncome > 0
        ? 100
        : 0;

  return {
    currentMonth: {
      spent: currentSpent,
      income: currentIncome,
      net: currentIncome - currentSpent
    },
    previousMonth: {
      spent: prevSpent,
      income: prevIncome,
      net: prevIncome - prevSpent
    },
    changes: {
      spentChange,
      spentChangePercent,
      incomeChange,
      incomeChangePercent
    }
  };
}
