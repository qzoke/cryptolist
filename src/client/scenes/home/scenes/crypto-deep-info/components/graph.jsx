import React from 'react';
import {} from 'reactstrap';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Loading } from '../../../../../components/loading';
import moment from 'moment';

const CANDLES_QUERY = gql`
  query GraphQuery($currencySymbol: String, $start: Int, $end: Int) {
    currency(currencySymbol: $currencySymbol) {
      id
      markets {
        data {
          id
          marketSymbol
          candles(sort: OLD_FIRST, resolution: _15m, start: $start, end: $end) {
            start
            end
            data
          }
        }
      }
    }
  }
`;

export class GraphComponent extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.data.currency) return <Loading />;

    return (
      <div className="currency-info-container graph">
        <div className="volume-market line">Graph</div>
      </div>
    );
  }
}

GraphComponent.propTypes = {
  currencySymbol: PropTypes.string.isRequired,
  data: PropTypes.object,
  quoteSymbol: PropTypes.string.isRequired,
};

const withCandles = graphql(CANDLES_QUERY, {
  options: ({ currencySymbol }) => ({
    variables: {
      currencySymbol,
      start: moment()
        .subtract(1, 'days')
        .utc()
        .unix(),
      end: moment()
        .utc()
        .unix(),
    },
  }),
});

export const Graph = withCandles(GraphComponent);
