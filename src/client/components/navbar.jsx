import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar, NavItem, NavbarBrand, Collapse, NavbarToggler } from 'reactstrap';
import { QuoteCurrencySwitcher } from './quote-currency-switcher';

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
              <QuoteCurrencySwitcher />
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}
