const axios = require('axios');
const { API_URL_GET_DEVICE_LIST ,EVENT_NODE_RED_ERROR } = require('./utils/const');

module.exports = function (RED) {
    function GetDevicesNode(config) {
        RED.nodes.createNode(this, config);

        this.on('input', async (msg) => {
            this.log('config-------------------------------->' + JSON.stringify(config));
            if(!config.server){
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'get-devices: no server' });
                return;
            }
            let message = [];
            const baseUrl = 'http://127.0.0.1:1880';
            const url = baseUrl + API_URL_GET_DEVICE_LIST;
            let that = this;
            await axios
                .post(url, { id: config.server })
                .then(function (response) {
                    // Add status
                    if (response.data.error === 0) {
                        that.status({ text: '' });
                    } else if (response.data.error === 500){
                        that.status({ fill: 'red', shape: 'ring', text: RED._('get-devices.message.connect_fail') });
                    }

                    if (response.data.error === 0) {
                        let dataList = JSON.parse(JSON.stringify(response.data.data.device_list));
                        dataList=dataList.filter((item)=>(item.display_category!=='camera' && item.display_category!=='sensor'));
                        let tempList = [];
                        for (const item of dataList) {
                            if (config.device && config.device !== 'all') {
                                if (item.serial_number == config.device) {
                                    tempList.push(item);
                                }
                            }

                            if (config.category && (config.device === '' || config.device === 'all')) {
                                if (item.display_category == config.category) {
                                    tempList.push(item);
                                }
                            }
                        }

                        if ((config.category === 'all' || config.category ==='') && (config.device === 'all' || config.device === '')) {
                            message = dataList;
                        } else {
                            message = tempList;
                        }
                        msg.payload = message;
                        that.send(msg);
                    }
                })
                .catch(function (error) {
                    that.error(error);
                });
        });
    }
    RED.nodes.registerType('get-devices', GetDevicesNode);
};
