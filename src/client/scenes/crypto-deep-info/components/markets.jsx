import React from 'react';
import {} from 'reactstrap';
import PropTypes from 'prop-types';
import { Loading } from '../../../components/loading';
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from 'recharts';
import { Query } from 'regraph-request';

const colors = ['#EE8434', '#335C67', '#A33B20', '#EDD382', '#306B34'];

const MARKET_QUERY = `
  query MarketQuery($currencySymbol: String!) {
    currency(currencySymbol: $currencySymbol) {
      id
      markets {
        id
        marketSymbol
        ticker {
          last
          percentChange
          dayLow
          dayHigh
          baseVolume
          quoteVolume
        }
      }
    }
  }
`;

export class MarketsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.getExchangeVolume = this.getExchangeVolume.bind(this);
    this.getQuoteVolume = this.getQuoteVolume.bind(this);
  }

  getExchangeVolume(markets) {
    return markets.reduce((aggregator, market) => {
      const exchange = market.marketSymbol.split(':')[0];
      if (market.ticker) {
        aggregator[exchange] = aggregator[exchange] || 0 + market.ticker.baseVolume;
      }
      return aggregator;
    }, []);
  }

  getQuoteVolume(markets) {
    return markets.reduce((aggregator, market) => {
      const quote = market.marketSymbol.split('/')[1];
      if (market.ticker) {
        aggregator[quote] = aggregator[quote] || 0 + market.ticker.baseVolume;
      }
      return aggregator;
    }, []);
  }

  renderCustomizedLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent * 100 > 10)
      return (
        <text
          x={x}
          y={y}
          fill="white"
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline="central"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    return null;
  }

  render() {
    if (!this.props.data.currency) return <Loading />;
    if (!this.props.data.currency.markets) return <div />;

    let exchangeVolumeObjects = this.getExchangeVolume(this.props.data.currency.markets);
    let quoteVolumeObjects = this.getQuoteVolume(this.props.data.currency.markets);

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
                  innerRadius="40%"
                  outerRadius="80%"
                  label={this.renderCustomizedLabel}
                  labelLine={false}
                >
                  {exchangeVolumes.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={value => `${(value / totalExchangeVolume * 100).toFixed(2)}%`}
                />
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
                  innerRadius="40%"
                  outerRadius="80%"
                  labelLine={false}
                  label={this.renderCustomizedLabel}
                >
                  {exchangeVolumes.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={value => `${(value / totalExchangeVolume * 100).toFixed(2)}%`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }
}

MarketsComponent.propTypes = {
  data: PropTypes.object,
  match: PropTypes.object.isRequired,
};

export const Markets = Query(MarketsComponent, MARKET_QUERY, ({ currencySymbol }) => ({
  currencySymbol,
}));
