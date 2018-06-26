import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { marketCapFormat } from './components/market-cap-formatter';
import { PaginationBar } from './components/pagination-bar';
import { Loading } from '../../../../components/loading';
import { CryptoListItem } from './components/crypto-list-item';

const ITEMS_PER_PAGE = 10;

const ALL_CURRENCY_QUERY = gql`
  query AllCurrencies($sort: [CurrencySorter], $page: Page) {
    currencies(sort: $sort, page: $page) {
      totalCount
      data {
        id
        currencyName
        currentSupply
        currencySymbol
        marketCap
        marketCapRank
        markets(aggregation: VWAP) {
          data {
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
    }
  }
`;

const BITCOIN_QUERY = gql`
  {
    currency(currencySymbol: "BTC") {
      currencyName
      currentSupply
      currencySymbol
      markets(aggregation: VWAP) {
        data {
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
  }
`;

export class CryptoListGridComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.page = this.page.bind(this);
    this.sort = this.sort.bind(this);
    this.state = { page: 1, sortProp: 'marketCapRank', sortDirectionAsc: true };
  }

  page(page) {
    this.setState({ page });
    this.props.page((page - 1) * ITEMS_PER_PAGE);
  }

  sort(sortProp) {
    var sortAsc =
      sortProp != this.state.sortProp ? this.state.sortDirectionAsc : !this.state.sortDirectionAsc;
    this.setState({ sortProp, sortDirectionAsc: sortAsc });

    this.props.sort(sortProp, sortAsc ? 'ASC' : 'DESC');
  }

  render() {
    // Wait until props come back from Apollo
    if (!this.props.currencies || !this.props.currencies.data || !this.props.bitcoin)
      return <Loading showText={false} />;

    const currencyList = marketCapFormat(
      this.props.currencies.data,
      this.props.bitcoin,
      this.props.quoteSymbol
    ).map(currency => (
      <CryptoListItem
        key={currency.id}
        currency={currency}
        quoteSymbol={this.props.quoteSymbol}
        onClick={data => {
          this.props.currencySelected(data);
        }}
      />
    ));

    return (
      <div className="crypto-list-grid">
        {currencyList}
        <PaginationBar
          totalCount={this.props.currencies.totalCount}
          limit={ITEMS_PER_PAGE}
          page={this.state.page}
          goToPage={this.page}
        />
      </div>
    );
  }
}

CryptoListGridComponent.propTypes = {
  currencies: PropTypes.object,
  bitcoin: PropTypes.object,
  page: PropTypes.func,
  sort: PropTypes.func,
  quoteSymbol: PropTypes.string.isRequired,
  currencySelected: PropTypes.func,
};

const withBitcoin = graphql(BITCOIN_QUERY, {
  props: ({ data }) => ({
    bitcoin: data && data.currency,
  }),
});

const withCurrencies = graphql(ALL_CURRENCY_QUERY, {
  options: () => ({
    variables: {
      page: {
        limit: ITEMS_PER_PAGE,
        skip: 0,
      },
      sort: {
        marketCapRank: 'ASC',
      },
    },
  }),
  props: ({ data: { currencies, fetchMore } }) => ({
    currencies: currencies,
    page(skip) {
      return fetchMore({
        variables: {
          page: {
            skip: skip,
            limit: ITEMS_PER_PAGE,
          },
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult.currencies) {
            return previousResult;
          }
          return {
            currencies: fetchMoreResult.currencies,
          };
        },
      });
    },
    sort(property, direction) {
      var sort = {};
      sort[property] = direction;
      return fetchMore({
        variables: { sort: sort },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult.currencies) {
            return previousResult;
          }
          return {
            currencies: fetchMoreResult.currencies,
          };
        },
      });
    },
  }),
});

export const CryptoListGrid = withCurrencies(withBitcoin(CryptoListGridComponent));
