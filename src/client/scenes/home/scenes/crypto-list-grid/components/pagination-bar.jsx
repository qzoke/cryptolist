import React from 'react';
import PropTypes from 'prop-types';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

export class PaginationBar extends React.PureComponent {
  constructor(params) {
    super(params);
    this.getPageArray = this.getPageArray.bind(this);
  }

  getPageArray(page, totalPages) {
    let pages = [1];
    if (page === 1) {
      pages.push(2, 3);
    } else if (page === totalPages) {
      pages.push(totalPages - 2, totalPages - 1);
    } else {
      if (page - 1 !== 1) pages.push(page - 1);
      pages.push(page);
      if (page + 1 !== totalPages) pages.push(page + 1);
    }
    pages.push(totalPages);
    return pages;
  }

  render() {
    let totalPages = Math.ceil(this.props.totalCount / this.props.limit);
    let pageArray = this.getPageArray(this.props.page, totalPages);
    let pageObjects = pageArray.map(x => (
      <PaginationItem key={x} disabled={this.props.page === x}>
        <PaginationLink onClick={() => this.props.goToPage(x)}>{x}</PaginationLink>
      </PaginationItem>
    ));

    return (
      <div className="pagination-container">
        <Pagination size="sm">
          <PaginationItem disabled={this.props.page === 1}>
            <PaginationLink previous onClick={() => this.props.goToPage(this.props.page - 1)} />
          </PaginationItem>

          {pageObjects}

          <PaginationItem disabled={this.props.page === totalPages}>
            <PaginationLink next onClick={() => this.props.goToPage(this.props.page + 1)} />
          </PaginationItem>
        </Pagination>
      </div>
    );
  }
}

PaginationBar.propTypes = {
  totalCount: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  goToPage: PropTypes.func.isRequired,
};
