import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Tooltip } from 'reactstrap';
import { Loading } from '../../../components/loading';
import { Query } from 'regraph-request';
import { getPairFromMatch } from '../../../library/path-tools';
import { formatPrice } from '../../../library/currency-tools';
import { DATETIME_FORMAT } from './chart-utils';

const LIMIT = 50;
const CANDLE_QUERY = `
query HistoricalData (
  $currencySymbol: String!
  $quote: String!
  $resolution: CandleResolution!
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
      data {
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
    }
    exchanges:markets(filter:{quoteSymbol_eq:$quote}){
      totalCount
      data {
        marketSymbol
      }
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
    if (exchange === 'VWAP') {
      vars = {
        aggregation: 'VWAP',
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
    let { quote } = getPairFromMatch(this.props.match);

    if (!this.props.data.currency) {
      list = <Loading />;
      exchanges = null;
    } else {
      let market = this.props.data.currency.markets.data.find(m =>
        m.marketSymbol.endsWith(quote.toUpperCase())
      );
      if (!market) return null;

      list = market.timeseries.map(t => (
        <HistoricalDataItem {...t} quote={quote} key={t.startUnix} />
      ));

      exchanges = this.props.data.currency.exchanges.data.map(exchange => {
        let name = exchange.marketSymbol.split(':')[0];
        return (
          <option key={name} value={name}>
            {name}
          </option>
        );
      });
      exchanges.unshift(
        <option key="VWAP" value="VWAP">
          VWAP
        </option>
      );
    }

    return (
      <div className="historical-data row">
        <div className="col-sm-6">
          <h3>Historical Data</h3>
        </div>
        <div className="col-sm-6">
          <select
            name="exchange"
            id="exchange"
            className="float-right"
            onChange={this.changeExchange.bind(this)}
          >
            {exchanges}
          </select>
        </div>
        <div className="col-sm-1 pull-right">
          <div className="pull-right">
            <Tooltip
              placement="top"
              isOpen={this.state.tooltipOpen}
              target="header"
              toggle={this.toggle}
            >
              Last {LIMIT} candles for the selected resolution
            </Tooltip>
          </div>
        </div>
        <div className="col-sm-12">
          <div className="row header" id="header">
            <div className="col-sm-3">Time</div>
            <div className="col-sm-3 number">Volume ({quote.toUpperCase()})</div>
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
  match: PropTypes.object,
  resolution: PropTypes.object,
  endTime: PropTypes.number,
  startTime: PropTypes.number,
};

export const HistoricalData = Query(HistoricalDataComponent, CANDLE_QUERY, props => {
  let { base, quote } = getPairFromMatch(props.match);
  return {
    currencySymbol: base.toUpperCase(),
    quote: quote.toUpperCase(),
    resolution: props.resolution.value,
    limit: LIMIT,
    aggregation: 'VWAP',
    exchangeSymbol: '%',
  };
});
