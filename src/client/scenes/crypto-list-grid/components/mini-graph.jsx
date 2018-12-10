import React from 'react';
import PropTypes from 'prop-types';

const STROKE_WIDTH = 2;
export const NUMBER_OF_DAYS = 1;

const generatePoints = ({ markets, btcMarkets, quoteSymbol, height, width }) => {
  if (!markets) return;
  height = height - STROKE_WIDTH / 2;

  let prices;
  let findMarketWithQuote = market =>
    market.marketSymbol.split('/')[1] == quoteSymbol.toUpperCase();
  let market = markets.find(findMarketWithQuote);

  if (market) {
    prices = market.ohlcv.map(t => t[1]);
  } else {
    if (!btcMarkets.length) return;
    let toBTCMarket = markets.find(market => market.marketSymbol.split('/')[1] == 'BTC');
    let btcToQuoteMarket = btcMarkets.find(findMarketWithQuote);
    if (!toBTCMarket || !btcToQuoteMarket) return;
    prices = toBTCMarket.ohlcv.map((t, i) => {
      return t[1] * btcToQuoteMarket.ohlcv[i][1];
    });
  }

  let prunedPrices = prices.filter(p => p);
  let high = Math.max(...prunedPrices);
  let low = Math.min(...prunedPrices);
  let denominator = high - low;
  let lastPrice = 0;

  return prices.map((price, index) => {
    price = price ? price : lastPrice;
    let p = {
      x: index / (24 * NUMBER_OF_DAYS) * width, // 24 = hr/day
      y: height + STROKE_WIDTH / 2 - (price - low) / denominator * height,
    };
    lastPrice = price;
    return p;
  });
};

const generatePathFromPoints = ({ points, width }) => {
  if (!points.length) return;
  let paths = points.map(price => `L${price.x},${price.y}`);
  let startingPosition = `M${paths[0].substring(1)}`;
  return `${startingPosition}${paths.join('')}L${width},${points[points.length - 1].y}`;
};

export const MiniGraph = ({ currency, quoteSymbol, bitcoin, width, height, isPositive }) => {
  let points = generatePoints({
    ...currency,
    btcMarkets: bitcoin.markets,
    quoteSymbol,
    height,
    width,
  });
  if (!points) return null;
  let path = generatePathFromPoints({ points, width });
  if (!path) return null;

  return (
    <svg className="mini-graph" width={width} height={height} xmlns="http://www.w3.org/2000/svg">
      <path
        d={path}
        fill="transparent"
        stroke={isPositive ? '#74A321' : '#FF7777'}
        strokeWidth={STROKE_WIDTH}
      />
    </svg>
  );
};

MiniGraph.propTypes = {
  currency: PropTypes.object,
  quoteSymbol: PropTypes.string,
  bitcoin: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number,
  isPositive: PropTypes.bool,
};
