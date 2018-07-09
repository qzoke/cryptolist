import React from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import PropTypes from 'prop-types';

const quotes = ['USD', 'USDT', 'EUR', 'GBP', 'BTC'];

export class QuoteCurrencySwitcher extends React.PureComponent {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.changeQuoteSymbol = props.changeQuoteSymbol;
    this.state = {
      dropdownOpen: false,
    };
  }

  toggle() {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  }

  render() {
    const inputs = quotes.map(x => {
      const isDisabled = x === this.state.currentQuoteSymbol;
      return (
        <DropdownItem key={x} onClick={() => this.changeQuoteSymbol(x)} disabled={isDisabled}>
          <a>{x}</a>
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
