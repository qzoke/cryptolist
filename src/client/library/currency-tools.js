export const formatPrice = (price, quote, precision = 4) => {
  switch (quote.toUpperCase()) {
    case 'USD':
      return '$' + price.toLocaleString();
    case 'GBP':
      return '£' + price.toLocaleString();
    case 'EUR':
      return '€' + price.toLocaleString();
    case 'USDT':
      return price.toLocaleString() + 'USDT';
    default:
      return price.toFixed(precision) + quote.toUpperCase();
  }
};
