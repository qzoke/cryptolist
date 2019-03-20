import React from 'react';
import PropTypes from 'prop-types';

export const Transaction = ({ fees, txId, valueIn, valueOut }) => {
  return (
    <div className="sub-table">
      <div className="item">
        <div className="label">Fees</div>
        <div className="value">{fees}</div>
      </div>
      <div className="item">
        <div className="label">Transaction ID</div>
        <div className="value hash">{txId}</div>
      </div>
      <div className="item">
        <div className="label">Value In</div>
        <div className="value">{valueIn}</div>
      </div>
      <div className="item">
        <div className="label">Value Out</div>
        <div className="value">{valueOut}</div>
      </div>
    </div>
  );
};

Transaction.propTypes = {
  fees: PropTypes.string,
  txId: PropTypes.string,
  valueIn: PropTypes.string,
  valueOut: PropTypes.string,
  vin: PropTypes.array,
  vout: PropTypes.array,
};
