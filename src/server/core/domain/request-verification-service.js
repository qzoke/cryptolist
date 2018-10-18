const crypto = require('crypto');
const queryHashes = require('./query-hashes');

module.exports = {
  verify,
  hashQuery,
};

function verify({ query, variables }) {
  let hash = hashQuery(query.trim());
  let verifiedHash = verifyHash(hash);

  if (!verifiedHash) return false;
  if (verifiedHash.variables) return verifyVariables(variables, verifiedHash.variables);

  return true;
}

function verifyHash(hash) {
  return queryHashes.find(value => value.hash === hash);
}

function hashQuery(val) {
  let hasher = crypto.createHash('sha256');
  hasher.update(val);
  return hasher.digest().toString('hex');
}

function verifyVariables(variables, restrictions) {
  let failures = restrictions.find(restriction => {
    let variable = variables[restriction.name];
    if (variable) return !verifyVariable(restriction, variable);
  });
  return !failures;
}

function verifyVariable(value, restriction) {
  switch (restriction.restriction) {
    case 'in':
      return restriction.value.contains(value);
    case 'gt':
      return value > restriction.value;
    case 'lt':
      return value < restriction.value;
    case 'eq':
      return value === restriction.value;
    default:
      return true;
  }
}
