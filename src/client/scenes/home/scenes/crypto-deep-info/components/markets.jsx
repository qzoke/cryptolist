import React from 'react';
import {} from 'reactstrap';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Loading } from '../../../../../components/loading';
import { ResponsivePie } from '@nivo/pie';
import { MarketComparisonGraph } from './market-comparison-graph';

// const colors = ['#F87A0B', '#002626', '#0E4749', '#95C623', '#E6FAFC'];
// const colors = ['#222222', '#474747', '#727272', '#939393', '#bababa']; // greyscale
// const colors = ['#EE8434', '#223843', '#A33B20', '#429321', '#EDD382']; // slightly preferred
const colors = ['#EE8434', '#335C67', '#A33B20', '#EDD382', '#306B34'];

const MARKET_QUERY = gql`
  query DeepInfoQuery($currencySymbol: String) {
    currency(currencySymbol: $currencySymbol) {
      id
      markets {
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
  }
`;

export class MarketsComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getExchangeVolume = this.getExchangeVolume.bind(this);
    this.getQuoteVolume = this.getQuoteVolume.bind(this);
  }

  getExchangeVolume(markets) {
    return markets.reduce((aggregator, market) => {
      const exchange = market.marketSymbol.split(':')[0];
      aggregator[exchange] = aggregator[exchange] || 0 + market.ticker.baseVolume;
      return aggregator;
    }, []);
  }

  getQuoteVolume(markets) {
    return markets.reduce((aggregator, market) => {
      const quote = market.marketSymbol.split('/')[1];
      aggregator[quote] = aggregator[quote] || 0 + market.ticker.baseVolume;
      return aggregator;
    }, []);
  }

  render() {
    if (!this.props.data.currency) return <Loading />;

    let exchangeVolumeObjects = this.getExchangeVolume(this.props.data.currency.markets.data);
    let quoteVolumeObjects = this.getQuoteVolume(this.props.data.currency.markets.data);

    let exchangeVolumes = Object.entries(exchangeVolumeObjects).map(volume => {
      return {
        id: volume[0],
        value: volume[1],
        label: `${volume[0]}: ${volume[1].toLocaleString()} ${this.props.currencySymbol}`,
      };
    });

    let quoteVolumes = Object.entries(quoteVolumeObjects).map(volume => {
      return {
        id: volume[0],
        value: volume[1],
        label: `${volume[0]}: ${volume[1].toLocaleString()} ${this.props.currencySymbol}`,
      };
    });

    return (
      <div className="currency-info-container markets">
        <div className="volume-market pie">
          <h4>Volume / Exchange</h4>
          <div style={{ height: '21em' }}>
            <ResponsivePie
              data={exchangeVolumes}
              margin={{
                top: 19,
                right: 0,
                bottom: 80,
                left: 0,
              }}
              innerRadius={0.5}
              padAngle={1}
              colors={colors}
              colorBy="id"
              borderWidth={1}
              borderColor="inherit:darker(0.2)"
              radialLabelsTextXOffset={6}
              radialLabelsTextColor="#333333"
              radialLabelsLinkOffset={0}
              radialLabelsLinkDiagonalLength={16}
              radialLabelsLinkHorizontalLength={24}
              radialLabelsLinkStrokeWidth={1}
              radialLabelsLinkColor="inherit"
              enableSlicesLabels={false}
              animate={true}
              motionStiffness={90}
              motionDamping={15}
              tooltip={function(e) {
                return <span>{e.label}</span>;
              }}
              theme={{
                tooltip: {
                  container: {
                    fontSize: '13px',
                  },
                },
                labels: {
                  textColor: '#555',
                },
              }}
            />
          </div>
        </div>

        <div className="volume-market pie">
          <h4>Volume / Quote</h4>
          <div style={{ height: '21em' }}>
            <ResponsivePie
              data={quoteVolumes}
              margin={{
                top: 19,
                right: 0,
                bottom: 80,
                left: 0,
              }}
              innerRadius={0.5}
              padAngle={1}
              colors={colors}
              colorBy="id"
              borderWidth={1}
              borderColor="inherit:darker(0.2)"
              radialLabelsTextXOffset={6}
              radialLabelsTextColor="#333333"
              radialLabelsLinkOffset={0}
              radialLabelsLinkDiagonalLength={16}
              radialLabelsLinkHorizontalLength={24}
              radialLabelsLinkStrokeWidth={1}
              radialLabelsLinkColor="inherit"
              enableSlicesLabels={false}
              animate={true}
              motionStiffness={90}
              motionDamping={15}
              tooltip={function(e) {
                return <span>{e.label}</span>;
              }}
              theme={{
                tooltip: {
                  container: {
                    fontSize: '13px',
                  },
                },
                labels: {
                  textColor: '#555',
                },
              }}
            />
          </div>
        </div>
        <MarketComparisonGraph
          currencySymbol={this.props.currencySymbol}
          quoteSymbol={this.props.quoteSymbol}
        />
      </div>
    );
  }
}

MarketsComponent.propTypes = {
  currencySymbol: PropTypes.string.isRequired,
  data: PropTypes.object,
  quoteSymbol: PropTypes.string.isRequired,
};

const withMarkets = graphql(MARKET_QUERY, {
  options: ({ currencySymbol }) => ({
    variables: {
      currencySymbol,
    },
  }),
});

export const Markets = withMarkets(MarketsComponent);
