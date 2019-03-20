import React from 'react';
import PropTypes from 'prop-types';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { Transaction } from './transaction';

export const TransactionsInfo = ({
  block,
  expandedTransactions,
  toggleTransactionExpanded,
  nextTxPageAvailable,
  prevTxPageAvailable,
  nextPage,
  prevPage,
  page,
  totalPages,
}) => {
  const toggleTransactionExpandedWrapped = (e, id) => {
    e.preventDefault();
    toggleTransactionExpanded(id);
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="transactions">
          <div>
            <h3>Transactions</h3>
          </div>
          <div className="expandable-table">
            {block.txs.map(t => {
              const isExpanded = expandedTransactions.indexOf(t.txId) > -1;
              return (
                <div className={`item ${isExpanded ? 'expanded' : ''}`} key={t.txId}>
                  <a href="#" onClick={e => toggleTransactionExpandedWrapped(e, t.txId)}>
                    {t.txId}
                  </a>
                  {isExpanded && <Transaction {...t} />}
                </div>
              );
            })}
          </div>
          <Pagination>
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
