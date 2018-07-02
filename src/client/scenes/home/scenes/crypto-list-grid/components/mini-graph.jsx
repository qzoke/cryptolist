import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';

const numberOfDays = 1;
const CURRENCY_QUERY = gql`
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
      markets(filter: { quoteSymbol_eq: $quoteSymbol }, aggregation: VWAP) {
        data {
          marketSymbol
          ticker {
            last
          }
        }
      }
    }
  }
`;

export const MiniGraphComponent = ({ data, width, height, isPositive }) => {
  if (!data.currency || !data.currency.markets || !data.currency.btcMarket) return <div />;
  let prices;
  let currency = data.currency;
  let marketsData = currency.markets.data;
  let btcMarketData = currency.btcMarket.data;

  if (!marketsData.length) {
    if (btcMarketData.length && btcMarketData[0].candles) {
      let quotePrice = data.btcPrice.markets.data[0].ticker.last;
      prices = btcMarketData[0].candles.data.map(candle => {
        return candle[1] * quotePrice;
      });
    } else return <div />;
  } else {
    if (marketsData[0].candles) {
      prices = marketsData[0].candles.data.map(x => x[1]);
    } else return <div />;
  }

  let high = Math.max(...prices);
  let low = Math.min(...prices);
  let denominator = high - low;
  let actualPoints = prices.map((price, index) => ({
    x: index / (24 * numberOfDays) * width,
    y: height - (price - low) / denominator * height,
  }));
  if (!actualPoints.length) return <div />;
  let paths = actualPoints.map(price => `L${price.x},${price.y}`);
  let startingPosition = `M0,${height}`;
  let path = `${startingPosition}${paths.join('')}L${width},${
    actualPoints[actualPoints.length - 1].y
  }L${width},${height}Z`;

  return (
    <svg className="mini-graph" width={width} height={height} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="positiveGradient" x1="0" x2="0" y1="0" y2="1">
          <stop stopColor="#B4EC51" offset="0%" />
          <stop stopColor="#429321" offset="100%" />
        </linearGradient>
        <linearGradient id="negativeGradient" x1="0" x2="0" y1="0" y2="1">
          <stop stopColor="#f7ad00" offset="0%" />
          <stop stopColor="#f87a0b" offset="100%" />
        </linearGradient>
      </defs>
      <path
        d={path}
        stroke="transparent"
        fill={isPositive ? 'url(#positiveGradient)' : 'url(#negativeGradient)'}
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

const withCurrencyQuery = graphql(CURRENCY_QUERY, {
  options: ({ currencyId, quote }) => ({
    variables: {
      symbol: currencyId,
      quoteSymbol: quote,
      start: moment()
        .subtract(numberOfDays, 'day')
        .utc()
        .unix(),
      end: moment()
        .utc()
        .unix(),
      resolution: '_1h',
    },
  }),
});

export const MiniGraph = withCurrencyQuery(MiniGraphComponent);
