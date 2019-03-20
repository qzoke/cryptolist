import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { Input, Button, Form } from 'reactstrap';
import { BlockInfo } from './components/block-info';
import { TransactionsInfo } from './components/transactions-info';

export const BlocksScene = ({
  error,
  data,
  toggleTransactionExpanded,
  expandedTransactions,
  searchQuery,
  updateSearchQuery,
  runSearch,
  displayLatestBlock,
  txPage,
  txTotalPages,
  nextTxPageAvailable,
  prevTxPageAvailable,
  nextPage,
  prevPage,
}) => {
  if (error) return <div>{error}</div>;

  let block = displayLatestBlock ? data.asset.block : data.asset.searchBlock;

  const runSearchWrapped = e => {
    e.preventDefault();
    runSearch();
  };

  return (
    <div className="peer-to-peer">
      <div className="header">
        <h2>
          {block && (
            <span>
              {displayLatestBlock && 'Latest'} Block (#{block.height})
            </span>
          )}
        </h2>
        <Form onSubmit={runSearchWrapped} className="search">
          <Input
            type="text"
            value={searchQuery}
            onChange={updateSearchQuery}
            placeholder="Height or block hash"
          />
          <Button size="sm" onClick={runSearchWrapped}>
            <FontAwesomeIcon icon="search" />
          </Button>
        </Form>
      </div>
      {!block && <div>Unable to find block</div>}
      {block && (
        <React.Fragment>
          <BlockInfo block={block} />
          <TransactionsInfo
            block={block}
            expandedTransactions={expandedTransactions}
            toggleTransactionExpanded={toggleTransactionExpanded}
            nextTxPageAvailable={nextTxPageAvailable}
            prevTxPageAvailable={prevTxPageAvailable}
            nextPage={nextPage}
            prevPage={prevPage}
            page={txPage}
            totalPages={txTotalPages}
          />
        </React.Fragment>
      )}
    </div>
  );
};

BlocksScene.propTypes = {
  error: PropTypes.string,
  data: PropTypes.object,
  toggleTransactionExpanded: PropTypes.func,
  expandedTransactions: PropTypes.array,
  searchQuery: PropTypes.string,
  updateSearchQuery: PropTypes.func,
  runSearch: PropTypes.func,
  displayLatestBlock: PropTypes.bool,
  prevTxPageAvailable: PropTypes.bool,
  nextTxPageAvailable: PropTypes.bool,
  nextPage: PropTypes.func,
  prevPage: PropTypes.func,
  txPage: PropTypes.number,
  txTotalPages: PropTypes.number,
};
