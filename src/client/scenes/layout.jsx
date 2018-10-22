import React from 'react';
import PropTypes from 'prop-types';
import { AppNav } from '../components/navbar';
import { HomeScene } from './home/home-scene';
import { Route, withRouter } from 'react-router-dom';
import { HomepageRedirector } from '../components/homepage-redirector';

export class LayoutComponent extends React.Component {
  constructor(props) {
    super(props);
    this.updateCurrencies = this.updateCurrencies.bind(this);

    let [, quote, base] = props.location.pathname.split('/');
    let [primary, secondary] = (quote || '').split('-');

    this.state = {
      quote: {
        primary,
        secondary,
      },
      base,
    };
  }

  updateCurrencies({ primary, secondary, base }) {
    primary = primary || this.state.quote.primary;
    secondary = secondary || this.state.quote.secondary;
    base = base || this.state.base;

    this.props.history.push(`/${primary}-${secondary}/${base}`);
    this.setState({
      quote: {
        primary,
        secondary,
      },
      base,
    });
  }

  render() {
    return (
      <div className="layout">
        <div className="content">
          <div className="container-fluid">
            <AppNav
              updateCurrencies={this.updateCurrencies}
              base={this.state.base}
              quote={this.state.quote}
            />
          </div>
          <div className="container-fluid mt-3">
            <Route path="/" component={HomepageRedirector} />
            <Route
              path="/:quote/:base"
              render={props => (
                <HomeScene {...props} base={this.state.base} quote={this.state.quote} />
              )}
            />
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
  location: PropTypes.object,
  history: PropTypes.object,
};

export const Layout = withRouter(LayoutComponent);
