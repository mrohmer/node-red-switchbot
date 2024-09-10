module.exports = function (RED) {
  function SwitchBotNode(config) {
    const Api = require('../src/api.js');
    RED.nodes.createNode(this, config);

    this.name = config.name;
    this.token = config.token;

    this.api = new Api({token: config.token});
  }

  RED.nodes.registerType("SwitchBot", SwitchBotNode);

  RED.httpAdmin.get(`/switchbot-api/find-device-id`, function (req, res) {
    const {apiId, deviceName} = req.query ?? {};

    if (!apiId) {
      res.status(400).json({error: 'No API given'});
      return;
    }
    if (!deviceName) {
      res.status(400).json({error: 'No device name given'});
      return;
    }

    const api = RED.nodes.getNode(apiId);
    if (!api) {
      res.status(400).json({error: 'No API configured'});
      return;
    }

    const cachedDevice = api.lastDeviceList?.find?.(d => d.deviceName === deviceName);
    if (cachedDevice) {
      res.json(cachedDevice);
      return;
    }

    api.api.getDeviceList().then((response) => {
      api.lastDeviceList = response?.deviceList ?? api.lastDeviceList;
      const device = response?.deviceList?.find(d => d.deviceName === deviceName);
      if (!device) {
        res.status(404).json({error: `Device not found`});
        return;
      }
      res.json(device);
    }).catch((e) => {
      console.error(e);
      res.status(500).json({error: 'Failed to fetch device list'});
    });
  });
}
