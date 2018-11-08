import React from 'react';
import PropTypes from 'prop-types';

export class TradingViewChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      widget: null,
      rendered: false,
      base: '',
      quote: '',
    };
  }

  static getWidget(currency) {
    const TradingView = window.TradingView;
    const Cryptolist = window.Cryptolist;
    const symbol = `${currency.currencySymbol}/${currency.quoteSymbol}`;

    const widget = new TradingView.widget({
      autosize: true,
      symbol: symbol,
      interval: '60',
      timezone: 'America/New_York',
      container_id: 'chart_container',
      datafeed: Cryptolist.datafeed,
      library_path: '/public/js/trading-view/charting_library/',
      custom_css_url: '/public/css/app.css',
      locale: 'en',
      enabled_features: ['chart_property_page_trading'],
      disabled_features: [
        'header_symbol_search',
        'symbol_search_hot_key',
        'header_interval_dialog_button',
        'header_chart_type',
        'header_compare',
      ],
      time_frames: [
        { text: '1y', resolution: 'D', description: '1 Year', title: '1y' },
        { text: '3m', resolution: 'D', description: '3 Months', title: '3m' },
        { text: '1m', resolution: '240', description: '1 Month', title: '1m' },
        { text: '14d', resolution: '60', description: '2 Weeks', title: '14d' },
        { text: '7d', resolution: '30', description: '1 Week', title: '7d' },
        { text: '3d', resolution: '15', description: '3 Days', title: '3d' },
        { text: '1d', resolution: '5', description: '1 Day', title: '1d' },
      ],
      toolbar_bg: '#333338',
      overrides: {
        'paneProperties.background': '#333338',
        'paneProperties.vertGridProperties.color': '#404040',
        'paneProperties.horzGridProperties.color': '#404040',
        'symbolWatermarkProperties.color': 'rgba(0, 0, 0, 0.00)',
        'scalesProperties.textColor': '#888',
        'scalesProperties.backgroundColor': '#333338',
        'scalesProperties.lineColor': '#404040',
      },
    });

    return widget;
  }

  componentDidMount() {
    const widget = TradingViewChart.getWidget(this.props.currency);
    this.setState({
      widget,
      rendered: true,
      base: this.props.currency.currencySymbol,
      quote: this.props.currency.quoteSymbol,
    });
  }

  static getDerivedStateFromProps(props, state) {
    const { currencySymbol, quoteSymbol } = props.currency;
    if (state.rendered && (currencySymbol !== state.base || quoteSymbol !== state.quote)) {
      const widget = TradingViewChart.getWidget(props.currency);
      return { widget, base: currencySymbol, quote: quoteSymbol };
    }
    return null;
  }

  render() {
    return (
      <div className="widget">
        <div id="chart_container" className="chart" />
      </div>
    );
  }
}

TradingViewChart.propTypes = {
  currency: PropTypes.object,
};
