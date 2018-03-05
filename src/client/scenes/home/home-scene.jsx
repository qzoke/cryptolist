import React from 'react';
import { CryptoListGrid } from './components/crypto-list-grid';
import PropTypes from 'prop-types';

export class HomeScene extends React.PureComponent{
  render() {
    return (
      <div className="container">
        <CryptoListGrid quoteSymbol={this.props.quoteSymbol} />
      </div>);
  }
}

HomeScene.propTypes = {
  quoteSymbol: PropTypes.string.isRequired
};
