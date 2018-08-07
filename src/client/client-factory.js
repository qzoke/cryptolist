import { ApolloClient } from 'apollo-client';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

let GRAPHQL_HOST = process.env.GRAPHQL_HOST || 'alpha.blocktap.io';

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
