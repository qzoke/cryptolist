import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { marketCapFormat } from './market-cap-formatter';

const ALL_CURRENCY_QUERY = gql`
query allCurrencies {
  currencies (sort:{marketcapRank:ASC}, page:{limit:25}) {
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

  render() {
    let currencyList = marketCapFormat(this.state.topCurrencies, this.props.quoteSymbol).map(currency => {
      return (
        <tr key={currency.id}>
          <td>{currency.index + 1}</td>
          <td>
            <div className="currency-icon">
              <i className={'cc ' + currency.id} />
            </div>
            <span>{currency.symbol}</span><br />
            <span>{currency.name}</span>
          </td>
          <td className="numeral">{currency.supply.toLocaleString()}</td>
          <td className="numeral">{currency.marketCap}</td>
          <td className="numeral">{currency.price}</td>{/* Last price */}
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
