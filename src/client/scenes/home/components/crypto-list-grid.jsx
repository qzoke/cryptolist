import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const ALL_CURRENCY_QUERY = gql`
query allCurrencies {
  currencies {
    id
    currencyName
    currentSupply
    currencySymbol
    markets(aggregation:VWAP){
      ticker
    }
  }
}
`;

export class CryptoListGridComponent extends PureComponent {
  constructor() {
    super();
    this.state = { topCurrencies: [] };
    this.topMarketsList = ['BTC','ETH','XRP','BCH','LTC'];
  }

  componentWillReceiveProps(nextProps) {
    // TODO - fix the lifecycle events so that marketcap is
    // constructed with the two main scenarios:
    // 1) main page loads, fetches data from the server, and then receives
    //    the info as props
    // 2) other page loads, and the cache has been populated, which means
    //    that we need to construct from the cache
    if (nextProps.data.currencies) {
      let topCurrencies = nextProps.data.currencies.filter(curr => this.topMarketsList.includes(curr.currencySymbol));
      this.setState({ topCurrencies });
    }
  }

  asCurrency(value) {
    return '$'+(value.toLocaleString());
  }

  calculateMarketCap(currentSupply, lastPrice) {
    return this.asCurrency(currentSupply * lastPrice);
  }

  render() {
    let currencyList = this.state.topCurrencies.map(currency => {
      return (<tr key={currency.id}>
          <td>
            <span>{currency.currencySymbol}</span><br />
            <span>{currency.currencyName}</span>
          </td>
          <td className="numeral">{currency.currentSupply.toLocaleString()}</td>
          <td className="numeral">{this.calculateMarketCap(currency.currentSupply, currency.markets[0].ticker[0])}</td>
          <td className="numeral">{currency.markets[0].ticker[0]}</td>{/* Last price */}
        </tr>);
    });

    return (
    <table className="crypto-list-grid">
      <thead>
        <tr className="header">
          <th >Name</th>
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
  data: PropTypes.object
};

let CryptoListGrid = graphql(ALL_CURRENCY_QUERY)(CryptoListGridComponent);

export  { CryptoListGrid };
