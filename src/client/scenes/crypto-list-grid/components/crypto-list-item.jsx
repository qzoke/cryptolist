import React from 'react';
import PropTypes from 'prop-types';
import { MiniGraph } from './mini-graph';
import { Link } from 'react-router-dom';

export const CryptoListItem = ({ currency, secondary, bitcoin, quote, location }) => {
  let [quotes, , ...restOfPath] = location.pathname.split('/').filter(x => x);
  const { id, currencySymbol, marketCapRank, currencyName, price, percentChange } = currency;
  return (
    <Link
      key={id}
      className="currency-list-item row"
      to={`/${quotes}/${currencySymbol.toLowerCase()}/${restOfPath.join('/')}${location.search}`}
    >
      <div className="currency-icon-rank col-2">
        <div className="currency-icon">
          <i className={'cc ' + currencySymbol.toUpperCase()} />
        </div>
        <div className="currency-rank">{marketCapRank}</div>
      </div>
      <div className="currency-info col-6">
        <div className="name">{currencyName}</div>
        <div className="price">{price.toUpperCase()}</div>
        <div className="price">{secondary.price.toUpperCase()}</div>
      </div>
      <div className="currency-graph col-3">
        <MiniGraph
          quoteSymbol={quote.primary}
          currency={currency}
          bitcoin={bitcoin}
          width={80}
          height={30}
          isPositive={percentChange >= 0}
        />
      </div>
    </Link>
  );
};

CryptoListItem.propTypes = {
  currency: PropTypes.object,
  secondary: PropTypes.object,
  bitcoin: PropTypes.object,
  quote: PropTypes.object,
  location: PropTypes.object,
};
