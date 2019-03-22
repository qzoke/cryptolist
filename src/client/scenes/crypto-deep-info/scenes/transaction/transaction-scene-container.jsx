import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'regraph-request';
import { TransactionScene } from './transaction-scene';
import qs from 'qs';

export const SUPPORTED_ASSETS = ['BTC'];

const P2P_QUERY = `
query PeerToPeerData($assetSymbol: String! $txId:String!) {
  asset(assetSymbol: $assetSymbol) {
    ... on AssetBtc {
      tx(txId: $txId) {
        txId
        hash
        valueIn
        valueOut
        fees
        version
        sizeBytes
        vsizeBytes
        weight
        locktime
        blockhash
        confirmations
        blocktime
        blocktimeDate
        hex
        vin {
          n
          value
          coinbase
          txId
          vout
          sequence
          scriptSigAsm
          scriptSigHex
          addresses
          witness
        }
        vout {
          n
          value
          spent
          type
          scriptPubKeyAsm
          scriptPubKeyHex
          reqSigs
          addresses

        }
      }
    }
  }
}

`;

export class TransactionsSceneContainerComponent extends React.Component {
  constructor(props) {
    super(props);

    let query = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
    let search = query.transaction;

    this.state = {
      error: '',
      search,
    };
  }

  updateTransaction(event) {
    this.setState({ search: event.target.value });
  }

  runSearch() {
    let query = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
    query.transaction = this.state.search || undefined;
    this.props.history.push(`${this.props.location.pathname}?${qs.stringify(query)}`);
  }

  static getDerivedStateFromProps(props) {
    if (!props.data || !props.data.asset || !props.data.asset.tx) {
      return {
        error: 'Please enter a valid txId',
      };
    } else {
      return {
        error: null,
      };
    }
  }

  render() {
    return (
      <TransactionScene
        {...this.props}
        {...this.state}
        updateTransaction={this.updateTransaction.bind(this)}
        runSearch={this.runSearch.bind(this)}
      />
    );
  }
}

TransactionsSceneContainerComponent.propTypes = {
  data: PropTypes.object,
  getData: PropTypes.func,
  history: PropTypes.object,
  location: PropTypes.object,
};

export const TransactionSceneContainer = Query(
  TransactionsSceneContainerComponent,
  P2P_QUERY,
  ({ currency, location }) => {
    let query = qs.parse(location.search, { ignoreQueryPrefix: true });
    return {
      assetSymbol: currency.assetSymbol.toUpperCase(),
      txId: query.transaction,
    };
  }
);
