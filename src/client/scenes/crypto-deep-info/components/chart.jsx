import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  ComposedChart,
  Legend,
  Line,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { Resolutions } from './resolution-group';
import { Loading } from '../../../components/loading';
import { Query } from 'regraph-request';
import { HistoricalData } from './historical-data';
import { ChartUtils } from './chart-utils';

const colors = ['#90BADB', '#C595D0', '#FEA334', '#5ECF96', '#FF62EA', '#69FFE9', '#69FFE9'];
const GREEN_DARK = '#74A321';
const GREEN = '#74A32180';
const RED = '#FF777780';
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
        startUnix
        volume
      }
    }
    markets(filter: { quoteSymbol_eq: $quoteSymbol }) {
      marketSymbol
      timeseries (resolution: $resolution, start: $startTime, end: $endTime, sort: OLD_FIRST) {
        open
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
    this.toggleChart = this.toggleChart.bind(this);
    this.highlightExchange = this.highlightExchange.bind(this);
    this.unhighlightExchange = this.unhighlightExchange.bind(this);

    this.state = {
      resolution: INITIAL_RESOLUTION,
      startTime: INITIAL_START_TIME,
      endTime: INITIAL_END_TIME,
      charts: {
        volume: true,
        VWA: true,
      },
      selectedExchange: '',
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

  toggleChart(selected) {
    let key = selected.dataKey.trim();
    let enabledCharts = this.state.charts;
    enabledCharts[key] = !enabledCharts[key];
    this.setState({ charts: enabledCharts, selectedExchange: key });
  }

  highlightExchange(selectedExchange) {
    this.setState({ selectedExchange });
  }

  unhighlightExchange() {
    this.setState({ selectedExchange: '' });
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

    let currency = this.props.data.currency;
    let vwaMarket = currency.vwa[0];
    let otherMarkets = currency.markets;
    let hasMarkets = !!otherMarkets.length;

    let data = vwaMarket.timeseries.map((candle, idx) => {
      let marketVals = hasMarkets
        ? otherMarkets.reduce((reducer, market) => {
            reducer[market.marketSymbol.split(':')[0]] = market.timeseries[idx]
              ? market.timeseries[idx].open
              : null;
            return reducer;
          }, {})
        : {};
      let vwa = {
        name: `${moment(candle.startUnix * 1000).format('H:m MMM DD')}`,
        timestamp: candle.startUnix,
        VWA: candle.open,
        volume: candle.volume,
      };
      return Object.assign({}, vwa, marketVals);
    });

    let exchangeNames = otherMarkets.map(market => market.marketSymbol.split(':')[0]);
    let marketList = exchangeNames.map((name, i) => (
      <Line
        type="linear"
        yAxisId="VWA"
        dataKey={this.state.charts[name] ? name : `${name} `}
        stroke={colors[i % colors.length]}
        animationDuration={500}
        dot={false}
        activeDot={false}
        key={name}
        strokeWidth={this.state.selectedExchange === name ? 3 : 1}
      />
    ));
    var lastPrice = 0;

    // Generate ticks manually
    let skip = Math.ceil(data.length / 5);
    let ticks = [];
    for (let index = 0; index < data.length; index += skip) {
      ticks.push(data[index].name);
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
          />
          <div className="chart-container">
            <ResponsiveContainer width="100%" aspect={1.7}>
              <ComposedChart data={data}>
                <XAxis dataKey="name" ticks={ticks} style={{ fontSize: '0.75em' }} />
                <YAxis
                  yAxisId="VWA"
                  dataKey="VWA"
                  scale="linear"
                  type="number"
                  orientation="right"
                  domain={[datamin => datamin * 0.975, datamax => datamax * 1.025]}
                  style={{ fontSize: '0.75em' }}
                />
                <YAxis
                  yAxisId="volume"
                  dataKey="volume"
                  type="number"
                  scale="linear"
                  domain={['datamin', dataMax => dataMax * 3]}
                  style={{ fontSize: '0.75em', display: 'none' }}
                />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend
                  wrapperStyle={{ fontSize: '0.75em' }}
                  onClick={this.toggleChart}
                  onMouseEnter={q => this.highlightExchange(q.dataKey)}
                  onMouseLeave={this.unhighlightExchange}
                />
                <Bar
                  dataKey={this.state.charts.volume ? 'volume' : 'volume '}
                  yAxisId="volume"
                  barSize={20}
                  fill={GREEN_DARK}
                  animationDuration={500}
                >
                  {data.map(item => {
                    let cell = (
                      <Cell fill={item.VWA >= lastPrice ? GREEN : RED} key={item.timestamp} />
                    );
                    lastPrice = item.VWA;
                    return cell;
                  })}
                </Bar>
                <Line
                  type="linear"
                  yAxisId="VWA"
                  dataKey={this.state.charts.VWA ? 'VWA' : 'VWA '}
                  stroke="#585858"
                  animationDuration={500}
                  dot={false}
                  activeDot={false}
                  strokeWidth={this.state.selectedExchange === 'VWA' ? 3 : 1}
                />
                {marketList}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="historical-data-container">
          <HistoricalData
            {...this.props}
            startTime={this.state.startTime}
            endTime={this.state.endTime}
            resolution={this.state.resolution}
          />
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
