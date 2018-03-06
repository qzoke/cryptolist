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
  if ((currencyBtcMarket && btcQuoteMarket) && currencyBtcMarket.ticker)
    return ((btcQuoteMarket.ticker[1] + currencyBtcMarket.ticker[1]) * 100).toFixed(2);

  return 0;
};

const get24HourVolume = (market, btcMarket, priceOfBtc, quoteSymbol) => {
  if (market)
    return asCurrency(market.ticker[5], quoteSymbol);

    if(btcMarket && btcMarket.ticker)
      return asCurrency(btcMarket.ticker[5] * priceOfBtc, quoteSymbol);
    else return asCurrency(0, quoteSymbol);
};

export const marketCapFormat = (currencies, btcNode, quoteSymbol) => {
  if (!currencies.length)
    return [];

  const priceOfBtc = getPriceOfBtc(btcNode, quoteSymbol);

  return currencies.map(currency => {
    const hasMarkets = currency.markets.length;
    const market = hasMarkets ? currency.markets.find(market => market.marketSymbol.endsWith(quoteSymbol)) : null;
    const percentChange = getPercentageChange(currency.markets, btcNode, quoteSymbol);
    const btcMarket = currency.markets.find(market => market.marketSymbol.endsWith('BTC'));
    const priceInBtc = btcMarket && btcMarket.ticker ? btcMarket.ticker[0] : 1;
    const volume = get24HourVolume(market, btcMarket, priceOfBtc, quoteSymbol);

    let lastPrice = hasMarkets && market ? market.ticker[0] : 0;
    if (lastPrice === 0 && hasMarkets) {
      lastPrice = calculatePriceFromBtc(priceInBtc, priceOfBtc);
    }

    return {
      id: currency.id,
      name: currency.currencyName,
      symbol: currency.currencySymbol,
      supply: currency.currentSupply.toLocaleString(),
      marketCap: calculateMarketCap(currency.currentSupply, lastPrice, quoteSymbol),
      price: asCurrency(lastPrice, quoteSymbol),
      percentChange: percentChange,
      volume: volume
    };
  });
};
