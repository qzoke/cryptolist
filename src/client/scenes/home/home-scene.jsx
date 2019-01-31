import React from 'react';
import { CryptoListGrid } from '../crypto-list-grid/crypto-list-grid';
import { CryptoDeepInfo } from '../crypto-deep-info/crypto-deep-info';
import PropTypes from 'prop-types';
import { Loading } from '../../components/loading';
import { marketCapFormat } from '../../components/market-cap-formatter';
import qs from 'qs';
import { Query } from 'regraph-request';
import moment from 'moment';
import { NUMBER_OF_DAYS } from '../crypto-list-grid/components/mini-graph';

const ITEMS_PER_PAGE = 10;
const CURRENCY_QUERY = `
query AllCurrencies($sort: [AssetSorter], $page: Page, $filter: AssetFilter, $selectedCurrency: String!, $start: Int, $end: Int, $resolution: TimeResolution!) {
  assets(sort: $sort, page: $page, filter: $filter) {
    id
    assetName
    currentSupply
    totalSupply
    assetSymbol
    marketCap
    marketCapRank
    markets(aggregation: VWA) {
      id
      marketSymbol
      ohlcv(start: $start, end: $end, resolution: $resolution, sort: OLD_FIRST)
      ticker {
        lastPrice
        percentChange
        lowPrice
        highPrice
        baseVolume
        quoteVolume
      }
    }
  }
  asset(assetSymbol: $selectedCurrency) {
    id
    assetName
    currentSupply
    totalSupply
    assetSymbol
    marketCap
    marketCapRank
    markets(aggregation: VWA) {
      id
      marketSymbol
      ticker {
        lastPrice
        percentChange
        lowPrice
        highPrice
        baseVolume
        quoteVolume
      }
    }
  }
  bitcoin: asset(assetSymbol: "BTC") {
    id
    assetName
    currentSupply
    assetSymbol
    markets(aggregation: VWA) {
      id
      marketSymbol
      ohlcv(start: $start, end: $end, resolution: $resolution, sort: OLD_FIRST)
      ticker {
        lastPrice
        percentChange
        lowPrice
        highPrice
        baseVolume
        quoteVolume
      }
    }
  }
}


`;

export class HomeSceneComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { currency: null, secondary: null };
  }

  static getDerivedStateFromProps(props) {
    if (props.data.asset) {
      let currency = marketCapFormat(props.data.asset, props.data.bitcoin, props.quote.primary);
      let secondary = marketCapFormat(props.data.asset, props.data.bitcoin, props.quote.secondary);

      return {
        currency,
        secondary,
      };
    }
    return null;
  }

  render() {
    if (!this.props.data.assets || !this.props.data.bitcoin || !this.props.data.asset) {
      return <Loading />;
    }

    return (
      <div className="row">
        <div className="col-auto crypto-list-container">
          <CryptoListGrid {...this.props} itemsPerPage={ITEMS_PER_PAGE} />
        </div>
        <div className="col-md-9 crypto-info-container">
          <CryptoDeepInfo
            {...this.props}
            currency={this.state.currency}
            secondary={this.state.secondary}
          />
        </div>
      </div>
    );
  }
}

HomeSceneComponent.propTypes = {
  data: PropTypes.object,
  quote: PropTypes.object,
  base: PropTypes.string,
};

export const HomeScene = Query(HomeSceneComponent, CURRENCY_QUERY, ({ base, location }) => {
  let query = qs.parse(location.search, { ignoreQueryPrefix: true });
  return {
    selectedCurrency: base,
    page: {
      limit: ITEMS_PER_PAGE,
      skip: query.page ? (query.page - 1) * ITEMS_PER_PAGE : 0,
    },
    sort: {
      marketCapRank: 'ASC',
    },
    start: moment()
      .subtract(NUMBER_OF_DAYS, 'day')
      .utc()
      .unix(),
    end: moment()
      .utc()
      .unix(),
    resolution: '_1h',
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
