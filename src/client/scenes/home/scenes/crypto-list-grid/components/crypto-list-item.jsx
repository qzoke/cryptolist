import React from 'react';
import PropTypes from 'prop-types';
import { MiniGraph } from './mini-graph';

export const CryptoListItem = ({ currency, quoteSymbol, onClick }) => {
  return (
    <div
      key={currency.id}
      className="currency-list-item"
      onClick={() => {
        onClick(currency.symbol);
      }}
    >
      <div className="currency-icon">
        <span className="currency-icon">
          <i className={'cc ' + currency.symbol.toUpperCase()} />
        </span>
      </div>
      <div className="currency-info">
        <div className="name">{currency.name}</div>
        <div className="price">{currency.price}</div>
      </div>
      <div className="currency-graph">
        <MiniGraph
          currencyId={currency.symbol}
          quote={quoteSymbol}
          width={80}
          height={30}
          isPositive={currency.percentChange >= 0}
        />
      </div>
    </div>
  );
};

CryptoListItem.propTypes = {
  currency: PropTypes.object,
  quoteSymbol: PropTypes.string,
  onClick: PropTypes.func,
};
