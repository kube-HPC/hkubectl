const WebSocket = require('ws');
const { once } = require('events');
const { log } = require('../output');
const messages = require('./messages');

class WorkerProxy {
    constructor({ name, socket, debugUrl }) {
        this.algorithmName = name;
        this._socket = socket;
        this._debugUrl = debugUrl;
    }

    _register(algorithmSocket, debugSocket) {
        Object.entries({ ...messages.incoming }).forEach(([, topic]) => {
            log.debug(`registering for topic ${topic}`);
            algorithmSocket.on(topic, (message) => {
                debugSocket.send(message);
            });
        });
        Object.entries({ ...messages.outgoing }).forEach(([, topic]) => {
            log.debug(`registering for topic ${topic}`);
            debugSocket.on(topic, (message) => {
                algorithmSocket.send(message);
            });
        });
    }

    async start() {
        this._debugWs = new WebSocket(this._debugUrl);
        await once(this._debugWs, 'open');
        this._register(this._socket);
        log.info(`proxy for ${this.algorithmName} started`);
    }

    stop() {
        log.info(`proxy for ${this.algorithmName} stopped`);
    }
}

module.exports = WorkerProxy;
