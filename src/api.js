/**
 * @typedef {Object} Config
 * @property {string} token - token from SwitchBot App.
 */

/**
 * @template T
 * @typedef {Object} Response
 * @property {number} statusCode
 * @property {string} message
 * @property {T} body
 */

/**
 * @typedef {Object} Device
 * @property {string} deviceId
 * @property {string} deviceType
 * @property {string} hubDeviceId
 * @property {string} deviceName
 * @property {string} enableCloudService
 */

/**
 * @typedef {Object} DeviceList
 * @property {Device[]} deviceList
 * @property {any[]} infraredRemoteList
 */

/**
 * @typedef {Object} BaseStatus
 * @property {string} deviceId
 * @property {string} hubDeviceId
 * @property {string} deviceType
 */

/**
 * @typedef {BaseStatus} MeterStatus
 * @property {number} humidity
 * @property {number} temperature
 */

/**
 * @typedef {BaseStatus} BotStatus
 * @property {string} power
 */

/**
 * @typedef {MeterStatus & BotStatus} Status
 */

class Api {
  /**
   *
   * @param {Config} config
   */
  constructor(config) {
    if (!config?.token) {
      throw new Error("No token provided");
    }
    this.config = config;
  }

  /**
   *
   * @param {string} path
   * @param {RequestInit} options
   * @return {Promise<Response<any>>}
   */
  async #fetch(path, options = {}) {
    const response = await fetch(`https://api.switch-bot.com/v1.0${path}`, {
      ...options,
      headers: {
        ...(options.headers ?? {}),
        "Authorization": this.config.token,
        "ContentType": "application/json; charset=utf8"
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${path}`);
    }

    return await response.json();
  }

  /**
   * @return {Promise<DeviceList>}
   */
  async getDeviceList() {
    /** @type {Response<DeviceList>} */
    const response = await this.#fetch('/devices');
    return response.body;
  }

  /**
   * @param {string} deviceId
   * @return {Promise<Status>}
   */
  async getStatus(deviceId) {
    /** @type {Response<Status>} */
    const response = await this.#fetch(`/devices/${deviceId}/status`);
    return response.body;
  }

  /**
   * @param {string} deviceId
   * @param {string} command
   * @return {Promise<void>}
   */
  async sendCommand(deviceId, command) {
    await this.#fetch(`/devices/${deviceId}/commands`, {
      method: 'POST',
      body: JSON.stringify({command, parameter: "default", commandType: "command"}),
    });
  }
}

module.exports = Api;
