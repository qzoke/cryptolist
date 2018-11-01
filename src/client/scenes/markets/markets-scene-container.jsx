import React from 'react';
import {} from 'reactstrap';
import PropTypes from 'prop-types';
import { Query } from 'regraph-request';
import { MarketsScene } from './markets-scene';

const MARKET_QUERY = `
  query MarketQuery($currencySymbol: String!) {
    currency(currencySymbol: $currencySymbol) {
      id
      markets {
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
`;

export class MarketsSceneContainerComponent extends React.Component {
  render() {
    return <MarketsScene {...this.props} />;
  }
}

MarketsSceneContainerComponent.propTypes = {
  data: PropTypes.object,
};

export const MarketsSceneContainer = Query(
  MarketsSceneContainerComponent,
  MARKET_QUERY,
  ({ currency }) => ({
    currencySymbol: currency.currencySymbol,
  })
);
