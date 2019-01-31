import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'regraph-request';
import { TradesDataScene } from './trades-data-scene';

const TRADES_QUERY = `
query TradesData ($currencySymbol:String!, $quoteSymbol:String!) {
  asset(assetSymbol: $currencySymbol) {
    markets(
      aggregation: VWA,
      filter:{quoteSymbol:{_eq:$quoteSymbol} },
    ) {
      trades {
        exchange
        tradeId
        unix
        price
        amount
        taker
      }
    }
		marketList:markets(aggregation:VWA) {
      marketSymbol
    }
  }
}
`;

export class TradesDataSceneContainerComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = { message: '' };
  }

  static getDerivedStateFromProps(props) {
    if (!props.currency.quoteSymbol)
      return {
        message:
          'No markets found for either selected quote currency. Please select a different quote currency',
      };
    else return null;
  }

  render() {
    return <TradesDataScene {...this.props} {...this.state} />;
  }
}

TradesDataSceneContainerComponent.propTypes = {
  data: PropTypes.object,
  getData: PropTypes.func,
  currency: PropTypes.object,
  base: PropTypes.string,
  quote: PropTypes.object,
};

export const TradesDataSceneContainer = Query(
  TradesDataSceneContainerComponent,
  TRADES_QUERY,
  ({ base, currency }) => {
    return {
      currencySymbol: base.toUpperCase(),
      quoteSymbol: currency.quoteSymbol,
    };
  }
);
