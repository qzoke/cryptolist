import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Layout } from './scenes/layout';
import { createIconFactory } from './icon-factory';
import { RegraphRequest } from 'regraph-request';

createIconFactory();

ReactDom.render(
  <RegraphRequest value="https://www.cryptolist.com/api/graphql">
    <Router>
      <Layout />
    </Router>
  </RegraphRequest>,
  document.getElementById('app')
);
