import React from 'react';
import PropTypes from 'prop-types';

export const BasicInfo = props => {
  let currency = props.currency;
  return (
    <div className="currency-info-container basic-info">
      <div className="row">
        <h5 className="col">Supply</h5>
      </div>
      <div className="row values">
        <div className="col">Circulating</div>
        <div className="col value">{currency.currentSupply.toLocaleString()}</div>
        <div className="col" />
        <div className="col">Remaining</div>
        <div className="col value">
          {(currency.totalSupply - currency.currentSupply).toLocaleString()}
        </div>
      </div>
      <div className="row values">
        <div className="col">Total</div>
        <div className="col value">{currency.totalSupply.toLocaleString()}</div>
        <div className="col" />
        <div className="col">Remaining %</div>
        <div className="col value">
          {((1 - currency.currentSupply / currency.totalSupply) * 100).toFixed(2)}%
        </div>
      </div>
    </div>
  );
};

BasicInfo.propTypes = {
  currency: PropTypes.object,
};
