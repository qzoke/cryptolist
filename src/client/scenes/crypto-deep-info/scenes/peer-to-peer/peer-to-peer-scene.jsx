import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Pagination, PaginationItem, PaginationLink, Input, Button, Form } from 'reactstrap';
import { Transaction } from './components/transaction';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

export const PeerToPeerScene = ({
  error,
  data,
  toggleTransactionExpanded,
  expandedTransactions,
  searchQuery,
  updateSearchQuery,
  runSearch,
  displayLatestBlock,
}) => {
  if (error) return <div>{error}</div>;

  let block = displayLatestBlock ? data.asset.block : data.asset.searchBlock;

  const toggleTransactionExpandedWrapped = (e, id) => {
    e.preventDefault();
    toggleTransactionExpanded(id);
  };

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
          <div className="block-info">
            <div className="row">
              <div className="col-md-6">
                <div className="table">
                  <div className="item">
                    <div className="label">Date</div>
                    <div className="value">{moment(block.date).format('LLLL')}</div>
                  </div>
                  <div className="item">
                    <div className="label">Time</div>
                    <div className="value">{block.time}</div>
                  </div>
                  <div className="item">
                    <div className="label">Height</div>
                    <div className="value">{block.height}</div>
                  </div>
                  <div className="item">
                    <div className="label">Difficulty</div>
                    <div className="value">{block.difficulty}</div>
                  </div>
                  <div className="item">
                    <div className="label">Version</div>
                    <div className="value">{block.version}</div>
                  </div>
                  <div className="item">
                    <div className="label">Size Bytes</div>
                    <div className="value">{block.sizeBytes}</div>
                  </div>
                  <div className="item">
                    <div className="label">Bits</div>
                    <div className="value">{block.bits}</div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="table">
                  <div className="item">
                    <div className="label">Nonce</div>
                    <div className="value">{block.nonce}</div>
                  </div>
                  <div className="item">
                    <div className="label">Confirmations</div>
                    <div className="value">{block.confirmations}</div>
                  </div>
                  <div className="item">
                    <div className="label">Hash</div>
                    <div className="value hash">{block.hash}</div>
                  </div>
                  <div className="item">
                    <div className="label">Previous</div>
                    <div className="value hash">{block.prevHash}</div>
                  </div>
                  <div className="item">
                    <div className="label">Next</div>
                    <div className="value hash">{block.nextHash || 'None'}</div>
                  </div>
                  <div className="item">
                    <div className="label">Merkle Root</div>
                    <div className="value hash">{block.merkleRoot}</div>
                  </div>
                  <div className="item">
                    <div className="label">Transaction Count</div>
                    <div className="value">{block.txCount}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                  <PaginationItem>
                    <PaginationLink previous />
                  </PaginationItem>
                  <PaginationItem disabled>
                    <PaginationLink>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink next />
                  </PaginationItem>
                </Pagination>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

PeerToPeerScene.propTypes = {
  error: PropTypes.string,
  data: PropTypes.object,
  toggleTransactionExpanded: PropTypes.func,
  expandedTransactions: PropTypes.array,
  searchQuery: PropTypes.string,
  updateSearchQuery: PropTypes.func,
  runSearch: PropTypes.func,
  displayLatestBlock: PropTypes.bool,
};
