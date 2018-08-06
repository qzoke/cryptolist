import React from 'react';
import PropTypes from 'prop-types';
import { Loading } from '../../../components/loading';
import { Query } from 'regraph-request';
import { getPairFromMatch } from '../../../library/path-tools';
const CANDLE_QUERY = `
query AllCurrencies ($currencySymbol: String!, $resolution:CandleResolution!) {
  currency(currencySymbol:$currencySymbol){
    markets(aggregation:VWAP){
      data {
        marketSymbol
        timeseries(resolution: $resolution, limit: 50){
          startUnix
          volume
          percentChange
          open
        }
      }
    }
  }
}
`;

let HistoricalDataItem = ({ startUnix, volume, percentChange, open }) => {
  return (
    <div className="row">
      <div className="col-sm-3">{startUnix}</div>
      <div className="col-sm-3">{volume}</div>
      <div className="col-sm-3">{percentChange}</div>
      <div className="col-sm-3">{open}</div>
    </div>
  );
};
HistoricalDataItem.propTypes = {
  startUnix: PropTypes.number,
  volume: PropTypes.number,
  percentChange: PropTypes.number,
  open: PropTypes.number,
};

export class HistoricalDataComponent extends React.Component {
  render() {
    let list;
    let { quote } = getPairFromMatch(this.props.match);

    if (!this.props.data.currency) list = <Loading />;
    else {
      let market = this.props.data.currency.markets.data.find(m =>
        m.marketSymbol.endsWith(quote.toUpperCase())
      );
      if (!market) return null;
      list = market.timeseries.map(t => <HistoricalDataItem {...t} key={t.startUnix} />);
    }
    return (
      <div className="historical-data row">
        <div className="col-sm-12">
          <h5>Historical Data</h5>
        </div>
        <div className="col-sm-12">
          <div className="row">
            <div className="col-sm-3">Time</div>
            <div className="col-sm-3">Volume</div>
            <div className="col-sm-3">Percent change</div>
            <div className="col-sm-3">Price</div>
          </div>
        </div>
        <div className="contents col-sm-12">{list}</div>
      </div>
    );
  }
}

HistoricalDataComponent.propTypes = {
  data: PropTypes.object,
  match: PropTypes.object,
};

export const HistoricalData = Query(HistoricalDataComponent, CANDLE_QUERY, props => {
  let { base } = getPairFromMatch(props.match);
  return {
    currencySymbol: base.toUpperCase(),
    resolution: '_30m',
  };
});
