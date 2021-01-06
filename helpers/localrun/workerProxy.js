const WebSocket = require('ws');
const { once } = require('events');
const { delay } = require('../utils');
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
        let retries = 15;
        let connected = false;
        do {
            retries -= 1;
            try {
                this._debugWs = new WebSocket(this._debugUrl);
                await once(this._debugWs, 'open');
                this._register(this._socket, this._debugWs);
                log.info(`proxy for ${this.algorithmName} started`);
                connected = true;
            }
            catch (error) {
                log.warning(`Connection to ${this._debugUrl} failed. Retries left ${retries}`);
                await delay(1000);
            }
        }
        while (!connected && retries > 0);
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
            this._debugWs.close();
            this._debugWs = null;
        }
        log.info(`proxy for ${this.algorithmName} stopped`);
    }
}

module.exports = WorkerProxy;
