const { eventBridge } = require('./utils/event');

module.exports = function (RED) {
    function AddDeviceNode(config) {
        RED.nodes.createNode(this, config);
        this.log('------------------------------------------>')
        this.on('input',(msg) => {
            msg.payload='test';
            this.send(msg);
        });

        //eventBridge.on('sse-state', (msg) => {
        //    console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<', msg);
        //});

        // TODO: clean listener

    }


    RED.nodes.registerType('event-add-device', AddDeviceNode);
};
