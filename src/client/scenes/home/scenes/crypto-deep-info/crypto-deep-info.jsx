import React from 'react';
import { Loading } from '../../../../components/loading';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Graph } from './components/graph';

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
  }
`;

export class CryptoDeepInfoComponent extends React.PureComponent {
  render() {
    if (!this.props.data.currency) return <Loading />;
    let currency = this.props.data.currency;
    return (
      <div>
        <h1>{currency.currencyName}</h1>
        <Graph
          currencyId={currency.currencySymbol}
          quote={this.props.quoteSymbol}
          width={650}
          height={250}
          isPositive={true}
        />
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
