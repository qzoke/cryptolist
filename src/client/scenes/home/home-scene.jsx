import React from 'react';
import { CryptoListGrid } from './scenes/crypto-list-grid/crypto-list-grid';
import { CryptoDeepInfo } from './scenes/crypto-deep-info/crypto-deep-info';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Loading } from '../../components/loading';
import { marketCapFormat } from '../../components/market-cap-formatter';

const ITEMS_PER_PAGE = Math.trunc((screen.height - 260) / 70);
const CURRENCY_QUERY = gql`
  query AllCurrencies(
    $sort: [CurrencySorter]
    $page: Page
    $filter: CurrencyFilter
    $selectedCurrency: String
  ) {
    currencies(sort: $sort, page: $page, filter: $filter) {
      totalCount
      data {
        id
        currencyName
        currentSupply
        totalSupply
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
    selectedCurrency: currency(currencySymbol: $selectedCurrency) {
      id
      currencyName
      currentSupply
      totalSupply
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

export class HomeSceneComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { currency: null };
  }

  static getDerivedStateFromProps(props) {
    if (props.currency) {
      return {
        currency: marketCapFormat(props.currency, props.bitcoin, props.match.params.quote),
      };
    }
    return null;
  }

  render() {
    if (!this.props.currencies || !this.props.bitcoin || !this.props.currency) {
      return <Loading />;
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-3 crypto-list-container">
            <CryptoListGrid {...this.props} itemsPerPage={ITEMS_PER_PAGE} />
          </div>
          <div className="col-9 crypto-info-container">
            <CryptoDeepInfo {...this.props} currency={this.state.currency} />
          </div>
        </div>
      </div>
    );
  }
}

HomeSceneComponent.propTypes = {
  currencies: PropTypes.object,
  bitcoin: PropTypes.object,
  currency: PropTypes.object,
  match: PropTypes.object,
};

const withCurrency = graphql(CURRENCY_QUERY, {
  options: ({ match }) => {
    return {
      variables: {
        selectedCurrency: match.params.base,
        page: {
          limit: ITEMS_PER_PAGE,
          skip: 0,
        },
        sort: {
          marketCapRank: 'ASC',
        },
        filter: null,
      },
    };
  },
  props: ({ data: { currencies, bitcoin, selectedCurrency, fetchMore, variables } }) => {
    return {
      currencies: currencies,
      bitcoin: bitcoin,
      currency: selectedCurrency,
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
    };
  },
});

export const HomeScene = withCurrency(HomeSceneComponent);
