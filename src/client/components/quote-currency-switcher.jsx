import React from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, NavItem, DropdownItem } from 'reactstrap';
import PropTypes from 'prop-types';

const quoteOptions = ['USD', 'USDT', 'EUR', 'GBP', 'BTC'];

export class QuoteCurrencySwitcher extends React.Component {
  constructor(props) {
    super(props);
    this.togglePrimary = this.togglePrimary.bind(this);
    this.toggleSecondary = this.toggleSecondary.bind(this);

    this.state = {
      primaryOpen: false,
      secondaryOpen: false,
    };
  }

  togglePrimary() {
    this.setState(state => ({ primaryOpen: !state.primaryOpen }));
  }

  toggleSecondary() {
    this.setState(state => ({ secondaryOpen: !state.secondaryOpen }));
  }

  changeQuoteSymbol(which) {
    return value => {
      let x = {};
      x[which] = value;
      this.props.updateCurrencies(x);
    };
  }

  render() {
    const inputs = (quote, onClick) =>
      quoteOptions.map(quoteOption => {
        const isDisabled = quoteOption === quote;
        return (
          <DropdownItem
            className="dropdown-item"
            key={quoteOption}
            disabled={isDisabled}
            onClick={() => onClick(quoteOption.toLowerCase())}
          >
            {quoteOption}
          </DropdownItem>
        );
      });

    return (
      <React.Fragment>
        <NavItem>
          {this.props.quote.primary && (
            <ButtonDropdown
              className="currency-switcher"
              isOpen={this.state.primaryOpen}
              toggle={this.togglePrimary}
            >
              <DropdownToggle color="" caret>
                {this.props.quote.primary.toUpperCase()}
              </DropdownToggle>
              <DropdownMenu>
                {inputs(this.props.quote.primary, this.changeQuoteSymbol('primary'))}
              </DropdownMenu>
            </ButtonDropdown>
          )}
        </NavItem>
        <NavItem>
          {this.props.quote.secondary && (
            <ButtonDropdown
              className="currency-switcher"
              isOpen={this.state.secondaryOpen}
              toggle={this.toggleSecondary}
            >
              <DropdownToggle color="" caret>
                {this.props.quote.secondary.toUpperCase()}
              </DropdownToggle>
              <DropdownMenu>
                {inputs(this.props.quote.secondary, this.changeQuoteSymbol('secondary'))}
              </DropdownMenu>
            </ButtonDropdown>
          )}
        </NavItem>
      </React.Fragment>
    );
  }
}

QuoteCurrencySwitcher.propTypes = {
  quote: PropTypes.object,
  updateCurrencies: PropTypes.func,
};
