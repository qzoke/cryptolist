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

const INITIAL_RESOLUTION = Resolutions.find(r => r.value === '_1d');
const INITIAL_START_TIME =
  moment()
    .subtract(3, 'months')
    .unix() * 1000;
const INITIAL_END_TIME = moment().unix() * 1000;
const CANDLE_QUERY = `
query CandlestickData(
  $currencySymbol: String!,
  $quoteSymbol: String,
  $startTime: Int,
  $endTime: Int,
  $resolution: TimeResolution!
) {
  currency(currencySymbol: $currencySymbol) {
    vwa: markets(filter: { quoteSymbol_eq: $quoteSymbol }, aggregation: VWA) {
      marketSymbol
      timeseries (resolution: $resolution, start: $startTime, end: $endTime, sort: OLD_FIRST) {
        open
        high
        low
        close
        startUnix
        volume
      }
    }
    markets(filter: { quoteSymbol_eq: $quoteSymbol }) {
      marketSymbol
      timeseries (resolution: $resolution, start: $startTime, end: $endTime, sort: OLD_FIRST) {
        open
        high
        low
        close
        startUnix
        volume
      }
    }
  }
}
`;

export class ChartComponent extends React.Component {
  constructor(props) {
    super(props);
    this.updateStartTime = this.updateStartTime.bind(this);
    this.updateEndTime = this.updateEndTime.bind(this);
    this.updateResolution = this.updateResolution.bind(this);
    this.updateSelectedChart = this.updateSelectedChart.bind(this);

    this.state = {
      resolution: INITIAL_RESOLUTION,
      startTime: INITIAL_START_TIME,
      endTime: INITIAL_END_TIME,
      selectedChart: 'line',
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
    this.setState({ selectedChart });
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
            selectedChart={this.state.selectedChart}
            updateSelectedChart={this.updateSelectedChart}
          />
          {this.state.selectedChart === 'candle' && (
            <CandleChart currency={this.props.data.currency} />
          )}

          {this.state.selectedChart === 'line' && <LineChart currency={this.props.data.currency} />}
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
  data: PropTypes.object,
};

export const Chart = Query(ChartComponent, CANDLE_QUERY, props => ({
  startTime: INITIAL_START_TIME / 1000,
  endTime: INITIAL_END_TIME / 1000,
  resolution: INITIAL_RESOLUTION.value,
  quoteSymbol: props.match.params.quote,
  currencySymbol: props.match.params.base,
}));
