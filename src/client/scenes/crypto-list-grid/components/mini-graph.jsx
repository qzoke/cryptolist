import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Query } from 'regraph-request';

const STROKE_WIDTH = 2;
const numberOfDays = 1;
const CURRENCY_QUERY = `
query CurrencyQuery(
  $symbol: String!
  $quoteSymbol: String
  $start: Int
  $end: Int
  $resolution: CandleResolution!
) {
  currency(currencySymbol: $symbol) {
    id
    markets(filter: { quoteSymbol_eq: $quoteSymbol }, aggregation: VWA) {
      id
      marketSymbol
      timeseries(start: $start, end: $end, resolution: $resolution, sort: OLD_FIRST) {
        open
      }
    }
    btcMarket: markets(filter: { quoteSymbol_eq: "BTC" }, aggregation: VWA) {
      id
      marketSymbol
      timeseries(start: $start, end: $end, resolution: $resolution, sort: OLD_FIRST) {
        open
      }
    }
  }
  btcPrice: currency(currencySymbol: "BTC") {
    id
    markets(filter: { quoteSymbol_eq: $quoteSymbol }, aggregation: VWA) {
      id
      marketSymbol
      ticker {
        last
      }
    }
  }
}
`;

const generatePoints = ({ data, height, width }) => {
  if (!data.currency || !data.currency.markets || !data.currency.btcMarket) return;
  height = height - STROKE_WIDTH / 2;
  let prices,
    currency = data.currency,
    marketsData = currency.markets,
    btcMarketData = currency.btcMarket;

  if (!marketsData.length) {
    if (btcMarketData.length && btcMarketData[0].timeseries) {
      let quotePrice = data.btcPrice.markets[0].ticker.last;
      prices = btcMarketData[0].timeseries.map(timeseries => {
        return timeseries.open * quotePrice;
      });
    } else return;
  } else {
    if (marketsData[0].timeseries) {
      prices = marketsData[0].timeseries.map(x => x.open);
    } else return;
  }

  let prunedPrices = prices.filter(p => p);
  let high = Math.max(...prunedPrices);
  let low = Math.min(...prunedPrices);

  let denominator = high - low;
  let lastPrice = 0;
  return prices.map((price, index) => {
    price = price ? price : lastPrice;
    let p = {
      x: index / (24 * numberOfDays) * width,
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

export const MiniGraphComponent = ({ data, width, height, isPositive }) => {
  let points = generatePoints({ data, height, width });
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

MiniGraphComponent.propTypes = {
  currencyId: PropTypes.string,
  quote: PropTypes.string,
  data: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number,
  isPositive: PropTypes.bool,
};

export const MiniGraph = Query(MiniGraphComponent, CURRENCY_QUERY, props => ({
  symbol: props.currencyId,
  quoteSymbol: props.quote,
  start: moment()
    .subtract(numberOfDays, 'day')
    .utc()
    .unix(),
  end: moment()
    .utc()
    .unix(),
  resolution: '_1h',
}));
