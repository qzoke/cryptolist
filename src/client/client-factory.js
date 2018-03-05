import { ApolloClient } from 'apollo-client';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

let GRAPHQL_HOST = process.env.GRAPHQL_HOST || 'localhost';

export const createClient = ssrMode => {
  const httpLink = new BatchHttpLink({
    uri: `http://${GRAPHQL_HOST}:8081/graphql`,
    //fetch,
  });

  const wsLink = new WebSocketLink({
    uri: `ws://${GRAPHQL_HOST}:8081/subscriptions`,
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
