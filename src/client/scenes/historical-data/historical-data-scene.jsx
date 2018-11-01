import React from 'react';
import PropTypes from 'prop-types';
import { Loading } from '../../components/loading';
import { HistoricalDataItem } from './components/historical-data-item';
import { Toolbar } from './components/toolbar';

export const HistoricalDataScene = ({
  data,
  currency,
  updateExchange,
  updateResolution,
  selectedExchange,
  selectedResolution,
}) => {
  let list;

  if (!data.currency) {
    return <Loading />;
  }

  let market = data.currency.markets.find(m =>
    m.marketSymbol.endsWith(currency.quoteSymbol.toUpperCase())
  );

  if (!market) return null;

  list = market.timeseries.map(t => (
    <HistoricalDataItem {...t} quote={currency.quoteSymbol} key={t.startUnix} />
  ));

  return (
    <div className="historical-data row">
      <div className="col-sm-12">
        <Toolbar
          resolution={selectedResolution}
          updateResolution={updateResolution}
          exchanges={data.currency.exchanges}
          selectedExchange={selectedExchange}
          updateExchange={updateExchange}
        />
      </div>
      <div className="col-sm-12">
        <div className="row header">
          <div className="col-sm-3">Time</div>
          <div className="col-sm-3 number">Volume ({currency.quoteSymbol.toUpperCase()})</div>
          <div className="col-sm-3 number">Percent Change</div>
          <div className="col-sm-3 number">Price</div>
        </div>
      </div>
      <div className="contents col-sm-12">{list}</div>
    </div>
  );
};

HistoricalDataScene.propTypes = {
  data: PropTypes.object,
  currency: PropTypes.object,
  updateExchange: PropTypes.func,
  toggleTooltip: PropTypes.func,
  tooltipOpen: PropTypes.bool,
  selectedExchange: PropTypes.string,
  selectedResolution: PropTypes.object,
  updateResolution: PropTypes.func,
};
