module.exports = function (RED) {
    function EventDelDeviceNode(config) {
        RED.nodes.createNode(this, config);

        this.on('input', async (msg) => {
            msg.payload='test';
            this.send(msg);
        });
    }

    RED.nodes.registerType('event-del-device', EventDelDeviceNode);
};
