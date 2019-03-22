import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'regraph-request';
import { AddressScene } from './address-scene';
import qs from 'qs';

export const SUPPORTED_ASSETS = ['BTC'];

const P2P_QUERY = `
query Address($assetSymbol: String! $address: String!) {
  asset(assetSymbol: $assetSymbol) {
    ... on AssetBtc {
      address (address:$address) {
        address
        balance
        totalReceived
        totalSent
        unconfirmedBalance
        unconfirmedTxCount
        txCount
        txIds
      }
    }
  }
}
`;

export class AddressSceneContainerComponent extends React.Component {
  constructor(props) {
    super(props);

    let query = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
    let search = query.address;

    this.state = {
      error: '',
      search,
    };
  }

  updateAddress(event) {
    this.setState({ search: event.target.value });
  }

  runSearch() {
    let query = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
    query.address = this.state.search || undefined;
    this.props.history.push(`${this.props.location.pathname}?${qs.stringify(query)}`);
  }

  static getDerivedStateFromProps(props) {
    if (!props.data || !props.data.asset || !props.data.asset.address) {
      return {
        error: 'Please enter a valid address',
      };
    } else {
      return {
        error: null,
      };
    }
  }

  render() {
    return (
      <AddressScene
        {...this.props}
        {...this.state}
        updateAddress={this.updateAddress.bind(this)}
        runSearch={this.runSearch.bind(this)}
      />
    );
  }
}

AddressSceneContainerComponent.propTypes = {
  data: PropTypes.object,
  getData: PropTypes.func,
  history: PropTypes.object,
  location: PropTypes.object,
};

export const AddressSceneContainer = Query(
  AddressSceneContainerComponent,
  P2P_QUERY,
  ({ currency, location }) => {
    let query = qs.parse(location.search, { ignoreQueryPrefix: true });
    return {
      assetSymbol: currency.assetSymbol.toUpperCase(),
      address: query.address,
    };
  }
);
