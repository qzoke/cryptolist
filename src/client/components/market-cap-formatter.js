import { formatPrice } from '../library/currency-tools';

const asCurrency = (value, quoteSymbol, precision) => {
  return formatPrice(value, quoteSymbol, precision);
};

const calculatePriceFromBtc = (priceInBtc, priceOfBtc) => {
  return priceInBtc * priceOfBtc;
};

const getPriceOfBtc = (btcNode, quoteSymbol) => {
  const btcMarket = btcNode.markets.find(market => market.marketSymbol.endsWith(quoteSymbol));
  return btcMarket ? btcMarket.ticker.last : 1;
};

const getPercentageChange = (markets, btcNode, quoteSymbol) => {
  if (!markets || !markets.length) return 0;

  // Try to use native market
  const market = markets.find(market => market.marketSymbol.endsWith(quoteSymbol));
  if (market && market.ticker) return market.ticker.percentChange.toFixed(2);

  // If native market does not exist, convert to btc
  const currencyBtcMarket = markets.find(market => market.marketSymbol.endsWith('BTC'));
  const btcQuoteMarket = btcNode.markets.find(market => market.marketSymbol.endsWith(quoteSymbol));
  if (currencyBtcMarket && btcQuoteMarket && currencyBtcMarket.ticker) {
    let btcChange = currencyBtcMarket.ticker.percentChange;
    let currencyToBtcChange = btcQuoteMarket.ticker.percentChange;
    return (btcChange + currencyToBtcChange).toFixed(2);
  }

  return 0;
};

const get24HourVolume = (market, btcMarket, priceOfBtc, quoteSymbol) => {
  if (market && market.ticker) return asCurrency(market.ticker.quoteVolume, quoteSymbol);

  if (btcMarket && btcMarket.ticker)
    return asCurrency(btcMarket.ticker.quoteVolume * priceOfBtc, quoteSymbol);
  else return asCurrency(0, quoteSymbol);
};

export const marketCapFormat = (currency, btcNode, quoteSymbol) => {
  quoteSymbol = quoteSymbol.toUpperCase();
  const priceOfBtc = getPriceOfBtc(btcNode, quoteSymbol);

  const hasMarkets = !!currency.markets.length;
  const market = hasMarkets
    ? currency.markets.find(market => market.marketSymbol.endsWith(quoteSymbol))
    : null;
  const percentChange = getPercentageChange(currency.markets, btcNode, quoteSymbol);
  const btcMarket = currency.markets.find(market => market.marketSymbol.endsWith('BTC'));
  const priceInBtc = btcMarket && btcMarket.ticker ? btcMarket.ticker.last : 1;
  const volume = get24HourVolume(market, btcMarket, priceOfBtc, quoteSymbol);

  let lastPrice = hasMarkets && market && market.ticker ? market.ticker.last : 0;
  if (lastPrice === 0 && hasMarkets) {
    lastPrice = calculatePriceFromBtc(priceInBtc, priceOfBtc);
  }

  return Object.assign({}, currency, {
    marketCap: asCurrency(calculatePriceFromBtc(currency.marketCap, priceOfBtc), quoteSymbol),
    price: asCurrency(lastPrice, quoteSymbol, 8),
    percentChange: percentChange,
    volume: volume,
    computedMarket: !market,
  });
};
