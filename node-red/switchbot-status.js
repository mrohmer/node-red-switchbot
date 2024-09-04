module.exports = function (RED) {
  function ReadStatusNode(config) {
    RED.nodes.createNode(this, config);

    this.globalConfig = RED.nodes.getNode(config.globalConfig);

    if (!this.globalConfig) {
      this.status({fill: "grey", shape: "ring", text: `No API configured`})
      return;
    }
    if (!config.deviceId) {
      this.status({fill: "grey", shape: "ring", text: `No Device ID configured`})
      return;
    }

    const api = this.globalConfig.api;

    this.on('input', async () => {
      try {
        this.status({fill: "yellow", shape: "dot", text: "retrieving status"});
        const payload = await api.getStatus(config.deviceId);

        this.status({fill: "green", shape: "dot", text: `last read at ${new Date().toLocaleTimeString()}`});
        this.send([{payload}]);
      } catch (e) {
        console.log(e);
        this.status({fill: "red", shape: "dot", text: "Failed:" + e});
      }
    });
  }

  RED.nodes.registerType("SwitchBot | Status", ReadStatusNode);
}
