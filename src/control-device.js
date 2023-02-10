module.exports = function (RED) {
    function ControlDevicesNode(config) {
        RED.nodes.createNode(this, config);

        this.on('input',(msg) => {
            msg.payload='test';
            this.send(msg);
        });
    }

    RED.nodes.registerType('control-device', ControlDevicesNode);
};
