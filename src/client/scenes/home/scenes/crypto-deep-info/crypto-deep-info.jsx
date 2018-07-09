import React from 'react';
import PropTypes from 'prop-types';
import { Switcher } from './components/switcher';
import { Tooltip } from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

export class CryptoDeepInfo extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      tooltipOpen: false,
    };
  }

  toggle() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen,
    });
  }

  render() {
    let currency = this.props.currency;

    return (
      <div className="crypto-deep-info">
        <div className="hero">
          <h1 className="name">{currency.currencyName}</h1>
          <h3 className="symbol">({currency.currencySymbol})</h3>
          {currency.computedMarket ? (
            <div className="computed-market">
              <FontAwesomeIcon id="calculated" icon="calculator" />
              <Tooltip
                placement="left"
                isOpen={this.state.tooltipOpen}
                target="calculated"
                toggle={this.toggle}
              >
                No native market found for selected currency to quote currency. The values shown are
                interpreted from BTC.
              </Tooltip>
            </div>
          ) : null}
        </div>
        <div className="price-container">
          <span className="price">{currency.price}</span>
          <span
            className={`change ${Math.sign(currency.percentChange < 0) ? 'negative' : 'positive'}`}
          >
            {currency.percentChange}%
          </span>
        </div>
        <Switcher {...this.props} currency={currency} />
      </div>
    );
  }
}

CryptoDeepInfo.propTypes = {
  data: PropTypes.object,
  currency: PropTypes.object,
};
