const axios = require('axios').default;
const {
    API_URL_IHOST_CALLBACK,
    API_URL_ADD_THIRDPARTY_DEVICE
} = require('./utils/const');

module.exports = function (RED) {
    function RegisterDeviceNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', () => {
            const data = {
                id: config.server,
                params: [
                    {
                        name: 'Test Device',
                        third_serial_number: '1e99749b-ad04-492b-a4a8-ba5b23b768a1',
                        manufacturer: 'sonoff',
                        model: 'SD23-BL',
                        firmware_version: '0.1.3',
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
                    console.log(res);
                })
                .catch((err) => {
                    console.error(err);
                });
        });
    }

    RED.httpAdmin.post(API_URL_IHOST_CALLBACK, (req, res) => {
        res.send(JSON.stringify({
            "event": {
                "header": {
                "name": "UpdateDeviceStatesResponse",
                "message_id": "Unique identifier, preferably a version 4 UUID",
                "version": "1"
                },
                "payload": {}
            }
        }));
    });

    RED.nodes.registerType('register-device', RegisterDeviceNode);
};
