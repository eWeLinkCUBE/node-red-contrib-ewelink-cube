module.exports = function (RED) {
    function PutDeviceStateNode(config) {
        RED.nodes.createNode(this, config);

        this.on('input', (msg) => {
            msg.payload='test';
            this.send(msg);
        });
    }

    RED.nodes.registerType('put-device-state', PutDeviceStateNode);
};
