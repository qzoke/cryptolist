import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'regraph-request';
import { HistoricalDataScene } from './historical-data-scene';
import { Resolutions } from '../native-chart/components/resolution-group';

const LIMIT = 50;
const CANDLE_QUERY = `
query HistoricalData (
  $currencySymbol: String!
  $quote: String!
  $resolution: TimeResolution!
  $limit: Int!
  $aggregation:Aggregation
  $exchangeSymbol:String
) {
  currency(currencySymbol: $currencySymbol) {
    markets(filter: {
      _and: [
        { quoteSymbol_eq: $quote},
        { exchangeSymbol_like: $exchangeSymbol}
      ]}
      aggregation: $aggregation
    ) {
      marketSymbol
      timeseries(
        resolution: $resolution,
        limit: $limit,
      ) {
        startUnix
        volume
        quoteVolume
        percentChange
        open
      }
    }
    exchanges:markets(filter:{quoteSymbol_eq:$quote}){
      marketSymbol
    }
  }
}
`;

export class HistoricalDataSceneContainerComponent extends React.Component {
  constructor(props) {
    super(props);

    this.updateExchange = this.updateExchange.bind(this);
    this.updateResolution = this.updateResolution.bind(this);

    this.state = {
      selectedExchange: 'VWA',
      selectedResolution: Resolutions.find(r => r.value === '_1d'),
      message: '',
    };
  }

  static getDerivedStateFromProps(props) {
    if (!props.currency.quoteSymbol)
      return {
        message:
          'No markets found for either selected quote currency. Please select a different quote currency',
      };
    else return null;
  }

  updateExchange({ target }) {
    let { value: exchange } = target;
    let aggregation, exchangeSymbol;
    if (exchange === 'VWA') {
      aggregation = 'VWA';
      exchangeSymbol = '%';
      this.setState({ selectedExchange: aggregation });
    } else {
      aggregation = null;
      exchangeSymbol = exchange;
      this.setState({ selectedExchange: exchange });
    }
    this.props.getData({ aggregation, exchangeSymbol });
  }

  updateResolution(resolution) {
    this.props.getData({ resolution: resolution.value });
    this.setState({ selectedResolution: resolution });
  }

  render() {
    return (
      <HistoricalDataScene
        updateExchange={this.updateExchange}
        updateResolution={this.updateResolution}
        {...this.props}
        {...this.state}
      />
    );
  }
}

HistoricalDataSceneContainerComponent.propTypes = {
  data: PropTypes.object,
  getData: PropTypes.func,
  currency: PropTypes.object,
  base: PropTypes.string,
};

export const HistoricalDataSceneContainer = Query(
  HistoricalDataSceneContainerComponent,
  CANDLE_QUERY,
  ({ base, currency }) => ({
    currencySymbol: base.toUpperCase(),
    quote: currency.quoteSymbol,
    resolution: '_1d',
    limit: LIMIT,
    aggregation: 'VWA',
    exchangeSymbol: '%',
  })
);
