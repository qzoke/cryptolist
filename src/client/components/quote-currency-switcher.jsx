import React from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import PropTypes from 'prop-types';

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
    let quote = this.props.quoteSymbol;
    if (!quote) quote = 'usd';

    const inputs = quotes.map(x => {
      const isDisabled = x === quote;
      return (
        <DropdownItem
          className="dropdown-item"
          key={x}
          disabled={isDisabled}
          onClick={() => this.props.onClick(x.toLowerCase())}
        >
          {x}
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
          {quote.toUpperCase()}
        </DropdownToggle>
        <DropdownMenu>{inputs}</DropdownMenu>
      </ButtonDropdown>
    );
  }
}

QuoteCurrencySwitcher.propTypes = {
  quoteSymbol: PropTypes.string,
  onClick: PropTypes.func,
};
