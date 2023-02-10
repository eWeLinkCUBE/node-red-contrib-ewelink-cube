module.exports = function (RED) {
    function ApiServerNode(config) {
        RED.nodes.createNode(this, config);
    }

    RED.httpAdmin.post('/hello', (req, res) => {
        // req.body
        const data = 'world';
        res.send(data);
    });

    RED.nodes.registerType('api-server', ApiServerNode);
};
