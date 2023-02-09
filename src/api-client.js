module.exports = function (RED) {
    function ApiClientNode(config) {
        RED.nodes.createNode(this, config);
    }

    RED.nodes.registerType('api-client', ApiClientNode);
};
