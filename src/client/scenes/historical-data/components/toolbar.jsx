import React from 'react';
import PropTypes from 'prop-types';
import { ResolutionGroup } from '../../crypto-deep-info/components/resolution-group';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export class Toolbar extends React.Component {
  static propTypes = {
    resolution: PropTypes.object,
    updateResolution: PropTypes.func,
    exchanges: PropTypes.array,
    selectedExchange: PropTypes.string,
    updateExchange: PropTypes.func,
  };

  state = {
    exchangesOpen: false,
  };

  toggleDisplayExchanges() {
    this.setState(state => ({ exchangesOpen: !state.exchangesOpen }));
  }

  getExchangesDropdownItems(exchangesList) {
    const exchanges = exchangesList.map(exchange => {
      const name = exchange.marketSymbol.split(':')[0];
      return (
        <DropdownItem
          key={name}
          value={name}
          active={this.props.selectedExchange === name}
          onClick={this.props.updateExchange}
          size="sm"
        >
          {name}
        </DropdownItem>
      );
    });
    exchanges.unshift(
      <DropdownItem
        key="VWA"
        value="VWA"
        active={this.props.selectedExchange === name}
        onClick={this.props.updateExchange}
        size="sm"
      >
        VWA
      </DropdownItem>
    );

    return exchanges;
  }

  render() {
    const exchanges = this.getExchangesDropdownItems(this.props.exchanges);

    return (
      <div className="controls row">
        <div className="control">
          <ResolutionGroup
            updateResolution={this.props.updateResolution}
            resolution={this.props.resolution}
          />
        </div>
        <div className="control">
          <Dropdown
            isOpen={this.state.exchangesOpen}
            onChange={this.props.updateExchange}
            toggle={this.toggleDisplayExchanges.bind(this)}
          >
            <DropdownToggle className="btn-sm" caret>
              {this.props.selectedExchange}
            </DropdownToggle>
            <DropdownMenu>{exchanges}</DropdownMenu>
          </Dropdown>
        </div>
      </div>
    );
  }
}
