import React from 'react';
import PropTypes from 'prop-types';
import { Loading } from '../../../../../components/loading';
import moment from 'moment';
import { adHocRequest } from '../../../../../client-factory.js';
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ResolutionGroup } from './resolution-group.jsx';

const INITIAL_RESOLUTION = '_1h';
const CANDLE_QUERY = `
query CandlestickData($currencySymbol: String, $quoteSymbol: String, $start: Int, $end: Int, $resolution: CandleResolution!) {
  currency(currencySymbol: $currencySymbol) {
    id
    markets(filter: { quoteSymbol_eq: $quoteSymbol }, aggregation: VWAP) {
      data {
        id
        marketSymbol
        candles (resolution: $resolution, start: $start, end: $end, sort: OLD_FIRST) {
          start
          end
          data
        }
      }
    }
  }
}
`;

export class GraphComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.updateResolution = this.updateResolution.bind(this);
    this.state = {
      resolution: INITIAL_RESOLUTION,
    };
  }

  updateResolution(resolution) {
    this.setState({ resolution });
    this.props.getData({ resolution });
  }

  render() {
    if (!this.props.data.currency) return <div />;
    let data = this.props.data.currency.markets.data[0].candles.data.map(c => {
      return {
        name: `${moment(c[0] * 1000).format('H:m MMM DD')}`,
        close: c[4],
        volume: c[6],
      };
    });

    return (
      <div className="currency-info-container graph">
        <div className="volume-market line">
          <ResolutionGroup
            updateResolution={this.updateResolution}
            resolution={this.state.resolution}
          />
          <LineChart width={800} height={400} data={data}>
            <XAxis dataKey="name" />
            <YAxis dataKey="close" scale="linear" type="number" domain={['datamin', 'datamax']} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Line type="monotone" dataKey="close" stroke="#8884d8" dot={false} />
          </LineChart>
          <BarChart width={800} height={100} data={data}>
            <XAxis dataKey="name" />
            <YAxis dataKey="volume" type="number" domain={['datamin', 'datamax']} />
            <Bar dataKey="volume" barSize={20} fill="#413ea0" />
            <Tooltip />
          </BarChart>
        </div>
      </div>
    );
  }
}

GraphComponent.propTypes = {
  currencySymbol: PropTypes.string.isRequired,
  quoteSymbol: PropTypes.string.isRequired,
  getData: PropTypes.func,
};

const withCurrencyQuery = (WrappedComponent, query) => {
  return class extends React.PureComponent {
    constructor(props) {
      super(props);
      this.getData = this.getData.bind(this);
      this.state = {
        data: {},
        quoteSymbol: props.quote,
        currencySymbol: props.currencySymbol,
      };
      this.getData({ currencySymbol: props.currencyId, quoteSymbol: props.quote });
    }

    componentDidUpdate(prevProps, prevState) {
      if (
        this.state.quoteSymbol !== this.props.quoteSymbol ||
        this.state.currencySymbol !== this.props.currencySymbol
      )
        this.getData({
          currencySymbol: prevProps.currencySymbol,
          quoteSymbol: prevProps.quoteSymbol,
        });
    }

    getData({
      currencySymbol = this.state.currencySymbol,
      quoteSymbol = this.state.quoteSymbol,
      resolution = INITIAL_RESOLUTION,
    }) {
      let variables = {
        quoteSymbol,
        currencySymbol,
        resolution,
      };
      adHocRequest(query, variables).then(res => {
        this.setState({ data: res.data, quoteSymbol, currencySymbol });
      });
    }

    render() {
      if (!this.state.data.currency) return <div />;
      return <WrappedComponent {...this.props} data={this.state.data} getData={this.getData} />;
    }
  };
};

export const Graph = withCurrencyQuery(GraphComponent, CANDLE_QUERY);
