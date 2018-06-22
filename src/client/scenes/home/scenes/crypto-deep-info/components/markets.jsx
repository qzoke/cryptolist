import React from 'react';
import {} from 'reactstrap';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Loading } from '../../../../../components/loading';
import { ResponsivePie } from '@nivo/pie';

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
  getExchangeVolume(markets) {
    return markets.reduce((aggregator, market) => {
      const exchange = market.marketSymbol.split(':')[0];
      aggregator[exchange] = aggregator[exchange] || 0 + market.ticker.baseVolume;
      return aggregator;
    }, []);
  }

  render() {
    if (!this.props.data.currency) return <Loading />;
    let volumeObjects = this.getExchangeVolume(this.props.data.currency.markets.data);
    let volumes = Object.entries(volumeObjects).map(volume => {
      return {
        id: volume[0],
        value: volume[1],
        label: `${volume[0]}: ${volume[1].toLocaleString()}`,
      };
    });

    return (
      <div className="currency-info-container" style={{ position: 'relative' }}>
        <h2>Volume / Market</h2>
        <div style={{ width: '30em', height: '21em' }}>
          <ResponsivePie
            data={volumes}
            margin={{
              top: 19,
              right: 0,
              bottom: 80,
              left: 0,
            }}
            innerRadius={0.5}
            padAngle={1}
            colors="nivo"
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
    );
  }
}

MarketsComponent.propTypes = {
  currencySymbol: PropTypes.string.isRequired,
  data: PropTypes.object,
};

const withMarkets = graphql(MARKET_QUERY, {
  options: ({ currencySymbol }) => ({
    variables: {
      currencySymbol,
    },
  }),
});

export const Markets = withMarkets(MarketsComponent);
