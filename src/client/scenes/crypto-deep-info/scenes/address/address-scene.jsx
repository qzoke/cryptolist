import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Form } from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

export const AddressScene = ({ error, data, search, updateAddress, runSearch }) => {
  let address = data.asset && data.asset.address;

  let runSearchWrapped = e => {
    e.preventDefault();
    runSearch();
  };

  return (
    <div className="peer-to-peer">
      <div className="header">
        <h2>Address</h2>
        <Form onSubmit={runSearchWrapped} className="search">
          <Input type="text" value={search} onChange={updateAddress} placeholder="Address" />
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
                <div className="label">Address</div>
                <div className="value hash">{address.address}</div>
              </div>
              <div className="item">
                <div className="label">Balance</div>
                <div className="value hash">{address.balance}</div>
              </div>
              <div className="item">
                <div className="label">Total Received</div>
                <div className="value hash">{address.totalReceived}</div>
              </div>
              <div className="item">
                <div className="label">Total Sent</div>
                <div className="value hash">{address.totalSent}</div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="table">
              <div className="item">
                <div className="label">Unconfirmed Balance</div>
                <div className="value">{address.unconfirmedBalance}</div>
              </div>
              <div className="item">
                <div className="label">Transaction Count</div>
                <div className="value">{address.txCount}</div>
              </div>
              <div className="item">
                <div className="label">Unconfirmed Transaction Count</div>
                <div className="value">{address.unconfirmedTxCount}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

AddressScene.propTypes = {
  error: PropTypes.string,
  data: PropTypes.object,
  search: PropTypes.string,
  updateAddress: PropTypes.func,
  runSearch: PropTypes.func,
};
