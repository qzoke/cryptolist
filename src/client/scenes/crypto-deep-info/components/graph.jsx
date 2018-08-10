import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import moment from 'moment';
import { ComposedChart, Legend, Line, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ResolutionGroup, Resolutions } from './resolution-group.jsx';
import DateTime from 'react-datetime';
import { Loading } from '../../../components/loading';
import { Query } from 'regraph-request';
import { HistoricalData } from './historical-data';

const colors = ['#90BADB', '#C595D0', '#FEA334', '#5ECF96', '#FF62EA', '#69FFE9', '#69FFE9'];
const INITIAL_RESOLUTION = Resolutions.find(r => r.value === '_1d');
console.log(INITIAL_RESOLUTION);
const INITIAL_START_TIME =
  moment()
    .subtract(3, 'months')
    .unix() * 1000;
const INITIAL_END_TIME = moment().unix() * 1000;
const CANDLE_QUERY = `
query CandlestickData(
  $currencySymbol: String,
  $quoteSymbol: String,
  $startTime: Int,
  $endTime: Int,
  $resolution: CandleResolution!
) {
  currency(currencySymbol: $currencySymbol) {
    vwap: markets(filter: { quoteSymbol_eq: $quoteSymbol }, aggregation: VWAP) {
      data {
        marketSymbol
        candles (resolution: $resolution, start: $startTime, end: $endTime, sort: OLD_FIRST) {
          data
        }
      }
    }
    markets(filter: { quoteSymbol_eq: $quoteSymbol }) {
      data {
        marketSymbol
        candles (resolution: $resolution, start: $startTime, end: $endTime, sort: OLD_FIRST) {
          data
        }
      }
    }
  }
}
`;

export class GraphComponent extends React.Component {
  constructor(props) {
    super(props);
    this.updateStartTime = this.updateStartTime.bind(this);
    this.updateEndTime = this.updateEndTime.bind(this);
    this.updateResolution = this.updateResolution.bind(this);
    this.isValidStart = this.isValidStart.bind(this);
    this.isValidEnd = this.isValidEnd.bind(this);
    this.toggleChart = this.toggleChart.bind(this);
    this.highlightExchange = this.highlightExchange.bind(this);
    this.unhighlightExchange = this.unhighlightExchange.bind(this);
    this.toggleStartTime = this.toggleStartTime.bind(this);
    this.toggleEndTime = this.toggleEndTime.bind(this);
    this.state = {
      resolution: INITIAL_RESOLUTION,
      startTime: INITIAL_START_TIME,
      endTime: INITIAL_END_TIME,
      startShown: false,
      endShown: false,
      charts: {
        volume: true,
        VWAP: true,
      },
      selectedExchange: '',
    };
  }

  isValidStart(current) {
    return current.unix() * 1000 < this.state.endTime && current.unix() <= moment().unix();
  }

  isValidEnd(current) {
    return current.unix() * 1000 > this.state.startTime && current.unix() <= moment().unix();
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
    this.setState({ resolution });
    this.props.getData({ resolution: resolution.value });
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

  toggleStartTime(e) {
    e.preventDefault();
    this.setState({ startShown: !this.state.startShown });
  }

  toggleEndTime(e) {
    e.preventDefault();
    this.setState({ endShown: !this.state.endShown });
  }

  render() {
    if (!this.props.data.currency) return <Loading />;
    if (this.props.data.currency.vwap.data.length === 0) {
      return (
        <div>
          No markets found for selected currency pair. Please select a different quote currency
        </div>
      );
    }

    let currency = this.props.data.currency;
    let vwapMarket = currency.vwap.data[0];
    let otherMarkets = currency.markets.data;
    let hasMarkets = !!otherMarkets.length;

    let data = vwapMarket.candles.data.map((candle, idx) => {
      let marketVals = hasMarkets
        ? otherMarkets.reduce((reducer, market) => {
            reducer[market.marketSymbol.split(':')[0]] = market.candles.data[idx]
              ? market.candles.data[idx][4]
              : null;
            return reducer;
          }, {})
        : {};
      let vwap = {
        name: `${moment(candle[0] * 1000).format('H:m MMM DD')}`,
        timestamp: candle[0],
        VWAP: candle[4],
        volume: candle[6],
      };
      return Object.assign({}, vwap, marketVals);
    });

    let exchangeNames = otherMarkets.map(market => market.marketSymbol.split(':')[0]);
    let marketList = exchangeNames.map((name, i) => (
      <Line
        type="linear"
        yAxisId="VWAP"
        dataKey={this.state.charts[name] ? name : `${name} `}
        stroke={colors[i % colors.length]}
        animationDuration={500}
        dot={false}
        activeDot={false}
        key={name}
        strokeWidth={this.state.selectedExchange === name ? 3 : 1}
      />
    ));
    return (
      <div className="currency-info-container graph">
        <div className="volume-market line">
          <div className="controls row">
            <div className="col-sm-2">
              <ResolutionGroup
                updateResolution={this.updateResolution}
                resolution={this.state.resolution}
              />
            </div>
            <div className="startTime offset-sm-1 col-sm-4">
              <Button onClick={this.toggleStartTime}>
                {moment(this.state.startTime).format('D/M/YY H:m')}
              </Button>
              {this.state.startShown && (
                <DateTime
                  value={this.state.startTime}
                  onChange={this.updateStartTime}
                  isValidDate={this.isValidStart}
                  input={false}
                />
              )}
            </div>
            {' - '}
            <div className="endTime offset-sm-3 col-sm-4">
              <Button onClick={this.toggleEndTime}>
                {moment(this.state.endTime).format('D/M/YY H:m')}
              </Button>
              {this.state.endShown && (
                <DateTime
                  value={this.state.endTime}
                  onChange={this.updateEndTime}
                  isValidDate={this.isValidEnd}
                  input={false}
                />
              )}
            </div>
          </div>
          <ComposedChart width={800} height={400} data={data}>
            <XAxis dataKey="name" style={{ fontSize: '0.75em' }} />
            <YAxis
              yAxisId="VWAP"
              dataKey="VWAP"
              scale="linear"
              type="number"
              domain={[datamin => datamin * 0.975, datamax => datamax * 1.025]}
              style={{ fontSize: '0.75em' }}
            />
            <YAxis
              yAxisId="volume"
              dataKey="volume"
              type="number"
              scale="linear"
              orientation="right"
              domain={['datamin', dataMax => dataMax * 3]}
              style={{ fontSize: '0.75em' }}
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
              fill="#e1e2e6"
              animationDuration={500}
            />
            <Line
              type="linear"
              yAxisId="VWAP"
              dataKey={this.state.charts.VWAP ? 'VWAP' : 'VWAP '}
              stroke="#585858"
              animationDuration={500}
              dot={false}
              activeDot={false}
              strokeWidth={this.state.selectedExchange === 'VWAP' ? 3 : 1}
            />
            {marketList}
          </ComposedChart>
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

GraphComponent.propTypes = {
  getData: PropTypes.func,
  data: PropTypes.object,
};

export const Graph = Query(GraphComponent, CANDLE_QUERY, props => ({
  startTime: INITIAL_START_TIME / 1000,
  endTime: INITIAL_END_TIME / 1000,
  resolution: INITIAL_RESOLUTION.value,
  quoteSymbol: props.match.params.quote,
  currencySymbol: props.match.params.base,
}));
