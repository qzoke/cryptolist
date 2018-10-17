const express = require('express');
const configService = require('../core/domain/config-service');
const { GraphQLClient } = require('graphql-request');
const app = express();

app.post('/api/graphql', (req, res, next) => proxyGraphql(req, res).catch(next));

module.exports = app;

///////////////

async function proxyGraphql(req, res) {
  let { query, variables } = req.body;
  let { config } = configService;

  let endpoint = config.blocktap.graphqlEndpoint;
  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${config.blocktap.apiKey}`,
    },
  });
  let data = await graphQLClient.rawRequest(query, variables);

  res.json(data);
}
