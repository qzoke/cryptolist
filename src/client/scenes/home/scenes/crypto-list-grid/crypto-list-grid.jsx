import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { marketCapFormat } from './components/market-cap-formatter';
import { PaginationBar } from './components/pagination-bar';
import { Loading } from '../../../../components/loading';
import { CryptoListItem } from './components/crypto-list-item';
import { Search } from './components/search';

const ITEMS_PER_PAGE = 10;

const ALL_CURRENCY_QUERY = gql`
  query AllCurrencies($sort: [CurrencySorter], $page: Page, $filter: CurrencyFilter) {
    currencies(sort: $sort, page: $page, filter: $filter) {
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
    }
    bitcoin: currency(currencySymbol: "BTC") {
      id
      currencyName
      currentSupply
      currencySymbol
      markets(aggregation: VWAP) {
        data {
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
  }
`;

export class CryptoListGridComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.filter = this.filter.bind(this);
    this.page = this.page.bind(this);
    this.state = {
      page: 1,
    };
  }

  filter(filterQuery) {
    this.setState({ page: 1 });
    this.props.filter(filterQuery);
  }

  page(page) {
    this.setState({ page });
    this.props.page((page - 1) * ITEMS_PER_PAGE);
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
        <Search updateQuery={this.filter} />
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
  filter: PropTypes.func,
  quoteSymbol: PropTypes.string.isRequired,
  currencySelected: PropTypes.func,
};

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
      filter: null,
    },
  }),
  props: ({ data: { currencies, bitcoin, fetchMore, variables } }) => ({
    currencies: currencies,
    bitcoin: bitcoin,
    page(skip) {
      let page = {
        skip: skip,
        limit: ITEMS_PER_PAGE,
      };
      let vars = Object.assign(variables, { page });
      return fetchMore({
        variables: vars,
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
    filter(filter) {
      let page = {
        skip: 0,
        limit: ITEMS_PER_PAGE,
      };
      let vars = Object.assign(variables, { filter, page });
      return fetchMore({
        variables: vars,
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

export const CryptoListGrid = withCurrencies(CryptoListGridComponent);
