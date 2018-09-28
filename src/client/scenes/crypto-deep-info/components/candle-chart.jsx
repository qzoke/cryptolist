import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  ComposedChart,
  Line,
  ErrorBar,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const GREEN_DARK = '#74A321';
const GREEN = '#74A321';
const RED = '#FF7777';
const VOLUME_COLOR = '#cccccc66';

export class CandleChart extends React.Component {
  generateDatumFromCandle(candle) {
    let isPositive = candle.close >= candle.open;

    let max = Math.max(candle.open, candle.close);
    let min = Math.min(candle.open, candle.close);
    let body = [max - min, 0];
    let high = candle.high - max;
    let low = Math.abs(candle.low - max);
    let shadow = [low, high];

    return {
      name: `${moment(candle.startUnix * 1000).format('H:m MMM DD')}`,
      timestamp: candle.startUnix,
      VWA: max,
      greenBody: isPositive ? body : null,
      redBody: !isPositive ? body : null,
      shadow,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      volume: candle.volume,
    };
  }

  render() {
    let currency = this.props.currency;
    let vwaMarket = currency.vwa[0];
    let data = vwaMarket.timeseries.map(this.generateDatumFromCandle);

    // Generate ticks manually
    let skip = Math.ceil(data.length / 5);
    let ticks = [];
    for (let index = 0; index < data.length; index += skip) {
      ticks.push(data[index].name);
    }

    let lastPrice = 0;

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
            <Bar
              dataKey="volume"
              yAxisId="volume"
              barSize={20}
              fill={VOLUME_COLOR}
              animationDuration={500}
            />
            <Line
              type="linear"
              yAxisId="VWA"
              dataKey="VWA"
              stroke="#585858"
              animationDuration={500}
              dot={false}
              activeDot={false}
              opacity={0}
            >
              <ErrorBar dataKey="shadow" width={0} strokeWidth={1} stroke="black" direction="y" />
              <ErrorBar
                dataKey="greenBody"
                width={0}
                strokeWidth={4}
                stroke={GREEN}
                direction="y"
              />
              <ErrorBar dataKey="redBody" width={0} strokeWidth={4} stroke={RED} direction="y" />
            </Line>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

CandleChart.propTypes = {
  currency: PropTypes.object,
};
