import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Query } from 'regraph-request';

const STROKE_WIDTH = 2;
const numberOfDays = 1;
const CURRENCY_QUERY = `
  query CurrencyQuery(
    $symbol: String
    $quoteSymbol: String
    $start: Int
    $end: Int
    $resolution: CandleResolution!
  ) {
    currency(currencySymbol: $symbol) {
      id
      markets(filter: { quoteSymbol_eq: $quoteSymbol }, aggregation: VWAP) {
        data {
          id
          marketSymbol
          candles(start: $start, end: $end, resolution: $resolution, sort: OLD_FIRST) {
            data
          }
        }
      }
      btcMarket: markets(filter: { quoteSymbol_eq: "BTC" }, aggregation: VWAP) {
        data {
          id
          marketSymbol
          candles(start: $start, end: $end, resolution: $resolution, sort: OLD_FIRST) {
            data
          }
        }
      }
    }
    btcPrice: currency(currencySymbol: "BTC") {
      id
      markets(filter: { quoteSymbol_eq: $quoteSymbol }, aggregation: VWAP) {
        data {
          id
          marketSymbol
          ticker {
            last
          }
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
    marketsData = currency.markets.data,
    btcMarketData = currency.btcMarket.data;

  if (!marketsData.length) {
    if (btcMarketData.length && btcMarketData[0].candles) {
      let quotePrice = data.btcPrice.markets.data[0].ticker.last;
      prices = btcMarketData[0].candles.data.map(candle => {
        return candle[1] * quotePrice;
      });
    } else return;
  } else {
    if (marketsData[0].candles) {
      prices = marketsData[0].candles.data.map(x => x[1]);
    } else return;
  }

  let high = Math.max(...prices);
  let low = Math.min(...prices);
  let denominator = high - low;
  return prices.map((price, index) => ({
    x: index / (24 * numberOfDays) * width,
    y: height + STROKE_WIDTH / 2 - (price - low) / denominator * height,
  }));
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
