const EventEmitter = require('events');
const WebSocket = require('ws');
const url = require('url');
const { Encoding } = require('@hkube/encoding');
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
            this._registerSocketMessages(socket);
            this.emit('connection', { query, socket });
        });
        this._socketServer.on('error', (error) => {
            log.error(`error ${error}`);
        });
        this._socketServer.on('listening', () => {
            log.info('listening');
        });
    }

    setEncodingType(type) {
        this._encoding = new Encoding({ type });
    }

    _registerSocketMessages(socket) {
        this._socket = socket;
        socket.on('message', (data) => {
            const payload = this._encoding.decode(data);
            log.debug(`got message ${payload.command}`);
            this.emit(payload.command, payload);
        });
        socket.on('close', (code) => {
            const reason = code === 1006 ? 'CLOSE_ABNORMAL' : `${code}`;
            this._socket = null;
            this.emit('disconnect', reason);
        });
    }

    /**
     *
     * @param {any} message the message to send to the algoRunner.
     * @param {string} message.command the command for the runner. one of messages.outgoing
     * @param {object} message.data the data for the command
     * @memberof SocketWorkerCommunication
     */
    send(message) {
        if (!this._socket) {
            const error = new Error('trying to send without a connected socket');
            log.warning(`Error sending message to algorithm command ${message.command}. error: ${error.message}`, error);
            throw error;
        }
        this._socket.send(this._encoding.encode(message));
    }
}

module.exports = WsWorkerCommunication;
