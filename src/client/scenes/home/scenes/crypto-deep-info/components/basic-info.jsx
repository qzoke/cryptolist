import React from 'react';
import PropTypes from 'prop-types';

export const BasicInfo = ({ currency, bitcoin, quoteSymbol }) => {
  return (
    <div className="currency-info-container basic-info">
      <div className="row headers">
        <div className="col">Market Cap Rank</div>
        <div className="col">Market Cap</div>
      </div>
      <div className="row values">
        <div className="col">{currency.marketCapRank}</div>
        <div className="col">{currency.marketCap}</div>
      </div>
      <div className="row supply headers">
        <div className="col">Total Supply</div>
        <div className="col">Current Supply</div>
        <div className="col">Remaining Supply</div>
        <div className="col">Percent remaining</div>
      </div>
      <div className="row supply values">
        <div className="col">{currency.totalSupply}</div>
        <div className="col">{currency.currentSupply}</div>
        <div className="col">{currency.totalSupply - currency.currentSupply}</div>
        <div className="col">
          {((1 - currency.currentSupply / currency.totalSupply) * 100).toFixed(2)}%
        </div>
      </div>
    </div>
  );
};

BasicInfo.propTypes = {
  currency: PropTypes.object,
};
