const asCurrency = (value, quoteSymbol) => {
  switch (quoteSymbol) {
    case 'USD':
      return '$'+(value.toLocaleString());
    case 'GBP':
      return '£'+(value.toLocaleString());
    case 'EUR':
      return '€'+(value.toLocaleString());
    case 'USDT':
      return value.toLocaleString()+'USDT';
    default:
      return value.toFixed(8) + quoteSymbol;
  }
};

const calculateMarketCap = (currentSupply, lastPrice, quoteSymbol) => {
  return asCurrency(currentSupply * lastPrice, quoteSymbol);
};

const calculatePriceFromBtc = (priceInBtc, priceOfBtc) => {
  return priceInBtc * priceOfBtc;
};

const getPriceOfBtc = (btcNode, quoteSymbol) => {
  const btcMarket = btcNode.markets.find(market => {
    return market.marketSymbol.endsWith(quoteSymbol);
  });
  return btcMarket ? btcMarket.ticker[0] : 1;
};

const getPercentageChange = (markets, btcNode, quoteSymbol) => {
  if (!markets || !markets.length) return 0;

  // Try to use native market
  const market = markets.find(market => market.marketSymbol.endsWith(quoteSymbol));
  if (market)
    return (market.ticker[1] * 100).toFixed(2);

  // If native market does not exist, convert to btc
  const currencyBtcMarket = markets.find(market => market.marketSymbol.endsWith('BTC'));
  const btcQuoteMarket = btcNode.markets.find(market => market.marketSymbol.endsWith(quoteSymbol));
  if (currencyBtcMarket && btcQuoteMarket)
    return ((btcQuoteMarket.ticker[1] + currencyBtcMarket.ticker[1]) * 100).toFixed(2);

  return 0;
};

export const marketCapFormat = (currencies, quoteSymbol) => {
  if (!currencies.length)
    return [];

  const btcNode = currencies.find(currency => currency.currencySymbol === 'BTC');
  const priceOfBtc = getPriceOfBtc(btcNode, quoteSymbol);

  return currencies.map((currency, index) => {
    const hasMarkets = currency.markets.length;
    const market = hasMarkets ? currency.markets.find(market => market.marketSymbol.endsWith(quoteSymbol)) : null;
    const percentChange = getPercentageChange(currency.markets, btcNode, quoteSymbol);

    let lastPrice = hasMarkets && market ? market.ticker[0] : 0;
    if (lastPrice === 0 && hasMarkets) {
      const btcMarket = currency.markets.find(market => market.marketSymbol.endsWith('BTC'));
      const priceInBtc = btcMarket ? btcMarket.ticker[0] : 1;
      lastPrice = calculatePriceFromBtc(priceInBtc, priceOfBtc);
    }

    return {
      id: currency.id,
      name: currency.currencyName,
      symbol: currency.currencySymbol,
      index: index,
      supply: currency.currentSupply.toLocaleString(),
      marketCap: calculateMarketCap(currency.currentSupply, lastPrice, quoteSymbol),
      price: asCurrency(lastPrice, quoteSymbol),
      percentChange: percentChange
    };
  });
};
