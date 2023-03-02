const {API_URL_CONTROL_DEVICE,EVENT_NODE_RED_ERROR} = require('./utils/const');
const axios = require('axios');
module.exports = function (RED) {
    function PutDeviceStateNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', () => {
            const server = config.server.trim();
            if (!server) {
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'put-state-device: no server' });
                return;
            }

            let params = {
                id: config.server,
                deviceId: config.device,
                params: config.state,
            };
            axios.post(`http://127.0.0.1:1880${API_URL_CONTROL_DEVICE}`, params)
            .then((res) => {
                // Add status
                if (res.data.error === 0) {
                    node.status({ text: '' });
                } else {
                    node.status({ fill: 'red', shape: 'ring', text: RED._('put-device-state.message.connect_fail') });
                }
                node.send({ payload: res.data });
            })
            .catch((error) => {
                node.error(err);
            });
        });
    }

    RED.nodes.registerType('put-device-state', PutDeviceStateNode);
};
