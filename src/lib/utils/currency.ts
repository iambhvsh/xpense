import { dbHelpers } from '../db';

// Cache for currency and date format to avoid async calls on every render
let currencyCache: string | null = null;
let dateFormatCache: string | null = null;

// Initialize cache from database
export const initializeCurrencyCache = async () => {
  currencyCache = await dbHelpers.getSetting('xpense-currency') || 'USD';
  dateFormatCache = await dbHelpers.getSetting('xpense-date-format') || 'MM/DD/YYYY';
};

// Update cache when settings change
export const updateCurrencyCache = (currency: string) => {
  currencyCache = currency;
};

export const updateDateFormatCache = (format: string) => {
  dateFormatCache = format;
};

export const getCurrencySymbol = (): string => {
  const currency = currencyCache || 'USD';
  
  const symbols: Record<string, string> = {
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
  
  return symbols[currency] || '$';
};

export const formatCurrency = (amount: number): string => {
  const symbol = getCurrencySymbol();
  const formatted = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  
  return `${symbol}${formatted}`;
};

export const formatDate = (dateString: string): string => {
  const format = dateFormatCache || 'MM/DD/YYYY';
  const date = new Date(dateString);
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthShort = monthNames[date.getMonth()];
  
  switch (format) {
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'DD.MM.YYYY':
      return `${day}.${month}.${year}`;
    case 'MMM DD, YYYY':
      return `${monthShort} ${day}, ${year}`;
    case 'MM/DD/YYYY':
    default:
      return `${month}/${day}/${year}`;
  }
};
