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

// Memoization cache for formatted values
const formatCache = new Map<string, string>();
const MAX_CACHE_SIZE = 500;

export const formatCurrency = (amount: number): string => {
  const cacheKey = `${currencyCache || 'USD'}_${amount}`;
  
  // Check cache first
  if (formatCache.has(cacheKey)) {
    return formatCache.get(cacheKey)!;
  }
  
  const symbol = getCurrencySymbol();
  const formatted = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  
  const result = `${symbol}${formatted}`;
  
  // Add to cache with size limit
  if (formatCache.size >= MAX_CACHE_SIZE) {
    const firstKey = formatCache.keys().next().value;
    formatCache.delete(firstKey);
  }
  formatCache.set(cacheKey, result);
  
  return result;
};

// Memoization cache for date formatting
const dateCache = new Map<string, string>();
const MAX_DATE_CACHE_SIZE = 200;

export const formatDate = (dateString: string): string => {
  const format = dateFormatCache || 'MM/DD/YYYY';
  const cacheKey = `${format}_${dateString}`;
  
  // Check cache first
  if (dateCache.has(cacheKey)) {
    return dateCache.get(cacheKey)!;
  }
  
  const date = new Date(dateString);
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthShort = monthNames[date.getMonth()];
  
  let result: string;
  switch (format) {
    case 'DD/MM/YYYY':
      result = `${day}/${month}/${year}`;
      break;
    case 'YYYY-MM-DD':
      result = `${year}-${month}-${day}`;
      break;
    case 'DD.MM.YYYY':
      result = `${day}.${month}.${year}`;
      break;
    case 'MMM DD, YYYY':
      result = `${monthShort} ${day}, ${year}`;
      break;
    case 'MM/DD/YYYY':
    default:
      result = `${month}/${day}/${year}`;
  }
  
  // Add to cache with size limit
  if (dateCache.size >= MAX_DATE_CACHE_SIZE) {
    const firstKey = dateCache.keys().next().value;
    dateCache.delete(firstKey);
  }
  dateCache.set(cacheKey, result);
  
  return result;
};
