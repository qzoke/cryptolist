const express = require('express');
const configMgr = require('@altangent/config-manager');
const { GraphQLClient } = require('graphql-request');
const app = express();

app.post('/proxy/graphql', (req, res, next) => proxyGraphql(req, res).catch(next));

module.exports = app;

///////////////

async function proxyGraphql(req, res) {
  let { query, variables } = req.body;
  let config = configMgr.load();

  let endpoint = config.blocktap.graphqlEndpoint;
  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${config.blocktap.apiKey}`,
    },
  });
  let data = await graphQLClient.rawRequest(query, variables);

  res.json(data);
}
