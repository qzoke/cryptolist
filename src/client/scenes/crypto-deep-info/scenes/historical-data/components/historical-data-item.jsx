import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { formatPrice } from '../../../../../library/currency-tools';
import { DATETIME_FORMAT } from '../../native-chart/components/chart-utils';

export const HistoricalDataItem = ({ startUnix, quoteVolume, percentChange, open, quote }) => {
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
