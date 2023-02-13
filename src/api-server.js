const { ihostApi: ApiClient } = require('./extern/libapi').default;
const { NodeDataCache } = require('./utils/cache');

module.exports = function (RED) {
    function ApiServerNode(config) {
        RED.nodes.createNode(this, config);
        // TODO: clean cache
    }

    const API_PREFIX = 'ewelink-cube-api-v1';
    const nodeDataCache = new NodeDataCache();

    // body: { "id": "xxx", "name": "xxx", "ip": "xxx", "token": "xxx" }
    RED.httpAdmin.post(`/${API_PREFIX}/cache/add-api-server-node`, (req, res) => {
        const id = req.body.id;
        const name = req.body.name;
        const ip = req.body.ip;
        const token = req.body.token;

        if (nodeDataCache.has(id)) {
            nodeDataCache.remove(id);
        }
        nodeDataCache.add({
            id,
            name,
            ip,
            token
        });

        res.send(JSON.stringify({ error: 0, msg: 'success' }));
    });

    // body: { "id": "xxx" }
    RED.httpAdmin.post(`/${API_PREFIX}/cache/remove-api-server-node`, (req, res) => {
        const id = req.body.id;

        if (nodeDataCache.has(id)) {
            nodeDataCache.remove(id);
        }

        res.send(JSON.stringify({ error: 0, msg: 'success' }));
    });

    // body: { "ip": "xxx" }
    RED.httpAdmin.post(`/${API_PREFIX}/get-bridge-info`, (req, res) => {
        const ip = req.body.ip;
        const apiClient = new ApiClient({ ip });
        apiClient.getBridgeInfo()
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                // TODO: handle err
                res.send(JSON.stringify({ error: 500, msg: 'getBridgeInfo() error' }));
            });
    });

    // body: { "ip": "xxx" }
    RED.httpAdmin.post(`/${API_PREFIX}/get-bridge-token`, (req, res) => {
        const ip = req.body.ip;
        const apiClient = new ApiClient({ ip });
        apiClient.getBridgeAT({})
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                // TODO: handle err
                res.send(JSON.stringify({ error: 500, msg: 'getBridgeAT() error' }));
            })
    });

    // body: { "id": "xxx" }
    RED.httpAdmin.post(`/${API_PREFIX}/get-device-list`, (req, res) => {
        // getNode
        // Y: this.apiClient
        // N: cache
        // apiClient.getDeviceList()
        //     .then((data) => {
        //         res.send(data);
        //     })
        //     .catch((err) => {
        //         // TODO: handle err
        //         res.send(JSON.stringify({ error: 500, msg: 'getDeviceList() error' }))
        //     });
        res.send('ok');
    });

    RED.nodes.registerType('api-server', ApiServerNode);
};
