import React from 'react';
import PropTypes from 'prop-types';
import { Loading } from '../../components/loading';
import { TradesDataItem } from './components/trades-data-item';
import { Toolbar } from './components/toolbar';

export const TradesDataScene = ({ data, currency, message, getData }) => {
  if (!data.currency || !data.currency.markets.length) {
    if (message) return <div className="row justify-content-center">{message}</div>;
    return <Loading />;
  }

  const market = data.currency.markets[0];
  const { trades } = market;
  const list = trades.map(t => (
    <TradesDataItem key={t.tradeId} quote={currency.quoteSymbol || ''} {...t} />
  ));

  return (
    <div className="historical-data row">
      <div className="col-sm-12">
        <Toolbar getData={getData} />
      </div>
      <div className="col-sm-12">
        {message && <div>{message}</div>}
        <div className="row header">
          <div className="col-sm-2">Exchange</div>
          <div className="col-sm-2">Time</div>
          <div className="col-sm-2 number">Price</div>
          <div className="col-sm-2 number">Amount</div>
          <div className="col-sm-2 number">Taker</div>
          <div className="col-sm-2">Trade ID</div>
        </div>
      </div>
      <div className="contents col-sm-12">{list}</div>
    </div>
  );
};

TradesDataScene.propTypes = {
  data: PropTypes.object,
  message: PropTypes.string,
  quote: PropTypes.object,
  usingSecondary: PropTypes.bool,
  currency: PropTypes.object,
  getData: PropTypes.func,
};
