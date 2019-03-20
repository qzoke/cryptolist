import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'regraph-request';
import { PeerToPeerScene } from './peer-to-peer-scene';

export const SUPPORTED_ASSETS = ['BTC', 'LTC'];
// const assetMapping = { BTC: 'AssetBtc', LTC: 'AssetLtc' };

const P2P_QUERY = `
query PeerToPeerData($assetSymbol: String!, $skip: Int, $limit: Int, $search: String) {
  asset(assetSymbol: $assetSymbol) {
    ... on AssetBtc {
      block {
        ...block
      }
      searchBlock: block(hash: $search) {
        ...block
      }
    }
  }
}

fragment block on BitcoinBlock {
  height
  hash
  prevHash
  nextHash
  merkleRoot
  version
  difficulty
  sizeBytes
  time
  date
  bits
  nonce
  confirmations
  txCount
  txs(limit: $limit, skip: $skip) {
    txId
    valueIn
    valueOut
    fees
    vin {
      n
      value
      addresses
    }
    vout {
      n
      value
      spent
      addresses
    }
  }
}
  `;

export class PeerToPeerSceneContainerComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      searchQuery: '',
      displayLatestBlock: true,
      expandedTransactions: [],
    };

    SUPPORTED_ASSETS.indexOf(props.currency.assetSymbol) >= 0;
  }

  toggleTransactionExpanded(txId) {
    this.setState(state => {
      const idx = state.expandedTransactions.indexOf(txId);

      if (idx > -1) {
        const { expandedTransactions } = state;
        expandedTransactions.splice(idx, 1);
        return {
          expandedTransactions,
        };
      } else {
        return {
          expandTransaction: state.expandedTransactions.push(txId),
        };
      }
    });
  }

  updateSearchQuery(event) {
    this.setState({ searchQuery: event.target.value });
  }

  runSearch() {
    this.props.getData({ search: this.state.searchQuery }).then(() => {
      this.setState({
        displayLatestBlock: !this.state.searchQuery,
      });
    });
  }

  static getDerivedStateFromProps(props) {
    if (!props.data || !props.data.asset || !props.data.asset.block) {
      return {
        error: 'Could not find asset peer to peer data',
      };
    } else {
      return {
        error: null,
      };
    }
  }

  render() {
    return (
      <PeerToPeerScene
        {...this.props}
        {...this.state}
        runSearch={this.runSearch.bind(this)}
        updateSearchQuery={this.updateSearchQuery.bind(this)}
        toggleTransactionExpanded={this.toggleTransactionExpanded.bind(this)}
      />
    );
  }
}

PeerToPeerSceneContainerComponent.propTypes = {
  data: PropTypes.object,
  getData: PropTypes.func,
  base: PropTypes.string,
  currency: PropTypes.object,
};

export const PeerToPeerSceneContainer = Query(
  PeerToPeerSceneContainerComponent,
  P2P_QUERY,
  ({ currency }) => {
    return {
      assetSymbol: currency.assetSymbol.toUpperCase(),
      limit: 10,
      skip: 0,
      search: '',
    };
  }
);
