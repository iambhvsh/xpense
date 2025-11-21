/**
 * Pre-formatting utilities
 * Formats data BEFORE render to eliminate formatting in render loops
 */

import { TransactionRecord } from '@/lib/db';

export interface FormattedTransaction extends TransactionRecord {
  formattedAmount: string;
  formattedDate: string;
  displayDate: string;
}

// Currency symbols
const CURRENCY_SYMBOLS: Record<string, string> = {
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
  'JPY': '¥',
  'CNY': '¥',
  'INR': '₹',
  'CAD': '$',
  'AUD': '$',
  'CHF': 'Fr',
  'KRW': '₩',
};

/**
 * Pre-format a single transaction
 */
export function formatTransaction(
  transaction: TransactionRecord,
  currency: string = 'USD',
  dateFormat: string = 'MM/DD/YYYY'
): FormattedTransaction {
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  const formatted = Math.abs(transaction.amount).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  
  const date = new Date(transaction.date);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthShort = monthNames[date.getMonth()];
  
  let formattedDate: string;
  switch (dateFormat) {
    case 'DD/MM/YYYY':
      formattedDate = `${day}/${month}/${year}`;
      break;
    case 'YYYY-MM-DD':
      formattedDate = `${year}-${month}-${day}`;
      break;
    case 'DD.MM.YYYY':
      formattedDate = `${day}.${month}.${year}`;
      break;
    case 'MMM DD, YYYY':
      formattedDate = `${monthShort} ${day}, ${year}`;
      break;
    case 'MM/DD/YYYY':
    default:
      formattedDate = `${month}/${day}/${year}`;
  }
  
  return {
    ...transaction,
    formattedAmount: `${symbol}${formatted}`,
    formattedDate,
    displayDate: `${monthShort} ${day}`
  };
}

/**
 * Pre-format an array of transactions
 * Use this in data preparation, NOT in render
 */
export function formatTransactions(
  transactions: TransactionRecord[],
  currency: string = 'USD',
  dateFormat: string = 'MM/DD/YYYY'
): FormattedTransaction[] {
  return transactions.map(t => formatTransaction(t, currency, dateFormat));
}

/**
 * Format currency amount (for non-transaction use)
 */
export function formatAmount(amount: number, currency: string = 'USD'): string {
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  const formatted = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `${symbol}${formatted}`;
}
