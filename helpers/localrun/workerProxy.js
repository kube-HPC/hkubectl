const WebSocket = require('ws');
const { once } = require('events');
const { log } = require('../output');

class WorkerProxy {
    constructor({ name, socket, debugUrl }) {
        this.algorithmName = name;
        this._socket = socket;
        this._debugUrl = debugUrl;
    }

    _register(algorithmSocket, debugSocket) {
        algorithmSocket.on('message', (message) => {
            debugSocket.send(message);
        });
        debugSocket.on('message', (message) => {
            algorithmSocket.send(message);
        });
    }

    async start() {
        this._debugWs = new WebSocket(this._debugUrl);
        await once(this._debugWs, 'open');
        this._register(this._socket, this._debugWs);
        log.info(`proxy for ${this.algorithmName} started`);
    }

    stop() {
        if (this._socket) {
            this._socket.removeAllListeners('message');
            this._socket.removeAllListeners('close');
            this._socket = null;
        }
        if (this._debugWs) {
            this._debugWs.removeAllListeners('message');
            this._debugWs.removeAllListeners('close');
            this._debugWs = null;
        }
        log.info(`proxy for ${this.algorithmName} stopped`);
    }
}

module.exports = WorkerProxy;
