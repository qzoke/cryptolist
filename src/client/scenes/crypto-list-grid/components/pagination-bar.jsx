import React from 'react';
import PropTypes from 'prop-types';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

export const PaginationBar = ({ page, goToPage }) => {
  return (
    <div className="pagination-container">
      <Pagination size="sm">
        <PaginationItem disabled={page === 1}>
          <PaginationLink previous onClick={() => goToPage(page - 1)} />
        </PaginationItem>

        <PaginationItem disabled={false}>
          <PaginationLink next onClick={() => goToPage(page + 1)} />
        </PaginationItem>
      </Pagination>
    </div>
  );
};

PaginationBar.propTypes = {
  page: PropTypes.number.isRequired,
  goToPage: PropTypes.func.isRequired,
};
