import React from 'react';
import PropTypes from 'prop-types';

const NO_MARKET_MSG =
  'No markets found for either selected quote currency. Please select a different quote currency';

export class TradingViewChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      widget: null,
      rendered: false,
      base: '',
      quote: '',
      message: '',
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
      toolbar_bg: '#2a2a2e',
      overrides: {
        'paneProperties.background': '#2a2a2e',
        'paneProperties.vertGridProperties.color': '#404040',
        'paneProperties.horzGridProperties.color': '#404040',
        'symbolWatermarkProperties.color': 'rgba(0, 0, 0, 0.00)',
        'scalesProperties.textColor': '#888',
        'scalesProperties.backgroundColor': '#2a2a2e',
        'scalesProperties.lineColor': '#404040',
      },
    });

    return widget;
  }

  componentDidMount() {
    let widget = TradingViewChart.getWidget(this.props.currency);
    const quote = TradingViewChart.getQuoteToUse(this.props.currency.markets, this.props.quote);
    let message = '';
    if (!quote) {
      widget = null;
      message = NO_MARKET_MSG;
    }

    this.setState({
      widget,
      message,
      rendered: true,
      base: this.props.currency.currencySymbol,
      quote: quote,
    });
  }

  static getDerivedStateFromProps(props, state) {
    const { currencySymbol: base } = props.currency;
    const quote = TradingViewChart.getQuoteToUse(props.currency.markets, props.quote);
    let message = '';

    if (state.rendered && (base !== state.base || quote !== state.quote)) {
      let widget = TradingViewChart.getWidget(props.currency);
      if (!quote) {
        widget = null;
        message = NO_MARKET_MSG;
      }
      return { widget, quote, base, message };
    }

    return null;
  }

  static getQuoteToUse(markets, quotes) {
    const secondaryMarket = TradingViewChart.marketExistsForQuote(
      markets,
      quotes.secondary.toUpperCase()
    );
    const primaryMarket = TradingViewChart.marketExistsForQuote(
      markets,
      quotes.primary.toUpperCase()
    );

    if (primaryMarket) return quotes.primary;
    else if (secondaryMarket) return quotes.secondary;
    return null;
  }

  static marketExistsForQuote(markets, quote) {
    if (!markets) return null;
    return markets.find(market => {
      let marketQuote = market.marketSymbol.split('/')[1];
      return marketQuote === quote;
    });
  }

  render() {
    return (
      <div className="widget">
        {this.state.message && <div className="alert alert-warning">{this.state.message}</div>}
        <div id="chart_container" className="chart" />
      </div>
    );
  }
}

TradingViewChart.propTypes = {
  currency: PropTypes.object,
  quote: PropTypes.object,
};
