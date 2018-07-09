import React from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const quotes = ['USD', 'USDT', 'EUR', 'GBP', 'BTC'];

export class QuoteCurrencySwitcher extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
    };
  }

  toggle() {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  }

  render() {
    let [quote, base, ...destination] = window.location.pathname.split('/').filter(s => s.length);
    const inputs = quotes.map(x => {
      const isDisabled = x === quote;
      return (
        <DropdownItem key={x} disabled={isDisabled}>
          <Link to={`/${x}/${base}/${destination.join('/')}`}>{x}</Link>
        </DropdownItem>
      );
    });
    return (
      <ButtonDropdown
        className="currency-switcher"
        isOpen={this.state.dropdownOpen}
        toggle={this.toggle}
      >
        <DropdownToggle color="" caret>
          {this.props.currentQuoteSymbol}
        </DropdownToggle>
        <DropdownMenu>{inputs}</DropdownMenu>
      </ButtonDropdown>
    );
  }
}

QuoteCurrencySwitcher.propTypes = {
  currentQuoteSymbol: PropTypes.string.isRequired,
  changeQuoteSymbol: PropTypes.func.isRequired,
};
