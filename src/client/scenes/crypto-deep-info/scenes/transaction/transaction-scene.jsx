import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Form } from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import moment from 'moment';

export const TransactionScene = ({ error, data, search, updateTransaction, runSearch }) => {
  let tx = data.asset && data.asset.tx;

  let runSearchWrapped = e => {
    e.preventDefault();
    runSearch();
  };

  return (
    <div className="peer-to-peer">
      <div className="header">
        <h2>Transaction</h2>
        <Form onSubmit={runSearchWrapped} className="search">
          <Input
            type="text"
            value={search}
            onChange={updateTransaction}
            placeholder="Transaction ID"
          />
          <Button size="sm" onClick={runSearchWrapped}>
            <FontAwesomeIcon icon="search" />
          </Button>
        </Form>
      </div>
      {error}
      {!error && (
        <div className="row">
          <div className="col-md-6">
            <div className="table">
              <div className="item">
                <div className="label">Hash</div>
                <div className="value hash">{tx.hash}</div>
              </div>
              <div className="item">
                <div className="label">Block Hash</div>
                <div className="value hash">{tx.blockhash}</div>
              </div>
              <div className="item">
                <div className="label">Value In</div>
                <div className="value">{tx.valueIn}</div>
              </div>
              <div className="item">
                <div className="label">Value Out</div>
                <div className="value">{tx.valueOut}</div>
              </div>
              <div className="item">
                <div className="label">Fees</div>
                <div className="value">{tx.fees}</div>
              </div>
              <div className="item">
                <div className="label">Version</div>
                <div className="value">{tx.version}</div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="table">
              <div className="item">
                <div className="label">Size (Bytes)</div>
                <div className="value">{tx.sizeBytes}</div>
              </div>
              <div className="item">
                <div className="label">Virtual Size (Bytes)</div>
                <div className="value">{tx.vsizeBytes}</div>
              </div>
              <div className="item">
                <div className="label">Weight</div>
                <div className="value">{tx.weight}</div>
              </div>
              <div className="item">
                <div className="label">Lock Time</div>
                <div className="value">{tx.locktime}</div>
              </div>
              <div className="item">
                <div className="label">Confirmations</div>
                <div className="value">{tx.confirmations}</div>
              </div>
              <div className="item">
                <div className="label">Block Time</div>
                <div className="value">{moment(tx.blocktime).format('LLLL')}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

TransactionScene.propTypes = {
  error: PropTypes.string,
  data: PropTypes.object,
  search: PropTypes.string,
  updateTransaction: PropTypes.func,
  runSearch: PropTypes.func,
};
