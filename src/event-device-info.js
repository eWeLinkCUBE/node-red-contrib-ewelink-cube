const { eventBridge } = require('./utils/event');
const { EVENT_SSE_ON_UPDATE_DEVICE_INFO } = require('./utils/const');

module.exports = function (RED) {
    function GetDevicesInfoNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        function eventSseOnUpdateDeviceHandler(jsonData) {
            const data = JSON.parse(jsonData);
            const number = _.get(data, ['msg', 'data', 'endpoint','serial_number'], '');
            if (config.server === data.srcNodeId) {
                if (config.device == '') {
                    node.send({ payload: data.payload.name });
                }

                if (config.device === number) {
                    node.send({ payload: data.payload.name });
                }
            }
        }

        eventBridge.on(EVENT_SSE_ON_UPDATE_DEVICE_INFO, eventSseOnUpdateDeviceHandler);

        node.on('close', (done) => {
            eventBridge.off(EVENT_SSE_ON_UPDATE_DEVICE_INFO, eventSseOnUpdateDeviceHandler);
            done();
        });
    }

    RED.nodes.registerType('event-device-info', GetDevicesInfoNode);
};
