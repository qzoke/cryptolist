const config = require('@altangent/config-manager');

let _instance;

module.exports = {
  load,
  get config() {
    if (!_instance) throw new Error('Instance has not been loaded');
    return _instance;
  },
};

async function load() {
  _instance = await config.load();
  return _instance;
}
