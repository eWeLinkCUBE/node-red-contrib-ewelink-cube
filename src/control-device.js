const axios = require('axios');
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
const { API_URL_CONTROL_DEVICE } = require('./utils/const');
module.exports = function (RED) {
    function ControlDevicesNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        this.on('input', async (msg) => {
            node.log('config>>>>>>>>>>>>>>>' + JSON.stringify(config));
            const params = JSON.parse(JSON.stringify(config));
            let data = {
                id:config.server,
                deviceId:config.device,
                params:{}
            };
            if(params.list === '')return;
            const list = JSON.parse(params.list);
            if (params.device === list.deviceId) {
                switch (list.type) {
                    case 'light':
                        for (const item in list.light) {
                            if (list.light[item]) {
                                if ([item] == 'power') {
                                    data.params.power = { powerState: list.light[item] };
                                } else if ([item] == 'brightness') {
                                    data.params.brightness = { brightness: Number(list.light[item]) };
                                } else if ([item] == 'colorOrTemp') {
                                    if (list.light.type === 'color-temperature') {
                                        let temperature = {
                                            'color-temperature': {
                                                colorTemperature: Number(list.light[item]),
                                            },
                                        };
                                        Object.assign(data.params, temperature);
                                    } else if (list.light.type === 'color-rgb') {
                                        try{
                                            if(list.light.hslStr){
                                                const [red, green, blue] = list.light.hslStr.match(/\d+/g).map(Number);
                                                let rgb = {
                                                    'color-rgb': {
                                                        red,
                                                        green,
                                                        blue
                                                    },
                                                };
                                                Object.assign(data.params, rgb);
                                            }
                                        }catch(error){
                                            console.log('error',error);
                                        }

                                    }
                                }
                            }
                        }
                        break;
                    case 'single':
                        let single = { power: { powerState: list.single } };
                        Object.assign(data.params,single);
                        break;
                    case 'multi':
                        data.params.toggle = {};
                        for (const item in list.multi) {
                            let toggle = {
                                [item]: {
                                    toggleState: list.multi[item],
                                },
                            };
                            Object.assign(data.params.toggle, toggle);
                        }
                        break;
                    case 'curtain':
                        let  curtain = { percentage: { percentage: list.curtain } };
                        Object.assign(data.params,curtain);
                        break;
                    default:
                        break;
                }
            }
            node.log('data---------------------' + JSON.stringify(data));

            const baseUrl = 'http://localhost:1880';
            let message = '';
            const url = baseUrl + API_URL_CONTROL_DEVICE;
            data.params=JSON.stringify(data.params);
            await axios
                .post(url, data)
                .then((res) => {
                    node.log('res>>>>>>>>>>>>>>>>>>>'+JSON.stringify(res.data));
                    message = res.data;
                })
                .catch((error) => {
                    message = 'NetWork Error';
                });
            msg.payload = message;
            this.send(msg);
        });
    }

    RED.nodes.registerType('control-device', ControlDevicesNode);
};
