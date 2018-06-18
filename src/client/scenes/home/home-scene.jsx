import React from 'react';
import { CryptoListGrid } from './scenes/crypto-list-grid/crypto-list-grid';
import { CryptoDeepInfo } from './scenes/crypto-deep-info/crypto-deep-info';
import PropTypes from 'prop-types';

export class HomeScene extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currency: 'BTC',
    };
  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-3 crypto-list-container">
            <CryptoListGrid
              quoteSymbol={this.props.quoteSymbol}
              currencySelected={data => this.setState({ currency: data })}
            />
          </div>
          <div className="col-9 crypto-info-container">
            <CryptoDeepInfo
              currencyTicker={this.state.currency}
              quoteSymbol={this.props.quoteSymbol}
            />
          </div>
        </div>
      </div>
    );
  }
}

HomeScene.propTypes = {
  quoteSymbol: PropTypes.string.isRequired,
};
