import React from 'react';
import PropTypes from 'prop-types';
import { MiniGraph } from './mini-graph';
import { Link } from 'react-router-dom';

export const CryptoListItem = ({ currency, quoteSymbol }) => {
  return (
    <Link
      key={currency.id}
      className="currency-list-item"
      to={`/${quoteSymbol}/${currency.symbol}/info`}
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
    </Link>
  );
};

CryptoListItem.propTypes = {
  currency: PropTypes.object,
  quoteSymbol: PropTypes.string,
};
