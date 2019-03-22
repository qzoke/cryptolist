import React from 'react';
import PropTypes from 'prop-types';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { getNewPath } from '../../../../../library/path-tools';

const getTxPath = txId => {
  return getNewPath(window.location.pathname, '/*/*/transaction', {
    transaction: txId || undefined,
  });
};

export const TransactionsInfo = ({
  block,
  nextTxPageAvailable,
  prevTxPageAvailable,
  nextPage,
  prevPage,
  page,
  totalPages,
}) => {
  return (
    <div className="row">
      <div className="col-md-12">
        <div className="transactions">
          <div className="header">
            <h3>Transactions</h3>
            <Pagination size="sm">
              <PaginationItem disabled={!prevTxPageAvailable}>
                <PaginationLink previous onClick={prevPage} />
              </PaginationItem>
              <PaginationItem disabled>
                <PaginationLink>
                  {page}/{totalPages}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem disabled={!nextTxPageAvailable}>
                <PaginationLink next onClick={nextPage} />
              </PaginationItem>
            </Pagination>
          </div>
          <div className="expandable-table">
            {block.txs.map(t => (
              <div className="item" key={t.txId}>
                <Link to={getTxPath(t.txId)}>{t.txId}</Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

TransactionsInfo.propTypes = {
  block: PropTypes.object,
  expandedTransactions: PropTypes.array,
  toggleTransactionExpanded: PropTypes.func,
  nextTxPageAvailable: PropTypes.bool,
  prevTxPageAvailable: PropTypes.bool,
  nextPage: PropTypes.func,
  prevPage: PropTypes.func,
  page: PropTypes.number,
  totalPages: PropTypes.number,
};
