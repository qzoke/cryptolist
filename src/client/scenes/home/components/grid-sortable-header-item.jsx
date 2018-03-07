import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

export class GridSortableHeaderItem extends React.PureComponent {
  render() {
    const headerClassName = this.props.numeral ? 'numeral' : '';
    const isSortable = !!this.props.sortName;
    const clickHandler = () => isSortable ? this.props.sort(this.props.sortName) : null;
    const iconClassName = `sort-amount-${this.props.sortDir}`;
    const icon = this.props.isSorted ? <FontAwesomeIcon icon={iconClassName}/> : null;
    const link =  <a href="#" onClick={clickHandler}>
                    <span className="name">{this.props.name}</span>
                    {icon}
                  </a>;
    return (
      <th className={headerClassName}>
        {isSortable ? link : this.props.name}
      </th>
    );
  }
}

GridSortableHeaderItem.propTypes = {
  name: PropTypes.string.isRequired,
  sortName: PropTypes.string,
  isSorted: PropTypes.bool.isRequired,
  sort: PropTypes.func.isRequired,
  numeral: PropTypes.bool,
  sortDir: PropTypes.string.isRequired,
};
