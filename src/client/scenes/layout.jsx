import React from 'react';
import { AppNav } from '../components/navbar';
import { HomeScene } from './home/home-scene';
import { Route, withRouter } from 'react-router-dom';
import { HomepageRedirector } from '../components/homepage-redirector';
import PropTypes from 'prop-types';

export class LayoutComponent extends React.Component {
  constructor(props) {
    super(props);
    this.changeQuoteSymbol = this.changeQuoteSymbol.bind(this);
    let [quoteSymbol] = props.location.pathname.split('/').filter(p => !!p.length);
    this.state = { quoteSymbol };
  }

  changeQuoteSymbol(newQuoteSymbol) {
    this.setState({ quoteSymbol: newQuoteSymbol });
    let [, base, ...rest] = this.props.location.pathname.split('/').filter(p => !!p.length);
    this.props.history.push(
      `/${newQuoteSymbol}/${base}/${rest.join('/')}${this.props.location.search}`
    );
  }

  render() {
    return (
      <div className="layout">
        <div className="content">
          <div className="container">
            <AppNav quoteSymbol={this.state.quoteSymbol} onQuoteChange={this.changeQuoteSymbol} />
          </div>
          <div className="container mt-3">
            <Route path="/" component={HomepageRedirector} />
            <Route path="/:quote/:base" component={HomeScene} />
          </div>
        </div>
        <footer className="footer">
          Fork on <a href="https://github.com/altangent/cryptolist">GitHub</a> | Powered by{' '}
          <a href="https://blocktap.io">Blocktap</a>
        </footer>
      </div>
    );
  }
}

LayoutComponent.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
};

export const Layout = withRouter(LayoutComponent);
