import React from 'react';
import PropTypes from 'prop-types';
import { marketCapFormat } from './components/market-cap-formatter';
import { PaginationBar } from './components/pagination-bar';
import { CryptoListItem } from './components/crypto-list-item';
import { Search } from './components/search';
import qs from 'qs';
import { withRouter } from 'react-router-dom';

export class CryptoListGridComponent extends React.Component {
  constructor(props) {
    super(props);
    this.filter = this.filter.bind(this);
    this.page = this.page.bind(this);
  }

  filter(search) {
    let query = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
    if (search) {
      query.search = search;
      query.page = undefined;
    } else query.search = undefined;
    let formattedQuery = qs.stringify(query);
    this.props.history.push(
      `${this.props.location.pathname}${formattedQuery ? `?${formattedQuery}` : ''}`
    );
  }

  page(page) {
    let query = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
    if (page) query.page = page;
    else query.page = undefined;
    let formattedQuery = qs.stringify(query);
    this.props.history.push(
      `${this.props.location.pathname}${formattedQuery ? `?${formattedQuery}` : ''}`
    );
  }

  render() {
    const query = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
    const currencyList = marketCapFormat(
      this.props.data.currencies.data,
      this.props.data.bitcoin,
      this.props.quote.primary
    ).map(currency => {
      return (
        <CryptoListItem
          key={currency.id}
          currency={currency}
          bitcoin={this.props.data.bitcoin}
          quote={this.props.quote}
          location={this.props.location}
        />
      );
    });

    return (
      <div className="crypto-list-grid">
        <Search updateQuery={this.filter} search={query.search} />
        {currencyList}
        <PaginationBar
          totalCount={this.props.data.currencies.totalCount}
          limit={this.props.itemsPerPage}
          page={parseInt(query.page) || 1}
          goToPage={this.page}
        />
      </div>
    );
  }
}

CryptoListGridComponent.propTypes = {
  data: PropTypes.object,
  itemsPerPage: PropTypes.number,
  filter: PropTypes.func,
  page: PropTypes.func,
  match: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
  quote: PropTypes.object,
};

export const CryptoListGrid = withRouter(CryptoListGridComponent);
