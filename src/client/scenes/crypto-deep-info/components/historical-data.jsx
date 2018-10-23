import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Tooltip } from 'reactstrap';
import { Loading } from '../../../components/loading';
import { Query } from 'regraph-request';
import { formatPrice } from '../../../library/currency-tools';
import { DATETIME_FORMAT } from './chart-utils';

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

let HistoricalDataItem = ({ startUnix, quoteVolume, percentChange, open, quote }) => {
  let isPositiveChange = percentChange >= 0;
  return (
    <div className="row">
      <div className="col-sm-3">{moment(startUnix * 1000).format(DATETIME_FORMAT)}</div>
      <div className="col-sm-3 number">{quoteVolume ? formatPrice(quoteVolume, quote) : ''}</div>
      <div className={`col-sm-3 number ${isPositiveChange ? 'positive' : 'negative'}`}>
        {percentChange}
      </div>
      <div className="col-sm-3 number">{open ? formatPrice(open, quote, 8) : ''}</div>
    </div>
  );
};

HistoricalDataItem.propTypes = {
  startUnix: PropTypes.number,
  quoteVolume: PropTypes.number,
  percentChange: PropTypes.number,
  open: PropTypes.number,
  quote: PropTypes.string,
};

export class HistoricalDataComponent extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);

    this.state = {
      tooltipOpen: false,
    };
  }

  toggle() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen,
    });
  }

  changeExchange({ target }) {
    let { value: exchange } = target;
    let vars;
    if (exchange === 'VWA') {
      vars = {
        aggregation: 'VWA',
        exchangeSymbol: '%',
      };
    } else {
      vars = {
        aggregation: null,
        exchangeSymbol: exchange,
      };
    }
    this.props.getData(vars);
  }

  render() {
    let list, exchanges;

    if (!this.props.data.currency) {
      list = <Loading />;
      exchanges = null;
    } else {
      let market = this.props.data.currency.markets.find(m =>
        m.marketSymbol.endsWith(this.props.currency.quoteSymbol.toUpperCase())
      );
      if (!market) return null;

      list = market.timeseries.map(t => (
        <HistoricalDataItem {...t} quote={this.props.currency.quoteSymbol} key={t.startUnix} />
      ));

      exchanges = this.props.data.currency.exchanges.map(exchange => {
        let name = exchange.marketSymbol.split(':')[0];
        return (
          <option key={name} value={name}>
            {name}
          </option>
        );
      });
      exchanges.unshift(
        <option key="VWA" value="VWA">
          VWA
        </option>
      );
    }

    return (
      <div className="historical-data row">
        <div className="col-sm-4" id="header">
          <h5>Historical Data</h5>
        </div>
        <div className="col-sm-2 offset-sm-6">
          <select
            name="exchange"
            id="exchange"
            className="float-right form-control"
            onChange={this.changeExchange.bind(this)}
          >
            {exchanges}
          </select>
        </div>
        <div className="col-sm-1 pull-right">
          <div className="pull-right">
            <Tooltip
              placement="right"
              isOpen={this.state.tooltipOpen}
              target="header"
              toggle={this.toggle}
            >
              Last {LIMIT} candles for the selected resolution
            </Tooltip>
          </div>
        </div>
        <div className="col-sm-12">
          <div className="row header">
            <div className="col-sm-3">Time</div>
            <div className="col-sm-3 number">
              Volume ({this.props.currency.quoteSymbol.toUpperCase()})
            </div>
            <div className="col-sm-3 number">Percent Change</div>
            <div className="col-sm-3 number">Price</div>
          </div>
        </div>
        <div className="contents col-sm-12">{list}</div>
      </div>
    );
  }
}

HistoricalDataComponent.propTypes = {
  data: PropTypes.object,
  getData: PropTypes.func,
  currency: PropTypes.object,
  base: PropTypes.string,
  resolution: PropTypes.object,
  endTime: PropTypes.number,
  startTime: PropTypes.number,
};

export const HistoricalData = Query(
  HistoricalDataComponent,
  CANDLE_QUERY,
  ({ base, currency, resolution }) => {
    console.log(currency);
    return {
      currencySymbol: base.toUpperCase(),
      quote: currency.quoteSymbol.toUpperCase(),
      resolution: resolution.value,
      limit: LIMIT,
      aggregation: 'VWA',
      exchangeSymbol: '%',
    };
  }
);
