const { v4 } = require('uuid');
const axios = require('axios').default;
const {
    API_URL_IHOST_CALLBACK,
    API_URL_ADD_THIRDPARTY_DEVICE,
    EVENT_NODE_RED_ERROR,
} = require('./utils/const');

module.exports = function (RED) {
    function RegisterDeviceNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', () => {
            const name = config.name.trim();
            const server = config.server.trim();   // check server
            const deviceId = config.device_id.trim();
            const deviceName = config.device_name.trim();
            const category = config.category.trim();
            const capabilities = config.capabilities.trim();
            const manufacturer = config.manufacturer.trim();
            const model = config.model.trim();
            const firmwareVersion = config.firmware_version.trim();
            const serviceAddress = config.service_address.trim();
            let tags = config.tags.trim();
            let state = config.state.trim();

            if (!server) {
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'register-device: no server' });
                return;
            }

            if (!deviceId) {
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'register-device: no device ID' });
                return;
            }

            if (!deviceName) {
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'register-device: no device name' });
                return;
            }

            if (!manufacturer) {
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'register-device: no manufacturer' });
                return;
            }

            if (!model) {
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'register-device: no model' });
                return;
            }

            if (!firmwareVersion) {
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'register-device: no firmware version' });
                return;
            }

            if (!serviceAddress) {
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'register-device: no service address' });
                return;
            }

            if (!tags) {
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'register-device: no tags' });
                return;
            }

            if (!state) {
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'register-device: no state' });
                return;
            }

            const apiServerNode = RED.nodes.getNode(server);
            if (!apiServerNode) {
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'register-device: server not exists' });
                return;
            }

            try {
                tags = JSON.parse(tags);
            } catch (err) {
                console.error(err);
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'register-device: tags should be JSON' })
                return;
            }

            try {
                state = JSON.parse(state);
            } catch (err) {
                console.error(err);
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'register-device: state should be JSON' })
                return;
            }

            const data = {
                id: config.server,
                params: [
                    {
                        name,
                        third_serial_number: deviceId,
                        manufacturer,
                        model,
                        firmware_version: firmwareVersion,
                        display_category: 'switch',
                        capabilities: [
                            {
                                capability: 'power',
                                permission: 'readWrite'
                            }
                        ],
                        state: {
                            power: {
                                powerState: 'on'
                            }
                        },
                        tags: {},
                        service_address: 'http://192.168.2.21:1880/ewelink-cube-api-v1/ihost-callback'
                    }
                ]
            };
            axios.post(`http://127.0.0.1:1880${API_URL_ADD_THIRDPARTY_DEVICE}`, data)
                .then((res) => {
                    // TODO: handle success
                    console.log(res);
                })
                .catch((err) => {
                    // TODO: handle fail
                    console.error(err);
                });
        });
    }

    RED.httpAdmin.post(API_URL_IHOST_CALLBACK, (req, res) => {
        // TODO: get node id from req, then send message to output.
        const failedResponse = {
            event: {
                header: {
                    name: 'ErrorResponse',
                    message_id: v4(),
                    version: '1'
                },
                payload: {
                    type: 'ENDPOINT_UNREACHABLE'
                }
            }
        };
        const successResponse = {
            event: {
                header: {
                    name: 'UpdateDeviceStatesResponse',
                    message_id: v4(),
                    version: '1'
                },
                payload: {}
            }
        };
        res.send(JSON.stringify(successResponse));
    });

    RED.nodes.registerType('register-device', RegisterDeviceNode);
};
