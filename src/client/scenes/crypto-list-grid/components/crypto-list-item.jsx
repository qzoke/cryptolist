import React from 'react';
import PropTypes from 'prop-types';
import { MiniGraph } from './mini-graph';
import { Link } from 'react-router-dom';

export const CryptoListItem = ({ currency, bitcoin, quoteSymbol, location }) => {
  let [, , ...restOfPath] = location.pathname.split('/').filter(x => x);
  return (
    <Link
      key={currency.id}
      className="currency-list-item row"
      to={`/${quoteSymbol}/${currency.symbol.toLowerCase()}/${restOfPath.join('/')}${
        location.search
      }`}
    >
      <div className="currency-icon-rank col-2">
        <div className="currency-icon">
          <i className={'cc ' + currency.symbol.toUpperCase()} />
        </div>
        <div className="currency-rank">{currency.marketCapRank}</div>
      </div>
      <div className="currency-info col-3">
        <div className="name">{currency.name}</div>
        <div className="price">{currency.price.toUpperCase()}</div>
      </div>
      <div className="currency-graph col-3">
        <MiniGraph
          quoteSymbol={quoteSymbol}
          currency={currency}
          bitcoin={bitcoin}
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
  bitcoin: PropTypes.object,
  quoteSymbol: PropTypes.string,
  location: PropTypes.object,
};
