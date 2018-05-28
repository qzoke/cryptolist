import React from 'react';
import PropTypes from 'prop-types';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

export class PaginationBar extends React.PureComponent {
  render() {
    return (
      <div className="pagination-container">
        <Pagination>
          <PaginationItem disabled={this.props.previousIsDisabled} >
            <PaginationLink previous onClick={this.props.previousFunction} />
          </PaginationItem>

          <PaginationItem disabled={this.props.nextIsDisabled} >
            <PaginationLink next onClick={this.props.nextFunction} />
          </PaginationItem>
        </Pagination>
      </div>
    );
  }
}

PaginationBar.propTypes = {
  previousFunction: PropTypes.func.isRequired,
  nextFunction: PropTypes.func.isRequired,
  nextIsDisabled: PropTypes.bool,
  previousIsDisabled: PropTypes.bool,
};
