import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { marketCapFormat } from './components/market-cap-formatter';
import { PaginationBar } from './components/pagination-bar';
import { Loading } from '../../../../components/loading';
import { CryptoListItem } from './components/crypto-list-item';
import { Search } from './components/search';

export class CryptoListGrid extends PureComponent {
  constructor(props) {
    super(props);
    this.filter = this.filter.bind(this);
    this.page = this.page.bind(this);
    this.state = {
      page: 1,
    };
  }

  filter(filterQuery) {
    this.setState({ page: 1 });
    this.props.filter(filterQuery);
  }

  page(page) {
    this.setState({ page });
    this.props.page((page - 1) * this.props.itemsPerPage);
  }

  render() {
    const currencyList = marketCapFormat(
      this.props.currencies.data,
      this.props.bitcoin,
      this.props.quoteSymbol
    ).map(currency => (
      <CryptoListItem
        key={currency.id}
        currency={currency}
        quoteSymbol={this.props.quoteSymbol}
        onClick={data => this.props.currencySelected(data)}
      />
    ));

    return (
      <div className="crypto-list-grid">
        <Search updateQuery={this.filter} />
        {currencyList}
        <PaginationBar
          totalCount={this.props.currencies.totalCount}
          limit={this.props.itemsPerPage}
          page={this.state.page}
          goToPage={this.page}
        />
      </div>
    );
  }
}

CryptoListGrid.propTypes = {
  currencies: PropTypes.object,
  bitcoin: PropTypes.object,
  quoteSymbol: PropTypes.string.isRequired,
  currencySelected: PropTypes.func,
  itemsPerPage: PropTypes.number,
};
