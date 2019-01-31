import React from 'react';
import PropTypes from 'prop-types';
import { Loading } from '../../../../components/loading';
import { HistoricalDataItem } from './components/historical-data-item';
import { Toolbar } from './components/toolbar';

export const HistoricalDataScene = ({
  data,
  currency,
  updateExchange,
  updateResolution,
  selectedExchange,
  selectedResolution,
  message,
  getData,
}) => {
  let list;

  if (!data.asset) {
    if (message) return <div className="row justify-content-center">{message}</div>;
    return <Loading />;
  }

  if (!data.timeseries.length) return null;

  list = data.timeseries.map(t => <HistoricalDataItem {...t} key={t.startUnix} />);

  return (
    <div className="historical-data row">
      <div className="col-sm-12">
        <Toolbar
          resolution={selectedResolution}
          updateResolution={updateResolution}
          exchanges={data.asset.exchanges}
          selectedExchange={selectedExchange}
          updateExchange={updateExchange}
          getData={getData}
        />
      </div>
      <div className="col-sm-12">
        <div className="row header">
          <div className="col-sm-3">Time</div>
          <div className="col-sm-3 number">Volume</div>
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
  message: PropTypes.string,
  getData: PropTypes.func,
};
