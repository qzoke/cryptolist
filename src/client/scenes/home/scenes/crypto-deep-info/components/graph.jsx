import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { adHocRequest } from '../../../../../client-factory.js';
import { ComposedChart, Legend, Line, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ResolutionGroup, Resolutions } from './resolution-group.jsx';
import DateTime from 'react-datetime';

const INITIAL_RESOLUTION = Resolutions.find(r => r.value === '_1h');
const INITIAL_START_TIME =
  moment()
    .subtract(7, 'd')
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
    id
    markets(filter: { quoteSymbol_eq: $quoteSymbol }, aggregation: VWAP) {
      data {
        id
        marketSymbol
        candles (resolution: $resolution, start: $startTime, end: $endTime, sort: OLD_FIRST) {
          start
          end
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
    this.state = {
      resolution: INITIAL_RESOLUTION,
      startTime: INITIAL_START_TIME,
      endTime: INITIAL_END_TIME,
      charts: {
        volume: true,
        VWAP: true,
      },
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
    startTime = moment(startTime).unix() * 1000;
    this.setState({ startTime });
    this.props.getData({ startTime, endTime: this.state.endTime });
  }

  updateEndTime(endTime) {
    if (endTime - this.state.endTime <= this.state.resolution.seconds) return;
    endTime = moment(endTime).unix() * 1000;
    this.setState({ endTime });
    this.props.getData({ endTime, startTime: this.state.startTime });
  }

  updateResolution(resolution) {
    this.setState({ resolution });
    this.props.getData({ resolution });
  }

  toggleChart(selected) {
    let key = selected.dataKey.trim();
    let enabledCharts = this.state.charts;
    enabledCharts[key] = !enabledCharts[key];
    this.setState({ charts: enabledCharts });
  }

  render() {
    if (!this.props.data.currency) return <div />;
    if (this.props.data.currency.markets.data.length === 0) {
      return (
        <div>
          No markets found for selected currency pair. Please select a different quote currency
        </div>
      );
    }
    let data = this.props.data.currency.markets.data[0].candles.data.map(c => {
      return {
        name: `${moment(c[0] * 1000).format('H:m MMM DD')}`,
        VWAP: c[4],
        volume: c[6],
      };
    });

    return (
      <div className="currency-info-container graph">
        <div className="volume-market line">
          <div className="controls">
            <ResolutionGroup
              updateResolution={this.updateResolution}
              resolution={this.state.resolution}
            />
            <div className="startTime">
              <DateTime
                value={this.state.startTime}
                onChange={this.updateStartTime}
                isValidDate={this.isValidStart}
              />
            </div>
            <div className="endTime">
              <DateTime
                value={this.state.endTime}
                onChange={this.updateEndTime}
                isValidDate={this.isValidEnd}
              />
            </div>
          </div>
          <ComposedChart width={800} height={400} data={data}>
            <XAxis dataKey="name" style={{ fontSize: '0.75em' }} />
            <YAxis
              yAxisId="VWAP"
              dataKey="VWAP"
              scale="linear"
              type="number"
              domain={['datamin', 'datamax']}
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
            <Legend wrapperStyle={{ fontSize: '0.75em' }} onClick={this.toggleChart} />
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
              stroke="#f87a0b"
              animationDuration={500}
              dot={false}
              activeDot={false}
            />
          </ComposedChart>
        </div>
      </div>
    );
  }
}

GraphComponent.propTypes = {
  getData: PropTypes.func,
  data: PropTypes.object,
};

const withCurrencyQuery = (WrappedComponent, query) => {
  class WithCurrencyQuery extends React.Component {
    constructor(props) {
      super(props);
      this.getData = this.getData.bind(this);
      this.state = {
        data: {},
        quoteSymbol: props.match.params.quote,
        currencySymbol: props.match.params.base,
        resolution: INITIAL_RESOLUTION,
        startTime: INITIAL_START_TIME,
        endTime: INITIAL_END_TIME,
      };
      this.getData({
        currencySymbol: props.match.params.base,
        quoteSymbol: props.match.params.quote,
      });
    }

    componentDidUpdate(prevProps) {
      if (
        this.state.quoteSymbol !== this.props.match.params.quote ||
        this.state.currencySymbol !== this.props.match.params.base
      )
        this.getData({
          currencySymbol: prevProps.currencySymbol,
          quoteSymbol: prevProps.quoteSymbol,
        });
    }

    getData({
      startTime = this.state.startTime,
      endTime = this.state.endTime,
      currencySymbol = this.state.currencySymbol,
      quoteSymbol = this.state.quoteSymbol,
      resolution = this.state.resolution,
    }) {
      let variables = {
        quoteSymbol,
        currencySymbol,
        resolution: resolution.value,
        startTime: startTime / 1000,
        endTime: endTime / 1000,
      };
      adHocRequest(query, variables).then(res => {
        this.setState({
          data: res.data,
          quoteSymbol,
          currencySymbol,
          startTime,
          endTime,
          resolution,
        });
      });
    }

    render() {
      if (!this.state.data.currency) return <div />;
      return <WrappedComponent {...this.props} data={this.state.data} getData={this.getData} />;
    }
  }

  WithCurrencyQuery.propTypes = {
    match: PropTypes.object.isRequired,
  };

  return WithCurrencyQuery;
};

export const Graph = withCurrencyQuery(GraphComponent, CANDLE_QUERY);
