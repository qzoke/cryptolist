import React from 'react';
import { CryptoListGrid } from '../crypto-list-grid/crypto-list-grid';
import { CryptoDeepInfo } from '../crypto-deep-info/crypto-deep-info';
import PropTypes from 'prop-types';
import { Loading } from '../../components/loading';
import { marketCapFormat } from '../../components/market-cap-formatter';
import qs from 'qs';
import { Query } from 'regraph-request';

const ITEMS_PER_PAGE = Math.trunc((screen.height - 260) / 70);
const CURRENCY_QUERY = `
  query AllCurrencies(
    $sort: [CurrencySorter]
    $page: Page
    $filter: CurrencyFilter
    $selectedCurrency: String!
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
    currency(currencySymbol: $selectedCurrency) {
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
    if (props.data.currency) {
      return {
        currency: marketCapFormat(
          props.data.currency,
          props.data.bitcoin,
          props.match.params.quote
        ),
      };
    }
    return null;
  }

  render() {
    if (!this.props.data.currencies || !this.props.data.bitcoin || !this.props.data.currency) {
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
  data: PropTypes.object,
  match: PropTypes.object,
};

export const HomeScene = Query(HomeSceneComponent, CURRENCY_QUERY, ({ match, location }) => {
  let query = qs.parse(location.search, { ignoreQueryPrefix: true });
  return {
    selectedCurrency: match.params.base,
    page: {
      limit: ITEMS_PER_PAGE,
      skip: query.page ? (query.page - 1) * ITEMS_PER_PAGE : 0,
    },
    sort: {
      marketCapRank: 'ASC',
    },
    filter: (() => {
      if (query.search) {
        return {
          _or: [
            {
              currencySymbol_like: `%${query.search}%`,
            },
            {
              currencyName_like: `%${query.search}%`,
            },
          ],
        };
      }
      return null;
    })(),
  };
});
