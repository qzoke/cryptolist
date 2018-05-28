import React from 'react';
import { Loading } from '../../../../components/loading';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { CurrencyBasicInfo } from './components/currency-basic-info';
import gql from 'graphql-tag';
import { marketCapFormat } from '../../../../components/market-cap-formatter';

const CURRENCY_QUERY = gql`
  query DeepInfoQuery($currencySymbol: String) {
    currency(currencySymbol: $currencySymbol) {
      id
      currencyName
      currentSupply
      currencySymbol
      totalSupply
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
      markets(aggregation: VWAP) {
        data {
          id
          marketSymbol
          ticker {
            last
            percentChange
          }
        }
      }
    }
  }
`;

export class CryptoDeepInfoComponent extends React.PureComponent {
  render() {
    if (!this.props.data.currency) return <Loading />;

    let bitcoin = this.props.data.bitcoin;
    let currency = marketCapFormat(this.props.data.currency, bitcoin, this.props.quoteSymbol);

    return (
      <div className="crypto-deep-info">
        <div className="hero">
          <h1 className="name">{currency.currencyName}</h1>
          <h3 className="symbol">({currency.currencySymbol})</h3>
        </div>
        <div className="price-container">
          <span className="price">{currency.price}</span>
          <span
            className={`change ${Math.sign(currency.percentChange < 0) ? 'negative' : 'positive'}`}
          >
            {currency.percentChange}%
          </span>
        </div>
        <CurrencyBasicInfo currency={currency} />
      </div>
    );
  }
}

CryptoDeepInfoComponent.propTypes = {
  currencyTicker: PropTypes.string,
  data: PropTypes.object,
  quoteSymbol: PropTypes.string.isRequired,
};

const withCurrency = graphql(CURRENCY_QUERY, {
  options: ({ currencyTicker }) => ({
    variables: {
      currencySymbol: currencyTicker,
    },
  }),
});

export const CryptoDeepInfo = withCurrency(CryptoDeepInfoComponent);
