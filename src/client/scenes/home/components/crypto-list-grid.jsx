import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { marketCapFormat } from './market-cap-formatter';
import { PaginationBar } from './pagination-bar';

const ITEMS_PER_PAGE = 50;

const ALL_CURRENCY_QUERY = gql`
query AllCurrencies ($limit: Int!, $skip: Int!) {
  currencies (sort:{marketcapRank:ASC}, page:{limit:$limit, skip: $skip}) {
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

const BITCOIN_QUERY = gql`
{
  currency(currencySymbol:"BTC") {
    currencyName
    currentSupply
    currencySymbol
    markets(aggregation:VWAP) {
      marketSymbol
      ticker
    }
  }
}
`;

export class CryptoListGridComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.state = { page: 1 };
  }

  nextPage() {
    this.setState({ page: this.state.page + 1 });
    this.props.loadMoreEntries((this.state.page) * ITEMS_PER_PAGE);
  }

  previousPage() {
    var newPage = this.state.page == 1 ? this.state.page : this.state.page - 1;

    this.setState({ page: newPage });
    this.props.loadMoreEntries((newPage - 1) * ITEMS_PER_PAGE);
  }

  render() {
    if (!this.props.currencies || !this.props.bitcoin)
      return null;

    const currencyList = marketCapFormat(this.props.currencies, this.props.bitcoin, this.props.quoteSymbol).map((currency, index) => {
      const percentChangeClass = 'numeral ' + (currency.percentChange >= 0 ? 'positive' : 'negative');
      return (
        <tr key={currency.id}>
          <td>{(index + 1) + ((this.state.page - 1) * ITEMS_PER_PAGE)}</td>
          <td>
            <div className="currency-icon">
              <i className={'cc ' + currency.id} />
            </div>
            <span>{currency.symbol}</span><br />
            <span>{currency.name}</span>
          </td>
          <td className="numeral">{currency.supply.toLocaleString()}</td>
          <td className="numeral">{currency.marketCap}</td>
          <td className="numeral">{currency.volume}</td>
          <td className={percentChangeClass}>{currency.percentChange}</td>
          <td className="numeral">{currency.price}</td>{/* Last price */}
        </tr>);
    });

    return (
      <div>
        <table className="crypto-list-grid">
          <thead>
            <tr className="header">
              <th></th>
              <th>Name</th>
              <th className="numeral">Current Supply</th>
              <th className="numeral">Market Cap</th>
              <th className="numeral">24 Hour Volume</th>
              <th className="numeral">Percent Change</th>
              <th className="numeral">Price</th>
            </tr>
          </thead>
          <tbody>
            {currencyList}
          </tbody>
        </table>
        <PaginationBar
          nextFunction={this.nextPage}
          previousFunction={this.previousPage}
          nextIsDisabled={this.props.currencies < ITEMS_PER_PAGE}
          previousIsDisabled={this.state.page <= 1}
          />
      </div>);
  }
}

CryptoListGridComponent.propTypes = {
  currencies: PropTypes.array,
  bitcoin: PropTypes.object,
  loadMoreEntries: PropTypes.func,
  quoteSymbol: PropTypes.string.isRequired
};

const withBitcoin = graphql(BITCOIN_QUERY,{
  props: ({ data }) => ({
    bitcoin: data && data.currency,
  }),
});
const withCurrencies = graphql(ALL_CURRENCY_QUERY, {
  options: () => ({
    variables: {
      limit: ITEMS_PER_PAGE,
      skip: 0
    },
  }),
  props: ({ data: { currencies, fetchMore } }) => ({
    currencies: currencies,
    loadMoreEntries(skip) {
      return fetchMore({
        variables: {
          skip: skip,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult.currencies) { return previousResult; }
          return Object.assign({}, {
            // Append the new feed results to the old one
            currencies: [...fetchMoreResult.currencies],
          });
        }
      });
    }
  })
});

export const CryptoListGrid = withCurrencies(withBitcoin(CryptoListGridComponent));
