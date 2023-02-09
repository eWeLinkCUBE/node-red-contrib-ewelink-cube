module.exports = function (RED) {
    function GetDevicesNode(config) {
        RED.nodes.createNode(this, config);
    }

    RED.nodes.registerType('get-devices', GetDevicesNode);
};
