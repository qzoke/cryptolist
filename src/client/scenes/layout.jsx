import React from 'react';
import { AppNav } from '../components/navbar';
import { HomeScene } from './home/home-scene';
import { Route } from 'react-router-dom';
import { HomepageRedirector } from '../components/homepage-redirector';

export class Layout extends React.Component {
  constructor() {
    super();
    this.changeQuoteSymbol = this.changeQuoteSymbol.bind(this);
    this.state = { quoteSymbol: 'USD' };
  }

  changeQuoteSymbol(newQuoteSymbol) {
    this.setState({ quoteSymbol: newQuoteSymbol });
  }

  render() {
    return (
      <div className="layout">
        <div className="content">
          <div className="container">
            <AppNav
              changeQuoteSymbol={this.changeQuoteSymbol}
              currentQuoteSymbol={this.state.quoteSymbol}
            />
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
