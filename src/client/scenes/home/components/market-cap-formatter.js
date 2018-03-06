const asCurrency = (value, quoteSymbol) => {
  if(quoteSymbol === 'USD'){
    if (value < 1)
      return '¢'+(value * 100).toLocaleString();
    return '$'+(value.toLocaleString());
  }
  else
    if (quoteSymbol != 'BTC')
      return value.toLocaleString();
    return value.toFixed(8);
};

const calculateMarketCap = (currentSupply, lastPrice, quoteSymbol) => {
  return asCurrency(currentSupply * lastPrice, quoteSymbol);
};

const calculateBriceFromBtc = (priceInBtc, priceOfBtc) => {
  return priceInBtc * priceOfBtc;
};

export const marketCapFormat = (currencies, quoteSymbol) => {
  if (!currencies.length)
    return [];

  const btcNode = currencies.find(currency => currency.currencySymbol === 'BTC');
  const btcMarket = btcNode.markets.find(market => {
    return market.marketSymbol.endsWith(quoteSymbol);
  });
  const priceOfBtc = btcMarket ? btcMarket.ticker[0] : 1;

  return currencies.map((currency, index) => {
    let hasMarkets = currency.markets.length;
    let market = hasMarkets ? currency.markets.find(market => {
      return market.marketSymbol.endsWith(quoteSymbol);
    }) : null;

    let lastPrice = hasMarkets && market ? market.ticker[0] : 0;
    if (lastPrice === 0 && hasMarkets) {
      let btcMarket = currency.markets.find(market => {
        return market.marketSymbol.endsWith('BTC');
      });
      const priceInBtc = btcMarket ? btcMarket.ticker[0] : 1;
      lastPrice = calculateBriceFromBtc(priceInBtc, priceOfBtc);
    }

    return {
      id: currency.id,
      name: currency.currencyName,
      symbol: currency.currencySymbol,
      index: index,
      supply: currency.currentSupply.toLocaleString(),
      marketCap: calculateMarketCap(currency.currentSupply, lastPrice, quoteSymbol),
      price: asCurrency(lastPrice, quoteSymbol)
    };
  });
};
