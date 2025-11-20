export const getCurrencySymbol = (): string => {
  const currency = localStorage.getItem('wallet-currency') || 'USD';
  
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
  const format = localStorage.getItem('wallet-date-format') || 'MM/DD/YYYY';
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
