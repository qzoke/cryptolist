import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { marketCapFormat } from './market-cap-formatter';
import { PaginationBar } from './pagination-bar';
import { GridSortableHeaderItem } from './grid-sortable-header-item';
import { Loading } from '../../../components/loading';
import { Table } from 'reactstrap';
import { MiniGraph } from './mini-graph';

const ITEMS_PER_PAGE = 50;

const ALL_CURRENCY_QUERY = gql`
query AllCurrencies ($sort:[CurrencySorter], $page:Page) {
  currencies (sort:$sort, page:$page) {
    data {
	    id
      currencyName
      currentSupply
      currencySymbol
      marketCap
      marketCapRank
      markets(aggregation:VWAP) {
        data {
          marketSymbol
          ticker {
            last
            percentChange
            dayLow
            dayHigh
            baseVolume
            quoteVolume
          }
        }
      }
    }
  }
}
`;

const BITCOIN_QUERY = gql`
{
  currency(currencySymbol:"BTC") {
    currencyName
    currentSupply
    currencySymbol
    markets(aggregation:VWAP) {
      data {
        marketSymbol
        ticker {
          last
          percentChange
          dayLow
          dayHigh
          baseVolume
          quoteVolume
        }
      }
    }
  }
}
`;

export class CryptoListGridComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.sort = this.sort.bind(this);
    this.state = { page: 1, sortProp: 'marketCapRank', sortDirectionAsc: true };
  }

  nextPage() {
    this.setState({ page: this.state.page + 1 });
    this.props.page((this.state.page) * ITEMS_PER_PAGE);
  }

  previousPage() {
    var newPage = this.state.page == 1 ? this.state.page : this.state.page - 1;

    this.setState({ page: newPage });
    this.props.page((newPage - 1) * ITEMS_PER_PAGE);
  }

  sort(sortProp) {
    var sortAsc = sortProp != this.state.sortProp ? this.state.sortDirectionAsc : !this.state.sortDirectionAsc;
    this.setState({ sortProp, sortDirectionAsc: sortAsc });

    this.props.sort(sortProp, sortAsc ? 'ASC' : 'DESC');
  }

  render() {
    // Wait until props come back from Apollo
    if (!this.props.currencies || !this.props.bitcoin)
      return <Loading />;

    const currencyList = marketCapFormat(this.props.currencies, this.props.bitcoin, this.props.quoteSymbol).map(currency => {
      const percentChangeClass = 'numeral ' + (currency.percentChange >= 0 ? 'positive' : 'negative');
      return (
        <tr key={currency.id}>
          <td>{currency.marketCapRank}</td>
          <td>
            <div className="currency-icon">
              <i className={'cc ' + currency.id} />
            </div>
            <span>{currency.symbol}</span><br />
            <span>{currency.name}</span>
          </td>
          <td className="numeral">{currency.supply.toLocaleString()}</td>
          <td className="numeral">{currency.marketCap}</td>
          <td className="numeral">{currency.volume}</td>
          <td className={percentChangeClass}>{currency.percentChange}%</td>
          <td className="numeral">{currency.price}</td>{/* Last price */}
          <td><MiniGraph currencyId={currency.symbol} quote={this.props.quoteSymbol} width={120} height={50} /></td>
        </tr>);
    });

    const headerTypes = [
      {name: '#', sortName: 'marketCapRank'},
      {name: 'Name', sortName: 'currencyName'},
      {name: 'Current Supply', sortName: null, numeral: true},
      {name: 'Market Cap', sortName: 'marketcap', numeral: true},
      {name: '24 Hour Volume', sortName: null, numeral: true},
      {name: '% Change', sortName: null, numeral: true},
      {name: 'Price', sortName: null, numeral: true},
      {name: '3 Day Graph', numeral: true}
    ];

    const headers = headerTypes.map(header => {
      return <GridSortableHeaderItem
                key={header.name}
                name={header.name}
                sortName={header.sortName}
                isSorted={this.state.sortProp == header.sortName}
                sort={this.sort}
                numeral={header.numeral}
                sortDir={this.state.sortDirectionAsc ? 'down' : 'up'} />;
    });

    return (
      <div>
        <Table responsive className="crypto-list-grid">
          <thead>
            <tr className="header">
              {headers}
            </tr>
          </thead>
          <tbody>
            {currencyList}
          </tbody>
        </Table>
        <PaginationBar
          nextFunction={this.nextPage}
          previousFunction={this.previousPage}
          nextIsDisabled={this.props.currencies < ITEMS_PER_PAGE}
          previousIsDisabled={this.state.page <= 1}
          />
      </div>);
  }
}

CryptoListGridComponent.propTypes = {
  currencies: PropTypes.array,
  bitcoin: PropTypes.object,
  page: PropTypes.func,
  sort: PropTypes.func,
  quoteSymbol: PropTypes.string.isRequired
};

const withBitcoin = graphql(BITCOIN_QUERY, {
  props: ({ data }) => ({
    bitcoin: data && data.currency,
  })
});

const withCurrencies = graphql(ALL_CURRENCY_QUERY, {
  options: () => ({
    variables: {
      page: {
        limit: ITEMS_PER_PAGE,
        skip: 0
      },
      sort: {
        marketCapRank: 'ASC'
      }
    },
  }),
  props: ({ data: { currencies, fetchMore } }) =>  ({
    currencies: currencies && currencies.data,
    page(skip) {
      return fetchMore({
        variables: {
          page: {
            skip: skip,
            limit: ITEMS_PER_PAGE
          },
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult.currencies) { return previousResult; }
          return {
            currencies: fetchMoreResult.currencies,
          };
        }
      });
    },
    sort(property, direction) {
      var sort = {};
      sort[property] = direction;
      return fetchMore({
        variables: { sort: sort },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult.currencies) { return previousResult; }
          return {
            currencies: fetchMoreResult.currencies
          };
        }
      });
    }
  })
});

export const CryptoListGrid = withCurrencies(withBitcoin(CryptoListGridComponent));
