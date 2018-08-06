import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Loading } from '../../../components/loading';
import { Query } from 'regraph-request';
import { getPairFromMatch } from '../../../library/path-tools';
import { formatDisplayPrice } from '../../../library/currency-tools';

const CANDLE_QUERY = `
query HistoricalData (
  $currencySymbol: String!,
  $quote: String!,
  $resolution: CandleResolution!
) {
  currency(currencySymbol: $currencySymbol) {
    markets(filter: { quoteSymbol_eq: $quote }, aggregation:VWAP) {
      data {
        marketSymbol
        timeseries(
          resolution: $resolution,
          limit: 50,
        ) {
          startUnix
          volume
          quoteVolume
          percentChange
          open
        }
      }
    }
  }
}
`;

let HistoricalDataItem = ({ startUnix, quoteVolume, percentChange, open, quote }) => {
  let isPositiveChange = percentChange >= 0;
  return (
    <div className="row">
      <div className="col-sm-3">{moment(startUnix * 1000).format('D/M/YY H:m')}</div>
      <div className="col-sm-3">{quoteVolume ? formatDisplayPrice(quoteVolume, quote) : ''}</div>
      <div className={`col-sm-3 ${isPositiveChange ? 'positive' : 'negative'}`}>
        {percentChange}
      </div>
      <div className="col-sm-3">{open ? formatDisplayPrice(open, quote) : ''}</div>
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

export const HistoricalDataComponent = ({ data, match }) => {
  let list;
  console.log();
  let { quote } = getPairFromMatch(match);
  if (!data.currency) list = <Loading />;
  else {
    let market = data.currency.markets.data.find(m => m.marketSymbol.endsWith(quote.toUpperCase()));
    if (!market) return null;
    list = market.timeseries.map(t => (
      <HistoricalDataItem {...t} quote={quote} key={t.startUnix} />
    ));
  }
  return (
    <div className="historical-data row">
      <div className="col-sm-4">
        <h5>Historical Data</h5>
      </div>
      <div className="col-sm-12">
        <div className="row">
          <div className="col-sm-3">Time</div>
          <div className="col-sm-3">Volume ({quote.toUpperCase()})</div>
          <div className="col-sm-3">Percent change</div>
          <div className="col-sm-3">Price</div>
        </div>
      </div>
      <div className="contents col-sm-12">{list}</div>
    </div>
  );
};

HistoricalDataComponent.propTypes = {
  data: PropTypes.object,
  match: PropTypes.object,
  getData: PropTypes.func,
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
  };
});
