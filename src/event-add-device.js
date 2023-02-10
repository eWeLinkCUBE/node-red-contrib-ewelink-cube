module.exports = function (RED) {
    function AddDeviceNode(config) {
        RED.nodes.createNode(this, config);
        this.log('------------------------------------------>')
        this.on('input',(msg) => {
            msg.payload='test';
            this.send(msg);
        });
    }

    RED.nodes.registerType('event-add-device', AddDeviceNode);
};
