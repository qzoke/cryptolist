import React from 'react';
import { CryptoListGrid } from './scenes/crypto-list-grid/crypto-list-grid';
import { CryptoDeepInfo } from './scenes/crypto-deep-info/crypto-deep-info';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Loading } from '../../components/loading';
import { marketCapFormat } from '../../components/market-cap-formatter';

const ITEMS_PER_PAGE = 10;
const CURRENCY_QUERY = gql`
  query AllCurrencies($sort: [CurrencySorter], $page: Page, $filter: CurrencyFilter) {
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

export class HomeSceneComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.currencySelected = this.currencySelected.bind(this);

    this.state = { selectedCurrencySymbol: 'BTC', currency: null };
  }

  static getSelectedCurrency(symbol, list) {
    return list.find(curr => curr.currencySymbol === symbol);
  }

  currencySelected(currency) {
    // Ignore if they clicked the same currency that's selected
    if (currency === this.state.selectedCurrencySymbol) return;

    this.setState({
      selectedCurrencySymbol: currency,
      currency: marketCapFormat(
        this.constructor.getSelectedCurrency(currency, this.props.currencies.data),
        this.props.bitcoin,
        this.props.quoteSymbol
      ),
    });
  }

  static getDerivedStateFromProps(props, state) {
    // This applies to the initial load state only
    if (props.currencies && !state.currency) {
      let currency = HomeSceneComponent.getSelectedCurrency(
        state.selectedCurrencySymbol,
        props.currencies.data
      );
      return {
        currency: marketCapFormat(currency, props.bitcoin, props.quoteSymbol),
      };
    }
    return null;
  }

  render() {
    if (!this.props.currencies || !this.props.bitcoin) {
      return <Loading />;
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-3 crypto-list-container">
            <CryptoListGrid
              {...this.props}
              itemsPerPage={ITEMS_PER_PAGE}
              currencySelected={this.currencySelected}
            />
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
  quoteSymbol: PropTypes.string.isRequired,
  currencies: PropTypes.object,
  bitcoin: PropTypes.object,
};

const withCurrency = graphql(CURRENCY_QUERY, {
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
  props: ({ data: { currencies, bitcoin, fetchMore, variables } }) => {
    return {
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
    };
  },
});

export const HomeScene = withCurrency(HomeSceneComponent);
