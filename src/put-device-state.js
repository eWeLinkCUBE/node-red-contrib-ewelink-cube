const ApiClient = require('./extern/libapi').default.ihostApi;
const axios = require('axios');
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
const { API_URL_CONTROL_DEVICE } = require('./utils/const');
module.exports = function (RED) {
    function PutDeviceStateNode(config) {
        RED.nodes.createNode(this, config);
        let that = this;
        let message = '';
        this.on('input', async (msg) => {
            this.log('config————————————————————————————————————————————》' + JSON.stringify(config));
            const baseUrl = 'http://localhost:1880';
            const url = baseUrl + API_URL_CONTROL_DEVICE;
            let params = {
                id: config.server,
                deviceId: config.device,
                params: config.state,
            };
            await axios
                .post(url, params)
                .then((res) => {
                    message = 'success';
                })
                .catch((error) => {
                    message = 'error';
                });
            msg.payload = message;
            that.send(msg);
        });
    }

    RED.nodes.registerType('put-device-state', PutDeviceStateNode);
};
