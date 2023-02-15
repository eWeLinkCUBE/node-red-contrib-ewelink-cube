const { eventBridge } = require('./utils/event');
const { EVENT_SSE_ON_DELETE_DEVICE } = require('./utils/const');
const _ = require('lodash');

module.exports = function (RED) {
    function EventDelDeviceNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        function eventSseOnDelDeviceHandler(jsonData) {
            const data = JSON.parse(jsonData);
            const number = _.get(data, ['msg', 'data', 'endpoint','serial_number'], '');
            node.send({ payload: data.msg });
            if (config.server === data.srcNodeId) {
                if(config.device == ''){
                    node.send({ payload: data.msg });
                }

                if(config.device === number){
                    node.send({ payload: data.msg });
                }
            }
        }

        eventBridge.on(EVENT_SSE_ON_DELETE_DEVICE, eventSseOnDelDeviceHandler);

        node.on('close', (done) => {
            eventBridge.off(EVENT_SSE_ON_DELETE_DEVICE, eventSseOnDelDeviceHandler);
            done();
        });
    }

    RED.nodes.registerType('event-del-device', EventDelDeviceNode);
};
