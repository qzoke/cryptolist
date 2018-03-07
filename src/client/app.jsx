import React from 'react';
import ReactDom from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from './scenes/layout';
import { createClient } from './client-factory';
import { createIconFactory } from './icon-factory';

createIconFactory();

ReactDom.render(
  <ApolloProvider client={createClient(false)}>
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  </ApolloProvider>
  ,
  document.getElementById('app')
);
