import React from 'react';
import ReactDom from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter as Router } from 'react-router-dom';
import { Layout } from './scenes/layout';
import { createClient } from './client-factory';
import { createIconFactory } from './icon-factory';
import { RegraphRequest } from 'regraph-request';

createIconFactory();

ReactDom.render(
  <ApolloProvider client={createClient(false)}>
    <RegraphRequest value="https://alpha.blocktap.io/graphql">
      <Router>
        <Layout />
      </Router>
    </RegraphRequest>
  </ApolloProvider>,
  document.getElementById('app')
);
