import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  ComposedChart,
  Legend,
  Line,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
const colors = ['#90BADB', '#C595D0', '#FEA334', '#5ECF96', '#FF62EA', '#69FFE9', '#69FFE9'];
const GREEN_DARK = '#74A321';
const GREEN = '#74A32180';
const RED = '#FF777780';

export class LineChart extends React.Component {
  constructor(props) {
    super(props);
    this.toggleChart = this.toggleChart.bind(this);
    this.highlightExchange = this.highlightExchange.bind(this);
    this.unhighlightExchange = this.unhighlightExchange.bind(this);

    this.state = {
      charts: {
        volume: true,
        VWA: true,
      },
      selectedExchange: '',
    };
  }

  toggleChart(selected) {
    let key = selected.dataKey.trim();
    let enabledCharts = this.state.charts;
    enabledCharts[key] = !enabledCharts[key];
    this.setState({ charts: enabledCharts, selectedExchange: key });
  }

  highlightExchange(selectedExchange) {
    this.setState({ selectedExchange });
  }

  unhighlightExchange() {
    this.setState({ selectedExchange: '' });
  }

  render() {
    let currency = this.props.currency;
    let vwaMarket = currency.vwa[0];
    let otherMarkets = currency.markets;
    let hasMarkets = !!otherMarkets.length;

    let data = vwaMarket.timeseries.map((candle, idx) => {
      let marketVals = hasMarkets
        ? otherMarkets.reduce((reducer, market) => {
            reducer[market.marketSymbol.split(':')[0]] = market.timeseries[idx]
              ? market.timeseries[idx].open
              : null;
            return reducer;
          }, {})
        : {};
      let vwa = {
        name: `${moment(candle.startUnix * 1000).format('H:m MMM DD')}`,
        timestamp: candle.startUnix,
        VWA: candle.open,
        volume: candle.volume,
      };
      return Object.assign({}, vwa, marketVals);
    });

    let exchangeNames = otherMarkets.map(market => market.marketSymbol.split(':')[0]);
    let marketList = exchangeNames.map((name, i) => (
      <Line
        type="linear"
        yAxisId="VWA"
        dataKey={this.state.charts[name] ? name : `${name} `}
        stroke={colors[i % colors.length]}
        animationDuration={500}
        dot={false}
        activeDot={false}
        key={name}
        strokeWidth={this.state.selectedExchange === name ? 3 : 1}
      />
    ));
    var lastPrice = 0;

    // Generate ticks manually
    let skip = Math.ceil(data.length / 5);
    let ticks = [];
    for (let index = 0; index < data.length; index += skip) {
      ticks.push(data[index].name);
    }

    return (
      <div className="chart-container">
        <ResponsiveContainer width="100%" aspect={1.7}>
          <ComposedChart data={data}>
            <XAxis dataKey="name" ticks={ticks} style={{ fontSize: '0.75em' }} />
            <YAxis
              yAxisId="VWA"
              dataKey="VWA"
              scale="linear"
              type="number"
              orientation="right"
              domain={[datamin => datamin * 0.975, datamax => datamax * 1.025]}
              style={{ fontSize: '0.75em' }}
            />
            <YAxis
              yAxisId="volume"
              dataKey="volume"
              type="number"
              scale="linear"
              domain={['datamin', dataMax => dataMax * 4]}
              style={{ display: 'none' }}
            />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend
              wrapperStyle={{ fontSize: '0.75em' }}
              onClick={this.toggleChart}
              onMouseEnter={q => this.highlightExchange(q.dataKey)}
              onMouseLeave={this.unhighlightExchange}
            />
            <Bar
              dataKey={this.state.charts.volume ? 'volume' : 'volume '}
              yAxisId="volume"
              barSize={20}
              fill={GREEN_DARK}
              animationDuration={500}
            >
              {data.map(item => {
                let cell = <Cell fill={item.VWA >= lastPrice ? GREEN : RED} key={item.timestamp} />;
                lastPrice = item.VWA;
                return cell;
              })}
            </Bar>
            <Line
              type="linear"
              yAxisId="VWA"
              dataKey={this.state.charts.VWA ? 'VWA' : 'VWA '}
              stroke="#585858"
              animationDuration={500}
              dot={false}
              activeDot={false}
              strokeWidth={this.state.selectedExchange === 'VWA' ? 3 : 1}
            />
            {marketList}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

LineChart.propTypes = {
  currency: PropTypes.object,
};
