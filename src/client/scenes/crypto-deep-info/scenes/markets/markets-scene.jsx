import React from 'react';
import PropTypes from 'prop-types';
import { Loading } from '../../../../components/loading';
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from 'recharts';
import { CustomChartLabel } from './components/custom-chart-label';

const colors = ['#EE8434', '#335C67', '#A33B20', '#EDD382', '#306B34'];

const getExchangeVolume = markets => {
  return markets.reduce((aggregator, market) => {
    const exchange = market.marketSymbol.split(':')[0];
    if (market.ticker) {
      aggregator[exchange] = aggregator[exchange] || 0 + market.ticker.baseVolume;
    }
    return aggregator;
  }, []);
};

const getQuoteVolume = markets => {
  return markets.reduce((aggregator, market) => {
    const quote = market.marketSymbol.split('/')[1];
    if (market.ticker) {
      aggregator[quote] = aggregator[quote] || 0 + market.ticker.baseVolume;
    }
    return aggregator;
  }, []);
};

export const MarketsScene = ({ data }) => {
  if (!data.asset) return <Loading />;
  if (!data.asset.markets) return null;

  let exchangeVolumeObjects = getExchangeVolume(data.asset.markets);
  let quoteVolumeObjects = getQuoteVolume(data.asset.markets);

  let exchangeVolumes = Object.entries(exchangeVolumeObjects).map(volume => ({
    name: volume[0],
    value: volume[1],
  }));
  let totalExchangeVolume = exchangeVolumes.reduce((acc, v) => v.value + acc, 0);
  exchangeVolumes.sort((a, b) => (a.value > b.value ? 1 : -1));

  let quoteVolumes = Object.entries(quoteVolumeObjects).map(volume => ({
    name: volume[0],
    value: volume[1],
  }));
  quoteVolumes.sort((a, b) => (a.value > b.value ? 1 : -1));

  return (
    <div className="currency-info-container markets">
      <div className="volume-market pie">
        <h4>Volume / Exchange</h4>
        <div className="market-container">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={exchangeVolumes}
                dataKey="value"
                nameKey="name"
                outerRadius="100%"
                label={CustomChartLabel}
                labelLine={false}
                isAnimationActive={false}
              >
                {exchangeVolumes.map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={value => `${(value / totalExchangeVolume * 100).toFixed(2)}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="volume-market pie">
        <h4>Volume / Quote</h4>
        <div className="market-container">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={quoteVolumes}
                dataKey="value"
                nameKey="name"
                outerRadius="100%"
                labelLine={false}
                label={CustomChartLabel}
                isAnimationActive={false}
              >
                {exchangeVolumes.map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={value => `${(value / totalExchangeVolume * 100).toFixed(2)}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

MarketsScene.propTypes = {
  data: PropTypes.object,
};
