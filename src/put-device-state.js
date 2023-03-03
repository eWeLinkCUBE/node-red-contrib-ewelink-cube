const {API_URL_CONTROL_DEVICE,EVENT_NODE_RED_ERROR,API_URL_UPLOAD_DEVICE_STATE} = require('./utils/const');
const axios = require('axios');
module.exports = function (RED) {
    function PutDeviceStateNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', () => {
            const server = config.server.trim();
            const device = config.device.trim();
            let state = config.state.trim();
            if (!server) {
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'put-state-device: no server' });
                return;
            }

            if (!device) {
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'put-state-device: no device' });
                return;
            }

            try {
                state = JSON.parse(state);
            } catch (err) {
                console.error(err);
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'put-state-device: state should be JSON' })
                return;
            }

            let params = {
                id: config.server,
                deviceId: config.device,
                thirdPartyDeviceId:config.thirdPartyDeviceId,
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
                node.error(error);
            });
        });
    }

    RED.nodes.registerType('put-device-state', PutDeviceStateNode);
};
