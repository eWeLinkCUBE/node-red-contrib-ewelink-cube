const { eventBridge } = require('./utils/event');
module.exports = function (RED) {
    function EventDelDeviceNode(config) {
        RED.nodes.createNode(this, config);

        this.on('input', async (msg) => {
            this.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>config----'+config);
            msg.payload='test';
            this.send(msg);
        });

        eventBridge.on('sse-state', (msg) => {
            this.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<', msg);
         });
    }

    RED.nodes.registerType('event-del-device', EventDelDeviceNode);
};
