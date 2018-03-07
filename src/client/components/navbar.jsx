import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Nav, Navbar, NavItem, NavbarBrand, Collapse, NavbarToggler } from 'reactstrap';
import { QuoteCurrencySwitcher } from './quote-currency-switcher';

export class AppNav extends React.Component {
  constructor(props){
    super(props);
    this.changeQuoteSymbol = props.changeQuoteSymbol;
  }
  state = {
    isOpen: false,
    currentQuoteSymbol: this.props.currentQuoteSymbol
  };

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    return (
      <Navbar className="main-navbar" light expand="md">
        <NavbarBrand tag={Link} to="/">
          <img src="/public/img/cryptolist.png" alt="Cryptolist" />
        </NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse navbar isOpen={this.state.isOpen}>
          <Nav className="ml-auto" navbar>
            <NavItem><QuoteCurrencySwitcher currentQuoteSymbol={this.props.currentQuoteSymbol} changeQuoteSymbol={this.changeQuoteSymbol} /></NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

AppNav.propTypes = {
  changeQuoteSymbol: PropTypes.func.isRequired,
  currentQuoteSymbol: PropTypes.string.isRequired
};
