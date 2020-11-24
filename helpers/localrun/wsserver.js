const EventEmitter = require('events');
const WebSocket = require('ws');
const url = require('url');
const { log } = require('../output');

class WsWorkerCommunication extends EventEmitter {
    constructor() {
        super();
        this._socketServer = null;
        this._socket = null;
    }

    init(option) {
        const options = option || {};
        this._socketServer = new WebSocket.Server({ ...options, maxPayload: 1e8 });

        this._socketServer.on('connection', (socket, opt) => {
            const { query } = url.parse(opt.url, true);
            log.info('Connected!!!');
            this._registerSocketMessages(socket, query);
            this.emit('connection', { query, socket });
        });
        this._socketServer.on('error', (error) => {
            log.error(`error ${error}`);
        });
        this._socketServer.on('listening', () => {
            log.info('listening');
        });
    }

    _registerSocketMessages(socket, { name }) {
        socket.on('message', (data) => {
            this.emit('message', data);
        });
        socket.on('close', () => {
            this.emit('disconnect', { name });
        });
    }
}

module.exports = WsWorkerCommunication;
