import { ApolloClient } from 'apollo-client';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

let GRAPHQL_HOST = process.env.GRAPHQL_HOST || 'alpha.blocktap.io';

import React from 'react';
const HOST = `http://${GRAPHQL_HOST}/graphql`;

export const Query = (WrappedComponent, query, variables = () => {}, host = HOST) => {
  console.log(WrappedComponent, query, host);
  class WithRequest extends React.Component {
    constructor(props) {
      super(props);
      this.getData = this.getData.bind(this);
      this.state = {
        data: {},
      };
      this.getData(variables(props));
    }

    componentDidUpdate(prevProps) {
      if (JSON.stringify(this.props) !== JSON.stringify(prevProps))
        this.getData(variables(this.props));
    }

    getData(variables) {
      let vars = Object.assign({}, this.state, variables);
      vars.data = undefined;
      return adHocRequest(query, vars)
        .then(res => {
          vars.data = res.data;
          this.setState(vars);
        })
        .catch(err => {
          vars.data = { err };
          this.setState(vars);
        });
    }

    render() {
      return React.createElement(
        WrappedComponent,
        Object.assign({}, this.props, {
          data: this.state.data ? this.state.data : {},
          getData: this.getData,
        })
      );
    }
  }

  return WithRequest;
};

export const adHocRequest = (query, variables) => {
  return fetch(`https://${GRAPHQL_HOST}/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  }).then(res => res.json());
};

export const createClient = ssrMode => {
  const httpLink = new BatchHttpLink({
    uri: `https://${GRAPHQL_HOST}/graphql`,
  });

  const wsLink = new WebSocketLink({
    uri: `wss://${GRAPHQL_HOST}/subscriptions`,
    options: {
      reconnect: true,
    },
  });

  const link = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink
  );

  const cache = new InMemoryCache();

  return new ApolloClient({
    ssrMode,
    link,
    cache,
  });
};
