const { get, } = require('../helpers/request-helper');
const { AuthManager } = require('../helpers/authentication/auth-manager');

async function getAlgorithms(argv) {
    const { endpoint, rejectUnauthorized, username, password } = argv;
    const auth = new AuthManager({
        username,
        password,
        endpoint,
        rejectUnauthorized
    });
    await auth.init();
    this._kc_token = await auth.getToken();
    const algoPath = 'store/algorithms';
    const algorithms = await get({
        ...argv,
        path: algoPath,
        headers: { Authorization: `Bearer ${this._kc_token}` }
    });
    if (!algorithms || !algorithms.result) {
        return algorithms;
    }
    return algorithms.result;
}

async function getPipelines(argv) {
    const { endpoint, rejectUnauthorized, username, password } = argv;
    const auth = new AuthManager({
        username,
        password,
        endpoint,
        rejectUnauthorized
    });
    await auth.init();
    this._kc_token = await auth.getToken();
    const pipelinePath = 'store/pipelines';
    const pipelines = await get({
        ...argv,
        path: pipelinePath,
        headers: { Authorization: `Bearer ${this._kc_token}` }
    });
    if (!pipelines || !pipelines.result) {
        return pipelines;
    }
    return pipelines.result;
}

module.exports = {
    getPipelines,
    getAlgorithms
};
