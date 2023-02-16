const { ihostApi: ApiClient } = require('./extern/libapi').default;
const { NodeDataCache } = require('./utils/cache');
const { eventBridge } = require('./utils/event');
const {
    API_URL_CACHE_ADD_API_SERVER_NODE,
    API_URL_CACHE_REMOVE_API_SERVER_NODE,
    API_URL_GET_BRIDGE_INFO,
    API_URL_GET_BRIDGE_TOKEN,
    API_URL_GET_DEVICE_LIST,
    API_URL_CONTROL_DEVICE,
    API_URL_ADD_THIRDPARTY_DEVICE,
    EVENT_SSE_ON_UPDATE_DEVICE_STATE,
    EVENT_SSE_ON_ADD_DEVICE,
    EVENT_SSE_ON_DELETE_DEVICE,
    EVENT_SSE_ON_UPDATE_DEVICE_INFO,
    EVENT_SSE_ON_UPDATE_DEVICE_ONLINE,
    EVENT_NODE_RED_ERROR
} = require('./utils/const');

module.exports = function (RED) {
    const nodeDataCache = new NodeDataCache();

    function ApiServerNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        // Clean cache when user clicks deploy button.
        nodeDataCache.clean();
        node.apiClient = null;

        const ip = config.ip.trim();
        const token = config.token.trim();
        if (!ip) {
            RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'api-server: no IP' });
            return;
        }
        if (!token) {
            RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'api-server: no token' });
            return;
        }

        // Create API client and SSE connection.
        node.apiClient = new ApiClient({
            ip,
            at: token
        });
        node.apiClient.initSSE();
        node.apiClient.mountSseFunc({
            onopen(msg) {
                console.log(msg);
            },
            onerror(msg) {
                console.log(msg);
            },
            onAddDevice(msg) {
                console.log(msg);
                eventBridge.emit(EVENT_SSE_ON_ADD_DEVICE, JSON.stringify({ srcNodeId: config.id, msg }));
            },
            onUpdateDeviceInfo(msg) {
                console.log(msg);
                eventBridge.emit(EVENT_SSE_ON_UPDATE_DEVICE_INFO, JSON.stringify({ srcNodeId: config.id, msg }));
            },
            onDeleteDevice(msg) {
                console.log(msg);
                eventBridge.emit(EVENT_SSE_ON_DELETE_DEVICE, JSON.stringify({ srcNodeId: config.id, msg }));
            },
            onUpdateDeviceState(msg) {
                console.log(msg);
                // RED.comms.publish('sse-state', 'state state');
                eventBridge.emit(EVENT_SSE_ON_UPDATE_DEVICE_STATE, JSON.stringify({ srcNodeId: config.id, msg }));
            },
            onUpdateDeviceOnline(msg) {
                console.log(msg);
                eventBridge.emit(EVENT_SSE_ON_UPDATE_DEVICE_ONLINE, JSON.stringify({ srcNodeId: config.id, msg }));
            }
        });

        node.on('close', (done) => {
            node.apiClient.unmountSseFunc();
            done();
        });
    }

    // Add API server node data to cache.
    // params:
    //      {
    //          "id": "xxx" - API server node ID
    //          "name": "xxx" - API server node name
    //          "ip": "xxx" - API server node IP
    //          "token": "xxx" - API server node token
    //      }
    RED.httpAdmin.post(API_URL_CACHE_ADD_API_SERVER_NODE, (req, res) => {
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

    // Remove API server node data from cache.
    // params:
    //      {
    //          "id": "xxx" - API server node ID
    //      }
    RED.httpAdmin.post(API_URL_CACHE_REMOVE_API_SERVER_NODE, (req, res) => {
        const id = req.body.id;

        if (nodeDataCache.has(id)) {
            nodeDataCache.remove(id);
        }

        res.send(JSON.stringify({ error: 0, msg: 'success' }));
    });

    // Get bridge info.
    // params:
    //      {
    //          "ip": "xxx" - API server node IP
    //      }
    RED.httpAdmin.post(API_URL_GET_BRIDGE_INFO, (req, res) => {
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

    // Get bridge token.
    // params:
    //      {
    //          "ip": "xxx" - API server node IP
    //      }
    RED.httpAdmin.post(API_URL_GET_BRIDGE_TOKEN, (req, res) => {
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

    // Get device list.
    // params:
    //      {
    //          "id": "xxx" - API server node ID
    //      }
    RED.httpAdmin.post(API_URL_GET_DEVICE_LIST, (req, res) => {
        const id = req.body.id;

        const nodeData = nodeDataCache.getNodeData(id);
        const node = RED.nodes.getNode(id);
        let apiClient = null;
        // If cache hit, use cache data. Otherwise use node instance.
        if (nodeData) {
            apiClient = new ApiClient({ ip: nodeData.ip, at: nodeData.token });
        } else {
            if (!node || !node.apiClient) {
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'api-server: info incomplete' });
                res.send(JSON.stringify({ error: 2000, msg: 'api-server: info incomplete' }));
                return;
            }
            apiClient = node.apiClient;
        }

        apiClient.getDeviceList()
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                // TODO: handle err
                res.send(JSON.stringify({ error: 500, msg: 'getDeviceList() error' }));
            });
    });

    // Control device.
    // params:
    //      {
    //          "id": "xxx" - API server node ID
    //          "deviceId": "xxx" - device ID
    //          "params": {} - device state params
    //      }
    RED.httpAdmin.post(API_URL_CONTROL_DEVICE, (req, res) => {
        const id = req.body.id;
        const deviceId = req.body.deviceId;
        const params = req.body.params;

        const nodeData = nodeDataCache.getNodeData(id);
        const node = RED.nodes.getNode(id);
        let apiClient = null;
        // If cache hit, use cache data. Otherwise use node instance.
        if (nodeData) {
            apiClient = new ApiClient({ ip: nodeData.ip, at: nodeData.token });
        } else {
            if (!node || !node.apiClient) {
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'api-server: info incomplete' });
                res.send(JSON.stringify({ error: 2000, msg: 'api-server: info incomplete' }));
                return;
            }
            apiClient = node.apiClient;
        }

        apiClient.updateDeviceState(deviceId, params)
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                // TODO: handle err
                res.send(JSON.stringify({ error: 500, msg: 'updateDeviceState() error' }));
            });
    });

    // Add thirdparty device.
    // params:
    //       {
    //           "id": "xxx" - API server node ID
    //           "params": {} - thirdparty device params
    //       }
    RED.httpAdmin.post(API_URL_ADD_THIRDPARTY_DEVICE, (req, res) => {
        const id = req.body.id;
        const params = req.body.params;

        const nodeData = nodeDataCache.getNodeData(id);
        const node = RED.nodes.getNode(id);
        let apiClient = null;
        // If cache hit, use cache data. Otherwise use node instance.
        if (nodeData) {
            apiClient = new ApiClient({ ip: nodeData.ip, at: nodeData.token });
        } else {
            if (!node || !node.apiClient) {
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'api-server: info incomplete' });
                res.send(JSON.stringify({ error: 2000, msg: 'api-server: info incomplete' }));
                return;
            }
            apiClient = node.apiClient;
        }

        apiClient.syncDevices({ devices: params })
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                // TODO: handle err
                res.send(JSON.stringify({ error: 500, msg: 'syncDevices() error' }));
            });
    });

    RED.nodes.registerType('api-server', ApiServerNode);
};
