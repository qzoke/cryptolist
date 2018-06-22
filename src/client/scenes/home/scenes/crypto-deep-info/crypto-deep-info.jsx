import React from 'react';
import { Loading } from '../../../../components/loading';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { Switcher } from './components/switcher';
import gql from 'graphql-tag';
import { marketCapFormat } from '../../../../components/market-cap-formatter';
import { Tooltip } from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

const CURRENCY_QUERY = gql`
  query DeepInfoQuery($currencySymbol: String) {
    currency(currencySymbol: $currencySymbol) {
      id
      currencyName
      currentSupply
      currencySymbol
      totalSupply
      marketCap
      marketCapRank
      markets(aggregation: VWAP) {
        data {
          id
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
    bitcoin: currency(currencySymbol: "BTC") {
      id
      currencyName
      markets(aggregation: VWAP) {
        data {
          id
          marketSymbol
          ticker {
            last
            percentChange
          }
        }
      }
    }
  }
`;

export class CryptoDeepInfoComponent extends React.PureComponent {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      tooltipOpen: false,
    };
  }

  toggle() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen,
    });
  }

  render() {
    if (!this.props.data.currency) return <Loading />;

    let bitcoin = this.props.data.bitcoin;
    let currency = marketCapFormat(this.props.data.currency, bitcoin, this.props.quoteSymbol);

    return (
      <div className="crypto-deep-info">
        <div className="hero">
          <h1 className="name">{currency.currencyName}</h1>
          <h3 className="symbol">({currency.currencySymbol})</h3>
          {currency.computedMarket ? (
            <div className="computed-market">
              <FontAwesomeIcon id="calculated" icon="calculator" />
              <Tooltip
                placement="left"
                isOpen={this.state.tooltipOpen}
                target="calculated"
                toggle={this.toggle}
              >
                No native market found for selected currency to quote currency. The values shown are
                interpreted from BTC.
              </Tooltip>
            </div>
          ) : null}
        </div>
        <div className="price-container">
          <span className="price">{currency.price}</span>
          <span
            className={`change ${Math.sign(currency.percentChange < 0) ? 'negative' : 'positive'}`}
          >
            {currency.percentChange}%
          </span>
        </div>
        <Switcher currency={currency} quoteSymbol={this.props.quoteSymbol} />
      </div>
    );
  }
}

CryptoDeepInfoComponent.propTypes = {
  currencyTicker: PropTypes.string,
  data: PropTypes.object,
  quoteSymbol: PropTypes.string.isRequired,
};

const withCurrency = graphql(CURRENCY_QUERY, {
  options: ({ currencyTicker }) => ({
    variables: {
      currencySymbol: currencyTicker,
    },
  }),
});

export const CryptoDeepInfo = withCurrency(CryptoDeepInfoComponent);
