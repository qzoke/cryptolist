import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export const Resolutions = [
  { display: '1m', value: '_1m', seconds: 60 },
  { display: '5m', value: '_5m', seconds: 60 * 5 },
  { display: '15m', value: '_15m', seconds: 60 * 15 },
  { display: '30m', value: '_30m', seconds: 60 * 30 },
  { display: '1H', value: '_1h', seconds: 60 * 60 },
  { display: '2H', value: '_2h', seconds: 60 * 60 * 2 },
  { display: '4H', value: '_4h', seconds: 60 * 60 * 4 },
  { display: '1D', value: '_1d', seconds: 60 * 60 * 24 },
];

export class ResolutionGroup extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      open: false,
    };
  }

  toggle() {
    this.setState(prevState => ({
      open: !prevState.open,
    }));
  }
  render() {
    let buttons = Resolutions.map(r => (
      <DropdownItem
        key={r.value}
        active={this.props.resolution.value === r.value}
        onClick={() => this.props.updateResolution(r)}
        size="sm"
      >
        {r.display}
      </DropdownItem>
    ));

    return (
      <Dropdown isOpen={this.state.open} toggle={this.toggle}>
        <DropdownToggle className="btn-sm" caret>
          {this.props.resolution.display}
        </DropdownToggle>
        <DropdownMenu>{buttons}</DropdownMenu>
      </Dropdown>
    );
  }
}

ResolutionGroup.propTypes = {
  updateResolution: PropTypes.func,
  resolution: PropTypes.object,
};
