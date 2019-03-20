import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'regraph-request';
import { BlocksScene } from './blocks-scene';

export const SUPPORTED_ASSETS = ['BTC'];
const TX_LIMIT = 10;

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

export class BlocksSceneContainerComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      searchQuery: '',
      displayLatestBlock: true,
      expandedTransactions: [],
      nextTxPageAvailable: true,
      prevTxPageAvailable: false,
      txPage: 1,
      txTotalPages: 1,
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
    this.props.getData({ skip: 0, search: this.state.searchQuery }).then(() => {
      this.setState({
        txPage: 1,
        displayLatestBlock: !this.state.searchQuery,
        expandedTransactions: [],
      });
    });
  }

  static getTxPageAvailability(asset, page, useLatestBlock) {
    let nextTxPageAvailable,
      prevTxPageAvailable,
      txTotalPages,
      block = useLatestBlock ? asset.block : asset.searchBlock;

    if (!block) return {};

    prevTxPageAvailable = page !== 1;
    nextTxPageAvailable = page * TX_LIMIT < block.txCount;
    txTotalPages = Math.ceil(block.txCount / TX_LIMIT);

    return {
      nextTxPageAvailable,
      prevTxPageAvailable,
      txTotalPages,
    };
  }

  goToPage(pageNumer) {
    return this.props
      .getData({
        skip: pageNumer - 1 * TX_LIMIT,
      })
      .then(() => {
        this.setState({
          txPage: pageNumer,
        });
      });
  }

  nextPage() {
    if (this.state.nextTxPageAvailable) {
      this.goToPage(this.state.txPage + 1);
    }
  }

  prevPage() {
    if (this.state.prevTxPageAvailable) {
      this.goToPage(this.state.txPage - 1);
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (!props.data || !props.data.asset || !props.data.asset.block) {
      return {
        error: 'Could not find asset peer to peer data',
      };
    } else {
      let pagination = BlocksSceneContainerComponent.getTxPageAvailability(
        props.data.asset,
        state.txPage,
        state.displayLatestBlock
      );
      return {
        error: null,
        ...pagination,
      };
    }
  }

  render() {
    return (
      <BlocksScene
        {...this.props}
        {...this.state}
        runSearch={this.runSearch.bind(this)}
        updateSearchQuery={this.updateSearchQuery.bind(this)}
        toggleTransactionExpanded={this.toggleTransactionExpanded.bind(this)}
        nextPage={this.nextPage.bind(this)}
        prevPage={this.prevPage.bind(this)}
      />
    );
  }
}

BlocksSceneContainerComponent.propTypes = {
  data: PropTypes.object,
  getData: PropTypes.func,
  base: PropTypes.string,
  currency: PropTypes.object,
};

export const BlocksSceneContainer = Query(
  BlocksSceneContainerComponent,
  P2P_QUERY,
  ({ currency }) => {
    return {
      assetSymbol: currency.assetSymbol.toUpperCase(),
      limit: TX_LIMIT,
      skip: 0,
      search: '',
    };
  }
);
