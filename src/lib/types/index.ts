export enum Category {
  FOOD = 'Food',
  TRANSPORT = 'Transport',
  SHOPPING = 'Shopping',
  UTILITIES = 'Utilities',
  ENTERTAINMENT = 'Entertainment',
  HEALTH = 'Health',
  INCOME = 'Income',
  OTHER = 'Other'
}

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  note?: string;
  date: string;
  isExpense: boolean;
}

export interface ExpenseStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface ReceiptData {
  total: number;
  merchant: string;
  date: string;
  category?: Category;
  items?: string[];
}
