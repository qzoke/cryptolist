import React from 'react';
import {} from 'reactstrap';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Loading } from '../../../../../components/loading';
import { ResponsiveLine } from '@nivo/line';
import moment from 'moment';

// const colors = ['#F87A0B', '#002626', '#0E4749', '#95C623', '#E6FAFC'];
// const colors = ['#222222', '#474747', '#727272', '#939393', '#bababa']; // greyscale
// const colors = ['#EE8434', '#223843', '#A33B20', '#429321', '#EDD382']; // slightly preferred
// const colors = ['#EE8434', '#335C67', '#A33B20', '#EDD382', '#306B34'];

const CANDLES_QUERY = gql`
  query DeepInfoQuery($currencySymbol: String, $start: Int, $end: Int) {
    currency(currencySymbol: $currencySymbol) {
      id
      markets {
        data {
          id
          marketSymbol
          candles(sort: OLD_FIRST, resolution: _1m, start: $start, end: $end) {
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

  findCorrectMarkets(markets) {
    return markets.filter(p => p.marketSymbol.endsWith('USDT'));
  }

  generateDataFromCandles(candles, marketSymbol) {
    console.log(marketSymbol);
    // let thing = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    return {
      id: marketSymbol.split(':')[0],
      data: candles.map((candle, index) => ({
        x: index,
        y: candle[1],
      })),
    };
  }

  render() {
    if (!this.props.data.currency) return <Loading />;

    let markets = this.props.data.currency.markets.data;
    let filteredMarkets = this.findCorrectMarkets(markets);
    console.log(this.props.data.currency);
    let data = filteredMarkets.map(market =>
      this.generateDataFromCandles(market.candles.data, market.marketSymbol)
    );

    console.log(data);

    return (
      <div className="currency-info-container graph">
        <div className="volume-market line">
          <div style={{ height: '21em' }}>
            <ResponsiveLine
              data={data}
              margin={{
                top: 57,
                right: 110,
                bottom: 50,
                left: 60,
              }}
              enableDots={false}
              enableGridX={false}
              minY="auto"
              animate={true}
              motionStiffness={90}
              motionDamping={15}
              legends={[
                {
                  anchor: 'bottom-right',
                  direction: 'column',
                  translateX: 100,
                  itemWidth: 80,
                  itemHeight: 20,
                  symbolSize: 12,
                  symbolShape: 'circle',
                },
              ]}
            />
          </div>
        </div>
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
