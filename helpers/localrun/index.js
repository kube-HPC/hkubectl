const WsWorkerCommunication = require('./wsserver');
const WorkerProxy = require('./workerProxy');
const { log } = require('../output');
const { get, post } = require('../request-helper');
class LocalRunner {
    constructor() {
        this._wss = null;
        this._registeredAlgorithms = {};
        this._options = {};
    }

    init(options) {
        this._options = options;
        this._wss = new WsWorkerCommunication({ port: options.port });
        this._register();
        this._wss.init(options);
    }

    _register() {
        this._wss.on('connection', this._onConnection.bind(this));
    }

    async _onConnection({ query, socket }) {
        // verify that there is a debug algorithm
        let algorithm = await get({ ...this._options, path: `/store/algorithms/${query.name}` });
        if (!algorithm.result) {
            log.info('creating algorithm in cluster');
            algorithm = await post({ ...this._options, path: '/store/algorithms/debug', body: { name: query.name } });
        }
        if (!algorithm.result || !algorithm.result.options.debug) {
            log.warning(`algorithm ${query.name} is already registered as a regular algorithm`);
            return;
        }
        if (this._registeredAlgorithms[query.name]) {
            this._registeredAlgorithms[query.name].stop();
            delete this._registeredAlgorithms[query.name];
        }
        this._registeredAlgorithms[query.name] = new WorkerProxy({
            ...query,
            socket,
            debugUrl: algorithm.result.data.path
        });
        this._registeredAlgorithms[query.name].start();
        log.info(`algorithm ${query.name} registered`);
    }
}

module.exports = new LocalRunner();
