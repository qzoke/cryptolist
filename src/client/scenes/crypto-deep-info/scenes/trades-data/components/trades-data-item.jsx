import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DATETIME_FORMAT } from '../../crypto-deep-info/scenes/native-chart/components/chart-utils';
import { formatPrice } from '../../../library/currency-tools';

export const TradesDataItem = ({ exchange, price, amount, taker, tradeId, unix, quote }) => {
  return (
    <div className="row">
      <div className="col-sm-2">{exchange}</div>
      <div className="col-sm-2">{moment(parseInt(unix)).format(DATETIME_FORMAT)}</div>
      <div className="col-sm-2 number">{price ? formatPrice(price, quote) : ''}</div>
      <div className="col-sm-2 number">{amount ? formatPrice(amount, quote) : ''}</div>
      <div className="col-sm-2 number">{taker}</div>
      <div className="col-sm-2">{tradeId}</div>
    </div>
  );
};

TradesDataItem.propTypes = {
  exchange: PropTypes.string,
  price: PropTypes.string,
  amount: PropTypes.string,
  taker: PropTypes.string,
  tradeId: PropTypes.string,
  unix: PropTypes.string,
  quote: PropTypes.string,
};
