import React from 'react';
import { BasicInfo } from './basic-info';
import { Markets } from './markets';
import { Graph } from './graph';
import { Nav, NavItem, NavLink } from 'reactstrap';
import PropTypes from 'prop-types';

export class Switcher extends React.PureComponent {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.getContents = this.getContents.bind(this);
    this.state = {
      selectedTab: 'info',
    };
  }

  toggle(selectedTab) {
    this.setState({ selectedTab });
  }

  getContents() {
    switch (this.state.selectedTab) {
      case 'info':
        return <BasicInfo currency={this.props.currency} />;
      case 'markets':
        return <Markets currencySymbol={this.props.currency.currencySymbol} />;
      case 'graph':
        return <Graph currency={this.props.currency} />;
      default:
        return <div />;
    }
  }

  render() {
    return (
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              active={this.state.selectedTab === 'info' ? true : false}
              href="#"
              onClick={() => this.toggle('info')}
            >
              Info
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={this.state.selectedTab === 'graph' ? true : false}
              href="#"
              onClick={() => this.toggle('graph')}
            >
              Graph
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={this.state.selectedTab === 'markets' ? true : false}
              href="#"
              onClick={() => this.toggle('markets')}
            >
              Markets
            </NavLink>
          </NavItem>
        </Nav>
        {this.getContents()}
      </div>
    );
  }
}

Switcher.propTypes = {
  currency: PropTypes.object,
};
