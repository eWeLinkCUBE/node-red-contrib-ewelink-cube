const { eventBridge } = require('./utils/event');
const { EVENT_SSE_ON_UPDATE_DEVICE_ONLINE } = require('./utils/const');

module.exports = function (RED) {
    function EventOnlineNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        function eventSseOnUpdateDeviceOnlineHandler(jsonData) {
            const data = JSON.parse(jsonData);
            if (config.server === data.srcNodeId) {
                // TODO: compare msg device and config.device
                node.send({ payload: data.msg.data });
            }
        }

        eventBridge.on(EVENT_SSE_ON_UPDATE_DEVICE_ONLINE, eventSseOnUpdateDeviceOnlineHandler);

        node.on('close', (done) => {
            eventBridge.off(EVENT_SSE_ON_UPDATE_DEVICE_ONLINE, eventSseOnUpdateDeviceOnlineHandler);
            done();
        });
    }

    RED.nodes.registerType('event-online', EventOnlineNode);
};
