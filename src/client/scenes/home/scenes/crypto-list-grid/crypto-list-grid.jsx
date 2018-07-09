import React from 'react';
import PropTypes from 'prop-types';
import { marketCapFormat } from './components/market-cap-formatter';
import { PaginationBar } from './components/pagination-bar';
import { CryptoListItem } from './components/crypto-list-item';
import { Search } from './components/search';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';

export class CryptoListGridComponent extends React.Component {
  constructor(props) {
    super(props);
    this.filter = this.filter.bind(this);
    this.page = this.page.bind(this);
  }

  filter(search) {
    let query = queryString.parse(this.props.location.search);
    if (search) {
      query.search = search;
      query.page = undefined;
    } else query.search = undefined;

    let formattedQuery = queryString.stringify(query);
    this.props.history.push(
      `${this.props.location.pathname}${formattedQuery ? `?${formattedQuery}` : ''}`
    );
  }

  page(page) {
    let query = queryString.parse(this.props.location.search);
    if (page) query.page = page;
    else query.page = undefined;

    let formattedQuery = queryString.stringify(query);
    this.props.history.push(
      `${this.props.location.pathname}${formattedQuery ? `?${formattedQuery}` : ''}`
    );
  }

  render() {
    const qs = queryString.parse(this.props.location.search);
    const currencyList = marketCapFormat(
      this.props.currencies.data,
      this.props.bitcoin,
      this.props.match.params.quote
    ).map(currency => (
      <CryptoListItem
        key={currency.id}
        currency={currency}
        quoteSymbol={this.props.match.params.quote}
        location={this.props.location}
      />
    ));

    return (
      <div className="crypto-list-grid">
        <Search updateQuery={this.filter} search={qs.search} />
        {currencyList}
        <PaginationBar
          totalCount={this.props.currencies.totalCount}
          limit={this.props.itemsPerPage}
          page={parseInt(qs.page) || 1}
          goToPage={this.page}
        />
      </div>
    );
  }
}

CryptoListGridComponent.propTypes = {
  currencies: PropTypes.object,
  bitcoin: PropTypes.object,
  itemsPerPage: PropTypes.number,
  filter: PropTypes.func,
  page: PropTypes.func,
  match: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
};

export const CryptoListGrid = withRouter(CryptoListGridComponent);
