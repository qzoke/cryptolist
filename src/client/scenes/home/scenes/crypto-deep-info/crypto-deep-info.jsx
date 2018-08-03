import React from 'react';
import PropTypes from 'prop-types';
import { Switcher } from './components/switcher';
import { Tooltip } from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
const endings = {
  '0': 'th',
  '1': 'st',
  '2': 'nd',
  '3': 'rd',
  '4': 'th',
  '5': 'th',
  '6': 'th',
  '7': 'th',
  '8': 'th',
  '9': 'th',
};

export class CryptoDeepInfo extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      tooltipOpen: false,
    };
  }

  stringifyNumber(number) {
    let numberAsString = '' + number;
    let lastNumber = numberAsString[numberAsString.length - 1];
    let ending = endings[lastNumber];
    return numberAsString + ending;
  }

  toggle() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen,
    });
  }

  render() {
    let currency = this.props.currency;
    let isPositiveChange = Math.sign(currency.percentChange >= 0);

    return (
      <div className="crypto-deep-info">
        <div className="hero row">
          <div className="col-sm-4">
            <h2 className="name">{currency.currencyName}</h2>
            <div className="symbol">({currency.currencySymbol})</div>
          </div>
          <div className="price-container col-sm-4">
            <div className="price">{currency.price}</div>
            <div className={`change ${isPositiveChange ? 'positive' : 'negative'}`}>
              {currency.percentChange}%
            </div>
          </div>
          <div className="market-cap-container col-sm-3">
            <div>{currency.marketCap}</div>
            <div>Market Cap ({this.stringifyNumber(currency.marketCapRank)})</div>
          </div>
          {currency.computedMarket ? (
            <div className="computed-market col-sm-1">
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
        <Switcher {...this.props} currency={currency} />
      </div>
    );
  }
}

CryptoDeepInfo.propTypes = {
  data: PropTypes.object,
  currency: PropTypes.object,
};
