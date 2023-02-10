module.exports = function (RED) {
    function RegisterDevicesNode(config) {
        RED.nodes.createNode(this, config);
    }

    RED.nodes.registerType('register-device', RegisterDevicesNode);
};
