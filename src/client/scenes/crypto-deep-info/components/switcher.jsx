import React from 'react';
import { BasicInfoScene } from '../scenes/basic-info/basic-info-scene';
import { ChartRouter } from './chart-router';
import { HistoricalDataSceneContainer } from '../scenes/historical-data/historical-data-scene-container';
import { TradesDataSceneContainer } from '../scenes/trades-data/trades-data-scene-container';
import { PeerToPeerSceneContainer } from '../scenes/peer-to-peer/peer-to-peer-scene-container';
import { Nav, NavItem } from 'reactstrap';
import PropTypes from 'prop-types';
import { Route, Link } from 'react-router-dom';
import { SUPPORTED_ASSETS } from '../scenes/peer-to-peer/peer-to-peer-scene-container';

export class Switcher extends React.Component {
  render() {
    const { quote, base } = this.props;

    const PropsBasicInfo = () => <BasicInfoScene {...this.props} />;
    const PropsChart = () => <ChartRouter {...this.props} />;
    const PropsHistData = () => <HistoricalDataSceneContainer {...this.props} />;
    const PropsTradesData = () => <TradesDataSceneContainer {...this.props} />;
    const PropsPeerToPeer = () => <PeerToPeerSceneContainer {...this.props} />;

    const pathHead = `/${quote.primary}-${quote.secondary}/${base}`;
    const pathname = this.props.location.pathname.toLowerCase();
    const qs = this.props.location.search;

    return (
      <div>
        <Nav tabs>
          <NavItem>
            <Link
              className={`nav-link ${pathname.endsWith('chart') ? 'active' : ''}`}
              to={`${pathHead}/chart${qs}`}
            >
              Chart
            </Link>
          </NavItem>
          <NavItem>
            <Link
              className={`nav-link ${pathname.endsWith('info') ? 'active' : ''}`}
              to={`${pathHead}/info${qs}`}
            >
              Info
            </Link>
          </NavItem>
          <NavItem>
            <Link
              className={`nav-link ${pathname.endsWith('historical-data') ? 'active' : ''}`}
              to={`${pathHead}/historical-data${qs}`}
            >
              Historical Data
            </Link>
          </NavItem>
          <NavItem>
            <Link
              className={`nav-link ${pathname.endsWith('trades') ? 'active' : ''}`}
              to={`${pathHead}/trades${qs}`}
            >
              Trades
            </Link>
          </NavItem>
          {SUPPORTED_ASSETS.indexOf(this.props.currency.assetSymbol) >= 0 && (
            <NavItem>
              <Link
                className={`nav-link ${pathname.endsWith('peer-to-peer') ? 'active' : ''}`}
                to={`${pathHead}/peer-to-peer${qs}`}
              >
                Peer to Peer
              </Link>
            </NavItem>
          )}
        </Nav>

        <Route path={`${pathHead}/chart`} render={PropsChart} />
        <Route path={`${pathHead}/info`} render={PropsBasicInfo} />
        <Route path={`${pathHead}/historical-data`} render={PropsHistData} />
        <Route path={`${pathHead}/trades`} render={PropsTradesData} />
        <Route path={`${pathHead}/peer-to-peer`} render={PropsPeerToPeer} />
      </div>
    );
  }
}

Switcher.propTypes = {
  currency: PropTypes.object,
  quote: PropTypes.object,
  base: PropTypes.string,
  location: PropTypes.object,
};
