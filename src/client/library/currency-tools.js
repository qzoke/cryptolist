export const formatPrice = (price, quote, precision = 4) => {
  let readable = x =>
    x.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  switch (quote.toUpperCase()) {
    case 'USD':
      return '$' + readable(price);
    case 'GBP':
      return '£' + readable(price);
    case 'EUR':
      return '€' + readable(price);
    case 'USDT':
      return readable(price) + 'USDT';
    default:
      return price.toFixed(precision) + quote.toUpperCase();
  }
};
