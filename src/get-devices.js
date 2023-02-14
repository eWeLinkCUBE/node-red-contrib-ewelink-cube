const ApiClient = require('./extern/libapi').default.ihostApi;
const axios = require('axios');
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
module.exports = function (RED) {
    function GetDevicesNode(config) {
        RED.nodes.createNode(this, config);

        this.on('input', async (msg) => {
            this.log('config-------------------------------->' + JSON.stringify(config));
            let message = [];
            const baseUrl = 'http://127.0.0.1:1880';
            const url = baseUrl + '/get-device-list';
            let that = this;
            await axios
                .post(url, { params: {} })
                .then(function (response) {
                    //Filter classification before filtering device
                    let dataList = JSON.parse(JSON.stringify(response.data.data.device_list));
                    let tempList = [];
                    for (var i = 0; i < dataList.length - 1; i++) {
                        if (config.device) {
                            if (dataList[i].serial_number == config.device) {
                                tempList.push(dataList[i]);
                            }
                        }

                        if (config.category && !config.device) {
                            if (dataList[i].display_category == config.category) {
                                tempList.push(dataList[i]);
                            }
                        }
                    }

                    if (!config.category && !config.device) {
                        message = response.data;
                    } else {
                        message = tempList;
                    }
                })
                .catch(function (error) {
                    message = error;
                });
            msg.payload = message;
            that.send(msg);
        });
    }
    RED.nodes.registerType('get-devices', GetDevicesNode);
};
