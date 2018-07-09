import React from 'react';
import ReactDom from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter as Router } from 'react-router-dom';
import { Layout } from './scenes/layout';
import { createClient } from './client-factory';
import { createIconFactory } from './icon-factory';

createIconFactory();

ReactDom.render(
  <ApolloProvider client={createClient(false)}>
    <Router>
      <Layout />
    </Router>
  </ApolloProvider>,
  document.getElementById('app')
);
