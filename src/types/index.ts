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

export interface ReceiptData {
  total: number;
  merchant: string;
  date: string;
  category?: Category;
  items?: string[];
}
