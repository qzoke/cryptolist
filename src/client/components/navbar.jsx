import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar, NavItem, NavbarBrand, Collapse, NavbarToggler } from 'reactstrap';
import { QuoteCurrencySwitcher } from './quote-currency-switcher';
import PropTypes from 'prop-types';

export class AppNav extends React.Component {
  state = {
    isOpen: false,
  };

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    return (
      <Navbar className="main-navbar" light expand="md">
        <NavbarBrand tag={Link} onClick={() => location.reload()} to="/">
          <img src="/public/img/cryptolist.png" alt="Cryptolist" />
        </NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse navbar isOpen={this.state.isOpen}>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <QuoteCurrencySwitcher
                quoteSymbol={this.props.quoteSymbol}
                onClick={this.props.onQuoteChange}
              />
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

AppNav.propTypes = {
  onQuoteChange: PropTypes.func,
  quoteSymbol: PropTypes.string,
};
