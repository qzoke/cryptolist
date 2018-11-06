import React from 'react';
import { Chart } from '../scenes/native-chart/chart';
import { TradingViewChart } from '../scenes/trading-view/tradingview-chart';

export const ChartRouter = props => {
  const tv = window.TradingView;
  if (tv instanceof Object && Object.keys(tv).length) {
    return <TradingViewChart {...props} />;
  } else {
    return <Chart {...props} />;
  }
};
