module.exports = function (RED) {
    function GetDevicesNode(config) {
        RED.nodes.createNode(this, config);
        this.on('input', async (msg) => {
            msg.payload='test';
            this.send(msg);
        });
    }
    RED.nodes.registerType('get-devices', GetDevicesNode);
};
