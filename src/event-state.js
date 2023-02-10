module.exports = function (RED) {
    function GetStateNode(config) {
        RED.nodes.createNode(this, config);

        this.on('input',(msg) => {
            msg.payload='test';
            this.send(msg);
        });
    }

    RED.nodes.registerType('event-state', GetStateNode);
};
