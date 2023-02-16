const { API_URL_IHOST_CALLBACK } = require('./utils/const');

module.exports = function (RED) {
    function RegisterDeviceNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', () => {
            console.log('start');
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
