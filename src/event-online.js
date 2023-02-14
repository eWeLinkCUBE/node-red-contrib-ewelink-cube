const { eventBridge } = require('./utils/event');
module.exports = function (RED) {
    function GetStatusNode(config) {
        RED.nodes.createNode(this, config);

        this.on('input',(msg) => {
            msg.payload='test';
            this.send(msg);
        });

        eventBridge.on('sse-state', (msg) => {
           this.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<', msg);
        });
    }

    RED.nodes.registerType('event-online', GetStatusNode);
};
