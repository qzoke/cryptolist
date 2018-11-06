import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export class IndicatorGroup extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.addIndicator = this.addIndicator.bind(this);

    this.state = {
      open: false,
    };
  }

  toggle() {
    this.setState(prevState => ({
      open: !prevState.open,
    }));
  }

  addIndicator(name) {
    this.props.addIndicator(name);
  }

  render() {
    let buttons = this.props.allIndicators.map(r => (
      <DropdownItem key={r} size="sm" onClick={() => this.addIndicator(r)}>
        {r}
      </DropdownItem>
    ));

    return (
      <div>
        <Dropdown isOpen={this.state.open} toggle={this.toggle}>
          <DropdownToggle className="btn-sm" caret>
            Indicators
          </DropdownToggle>
          <DropdownMenu>{buttons}</DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}

IndicatorGroup.propTypes = {
  addIndicator: PropTypes.func,
  allIndicators: PropTypes.array,
};
