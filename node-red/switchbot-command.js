module.exports = function (RED) {
  function SendCommandNode(config) {
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

    this.on('input', async (msg) => {
      try {
        const command = msg.payload;
        this.status({fill: "yellow", shape: "dot", text: "sending command status"});
        const payload = await api.sendCommand(config.deviceId, command);

        this.status({fill: "green", shape: "dot", text: `command '${command}', last sent at ${new Date().toLocaleTimeString()}`});
        this.done();
      } catch (e) {
        console.log(e);
        this.status({fill: "red", shape: "dot", text: "Failed:" + e});
      }
    });
  }

  RED.nodes.registerType("SwitchBot | Command", SendCommandNode);
}
