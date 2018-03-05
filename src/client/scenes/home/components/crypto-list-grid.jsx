import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

// This is a temporary hack until we have market cap implemented in Blocktap
const topMarketsList = ['BTC','ETH','XRP','BCH','LTC','ADA','NEO','XLM','XMR','EOS','MIOTA','DASH','XEM','TRX','ETC','USDT','VEN','NANO','QTUM','LSK'];

const ALL_CURRENCY_QUERY = gql`
query allCurrencies {
  currencies (filter: {currencySymbol_in: [${topMarketsList.map(p => `"${p}"`)}]}) {
    id
    currencyName
    currentSupply
    currencySymbol
    markets(aggregation:VWAP){
      marketSymbol
      ticker
    }
  }
}
`;

export class CryptoListGridComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { topCurrencies: [] };
  }

  componentWillReceiveProps(nextProps) {
    // TODO - fix the lifecycle events so that marketcap is
    // constructed with the two main scenarios:
    // 1) main page loads, fetches data from the server, and then receives
    //    the info as props
    // 2) other page loads, and the cache has been populated, which means
    //    that we need to construct from the cache
    if (nextProps.data.currencies) {
      let topCurrencies = nextProps.data.currencies;
      this.setState({ topCurrencies });
    }
  }

  asCurrency(value) {
    if (value < 1)
      return '¢'+(value * 100);
    return '$'+(value.toLocaleString());
  }

  calculateMarketCap(currentSupply, lastPrice) {
    return this.asCurrency(currentSupply * lastPrice);
  }

  render() {
    let currencyList = this.state.topCurrencies.map((currency, index) => {
      let hasMarkets = currency.markets.length;
      let market = hasMarkets ? currency.markets.find(market => {
        return market.marketSymbol.endsWith(this.props.quoteSymbol);
      }) : null;
      let lastPrice = hasMarkets && market ? market.ticker[0] : 0;

      return (
        <tr key={currency.id}>
          <td>{index + 1}</td>
          <td>
            <div className="currency-icon">
              <i className={'cc ' + currency.id} />
            </div>
            <span>{currency.currencySymbol}</span><br />
            <span>{currency.currencyName}</span>
          </td>
          <td className="numeral">{currency.currentSupply.toLocaleString()}</td>
          <td className="numeral">{this.calculateMarketCap(currency.currentSupply, lastPrice)}</td>
          <td className="numeral">{this.asCurrency(lastPrice)}</td>{/* Last price */}
        </tr>);
    });

    return (
      <table className="crypto-list-grid">
        <thead>
          <tr className="header">
            <th></th>
            <th>Name</th>
            <th className="numeral">Current Supply</th>
            <th className="numeral">Market Cap</th>
            <th className="numeral">Price</th>
          </tr>
        </thead>
        <tbody>
          {currencyList}
        </tbody>
      </table>);
  }
}

CryptoListGridComponent.propTypes = {
  data: PropTypes.object,
  quoteSymbol: PropTypes.string.isRequired
};

export const CryptoListGrid = graphql(ALL_CURRENCY_QUERY)(CryptoListGridComponent);
