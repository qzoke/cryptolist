import React from 'react';
import { Redirect } from 'react-router-dom';

export const HomepageRedirector = () => {
  if (window.location.pathname) {
    let [quote, base, ..._] = window.location.pathname.split('/').filter(s => s.length);
    let changed = false;
    if (!quote) {
      quote = 'USD';
      changed = true;
    }
    if (!base) {
      base = 'BTC';
      changed = true;
    }

    if (changed) return <Redirect to={`/${quote}/${base}/info`} />;
  }
  return <div />;
};
