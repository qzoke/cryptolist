import React from 'react';
import { Redirect } from 'react-router-dom';

export const HomepageRedirector = () => {
  if (window.location.pathname) {
    let [quotes, base] = window.location.pathname.split('/').filter(s => s.length);
    let [primary, secondary] = (quotes || '').split('-');
    let changed = false;

    if (!primary) {
      primary = 'usd';
      changed = true;
    }
    if (!secondary) {
      secondary = 'btc';
      changed = true;
    }
    if (!base) {
      base = 'btc';
      changed = true;
    }

    if (changed) return <Redirect to={`/${primary}-${secondary}/${base}/chart`} />;
  }
  return <div />;
};
