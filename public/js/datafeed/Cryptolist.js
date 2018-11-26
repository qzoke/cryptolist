let Cryptolist = (window.Cryptolist = {});

(function() {
  let symbolInfoBase = {
    name: 'Blocktap:BTC/USDT', // Change
    ticker: 'Blocktap:BTC/USDT', // Change
    description: 'Blocktap:BTC/USDT', // Change
    type: 'bitcoin',
    session: '24x7',
    exchange: 'Blocktap.io', // Change
    timezone: 'Etc/UTC',
    pricescale: 100,
    minmov: 1,
    minmove2: 0,
    fractional: true,
    has_intraday: true,
    supported_resolutions: ['60', '120', '240', 'D'],
    intraday_multipliers: ['60', '120', '240'],
    has_seconds: false,
    has_daily: true,
    has_weekly_and_monthly: false,
    has_empty_bars: true,
    force_session_rebuild: true,
    has_no_volume: false,
    volume_precision: 4,
    data_status: 'streaming',
    expired: false,
    sector: 'cryptocurrency',
    industry: 'Crypto Asset',
    currency_code: '$',
  };

  function onReady(callback) {
    console.log('onReady');
    setTimeout(() =>
      callback({
        exchanges: [],
        symbolsTypes: [],
        supported_resolutions: [60, 120, 240, 'D'],
        supports_marks: false,
        supports_timescale_marks: false,
        supports_time: false,
        futures_regex: null,
      })
    );
  }

  function searchSymbols(userInput, exchange, symbolType, onResultReadyCallback) {
    console.log('search symbols', userInput, exchange, symbolType, onResultReadyCallback);
  }

  function resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    let symbol = Object.assign({}, symbolInfoBase, {
      name: symbolName,
      ticker: symbolName,
      description: symbolName,
      excahnge: symbolName.split(':')[0],
    });
    setTimeout(() => onSymbolResolvedCallback(symbol));
  }

  function getBars(
    symbolInfo,
    resolution,
    from,
    to,
    onHistoryCallback,
    onErrorCallback,
    firstDataRequest
  ) {
    console.log('getBars', symbolInfo, resolution, from, to, firstDataRequest);
    switch (resolution) {
      case 'D':
        resolution = '_1d';
        break;
      case '60':
        resolution = '_1h';
        break;
      case '120':
        resolution = '_2h';
        break;
      case '240':
        resolution = '_4h';
        break;
    }

    let [base, quote] = symbolInfo.name.split('/');
    let data = {
      query: `
      query TradingViewCandles(
        $baseSymbol: String!
        $quoteSymbol: String!
        $resolution: TimeResolution!
        $start: Int!
        $end: Int!
      ) {
        currency(currencySymbol:$baseSymbol){
          markets (
            filter: { quoteSymbol_eq:$quoteSymbol }
            aggregation:VWA
          ) {
            ohlcv(
              resolution: $resolution
              start: $start
              end: $end
            )
          }
        }
      }
      `,
      variables: {
        baseSymbol: base,
        quoteSymbol: quote,
        resolution,
        start: from,
        end: to,
      },
    };

    fetch('/api/graphql', {
      method: 'post',
      mode: 'cors',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(json => {
        if (json.errors) {
          throw new Error(json.errors[0].message);
        }
        let reversed = json.data.currency.markets[0].ohlcv.reverse();
        let bars = reversed.map(p => {
          return {
            time: p[0] * 1000,
            open: p[1],
            high: p[2],
            low: p[3],
            close: p[4],
            volume: p[5],
          };
        });
        onHistoryCallback(bars, { noData: false });
      })
      .catch(err => {
        console.error(err);
        onErrorCallback(err);
      });
  }

  function subscribeBars(
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscriberUID,
    onResetCacheNeededCallback
  ) {
    console.log('subscribeBars', symbolInfo.symbol, resolution);
  }

  function unsubscribeBars(subscriberUID) {
    console.log('unsubscribeBars');
  }

  function calculateHistoryDepth(resolution, resolutionBack, intervalBack) {
    console.log('calculateHistoryDepth', resolution, resolutionBack, intervalBack);
    if (intervalBack > 2000) return { resolution, resolutionBack, intervalBack: 2000 };
    return undefined;
  }

  function getMarks(symbolInfo, startDate, endDate, onDataCallback, resolution) {
    // no need to implement
    console.log('getMarks');
  }

  function getTimescaleMarks(symbolInfo, startDate, endDate, onDataCallback, resolution) {
    // no need to implement
    console.log('getTimescaleMarks');
  }

  function getServerTime(callback) {
    // no need to implement
    console.log('getServerTime');
    callback(Math.floor(Date.now() / 1000));
  }

  Cryptolist.datafeed = {
    onReady,
    searchSymbols,
    resolveSymbol,
    getBars,
    subscribeBars,
    unsubscribeBars,
    calculateHistoryDepth,
    getMarks,
    getTimescaleMarks,
    getServerTime,
  };
})();
