export const formatPrice = (value, quoteSymbol, precision = 3) => {
  let maxFixedLength = getMaxFixedLength(quoteSymbol);

  let fixedLength = Math.min(maxFixedLength, calcDecimals(value) + precision);

  let symbol = calcQuoteSymbol(quoteSymbol);
  if (symbol) {
    symbol = symbol + ' ';
  }

  return `${symbol}${value &&
    value.toLocaleString(undefined, {
      minimumFractionDigits: fixedLength,
      maximumFractionDigits: fixedLength,
    })}`;
};

function calcDecimals(value) {
  if (value > 1) return 0;
  if (value > 1e-1) return 0;
  if (value > 1e-2) return 1;
  if (value > 1e-3) return 2;
  if (value > 1e-4) return 3;
  if (value > 1e-5) return 4;
  if (value > 1e-6) return 5;
  if (value > 1e-7) return 6;
}

function calcQuoteSymbol(quoteSymbol) {
  switch (quoteSymbol) {
    case 'USD':
      return '$';
    case 'USDT':
      return '₮';
    case 'EUR':
      return '€';
    case 'GBP':
      return '£';
    case 'BTC':
      return '฿';
    default:
      return '';
  }
}

function getMaxFixedLength(quoteSymbol) {
  switch (quoteSymbol) {
    case 'USD':
    case 'USDT':
    case 'EUR':
    case 'GBP':
      return 2;
    default:
      return 8;
  }
}
