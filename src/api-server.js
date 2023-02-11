const ApiClient = require('./extern/libapi').default.ihostApi;

module.exports = function (RED) {
    let apiClient = null;

    function ApiServerNode(config) {
        RED.nodes.createNode(this, config);
    }

    RED.httpAdmin.post('/get-bridge-info', (req, res) => {
        const ip = req.body.ip;

        apiClient = new ApiClient({ ip });
        apiClient.getBridgeInfo()
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                // TODO: handle err
                res.send(JSON.stringify({ error: 500, msg: 'getBridgeInfo() error' }));
            });
    });

    RED.httpAdmin.post('/get-bridge-token', (req, res) => {
        const ip = req.body.ip;

        apiClient = new ApiClient({ ip });
        apiClient.getBridgeAT({})
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                // TODO: handle err
                res.send(JSON.stringify({ error: 500, msg: 'getBridgeAT() error' }));
            })
    });

    RED.httpAdmin.post('/get-device-list', (req, res) => {
        apiClient.getDeviceList()
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                // TODO: handle err
                res.send(JSON.stringify({ error: 500, msg: 'getDeviceList() error' }))
            });
    });

    RED.nodes.registerType('api-server', ApiServerNode);
};
