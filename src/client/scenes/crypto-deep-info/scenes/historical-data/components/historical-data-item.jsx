import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { formatPrice } from '../../../../../library/currency-tools';
import { DATETIME_FORMAT } from '../../native-chart/components/chart-utils';

export const HistoricalDataItem = ({ startUnix, markets }) => {
  let market = markets[0];
  let isPositiveChange = market.percentChange >= 0;
  return (
    <div className="row">
      <div className="col-sm-3">{moment(startUnix * 1000).format(DATETIME_FORMAT)}</div>
      <div className="col-sm-3 number">
        {market.quoteVolume ? formatPrice(market.quoteVolume, market.quoteSymbol) : ''}
      </div>
      <div className={`col-sm-3 number ${isPositiveChange ? 'positive' : 'negative'}`}>
        {market.percentChange}
      </div>
      <div className="col-sm-3 number">
        {market.openPrice ? formatPrice(market.openPrice, market.quoteSymbol, 8) : ''}
      </div>
    </div>
  );
};

HistoricalDataItem.propTypes = {
  startUnix: PropTypes.number,
  markets: PropTypes.object,
};
