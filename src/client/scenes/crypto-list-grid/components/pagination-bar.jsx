import React from 'react';
import PropTypes from 'prop-types';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

export const PaginationBar = ({ totalCount, limit, page, goToPage }) => {
  let getPageArray = (page, total) => {
    let pages = [1];
    if (page === 1) {
      if (total > 2) pages.push(2);
      if (total > 3) pages.push(3);
    } else if (page === total) {
      if (total - 2 > 1) pages.push(total - 2);
      if (total - 1 > 1) pages.push(total - 1);
    } else {
      if (page - 1 !== 1) pages.push(page - 1);
      pages.push(page);
      if (page + 1 !== total) pages.push(page + 1);
    }
    if (total !== 1) pages.push(total);
    return pages;
  };

  let totalPages = Math.ceil(totalCount / limit);
  let pageArray = getPageArray(page, totalPages);
  let pageObjects = pageArray.map(x => (
    <PaginationItem key={x} disabled={page === x}>
      <PaginationLink onClick={() => goToPage(x)}>{x}</PaginationLink>
    </PaginationItem>
  ));

  return (
    <div className="pagination-container">
      <Pagination size="sm">
        <PaginationItem disabled={page === 1}>
          <PaginationLink previous onClick={() => goToPage(page - 1)} />
        </PaginationItem>

        {pageObjects}

        <PaginationItem disabled={page === totalPages}>
          <PaginationLink next onClick={() => goToPage(page + 1)} />
        </PaginationItem>
      </Pagination>
    </div>
  );
};

PaginationBar.propTypes = {
  totalCount: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  goToPage: PropTypes.func.isRequired,
};
