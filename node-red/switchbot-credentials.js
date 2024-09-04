module.exports = function (RED) {
  function SwitchBotNode(config) {
    const Api = require('../src/api.js');
    RED.nodes.createNode(this, config);

    this.name = config.name;
    this.token = config.token;


    this.api = new Api({token: config.token});
  }

  RED.nodes.registerType("SwitchBot", SwitchBotNode);
}
