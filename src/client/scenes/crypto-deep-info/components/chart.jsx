import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Resolutions } from './resolution-group';
import { Loading } from '../../../components/loading';
import { Query } from 'regraph-request';
import { LineChart } from './line-chart';
import { CandleChart } from './candle-chart';
import { ChartUtils } from './chart-utils';
import { HistoricalData } from './historical-data';
import qs from 'qs';

const INITIAL_RESOLUTION = Resolutions.find(r => r.value === '_1d');
const INITIAL_START_TIME =
  moment()
    .subtract(3, 'months')
    .unix() * 1000;
const INITIAL_END_TIME = moment().unix() * 1000;
const DEFAULT_INDICATORS = ['sma10', 'sma20', 'sma50'];
const ALL_INDICATORS = [
  'sma5',
  'sma10',
  'sma20',
  'sma50',
  'sma100',
  'ema5',
  'ema10',
  'ema20',
  'ema50',
  'ema100',
];
const CANDLE_QUERY = `
query CandlestickData($currencySymbol: String!, $quoteSymbol: String, $startTime: Int, $endTime: Int, $resolution: TimeResolution!) {
  currency(currencySymbol: $currencySymbol) {
    vwa: markets(filter: {quoteSymbol_eq: $quoteSymbol}, aggregation: VWA) {
      ...chartData
    }
    markets(filter: {quoteSymbol_eq: $quoteSymbol}) {
      ...chartData
    }
  }
}

fragment chartData on Market {
  marketSymbol
  timeseries(resolution: $resolution, start: $startTime, end: $endTime, sort: OLD_FIRST includeBlanks: true) {
    open
    high
    low
    close
    startUnix
    volume
    ...timeseriesData
  }
}

fragment timeseriesData on TimeSeries {
  sma5: sma(periods: 5)
  sma10: sma(periods: 10)
  sma20: sma(periods: 20)
  sma50: sma(periods: 50)
  sma100: sma(periods: 100)
  ema5: ema(periods: 5)
  ema10: ema(periods: 10)
  ema20: ema(periods: 20)
  ema50: ema(periods: 50)
  ema100: ema(periods: 100)
}
`;

export class ChartComponent extends React.Component {
  constructor(props) {
    super(props);
    this.updateStartTime = this.updateStartTime.bind(this);
    this.updateEndTime = this.updateEndTime.bind(this);
    this.updateResolution = this.updateResolution.bind(this);
    this.updateSelectedChart = this.updateSelectedChart.bind(this);
    this.addIndicator = this.addIndicator.bind(this);
    this.removeIndicator = this.removeIndicator.bind(this);

    this.state = {
      resolution: INITIAL_RESOLUTION,
      startTime: INITIAL_START_TIME,
      endTime: INITIAL_END_TIME,
      indicators: DEFAULT_INDICATORS,
    };
  }

  updateStartTime(startTime) {
    if (this.state.endTime - startTime <= this.state.resolution.seconds) return;
    startTime = moment(startTime).unix();
    this.setState({ startTime: startTime * 1000 });
    this.props.getData({ startTime, endTime: this.state.endTime / 1000 });
  }

  updateEndTime(endTime) {
    if (endTime - this.state.startTime <= this.state.resolution.seconds) return;
    endTime = moment(endTime).unix();
    this.setState({ endTime: endTime * 1000 });
    this.props.getData({ endTime, startTime: this.state.startTime / 1000 });
  }

  updateResolution(resolution) {
    let currentCandleCount =
      (this.state.endTime - this.state.startTime) / 1000 / this.state.resolution.seconds;
    let newStartTime = this.state.endTime / 1000 - currentCandleCount * resolution.seconds;
    this.setState({ resolution, startTime: newStartTime * 1000 });
    this.props.getData({ startTime: newStartTime, resolution: resolution.value });
  }

  updateSelectedChart(selectedChart) {
    let query = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
    query.chart = selectedChart;
    this.setState({ selectedChart });
    this.props.history.push(`${this.props.location.pathname}?${qs.stringify(query)}`);
  }

  addIndicator(name) {
    name = name.toLowerCase();
    if (this.state.indicators.includes(name)) return;
    this.setState(state => ({ indicators: [...state.indicators, name] }));
  }

  removeIndicator(name) {
    name = name.toLowerCase();
    this.setState(state => ({ indicators: state.indicators.filter(i => i !== name) }));
  }

  render() {
    if (!this.props.data.currency) return <Loading />;
    if (this.props.data.currency.vwa.length === 0) {
      return (
        <div>
          No markets found for selected currency pair. Please select a different quote currency
        </div>
      );
    }

    let query = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
    let selectedChart = query.chart || 'candle';

    return (
      <div className="currency-info-container graph">
        <div className="volume-market line">
          <ChartUtils
            startTime={this.state.startTime}
            endTime={this.state.endTime}
            resolution={this.state.resolution}
            updateStartTime={this.updateStartTime}
            updateEndTime={this.updateEndTime}
            updateResolution={this.updateResolution}
            selectedChart={selectedChart}
            updateSelectedChart={this.updateSelectedChart}
            addIndicator={this.addIndicator}
            indicators={this.state.indicators}
            removeIndicator={this.removeIndicator}
            allIndicators={ALL_INDICATORS}
          />

          {selectedChart === 'candle' && (
            <CandleChart currency={this.props.data.currency} indicators={this.state.indicators} />
          )}
          {selectedChart === 'line' && <LineChart currency={this.props.data.currency} />}

          <div className="historical-data-container">
            <HistoricalData
              {...this.props}
              startTime={this.state.startTime}
              endTime={this.state.endTime}
              resolution={this.state.resolution}
            />
          </div>
        </div>
      </div>
    );
  }
}

ChartComponent.propTypes = {
  getData: PropTypes.func,
  updateQuery: PropTypes.func,
  data: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
};

export const Chart = Query(ChartComponent, CANDLE_QUERY, props => ({
  startTime: INITIAL_START_TIME / 1000,
  endTime: INITIAL_END_TIME / 1000,
  resolution: INITIAL_RESOLUTION.value,
  quoteSymbol: props.match.params.quote,
  currencySymbol: props.match.params.base,
}));
