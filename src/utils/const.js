/**
 * API server node - API prefix
 */
const API_PREFIX = 'ewelink-cube-api-v1';

/**
 * API URL - cache - add API server node
 */
const API_URL_CACHE_ADD_API_SERVER_NODE = `/${API_PREFIX}/cache/add-api-server-node`;

/**
 * API URL - cache - remove API server node
 */
const API_URL_CACHE_REMOVE_API_SERVER_NODE = `/${API_PREFIX}/cache/remove-api-server-node`;

/**
 * API URL - get bridge info
 */
const API_URL_GET_BRIDGE_INFO = `/${API_PREFIX}/get-bridge-info`;

/**
 * API URL - get bridge token
 */
const API_URL_GET_BRIDGE_TOKEN = `/${API_PREFIX}/get-bridge-token`;

/**
 * API URL - get device list
 */
const API_URL_GET_DEVICE_LIST = `/${API_PREFIX}/get-device-list`;

/**
 * API URL - control device
 */
const API_URL_CONTROL_DEVICE = `/${API_PREFIX}/control-device`;

/**
 * API URL - ihost callback
 */
const API_URL_IHOST_CALLBACK = `/${API_PREFIX}/ihost-callback`;

/**
 * SSE event - onAddDevice
 */
const EVENT_SSE_ON_ADD_DEVICE = 'EVENT_SSE_ON_ADD_DEVICE';

/**
 * SSE event - onUpdateDeviceInfo
 */
const EVENT_SSE_ON_UPDATE_DEVICE_INFO = 'EVENT_SSE_ON_UPDATE_DEVICE_INFO';

/**
 * SSE event - onDeleteDevice
 */
const EVENT_SSE_ON_DELETE_DEVICE = 'EVENT_SSE_ON_DELETE_DEVICE';

/**
 * SSE event - onUpdateDeviceState
 */
const EVENT_SSE_ON_UPDATE_DEVICE_STATE = 'EVENT_SSE_ON_UPDATE_DEVICE_STATE';

/**
 * SSE event - onUpdateDeviceOnline
 */
const EVENT_SSE_ON_UPDATE_DEVICE_ONLINE = 'EVENT_SSE_ON_UPDATE_DEVICE_ONLINE';

module.exports = {
    API_PREFIX,
    API_URL_CACHE_ADD_API_SERVER_NODE,
    API_URL_CACHE_REMOVE_API_SERVER_NODE,
    API_URL_GET_BRIDGE_INFO,
    API_URL_GET_BRIDGE_TOKEN,
    API_URL_GET_DEVICE_LIST,
    API_URL_CONTROL_DEVICE,
    API_URL_IHOST_CALLBACK,
    EVENT_SSE_ON_ADD_DEVICE,
    EVENT_SSE_ON_DELETE_DEVICE,
    EVENT_SSE_ON_UPDATE_DEVICE_INFO,
    EVENT_SSE_ON_UPDATE_DEVICE_ONLINE,
    EVENT_SSE_ON_UPDATE_DEVICE_STATE,
};
