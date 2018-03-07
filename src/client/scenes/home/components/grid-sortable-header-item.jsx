import React from 'react';
import PropTypes from 'prop-types';

export class GridSortableHeaderItem extends React.PureComponent {
  render() {
    var className = this.props.numeral ? 'numeral' : '';
    return (
      <th className={className}>
        {this.props.sortName ?
        <a href="#"
          onClick={() => this.props.sortName ? this.props.sort(this.props.sortName) : null }
          className={this.props.selectedSortName == this.props.sortName ? 'selected' : ''}>
          {this.props.name}
        </a>
        :
        this.props.name
        }
      </th>
    );
  }
}

GridSortableHeaderItem.propTypes = {
  name: PropTypes.string.isRequired,
  sortName: PropTypes.string,
  selectedSortName: PropTypes.string.isRequired,
  sort: PropTypes.func.isRequired,
  numeral: PropTypes.bool
};
