import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  ComposedChart,
  Line,
  ErrorBar,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const GREEN = '#74A321';
const RED = '#FF7777';
const VOLUME_COLOR = '#cccccc66';
const colors = ['#90BADB', '#C595D0', '#FEA334', '#5ECF96', '#FF62EA', '#69FFE9', '#69FFE9'];

const CustomTooltip = ({ payload }) => {
  if (!payload.length) return null;
  let item = payload[0].payload;
  return (
    <div className="candle-tooltip">
      <div>
        <span className="header">{item.name}</span>
      </div>
      <div>
        <span className="header">Volume:</span> {item.volume}
      </div>
      <div>
        <span className="header">Open:</span> {item.open}
      </div>
      <div>
        <span className="header">High:</span> {item.high}
      </div>
      <div>
        <span className="header">Low:</span> {item.low}
      </div>
      <div>
        <span className="header">Close:</span> {item.close}
      </div>
    </div>
  );
};
CustomTooltip.propTypes = {
  payload: PropTypes.array,
};

export class CandleChart extends React.Component {
  generateDatumFromCandle(candle) {
    let isPositive = candle.close >= candle.open;

    let max = Math.max(candle.open, candle.close);
    let min = Math.min(candle.open, candle.close);
    let body = [max - min, 0];
    let high = candle.high - max;
    let low = Math.abs(candle.low - max);
    let shadow = [low, high];

    let res = {
      name: `${moment(candle.startUnix * 1000).format('H:m MMM DD')}`,
      VWA: max,
      greenBody: isPositive ? body : null,
      redBody: !isPositive ? body : null,
      shadow,
    };

    return Object.assign({}, res, candle);
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

    console.log(this.props);

    let indicators = Object.keys(this.props.indicators).map((indicator, i) => {
      return (
        <Line
          type="linear"
          yAxisId="VWA"
          dataKey={indicator}
          stroke={colors[i % colors.length]}
          animationDuration={500}
          dot={false}
          activeDot={false}
          key={name}
          strokeWidth={2}
        />
      );
    });

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
            <Tooltip content={<CustomTooltip />} />
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
              isAnimationActive={false}
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
            {indicators}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

CandleChart.propTypes = {
  currency: PropTypes.object,
  indicators: PropTypes.object,
};
