import React from 'react';
import {} from 'reactstrap';
import PropTypes from 'prop-types';
import { Loading } from '../../../components/loading';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
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

  render() {
    if (!this.props.data.currency) return <Loading />;
    if (!this.props.data.currency.markets) return <div />;

    let exchangeVolumeObjects = this.getExchangeVolume(this.props.data.currency.markets);
    let quoteVolumeObjects = this.getQuoteVolume(this.props.data.currency.markets);

    let exchangeVolumes = Object.entries(exchangeVolumeObjects).map(volume => ({
      name: volume[0],
      value: volume[1],
    }));

    let quoteVolumes = Object.entries(quoteVolumeObjects).map(volume => ({
      name: volume[0],
      value: volume[1],
    }));

    return (
      <div className="currency-info-container markets">
        <div className="volume-market pie">
          <h4>Volume / Exchange</h4>
          <div className="market-container">
            <PieChart width={300} height={300}>
              <Pie
                cx={150}
                cy={150}
                data={exchangeVolumes}
                dataKey="value"
                nameKey="name"
                innerRadius="50%"
                outerRadius="80%"
                label={item => item.name}
              >
                {exchangeVolumes.map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>
        <div className="volume-market pie">
          <h4>Volume / Quote</h4>
          <div style={{ height: '21em' }}>
            <PieChart width={300} height={300}>
              <Pie
                cx={150}
                cy={150}
                data={quoteVolumes}
                dataKey="value"
                nameKey="name"
                innerRadius="50%"
                outerRadius="80%"
                label={item => item.name}
              >
                {exchangeVolumes.map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
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
