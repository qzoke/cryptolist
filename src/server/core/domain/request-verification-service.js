const crypto = require('crypto');

module.exports = {
  verify,
  hashQuery,
};

function verify({ query }) {
  let hash = hashQuery(query);
  return verifyHash(hash);
}

function verifyHash(hash) {
  return require('./query-hashes').find(value => value.hash === hash);
}

function hashQuery(val) {
  let hasher = crypto.createHash('sha256');
  hasher.update(val);
  return hasher.digest().toString('hex');
}
