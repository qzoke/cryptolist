const express = require('express');
const configService = require('../core/domain/config-service');
const { GraphQLClient } = require('graphql-request');
const { verify } = require('../core/domain/request-verification-service');
const app = express();

app.post('/api/graphql', (req, res, next) => proxyGraphql(req, res).catch(next));

module.exports = app;

///////////////

async function proxyGraphql(req, res) {
  if (!verify(req.body)) {
    res.status(403).send('Unverified query');
    return;
  }

  let { query, variables } = req.body;
  let { graphqlEndpoint, apiKey } = configService.config.blocktap;

  let graphQLClient = new GraphQLClient(graphqlEndpoint, {
    headers: {
      authorization: `Bearer ${apiKey}`,
    },
  });

  let data = await graphQLClient.rawRequest(query, variables);

  res.json(data);
}
