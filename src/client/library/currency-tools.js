import React from 'react';

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
      return price.toFixed(precision) + quote;
  }
};

export const formatDisplayPrice = (price, quote, precision = 4) => {
  let formattedPrice = price.toLocaleString(),
    isPrefix = true,
    symbol;
  switch (quote.toUpperCase()) {
    case 'USD':
      symbol = '$';
      break;
    case 'GBP':
      symbol = '£';
      break;
    case 'EUR':
      symbol = '€';
      break;
    case 'USDT':
      symbol = 'USDT';
      isPrefix = false;
      break;
    default:
      formattedPrice = price.toFixed(precision);
      symbol = quote;
      isPrefix = false;
      break;
  }

  return (
    <div className="formatted-price">
      {isPrefix ? <span className="symbol">{symbol}</span> : null}
      <span className="price">{formattedPrice}</span>
      {isPrefix ? null : <span className="symbol">{symbol}</span>}
    </div>
  );
};
