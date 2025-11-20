import { Category, Transaction } from '../types';

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.FOOD]: '#FF9500',
  [Category.TRANSPORT]: '#007AFF',
  [Category.SHOPPING]: '#5856D6',
  [Category.UTILITIES]: '#AF52DE',
  [Category.ENTERTAINMENT]: '#FF2D55',
  [Category.HEALTH]: '#FF3B30',
  [Category.INCOME]: '#34C759',
  [Category.OTHER]: '#8E8E93',
};

export const INITIAL_TRANSACTIONS: Transaction[] = [];
