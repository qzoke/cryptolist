import React, { PureComponent } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const ALL_CURRENCY_QUERY = gql`
query allCurrencies {
  currencies {
    id
    currencyName
    currentSupply
    currencySymbol
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

  render() {
    let currencyList = this.state.topCurrencies.map(currency => {
      return (<div key={currency.id}>
          {currency.currencyName}
        </div>);
    });
    return (<div>
      <div className="header">
      </div>
      <div className="grid">
        {currencyList}
      </div>
      <div className="footer">
      </div>
    </div>);
  }
}

let CryptoListGrid = graphql(ALL_CURRENCY_QUERY)(CryptoListGridComponent);

export  { CryptoListGrid };
