import { marketCapFormat } from './market-cap-formatter';

let btc = {
  id: 'btcbtcbtc',
  currencyName: 'Bitcoin',
  currencySymbol: 'BTC',
  currentSupply: 100000,
  marketCapRank: 1,
  marketCap: 16944950,
  markets: {
    data: [{
      marketSymbol:'VWAP:BTC/USD',
      ticker: {
        last: 5969.32672657,
        percentChange: -7.31,
        dayLow: 5943.91447868,
        dayHigh: 6490.24124109,
        baseVolume: 7282.63104862,
        quoteVolume: 44796931.24426494
      }
    }]
  }},
  eth = {
    id: 'ethetheth',
    currencyName: 'Ethereum',
    currencySymbol: 'ETH',
    currentSupply: 100000,
    marketCapRank: 2,
    marketCap: 10000,
    markets: {
      data: [{
        marketSymbol:'VWAP:ETH/USD',
        ticker: {
          last: 100,
          percentChange: 1,
          dayLow: 99,
          dayHigh: 101,
          baseVolume: 123,
          quoteVolume: 145
        }
      }]
    }
  };

test('no currencies, returns empty array', () => {
  // arrange
  let currencies = [];
  let bitcoinNode = {};
  let quoteSymbol = 'USD';

  // act
  let response = marketCapFormat(currencies, bitcoinNode, quoteSymbol);

  // assert
  expect(response.length).toBe(0);
});


test('list of currencies, returns valid response', () => {
  // arrange
  let currencies = [btc, eth];
  let bitcoinNode = btc;
  let quoteSymbol = 'USD';

  // act
  let response = marketCapFormat(currencies, bitcoinNode, quoteSymbol);

  // assert
  expect(response.length).toBe(2);
  expect(response[0].id).toBe('btcbtcbtc');
  expect(response[1].id).toBe('ethetheth');
  expect(response[0].name).toBe('Bitcoin');
  expect(response[1].name).toBe('Ethereum');
  expect(response[0].symbol).toBe('BTC');
  expect(response[1].symbol).toBe('ETH');
  expect(response[0].supply).toBe('100,000');
  expect(response[1].supply).toBe('100,000');
  expect(response[0].marketCap).toBe('$101,149,942,915.392');
  expect(response[1].marketCap).toBe('$59,693,267.266');
  expect(response[0].marketCapRank).toBe(1);
  expect(response[1].marketCapRank).toBe(2);
  expect(response[0].price).toBe('$5,969.327');
  expect(response[1].price).toBe('$100');
  expect(response[0].percentChange).toBe('-7.31');
  expect(response[1].percentChange).toBe('1.00');
  expect(response[0].volume).toBe('$44,796,931.244');
  expect(response[1].volume).toBe('$145');
});

test('market with no ticker', () => {
  // arrange
  let newEth = eth;
  newEth.markets.data[0].ticker = null;
  let currencies = [newEth];
  let bitcoinNode = btc;
  let quoteSymbol = 'USD';

  // act
  let response = marketCapFormat(currencies, bitcoinNode, quoteSymbol);

  // assert
  expect(response[0].volume).toBe('$0');
  expect(response[0].percentChange).toBe(0);
});

test('alternate quote symbols', () => {
  // arrange
  let newEth = eth;
  newEth.markets.data[0].marketSymbol = 'VWAP:ETH/USDT';
  console.log(newEth.markets.data);
  let currencies = [newEth];
  let bitcoinNode = btc;
  let quoteSymbol = 'USDT';

  // act
  let response = marketCapFormat(currencies, bitcoinNode, quoteSymbol);

  // assert
  console.log(response);
});
